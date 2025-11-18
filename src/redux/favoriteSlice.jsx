// src/redux/favoritesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db, auth } from "../firebase/firebaseConfig";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

const initialState = {
  favorites: [],
  loading: false,
  error: null,
};

// Get favorites from Firebase
export const fetchFavorites = createAsyncThunk(
  "favorite/fetchFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const uid = auth.currentUser.uid;
      const favRef = collection(db, "users", uid, "favorites");
      const snapshot = await getDocs(favRef);
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  "favorite/toggleFavorite",
  async (product, { getState, rejectWithValue }) => {
    try {
      const uid = auth.currentUser.uid;
      const favRef = collection(db, "users", uid, "favorites");
      // Check if product exists
      const existing = getState().favorite.favorites.find((p) => p.id === product.id);
      if (existing) {
        const docRef = doc(db, "users", uid, "favorites", existing.id);
        await deleteDoc(docRef);
        return { ...product, removed: true };
      } else {
        const docRef = await addDoc(favRef, product);
        return { ...product, id: docRef.id };
      }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const removed = action.payload.removed;
        if (removed) {
          state.favorites = state.favorites.filter((p) => p.id !== action.payload.id);
        } else {
          state.favorites.push(action.payload);
        }
      });
  },
});

export default favoriteSlice.reducer;
