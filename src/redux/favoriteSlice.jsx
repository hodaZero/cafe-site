import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db, auth } from "../firebase/firebaseConfig";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

// الحالة الأولية
const initialState = {
  favorites: [],
  loading: false,
  error: null,
};

// ------------------------
// Fetch user favorites
// ------------------------
export const fetchFavorites = createAsyncThunk(
  "favorite/fetchFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return [];
      const favRef = collection(db, "users", uid, "favorites");
      const snapshot = await getDocs(favRef);

      // تأكد من عدم وجود duplicates عند fetch
      const fetched = snapshot.docs.map((d) => ({ firebaseId: d.id, ...d.data() }));
      const unique = [];
      fetched.forEach((item) => {
        if (!unique.find((u) => u.productId === item.productId)) {
          unique.push(item);
        }
      });

      return unique;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ------------------------
// Add / Remove Favorite
// ------------------------
export const toggleFavorite = createAsyncThunk(
  "favorite/toggleFavorite",
  async (product, { getState, rejectWithValue }) => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return rejectWithValue("User not logged in");

      const favRef = collection(db, "users", uid, "favorites");

      // تحقق إذا المنتج موجود مسبقًا
      const existing = getState().favorite.favorites.find(
        (p) => p.productId === product.id
      );

      if (existing) {
        // إزالة من Firebase
        const docRef = doc(db, "users", uid, "favorites", existing.firebaseId);
        await deleteDoc(docRef);
        return { productId: product.id, removed: true };
      } else {
        // إضافة للفيفوريت
        const docRef = await addDoc(favRef, {
          productId: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          rating: product.rating,
        });

        return {
          firebaseId: docRef.id,
          productId: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          rating: product.rating,
        };
      }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ------------------------
// Slice
// ------------------------
const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        // استبدال كامل لتجنب duplicates
        state.favorites = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Toggle
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        if (action.payload.removed) {
          state.favorites = state.favorites.filter(
            (p) => p.productId !== action.payload.productId
          );
        } else {
          // إضافة فقط لو مش موجود
          const exists = state.favorites.find(
            (p) => p.productId === action.payload.productId
          );
          if (!exists) state.favorites.push(action.payload);
        }
      });
  },
});

export default favoriteSlice.reducer;
