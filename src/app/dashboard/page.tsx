'use client';

import { useGetProductsQuery, useGetCategoriesQuery, useGetProductsByCategoryQuery } from "@/redux/api/storeApi";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
import { signOut } from "next-auth/react";
import { toast } from 'react-toastify';

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
    const dispatch = useDispatch();

    const { data: categories = [] } = useGetCategoriesQuery({});
    const { data: allProductsData, isLoading: isAllLoading, isError: isAllError } = useGetProductsQuery({}, {
        skip: selectedCategory !== 'all',
    });

    const { data: categoryProductsData, isLoading: isCategoryLoading, isError: isCategoryError } = useGetProductsByCategoryQuery(selectedCategory, {
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

    const handleCart = () => {
        router.push('./cart');
    };

    const handleLogout = async() => {
        await signOut({ redirect: false });
        router.push('/');
        toast.success('logout successfully');
    };

    if (isLoading) return <p className="text-center text-lg">Loading...</p>;
    if (isError) return <p className="text-center text-red-500">Error loading products.</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-100 via-white to-pink-100 shadow-md py-6 px-6 flex flex-col sm:flex-row items-center justify-between rounded-b-3xl backdrop-blur-md bg-opacity-90">
                <div className="flex items-center space-x-3">
                    <span className="text-4xl animate-bounce">🛒</span>
                    <h1 className="text-3xl font-extrabold text-blue-800 tracking-wide">FakeStore</h1>
                </div>
                <p className="text-center text-gray-500 text-sm mt-2 sm:mt-0">
                    <span className="italic">Your affordable dream store</span>
                </p>
                <div className="flex gap-2 mt-2 sm:mt-0">
                    <button onClick={handleLogout} className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition-all">
                        Logout
                    </button>
                    <button onClick={handleCart} className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition-all">
                        🛒 Go to Cart
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
                {/* Search and Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                    <h2 className="text-2xl font-semibold text-gray-800"> Trending Now</h2>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 w-full sm:w-80 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Category Filter */}
                <div className="flex overflow-x-auto gap-3 mb-8 pb-2 scrollbar-hide">
                    <button
                        onClick={() => setSelectedCategry("all")}
                        className={`px-4 py-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 border shadow ${selectedCategory === "all"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-blue-100"
                            }`}
                    >
                        All
                    </button>
                    {categoriesList.map((cat: string) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategry(cat)}
                            className={`px-4 py-2 whitespace-nowrap capitalize rounded-full text-sm font-medium border shadow transition-all duration-200 ${selectedCategory === cat
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-700 hover:bg-blue-100"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {currentProducts.map((product: Product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-5 flex flex-col justify-between"
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
                            <div className="mt-4 flex flex-col gap-2">
                                <button
                                    onClick={() => router.push(`/products/${product.id}`)}
                                    className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium py-2 px-4 rounded-md transition duration-200 shadow"
                                >
                                    View Details
                                </button>
                                <button
                                    onClick={() => {
                                        dispatch(addToCart(product));
                                        toast.success('Added to cart!');
                                        router.push('/cart');
                                    }}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium py-2 px-4 rounded-md transition duration-200 shadow"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-12">
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
                )}
            </main>
        </div>
    );
};

export default Dashboard;
