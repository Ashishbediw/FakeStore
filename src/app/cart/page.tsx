'use client';
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Image from "next/image";
const Cart = () => {
    const cartItems = useSelector((state:RootState) => state.cart.items)
    return(
        <div className="max-w-4xl mx-auto px-4 py-10">
             <h1 className="text-2xl font-bold mb-6">🛒 Your Shopping Cart</h1>
             {cartItems.length === 0 ? (
                <p className="text-gray-500">Your cart is Empty</p>
             ):  <div className="grid gap-6">
                {cartItems.map((item) => (
                    <div key={item.id}   className="flex items-center gap-4 p-4 border rounded shadow-sm">
                        <img src={item.image} alt={item.title}   className="w-20 h-20 object-contain"/>
                         <div className="flex-1">
                                <h2 className="text-lg font-semibold">{item.title}</h2>
                                <p className="text-sm text-gray-600">Brand: {item.brand}</p>
                                <p className="text-sm text-gray-400">Category: {item.category}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-blue-600 font-bold text-lg">${item.price}</p>
                            </div>
                    </div>
                ))}
             </div> }
        </div>
    )
}

export default Cart