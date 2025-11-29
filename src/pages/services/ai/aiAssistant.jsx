import OpenAI from "openai";
import { fetchOrders, fetchProducts } from "../analytics/dataFetcher";
import { generateAnalytics } from "../analytics/analyticsEngine";

// أنشئ العميل

const client = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_KEY,
  dangerouslyAllowBrowser: true,
});
export async function askAI(question) {
  // 1) جلب التحليلات
  const analytics = await generateAnalytics();

  // 2) جلب بيانات Orders و Products
  const orders = await fetchOrders();
  const products = await fetchProducts();

  // 3) بناء سياق كامل للإرسال للـ AI
  const fullContext = {
    analytics,
    orders,
    products,
  };

  // 4) بناء الـ prompt
  const prompt = `
You are an advanced AI data analyst for a cafe system.
You answer based ONLY on these data:

DATA: 
${JSON.stringify(fullContext, null, 2)}

USER QUESTION:
${question}

TASK:
- Give accurate answers based on data
- If something isn’t found in data say “No data available”
- Provide insights when needed
- Suggest improvements or recommendations
  `;

  // 5) استدعاء OpenAI
  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a professional data analyst assistant." },
      { role: "user", content: prompt },
    ],
  });

  return res.choices[0].message.content;
}
