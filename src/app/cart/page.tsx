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
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-extrabold text-blue-700 mb-8 flex items-center gap-2">
                🛒 Your Shopping Cart
            </h1>

            {cartItems.length === 0 ? (
                <p className="text-gray-500 text-lg text-center">Your cart is empty. Start shopping now!</p>
            ) : (
                <div className="space-y-6">
                    {cartItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-28 h-28 object-contain bg-gray-50 p-2 rounded-lg hover:scale-105 transition-transform duration-300"
                            />
                            <div className="flex-1 w-full">
                                <h2 className="text-xl font-semibold text-gray-800 mb-1">{item.title}</h2>
                                <p className="text-sm text-gray-600 mb-1">Brand: {item.brand}</p>
                                <p className="text-sm text-gray-400">Category: {item.category}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-blue-600">${item.price.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}

                    {/* Subtotal Section */}
                    <div className="flex justify-between items-center p-6 mt-8 border-t border-gray-200 rounded-lg shadow-inner bg-gray-50">
                        <h2 className="text-xl font-bold text-gray-800">Subtotal</h2>
                        <p className="text-2xl font-bold text-green-600">${subtotal.toFixed(2)}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
