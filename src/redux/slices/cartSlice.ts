import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export type Product = {
    id: number;
    title: string;
    price: number;
    brand: string;
    category: string;
    image: string;
    discount: number;
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
            if (!existing) {
                state.items.push(action.payload)
            }
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        },
        clearCart: (state) => {
            state.items = [];
        },
    }
})

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;