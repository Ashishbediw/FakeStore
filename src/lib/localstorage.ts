const CART_STORAGE_KEY = "cart_item";
// const getCartKey = (userId:string) => {
//     return `${CART_STORAGE_KEY}_${userId}`
// }

export const saveCartToLocalStorage = (items:any[]) => {
    if(typeof window !== "undefined"){
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
};

export const loadCartFromLocalStorage = (): any[] => {
    if(typeof window !== "undefined"){
        const data = localStorage.getItem(CART_STORAGE_KEY);
        return data? JSON.parse(data) : [];
    }
    return [];
};  