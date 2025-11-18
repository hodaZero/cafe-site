import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db, auth } from "../firebase/firebaseConfig";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

// Fetch cart items
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return [];
      const cartRef = collection(db, "users", uid, "cart");
      const snapshot = await getDocs(cartRef);
      return snapshot.docs.map(d => ({ firebaseId: d.id, ...d.data() }));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Add or increase quantity
export const toggleCartItem = createAsyncThunk(
  "cart/toggleCartItem",
  async ({ product, quantity = 1 }, { getState, rejectWithValue }) => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return rejectWithValue("User not logged in");

      const existing = getState().cart.items.find(i => i.productId === product.id);
      const cartRef = collection(db, "users", uid, "cart");

      if (existing) {
        const docRef = doc(db, "users", uid, "cart", existing.firebaseId);
        const newQty = existing.quantity + quantity;
        await updateDoc(docRef, { quantity: newQty });
        return { firebaseId: existing.firebaseId, productId: product.id, quantity: newQty };
      } else {
        const docRef = await addDoc(cartRef, {
          productId: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity,
        });
        return { firebaseId: docRef.id, productId: product.id, name: product.name, image: product.image, price: product.price, quantity };
      }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Remove from Firebase
export const removeFromCartFirebase = createAsyncThunk(
  "cart/removeFromCartFirebase",
  async (productId, { getState, rejectWithValue }) => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return rejectWithValue("User not logged in");

      const existing = getState().cart.items.find(i => i.productId === productId);
      if (!existing) return rejectWithValue("Item not found");

      const docRef = doc(db, "users", uid, "cart", existing.firebaseId);
      await deleteDoc(docRef);
      return productId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    increaseQty: (state, action) => {
      const item = state.items.find(i => i.productId === action.payload);
      if (item) item.quantity += 1;
    },
    decreaseQty: (state, action) => {
      const item = state.items.find(i => i.productId === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true; })
      .addCase(fetchCart.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchCart.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(toggleCartItem.fulfilled, (state, action) => {
        const exists = state.items.find(i => i.productId === action.payload.productId);
        if (exists) {
          exists.quantity = action.payload.quantity;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(removeFromCartFirebase.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i.productId !== action.payload);
      });
  }
});

export const { increaseQty, decreaseQty } = cartSlice.actions;
export default cartSlice.reducer;
