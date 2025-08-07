'use client';

import { useGetProductsQuery, useGetCategoriesQuery, useGetProductsByCategoryQuery } from "@/redux/api/storeApi";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useDispatch, } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
import { signOut } from "next-auth/react";

type Product = {
    id: number;
    title: string;
    price: number;
    brand: string;
    category: string;
    image: string;
    discount: number;
};

const Dashboard = () => {
    const [selectedCategory, setSelectedCategry] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const router = useRouter();
    const { data: categories = [] } = useGetCategoriesQuery({});
    const {
        data: allProductsData,
        isLoading: isAllLoading,
        isError: isAllError,
    } = useGetProductsQuery({}, { skip: selectedCategory !== 'all' });
    const dispatch = useDispatch();
    const {
        data: categoryProductsData,
        isLoading: isCategoryLoading,
        isError: isCategoryError,
    } = useGetProductsByCategoryQuery(selectedCategory, {
        skip: selectedCategory === 'all',
    });



    const productData = selectedCategory === 'all' ? allProductsData : categoryProductsData;
    const isLoading = selectedCategory === 'all' ? isAllLoading : isCategoryLoading;
    const isError = selectedCategory === 'all' ? isAllError : isCategoryError;


    const products = productData?.products || productData || [];
    const categoriesList = categories?.categories || [];

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory]);

    const filteredProducts = products.filter((product: Product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const itemsPerPage = 8;
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    if (isLoading) return <p className="text-center text-lg">Loading...</p>;
    if (isError) return <p className="text-center text-red-500">Error loading products.</p>;

    const handleCart = () => {
        router.push('./cart')
    }

    const handleLogout = () => {
        signOut({
            callbackUrl: '/',
        });
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow py-6 px-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <span className="text-3xl">🛒</span>
                    <h1 className="text-2xl font-bold text-gray-800">FakeStore</h1>
                </div>
                <p className="text-center text-gray-500 text-sm flex-1">
                    Discover amazing products at unbeatable prices
                </p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded shadow transition duration-200"
                    >
                        Logout
                    </button>
                    <button
                        onClick={handleCart}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow transition duration-200"
                    >
                        Go To cart
                    </button>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                    <h2 className="text-2xl font-semibold text-gray-800">Featured Products</h2>
                    <input
                        type="text"
                        placeholder="Search by product name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 w-full sm:w-80 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Category Filter */}
                <div className="flex overflow-x-auto gap-3 mb-8 pb-2">
                    <button
                        onClick={() => setSelectedCategry("all")}
                        className={`px-4 py-2 whitespace-nowrap rounded-md border transition ${selectedCategory === "all"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        All
                    </button>
                    {categoriesList.map((cat: string) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategry(cat)}
                            className={`px-4 py-2 whitespace-nowrap capitalize rounded-md border transition ${selectedCategory === cat
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {currentProducts.map((product: Product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-4"
                        >
                            <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-48 object-contain mb-4 rounded"
                            />
                            <h3 className="text-lg font-semibold text-gray-800 truncate">{product.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">Brand: {product.brand}</p>
                            <p className="text-sm text-gray-400">Category: {product.category}</p>
                            <p className="text-lg font-bold text-blue-700 mt-2">${product.price}</p>
                            {product.discount > 0 && (
                                <p className="text-sm text-green-600 mt-1">{product.discount}% OFF</p>
                            )}
                            <button
                                onClick={() => router.push(`/products/${product.id}`)}
                                className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition duration-200 shadow"
                            >
                                 View Details
                            </button>
                            <button
                                onClick={() => dispatch(addToCart(product))}
                                className="mt-4 w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-md transition duration-200 shadow"
                            >
                                 Add to Cart
                            </button>

                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center gap-4 mt-10">
                    <button
                        onClick={handlePrev}
                        disabled={currentPage === 1}
                        className={`px-5 py-2 rounded-md font-medium transition ${currentPage === 1
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                    >
                        Previous
                    </button>
                    <span className="text-gray-700 font-semibold">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className={`px-5 py-2 rounded-md font-medium transition ${currentPage === totalPages
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                    >
                        Next
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
