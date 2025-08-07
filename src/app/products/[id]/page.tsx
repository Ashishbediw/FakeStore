'use client';

import { useParams } from 'next/navigation';
import { useGetProductByIdQuery } from '../../../redux/api/storeApi';
import { useDispatch } from 'react-redux';

export default function ProductDetailPage() {
    const { id } = useParams();
    const { data, error, isLoading } = useGetProductByIdQuery(id as string);
    const dispatch = useDispatch();

    if (isLoading) return <div className="text-center py-10 text-gray-600">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Something went wrong.</div>;

    const product = data?.product;

    if (!product) return <div className="text-center py-10 text-gray-500">Product not found.</div>;


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
                </div>
                
            </div>
        </div>
    );
}
