import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export type Product = {
    id: number;
    title: string;
    price: number;
    brand: string;
    category: string;
    image: string;
    discount: number;
    quantity?: number;
};

interface CartState {
    items: Product[];
}

const initialState: CartState = {
    items: [],
};
const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Product>) => {
            const existing = state.items.find(item => item.id === action.payload.id);
            if (existing) {
                existing.quantity = (existing.quantity || 1) + 1;
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        },
        
        decrementQuantity: (state, action: PayloadAction<number>) => {
            const existingItem = state.items.find(item => item.id === action.payload);
            if (existingItem && existingItem.quantity && existingItem.quantity > 1) {
                existingItem.quantity -= 1;
            } else {
                state.items = state.items.filter(item => item.id !== action.payload);
            }
        },
         clearCart: (state) => {
            state.items = [];
        }
        
        
    }
})

export const { addToCart, removeFromCart, decrementQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;