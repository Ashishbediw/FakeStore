'use client';

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { loadCartFromLocalStorage } from "@/lib/localstorage";
import { initializecart } from "@/redux/slices/cartSlice";

const Cart = () => {
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const dispatch = useDispatch();
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        const items = loadCartFromLocalStorage();
        dispatch(initializecart(items));
        setHydrated(true);
    }, [dispatch]);

    if (!hydrated) return null;

    const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
                    🛒 Your Shopping Cart
                </h1>

                {cartItems.length === 0 ? (
                    <p className="text-gray-500 text-center text-sm">Your cart is empty. Start shopping now!</p>
                ) : (
                    <div className="space-y-4">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-4 border-b border-gray-200 pb-4"
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-20 h-20 object-contain rounded bg-gray-50 p-2"
                                />
                                <div className="flex-1">
                                    <h2 className="text-base font-medium text-gray-800">{item.title}</h2>
                                    <p className="text-sm text-gray-500">Brand: {item.brand}</p>
                                    <p className="text-xs text-gray-400">Category: {item.category}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-base font-semibold text-blue-600">${item.price.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}

                        {/* Subtotal Section */}
                        <div className="flex justify-between items-center pt-6 border-t border-gray-300 mt-6">
                            <h2 className="text-base font-semibold text-gray-700">Subtotal</h2>
                            <p className="text-lg font-bold text-green-600">${subtotal.toFixed(2)}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
