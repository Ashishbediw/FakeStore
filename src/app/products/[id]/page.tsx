'use client';

import { useParams } from 'next/navigation';
import { useGetProductByIdQuery } from '../../../redux/api/storeApi';
import { useDispatch } from 'react-redux';
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

    if (isLoading) return <div className="text-center py-20 text-gray-500 text-lg">Loading product...</div>;
    if (error) return <div className="text-center py-20 text-red-500 text-lg">Something went wrong. Please try again.</div>;

    const product = data?.product;

    if (!product) return <div className="text-center py-20 text-gray-500 text-lg">Product not found.</div>;

    const handleAddToCart = () => {
        if (!session) {
            router.push("/login");
        } else {
            toast.success('Added to cart!');
            dispatch(addToCart(product));
            router.push("/cart");
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Image Section */}
                <div className="bg-white p-6 rounded-xl shadow-md flex justify-center items-center">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="max-h-[400px] w-auto object-contain rounded-lg"
                    />
                </div>

                {/* Details Section */}
                <div className="space-y-6">
                    <h1 className="text-4xl font-bold text-gray-900">{product.title}</h1>
                    <p className="text-gray-600 text-base">{product.description}</p>

                    <div className="text-2xl font-bold text-green-600">
                        ${product.price}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-wrap gap-4 text-sm">
                        <span className="bg-gray-100 px-3 py-1 rounded-full border text-gray-700">
                            <strong>Brand:</strong> {product.brand}
                        </span>
                        <span className="bg-gray-100 px-3 py-1 rounded-full border text-gray-700">
                            <strong>Model:</strong> {product.model}
                        </span>
                        <span className="bg-gray-100 px-3 py-1 rounded-full border text-gray-700">
                            <strong>Color:</strong> {product.color}
                        </span>
                        <span className="bg-gray-100 px-3 py-1 rounded-full border text-gray-700">
                            <strong>Category:</strong> {product.category}
                        </span>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="inline-block mt-6 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 shadow-lg"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
