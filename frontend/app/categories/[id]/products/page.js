// app/ categories/[id]/products/page
"use client";
import React, { useEffect, useState } from "react";
import {
  Home,
  ChevronRight,
  ShoppingBag,
  ArrowLeft,
  Filter,
  Grid3x3,
  List,
  Search,
  Package,
  SortAsc,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "../../../../store/hooks";
import {
  fetchProductsByCategory,
  clearProductsError,
} from "../../../../store/slices/categorySlice";
import ProductCard from "../../../../components/ui/ProductCard";
import { addToCart } from "../../../../store/slices/cartSlice";

// Color theme
const COLORS = {
  primary: "#C9B59C",
  lightBg: "#F9F8F6",
  secondaryBg: "#EFE9E3",
  border: "#D9CFC7",
  text: "#5D4037",
  textLight: "#8D6E63",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
};

export default function CategoryProducts() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    currentCategory,
    categoryProducts,
    productsLoading,
    productsError,
    totalPages,
    currentPage,
    totalProducts,
  } = useAppSelector((state) => state.categories);

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const categoryId = params.id;

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchProductsByCategory({ categoryId, page }));
    }
  }, [dispatch, categoryId, page]);

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    dispatch(addToCart({ productId: product.id, quantity: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  // Filter products based on search
  const filteredProducts = categoryProducts.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (productsLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: COLORS.lightBg }}>
        <div className="w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb Skeleton */}
          <div className="animate-pulse mb-8">
            <div
              className="h-4 rounded w-1/4"
              style={{ backgroundColor: COLORS.secondaryBg }}
            ></div>
          </div>

          {/* Header Skeleton */}
          <div
            className="rounded-2xl shadow-lg border p-8 mb-8 text-center animate-pulse"
            style={{
              backgroundColor: "white",
              borderColor: COLORS.border,
            }}
          >
            <div
              className="w-32 h-32 rounded-full mx-auto mb-6"
              style={{ backgroundColor: COLORS.secondaryBg }}
            ></div>
            <div
              className="h-8 rounded w-1/3 mx-auto mb-4"
              style={{ backgroundColor: COLORS.secondaryBg }}
            ></div>
            <div
              className="h-4 rounded w-2/3 mx-auto mb-6"
              style={{ backgroundColor: COLORS.secondaryBg }}
            ></div>
            <div
              className="h-4 rounded w-1/4 mx-auto"
              style={{ backgroundColor: COLORS.secondaryBg }}
            ></div>
          </div>

          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="rounded-2xl p-4 shadow animate-pulse"
                style={{
                  backgroundColor: "white",
                  borderColor: COLORS.border,
                }}
              >
                <div
                  className="h-48 rounded mb-4"
                  style={{ backgroundColor: COLORS.secondaryBg }}
                ></div>
                <div
                  className="h-4 rounded mb-2"
                  style={{ backgroundColor: COLORS.secondaryBg }}
                ></div>
                <div
                  className="h-4 rounded w-3/4"
                  style={{ backgroundColor: COLORS.secondaryBg }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (productsError) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: COLORS.lightBg }}
      >
        <div className="text-center">
          <div
            className="border px-4 py-3 rounded mb-4"
            style={{
              backgroundColor: "#FEF2F2",
              borderColor: COLORS.error,
              color: COLORS.error,
            }}
          >
            {productsError}
          </div>
          <button
            onClick={() => dispatch(clearProductsError())}
            className="px-4 py-2 text-white rounded hover:opacity-90 transition-opacity"
            style={{ backgroundColor: COLORS.primary }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!currentCategory) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: COLORS.lightBg }}
      >
        <div className="text-center">
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: COLORS.text }}
          >
            Category not found
          </h2>
          <button
            onClick={() => router.push("/categories")}
            className="px-4 py-2 text-white rounded hover:opacity-90 transition-opacity"
            style={{ backgroundColor: COLORS.primary }}
          >
            Back to Categories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.lightBg }}>
      {/* Navigation */}
      <div className="w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-sm mb-8">
          <button
            onClick={() => router.push("/categories")}
            className="flex items-center gap-2 transition-colors"
            style={{ color: COLORS.textLight }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = COLORS.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = COLORS.textLight;
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </button>
          <ChevronRight className="w-4 h-4" style={{ color: COLORS.border }} />
          <Home className="w-4 h-4" style={{ color: COLORS.textLight }} />
          <ChevronRight className="w-4 h-4" style={{ color: COLORS.border }} />
          <span className="font-semibold" style={{ color: COLORS.primary }}>
            {currentCategory.name}
          </span>
        </nav>

        {/* Category Header */}
        <div
          className="rounded-2xl shadow-lg border p-8 mb-8 text-center"
          style={{
            backgroundColor: "white",
            borderColor: COLORS.border,
          }}
        >
          {currentCategory.image && (
            <img
              src={currentCategory.image}
              alt={currentCategory.name}
              className="w-32 h-32 object-cover rounded-full mx-auto mb-6 shadow-md"
            />
          )}
          <h1
            className="text-4xl font-bold mb-4"
            style={{ color: COLORS.text }}
          >
            {currentCategory.name}
          </h1>
          <p
            className="text-lg max-w-2xl mx-auto mb-6"
            style={{ color: COLORS.textLight }}
          >
            {currentCategory.description ||
              `Explore our collection of ${currentCategory.name}`}
          </p>
          <div
            className="flex justify-center items-center gap-6 text-sm"
            style={{ color: COLORS.textLight }}
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span>{totalProducts} products</span>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div
          className="rounded-2xl shadow-lg border p-6 mb-8"
          style={{
            backgroundColor: "white",
            borderColor: COLORS.border,
          }}
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: COLORS.textLight }}
                />
                <input
                  type="text"
                  placeholder={`Search in ${currentCategory.name}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 border rounded-xl focus:outline-none transition-all"
                  style={{
                    backgroundColor: COLORS.lightBg,
                    borderColor: COLORS.border,
                    color: COLORS.text,
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors"
                    style={{ color: COLORS.textLight }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-4">
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ backgroundColor: COLORS.secondaryBg }}
              >
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid" ? "text-white" : "hover:bg-gray-200"
                  }`}
                  style={{
                    backgroundColor:
                      viewMode === "grid" ? COLORS.primary : "transparent",
                    color: viewMode === "grid" ? "white" : COLORS.text,
                  }}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list" ? "text-white" : "hover:bg-gray-200"
                  }`}
                  style={{
                    backgroundColor:
                      viewMode === "list" ? COLORS.primary : "transparent",
                    color: viewMode === "list" ? "white" : COLORS.text,
                  }}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 border rounded-xl focus:outline-none font-medium cursor-pointer transition-all"
                  style={{
                    backgroundColor: "white",
                    borderColor: COLORS.border,
                    color: COLORS.text,
                  }}
                >
                  <option value="name">Sort by Name</option>
                  <option value="price">Sort by Price</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="featured">Featured First</option>
                </select>
                <SortAsc
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                  style={{ color: COLORS.textLight }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2
                className="text-2xl font-bold mb-2"
                style={{ color: COLORS.text }}
              >
                {searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : `Products in ${currentCategory.name}`}
              </h2>
              <p className="text-sm" style={{ color: COLORS.textLight }}>
                Showing {filteredProducts.length} of {categoryProducts.length}{" "}
                products
              </p>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <>
              <div
                className={`grid gap-6 mb-8 ${
                  viewMode === "list"
                    ? "grid-cols-1"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                }`}
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    viewMode={viewMode}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    style={{
                      color: COLORS.text,
                      backgroundColor: "white",
                      borderColor: COLORS.border,
                    }}
                  >
                    Previous
                  </button>

                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-10 h-10 text-sm font-semibold rounded-lg transition-all ${
                          page === i + 1
                            ? "text-white shadow-md"
                            : "border hover:bg-gray-50"
                        }`}
                        style={{
                          backgroundColor:
                            page === i + 1 ? COLORS.primary : "white",
                          color: page === i + 1 ? "white" : COLORS.text,
                          borderColor: COLORS.border,
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    style={{
                      color: COLORS.text,
                      backgroundColor: "white",
                      borderColor: COLORS.border,
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div
              className="text-center py-20 rounded-2xl shadow-lg border"
              style={{
                backgroundColor: "white",
                borderColor: COLORS.border,
              }}
            >
              <div
                className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                style={{ backgroundColor: COLORS.secondaryBg }}
              >
                <Search
                  className="w-10 h-10"
                  style={{ color: COLORS.textLight }}
                />
              </div>
              <h3
                className="text-2xl font-bold mb-2"
                style={{ color: COLORS.text }}
              >
                {searchQuery ? "No products found" : "No products available"}
              </h3>
              <p className="mb-8" style={{ color: COLORS.textLight }}>
                {searchQuery
                  ? `No products match your search for "${searchQuery}" in ${currentCategory.name}`
                  : `There are no products available in ${currentCategory.name} yet.`}
              </p>
              {searchQuery ? (
                <button
                  onClick={clearSearch}
                  className="px-6 py-3 text-white rounded-xl shadow-lg font-semibold transition-all"
                  style={{ backgroundColor: COLORS.primary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.text;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.primary;
                  }}
                >
                  Clear Search
                </button>
              ) : (
                <button
                  onClick={() => router.push("/categories")}
                  className="px-6 py-3 text-white rounded-xl shadow-lg font-semibold transition-all"
                  style={{ backgroundColor: COLORS.primary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.text;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.primary;
                  }}
                >
                  Browse Other Categories
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
