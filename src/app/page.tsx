'use client';

import { useGetProductsQuery, useGetCategoriesQuery, useGetProductsByCategoryQuery } from "@/redux/api/storeApi";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";

type Product = {
  id: number;
  title: string;
  price: number;
  brand: string;
  category: string;
  image: string;
  discount: number;
};

const Home = () => {
  const { data: session, status } = useSession();
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

  const handleLogin = () => router.push('./login');
  const handleDashboard = () => router.push('./dashboard');

  if (isLoading) return <p className="text-center text-lg">Loading...</p>;
  if (isError) return <p className="text-center text-red-500">Error loading products.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white bg-opacity-90 backdrop-blur-md shadow-md py-4 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🛒</span>
          <h1 className="text-xl font-bold text-blue-800">FakeStore</h1>
        </div>
        <p className="text-gray-500 text-sm hidden sm:block">
          Discover amazing products at unbeatable prices
        </p>
        <div>
          {status === "loading" ? null : session ? (
            <button
              onClick={handleDashboard}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold text-sm py-2 px-4 rounded-md transition"
            >
              Dashboard
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2 px-4 rounded-md transition"
            >
              Login
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search + Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
          <h2 className="text-xl font-bold text-gray-800">✨ Featured Products</h2>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 w-full sm:w-80 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Category Filter */}
        <div className="flex overflow-x-auto gap-2 mb-6 pb-1 scrollbar-hide">
          <button
            onClick={() => setSelectedCategry("all")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${selectedCategory === "all"
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
              className={`px-3 py-1.5 rounded-full capitalize text-sm font-medium border transition-all ${selectedCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-blue-100"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {currentProducts.map((product: Product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition-all p-4 flex flex-col"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-40 object-contain mb-3 rounded"
              />
              <h3 className="text-sm font-semibold text-gray-800 truncate">{product.title}</h3>
              <p className="text-sm text-blue-600 font-bold mt-1">${product.price.toFixed(2)}</p>
              <button
                onClick={() => router.push(`/products/${product.id}`)}
                className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5 px-3 rounded-md transition shadow"
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-4 py-1.5 text-sm rounded-md font-medium transition ${currentPage === 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
              Previous
            </button>
            <span className="text-sm text-gray-700 font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-4 py-1.5 text-sm rounded-md font-medium transition ${currentPage === totalPages
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

export default Home;
