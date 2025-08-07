'use client';

import { useParams } from 'next/navigation';
import { useGetProductByIdQuery } from '../../../redux/api/storeApi';
import { useDispatch } from "react-redux";
import { addToCart } from '../../../redux/slices/cartSlice';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
export default function ProductDetailPage() {
    const { id } = useParams();
    const { data, error, isLoading } = useGetProductByIdQuery(id as string);
    const { data: session } = useSession();
    const router = useRouter();
    const dispatch = useDispatch();

    if (isLoading) return <div className="text-center py-10 text-gray-600">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Something went wrong.</div>;

    const product = data?.product;

    if (!product) return <div className="text-center py-10 text-gray-500">Product not found.</div>;

    const handleAddToCart = () => {
    if (!session) {
        router.push("/login"); 
    } else {
         toast.success('Opening cart...');
        dispatch(addToCart(product));
        router.push("/cart")
    }
};


    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="flex justify-center items-center">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="w-full max-w-sm rounded shadow-lg object-contain"
                    />
                </div>
                <div className="space-y-6">
                    <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
                    <p className="text-gray-600">{product.description}</p>

                    <div className="text-xl font-semibold text-green-600">
                        ${product.price}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                        <p><span className="font-medium">Brand:</span> {product.brand}</p>
                        <p><span className="font-medium">Model:</span> {product.model}</p>
                        <p><span className="font-medium">Color:</span> {product.color}</p>
                        <p><span className="font-medium">Category:</span> {product.category}</p>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="mt-6 w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded shadow transition duration-200"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
