import { Product } from "@/redux/slices/cartSlice";
const CART_STORAGE_KEY = "cart_item"

export const saveCartToLocalStorage = (items:Product[]) => {
    if(typeof window !== "undefined"){
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
};

export const loadCartFromLocalStorage = (): Product[] => {
    if(typeof window !== "undefined"){
        const data = localStorage.getItem(CART_STORAGE_KEY);
        return data? JSON.parse(data) : [];
    }
    return [];
};