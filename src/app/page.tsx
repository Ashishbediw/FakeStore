
'use client';

import { useGetProductsQuery } from "@/redux/api/storeApi";
import { useState } from "react";

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

  
  const { data, isLoading, isError } = useGetProductsQuery({});
  const products = data?.products || [];

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  //pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage)

  if (isLoading) return <p className="text-center text-lg">Loading...</p>;
  if (isError) return <p className="text-center text-red-500">Error loading products.</p>;

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  }

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white shadow-sm py-8 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to FakeStore</h1>
        <p className="mt-2 text-gray-500">Discover amazing products at unbeatable prices</p>
      </header>

      <main className="px-6 py-10 max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentProducts.map((product: Product) => (
            <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-md transition p-4">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-cover mb-4 rounded"
              />
              <h3 className="text-lg font-semibold text-gray-700">{product.title}</h3>
              <p className="text-gray-600 mt-1">Brand: {product.brand}</p>
              <p className="text-gray-500 text-sm mb-2">Category: {product.category}</p>
              <p className="text-gray-800 font-bold">${product.price}</p>
              {product.discount > 0 && (
                <p className="text-green-600 font-medium mt-1">{product.discount}% OFF</p>
              )}
            </div>

          ))}
        </div>
        <div className="flex justify-center items-center gap-4 mt-8">
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

export default Home;
