import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartLine } from "@/models/product";

type AddToCartPayload = {
  productId: string;
  variantId: string;
};

type UpdateQuantityPayload = AddToCartPayload & {
  quantity: number;
};

type CartState = {
  lines: CartLine[];
};

const initialState: CartState = {
  lines: []
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<AddToCartPayload>) {
      const line = state.lines.find(
        (item) =>
          item.productId === action.payload.productId &&
          item.variantId === action.payload.variantId
      );

      if (line) {
        line.quantity += 1;
        return;
      }

      state.lines.push({
        productId: action.payload.productId,
        quantity: 1,
        variantId: action.payload.variantId
      });
    },
    clearCart(state) {
      state.lines = [];
    },
    removeFromCart(state, action: PayloadAction<AddToCartPayload>) {
      state.lines = state.lines.filter(
        (item) =>
          item.productId !== action.payload.productId ||
          item.variantId !== action.payload.variantId
      );
    },
    updateQuantity(state, action: PayloadAction<UpdateQuantityPayload>) {
      const line = state.lines.find(
        (item) =>
          item.productId === action.payload.productId &&
          item.variantId === action.payload.variantId
      );

      if (!line) {
        return;
      }

      line.quantity = Math.max(1, action.payload.quantity);
    }
  }
});

export const { addToCart, clearCart, removeFromCart, updateQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
