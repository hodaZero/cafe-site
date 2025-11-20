import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db, auth } from "../firebase/firebaseConfig";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

// ================================
// Initial State
// ================================
const initialState = {
  favorites: [],
  loading: false,
  error: null,
};

// ================================
// Fetch Favorites
// ================================
export const fetchFavorites = createAsyncThunk(
  "favorite/fetchFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return [];

      const favRef = collection(db, "users", uid, "favorites");
      const snapshot = await getDocs(favRef);

      const fetched = snapshot.docs.map((d) => ({
        firebaseId: d.id,
        ...d.data(),
      }));

      // 🔥 منع أي duplicate نهائياً
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

// ================================
// Toggle Favorite
// ================================
export const toggleFavorite = createAsyncThunk(
  "favorite/toggleFavorite",
  async (product, { getState, rejectWithValue }) => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return rejectWithValue("User not logged in");

      const productId = product.productId || product.id;
      const favRef = collection(db, "users", uid, "favorites");

      const state = getState().favorite.favorites;

      const existing = state.find((p) => p.productId === productId);

      if (existing) {
        // حذف
        const docRef = doc(db, "users", uid, "favorites", existing.firebaseId);
        await deleteDoc(docRef);

        return { productId, removed: true };
      } else {
        // إضافة
        const docRef = await addDoc(favRef, {
          productId,
          name: product.name,
          image: product.image,
          price: product.price,
          rating: product.rating,
        });

        return {
          firebaseId: docRef.id,
          productId,
          name: product.name,
          image: product.image,
          price: product.price,
          rating: product.rating,
          added: true,
        };
      }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ================================
// Slice
// ================================
const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ---------------- FETCH ----------------
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------------- TOGGLE ----------------
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        // 🧨 حذف
        if (action.payload.removed) {
          state.favorites = state.favorites.filter(
            (p) => p.productId !== action.payload.productId
          );
        }

        // ⭐ إضافة بدون تكرار
        if (action.payload.added) {
          const exists = state.favorites.find(
            (p) => p.productId === action.payload.productId
          );

          // 🔥 الحل الحقيقي لمشكلة "المنتجين يبقوا 3"
          if (!exists) {
            state.favorites.push(action.payload);
          }
        }
      });
  },
});

export default favoriteSlice.reducer;
