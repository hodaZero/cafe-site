// src/services/ai/aiAssistant.jsx
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";

// إعداد embeddings
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.REACT_APP_GEMINI_KEY,
  model: "text-embedding-004",
});

// دالة لحساب التشابه بين متجهين
function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
  const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  return dot / (magA * magB);
}

// كاش لتخزين المستندات والـ vectors
let cachedDocs = [];
let cachedVectors = [];

// جلب كل الطلبات من Firebase
async function fetchOrders() {
  const usersSnap = await getDocs(collection(db, "users"));
  const allOrders = [];

  for (let userDoc of usersSnap.docs) {
    const ordersSnap = await getDocs(collection(db, "users", userDoc.id, "orders"));
    ordersSnap.forEach(orderDoc =>
      allOrders.push({ userId: userDoc.id, id: orderDoc.id, ...orderDoc.data() })
    );
  }
  return allOrders;
}

// جلب كل المنتجات من Firebase
async function fetchProducts() {
  const snap = await getDocs(collection(db, "products"));
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// حفظ أو تحديث embedding لكل مستند في Firestore
async function saveEmbeddingToFirestore(docId, vector) {
  const ref = doc(db, "embeddings", docId);
  await setDoc(ref, { vector });
}

// جلب embedding من Firestore إذا موجود
async function getEmbeddingFromFirestore(docId) {
  const ref = doc(db, "embeddings", docId);
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? snapshot.data().vector : null;
}

// تهيئة RAG مع التخزين في Firebase
export async function initRAG() {
  const orders = await fetchOrders();
  const products = await fetchProducts();

  // حساب التحليلات الفعلية لكل منتج
  const analyticsMap = {};
  products.forEach(p => {
    analyticsMap[p.name] = { quantity: 0, totalRevenue: 0, uniqueUsers: new Set(), price: p.price };
  });

  orders.forEach(order => {
    (order.items || []).forEach(item => {
      if (!analyticsMap[item.name]) {
        analyticsMap[item.name] = { quantity: 0, totalRevenue: 0, uniqueUsers: new Set(), price: item.price || 0 };
      }
      analyticsMap[item.name].quantity += item.quantity || 1;
      analyticsMap[item.name].totalRevenue += (item.quantity || 1) * (item.price || analyticsMap[item.name].price || 0);
      analyticsMap[item.name].uniqueUsers.add(order.userId);
    });
  });

  const analytics = Object.entries(analyticsMap).map(([name, data]) => ({
    name,
    quantity: data.quantity,
    totalRevenue: data.totalRevenue,
    uniqueUsers: data.uniqueUsers.size,
    price: data.price,
  }));

  // إنشاء المستندات للـ RAG
  const docs = [];

  // المنتجات
  products.forEach(p => {
    const a = analytics.find(an => an.name === p.name);
    docs.push({
      id: `product-${p.id}`,
      type: "product",
      name: p.name,
      price: p.price,
      sold: a ? a.quantity : 0,
    });
  });

  // التحليلات
  analytics.forEach(a => {
    docs.push({
      id: `analytics-${a.name}`,
      type: "analytics",
      name: a.name,
      quantity: a.quantity,
      totalRevenue: a.totalRevenue,
      uniqueUsers: a.uniqueUsers,
    });
  });

  // الطلبات
  orders.forEach(order => {
    docs.push({
      id: `order-${order.id}`,
      type: "order",
      userName: order.userName || "Unknown",
      items: order.items || [],
      total: order.total || 0,
      date: order.createdAt || null,
    });
  });

  // إنشاء الـ embeddings مع التخزين في Firebase
  const vectors = [];
  for (let d of docs) {
    let text = "";
    if (d.type === "order") {
      text = `Order ${d.id} by ${d.userName}: ${d.items.map(i => `${i.name} (${i.quantity})`).join(", ")}`;
    } else if (d.type === "product") {
      text = `Product ${d.name}: sold ${d.sold}, price ${d.price}`;
    } else if (d.type === "analytics") {
      text = `Analytics ${d.name}: quantity ${d.quantity}, revenue ${d.totalRevenue}, uniqueUsers ${d.uniqueUsers}`;
    }

    // جربنا نحصل الـ embedding من Firestore أولاً
    let vec = await getEmbeddingFromFirestore(d.id);
    if (!vec) {
      const [generatedVec] = await embeddings.embedDocuments([text]);
      vec = generatedVec;
      await saveEmbeddingToFirestore(d.id, vec); // خزنه
    }

    vectors.push(vec);
  }

  cachedDocs = docs;
  cachedVectors = vectors;
}

export async function askAI(query) {
  await initRAG();

  // Normalize Arabic letters (remove أ إ آ)
  const normalize = txt => txt.replace(/[أإآ]/g, "ا").trim();
  const q = normalize(query.toLowerCase());

  // أرباح الأسبوع
  if (q.includes("ارباح") || q.includes("revenue") || q.includes("total")) {
    const analytics = cachedDocs.filter(d => d.type === "analytics");
    const total = analytics.reduce((sum, a) => sum + a.totalRevenue, 0);
    return `إجمالي أرباح هذا الأسبوع: ${total}`;
  }

  // أكثر المنتجات مبيعًا
  if ((q.includes("اكثر") && q.includes("مبيع")) || q.includes("top selling")) {
    const analytics = cachedDocs.filter(d => d.type === "analytics");
    return analytics
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
      .map(a => `${a.name}: تم بيع ${a.quantity} مرات – أرباح ${a.totalRevenue}`)
      .join("\n");
  }

  // البحث عن منتج محدد
  const product = cachedDocs.find(
    d => d.type === "product" && q.includes(normalize(d.name.toLowerCase()))
  );

  if (product) {
    return `${product.name} تم بيعه ${product.sold} مرات`;
  }

  // fallback RAG
  const queryVector = await embeddings.embedQuery(query);
  const ranked = cachedDocs
    .map((doc, i) => ({ doc, score: cosineSimilarity(cachedVectors[i], queryVector) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  if (!ranked.length) return "لم أجد بيانات متعلقة.";

  return ranked
    .map(r => {
      const d = r.doc;
      if (d.type === "analytics")
        return `${d.name}: تم بيع ${d.quantity} – أرباح ${d.totalRevenue} – مستخدمين ${d.uniqueUsers}`;
      if (d.type === "product")
        return `${d.name}: تم بيع ${d.sold} – السعر ${d.price}`;
      if (d.type === "order")
        return `طلب ${d.id} بواسطة ${d.userName}: ${d.items.map(i => `${i.name} (${i.quantity})`).join(", ")}`;
    })
    .join("\n");
}