import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const initialState = {
  currentProduct: null,
  stockStatus: "checking", // checking | inStock | outOfStock
  dynamicPrice: null,
  suggestions: [],
  loading: false,
  error: null,
};

//  Check stock from Firestore
export const checkStock = createAsyncThunk(
  "orderFlow/checkStock",
  async (productId, { rejectWithValue }) => {
    try {
      const ref = doc(db, "products", productId);
      const snap = await getDoc(ref);

      if (!snap.exists()) return rejectWithValue("Product not found");

      const data = snap.data();

      return {
        productId,
        stock: data.stock,
        basePrice: data.price,
        upsell: data.upsell || [],
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// AI Upsell Suggestion
export const aiUpsell = createAsyncThunk(
  "orderFlow/aiUpsell",
  async (productName, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5000/api/ai/upsell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName }),
      });
      const data = await response.json();
      return data.suggestions;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const orderFlowSlice = createSlice({
  name: "orderFlow",
  initialState,
  reducers: {
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkStock.pending, (state) => {
        state.loading = true;
        state.stockStatus = "checking";
      })
      .addCase(checkStock.fulfilled, (state, action) => {
        state.loading = false;

        state.stockStatus = action.payload.stock > 0 ? "inStock" : "outOfStock";
        state.dynamicPrice = action.payload.basePrice;
        state.suggestions = action.payload.upsell;
      })
      .addCase(checkStock.rejected, (state, action) => {
        state.loading = false;
        state.stockStatus = "outOfStock";
        state.error = action.payload;
      })
      .addCase(aiUpsell.fulfilled, (state, action) => {
        state.suggestions.push(...action.payload);
      });
  },
});

export const { setCurrentProduct } = orderFlowSlice.actions;
export default orderFlowSlice.reducer;
