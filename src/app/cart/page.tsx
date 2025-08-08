'use client';

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { addToCart, removeFromCart, decrementQuantity, clearCart } from "@/redux/slices/cartSlice";
import { X, ArrowLeft } from "lucide-react";
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";

const Cart = () => {
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const dispatch = useDispatch();
    const router = useRouter();
    useEffect(() => {
        const item = localStorage.getItem("pendingCartItem");
        if (item) {
            try {
                const product = JSON.parse(item);
                dispatch(addToCart(product));
            } catch (error) {
                console.error("Failed to parse pendingCartItem", error);
            }
            localStorage.removeItem("pendingCartItem");
        }
    }, [dispatch]);

    const handleBackButton = () => {
        router.push('./dashboard');
    }
    const handleCheckout = () => {
         dispatch(clearCart());
          toast.success("Buy successfully");
           router.push('/dashboard')
    }




    const subtotal = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
                <button
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700 transition"
                    onClick={handleBackButton}
                >
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </button>
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
                                <div className="flex items-center gap-2 mt-2">
                                    <button
                                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                        onClick={() => dispatch(decrementQuantity(item.id))}
                                    >
                                        −
                                    </button>
                                    <span className="font-semibold">{item.quantity}</span>
                                    <button
                                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                        onClick={() => dispatch(addToCart(item))}
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="text-right">
                                    <p className="text-base font-semibold text-blue-600">${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                                    <p className="text-sm text-gray-400">
                                        (${item.price.toFixed(2)} each)
                                    </p>
                                </div>
                                <button
                                    onClick={() => dispatch(removeFromCart(item.id))}
                                    className="text-red-500 hover:text-red-700 text-sm"

                                >
                                    <X size={24} />

                                </button>
                            </div>
                        ))}

                        {/* Subtotal Section */}
                        <div className="flex justify-between items-center pt-6 border-t border-gray-300 mt-6">
                            <h2 className="text-base font-semibold text-gray-700">Subtotal</h2>
                            <p className="text-lg font-bold text-green-600">${subtotal.toFixed(2)}</p>
                            <button
                             onClick={handleCheckout}
                             className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700 transition"
                            >
                                CheckOut
                            </button>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
