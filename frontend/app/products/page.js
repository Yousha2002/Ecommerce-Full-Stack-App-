// app/products/page.js
"use client";
import React, { useEffect, useState } from "react";
import {
  FilterList,
  ViewModule,
  ViewList,
  Home,
  Category,
  Search,
  Sort,
  TrendingUp,
  LocalMall,
} from "@mui/icons-material";
import {
  ShoppingBag,
  ChevronRight,
  Grid3x3,
  List,
  SlidersHorizontal,
  ChevronDown,
  X,
} from "lucide-react";
import ProductCard from "../../components/ui/ProductCard";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { fetchProducts } from "../../store/slices/productSlice";
import { fetchCategories } from "../../store/slices/categorySlice";
import { addToCart } from "../../store/slices/cartSlice";
import { Grid, Card, Skeleton, Pagination } from "@mui/material";


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

export default function Products() {
  const [filters, setFilters] = useState({
    category: "",
    page: 1,
    limit: 12,
    sort: "name",
    search: "",
    discount: false,
    newArrival: false,
  });
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useAppDispatch();
  const {
    items: products,
    isLoading,
    totalPages,
    totalProducts,
  } = useAppSelector((state) => state.products);
  const { items: categories } = useAppSelector((state) => state.categories);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProducts(filters));
    dispatch(fetchCategories());
  }, [dispatch, filters]);

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    dispatch(addToCart({ productId: product.id, quantity: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : prev.page,
    }));
  };

  const handlePageChange = (event, value) => {
    handleFilterChange("page", value);
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      page: 1,
      limit: 12,
      sort: "name",
      search: "",
    });
    setSearchQuery("");
    setSelectedCategory("All");
    setSortBy("name");
  };

  const sortOptions = [
    { value: "name", label: "Sort by Name" },
    { value: "price", label: "Sort by Price" },
    { value: "rating", label: "Sort by Rating" },
  ];

  const filteredProducts =
    products?.filter((product) => {
      const matchesSearch =
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }) || [];

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * filters.limit,
    currentPage * filters.limit
  );

  const SkeletonLoader = () => (
    <Grid container spacing={3}>
      {[...Array(8)].map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card
            className="p-4 rounded-2xl border shadow-lg"
            style={{
              backgroundColor: "white",
              borderColor: COLORS.border,
            }}
          >
            <Skeleton
              variant="rectangular"
              height={200}
              className="rounded-xl mb-3"
              style={{ backgroundColor: COLORS.secondaryBg }}
            />
            <Skeleton
              variant="text"
              height={30}
              className="mb-2"
              style={{ backgroundColor: COLORS.secondaryBg }}
            />
            <Skeleton
              variant="text"
              height={20}
              width="60%"
              style={{ backgroundColor: COLORS.secondaryBg }}
            />
            <Skeleton
              variant="text"
              height={25}
              width="40%"
              className="mt-2"
              style={{ backgroundColor: COLORS.secondaryBg }}
            />
            <Skeleton
              variant="rectangular"
              height={40}
              className="rounded-lg mt-3"
              style={{ backgroundColor: COLORS.secondaryBg }}
            />
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.lightBg }}>
      <div className="w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Home className="w-4 h-4" style={{ color: COLORS.textLight }} />
          <ChevronRight className="w-4 h-4" style={{ color: COLORS.border }} />
          <span className="font-semibold" style={{ color: COLORS.primary }}>
            Products
          </span>
        </nav>

        <div className="text-center mb-12">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl shadow-xl mb-6"
            style={{ backgroundColor: COLORS.primary }}
          >
            <ShoppingBag className="w-10 h-10 text-white" />
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: COLORS.text }}
          >
            Discover Our Collection
          </h1>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: COLORS.textLight }}
          >
            Premium products curated just for you with unbeatable quality and
            value
          </p>
        </div>

        <div
          className="rounded-2xl shadow-lg border p-6 mb-8"
          style={{
            backgroundColor: "white",
            borderColor: COLORS.border,
          }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: COLORS.textLight }}
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none transition-all"
                  style={{
                    backgroundColor: COLORS.lightBg,
                    borderColor: COLORS.border,
                    color: COLORS.text,
                  }}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl transition-colors font-medium lg:hidden"
                style={{
                  color: COLORS.text,
                  backgroundColor: COLORS.secondaryBg,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.border;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.secondaryBg;
                }}
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </button>

              <div
                className="hidden lg:flex items-center gap-2 px-4 py-3 rounded-xl"
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
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() =>
                    handleFilterChange("discount", !filters.discount)
                  }
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filters.discount
                      ? "text-white shadow-md"
                      : "hover:bg-gray-200"
                  }`}
                  style={{
                    backgroundColor: filters.discount
                      ? COLORS.error
                      : COLORS.secondaryBg,
                    color: filters.discount ? "white" : COLORS.text,
                  }}
                >
                  On Sale
                </button>
                <button
                  onClick={() =>
                    handleFilterChange("newArrival", !filters.newArrival)
                  }
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filters.newArrival
                      ? "text-white shadow-md"
                      : "hover:bg-gray-200"
                  }`}
                  style={{
                    backgroundColor: filters.newArrival
                      ? COLORS.success
                      : COLORS.secondaryBg,
                    color: filters.newArrival ? "white" : COLORS.text,
                  }}
                >
                  New Arrivals
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
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                  style={{ color: COLORS.textLight }}
                />
              </div>

              {(searchQuery ||
                selectedCategory !== "All" ||
                sortBy !== "name") && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl transition-colors font-medium"
                  style={{
                    color: COLORS.error,
                    backgroundColor: "#FEF2F2",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#FEE2E2";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#FEF2F2";
                  }}
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          </div>

          <div
            className={`mt-6 pt-6 border-t ${
              showFilters ? "block" : "hidden lg:block"
            }`}
            style={{ borderColor: COLORS.border }}
          >
            <div className="flex items-center gap-3">
              <span
                className="text-sm font-semibold"
                style={{ color: COLORS.text }}
              >
                Categories:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  key="all"
                  onClick={() => setSelectedCategory("All")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === "All"
                      ? "text-white shadow-md"
                      : "hover:bg-gray-200"
                  }`}
                  style={{
                    backgroundColor:
                      selectedCategory === "All"
                        ? COLORS.primary
                        : COLORS.secondaryBg,
                    color: selectedCategory === "All" ? "white" : COLORS.text,
                  }}
                >
                  All
                </button>
                {categories?.map((category) => (
                  <button
                    key={category.id || category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === category.name
                        ? "text-white shadow-md"
                        : "hover:bg-gray-200"
                    }`}
                    style={{
                      backgroundColor:
                        selectedCategory === category.name
                          ? COLORS.primary
                          : COLORS.secondaryBg,
                      color:
                        selectedCategory === category.name
                          ? "white"
                          : COLORS.text,
                    }}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-2xl font-bold" style={{ color: COLORS.text }}>
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "Product" : "Products"}
            </p>
            <p className="text-sm mt-1" style={{ color: COLORS.textLight }}>
              {searchQuery && `Results for "${searchQuery}"`}
              {!searchQuery &&
                selectedCategory === "All" &&
                "Showing all products"}
              {!searchQuery &&
                selectedCategory !== "All" &&
                `Showing ${selectedCategory.toLowerCase()} products`}
            </p>
          </div>

          {selectedCategory !== "All" && (
            <button
              onClick={() => setSelectedCategory("All")}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors font-medium"
              style={{
                color: COLORS.primary,
                backgroundColor: COLORS.secondaryBg,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.border;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.secondaryBg;
              }}
            >
              <X className="w-4 h-4" />
              {selectedCategory}
            </button>
          )}
        </div>

        {isLoading ? (
          <SkeletonLoader />
        ) : paginatedProducts.length > 0 ? (
          <>
            <div
              className={`grid gap-6 mb-8 ${
                viewMode === "list"
                  ? "grid-cols-1"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              }`}
            >
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  viewMode={viewMode}
                />
              ))}
            </div>

            {Math.ceil(filteredProducts.length / filters.limit) > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  style={{
                    color: COLORS.text,
                    backgroundColor: "white",
                    borderColor: COLORS.border,
                  }}
                >
                  Previous
                </button>

                <div className="flex gap-2">
                  {[
                    ...Array(
                      Math.ceil(filteredProducts.length / filters.limit)
                    ),
                  ].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 text-sm font-semibold rounded-lg transition-all ${
                        currentPage === i + 1
                          ? "text-white shadow-md"
                          : "border hover:bg-gray-50"
                      }`}
                      style={{
                        backgroundColor:
                          currentPage === i + 1 ? COLORS.primary : "white",
                        color: currentPage === i + 1 ? "white" : COLORS.text,
                        borderColor: COLORS.border,
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(
                        Math.ceil(filteredProducts.length / filters.limit),
                        p + 1
                      )
                    )
                  }
                  disabled={
                    currentPage ===
                    Math.ceil(filteredProducts.length / filters.limit)
                  }
                  className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
              No products found
            </h3>
            <p className="mb-8" style={{ color: COLORS.textLight }}>
              {searchQuery
                ? `No products match your search for "${searchQuery}"`
                : "No products available at the moment"}
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 text-white rounded-xl shadow-lg font-semibold transition-all"
              style={{ backgroundColor: COLORS.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.text;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.primary;
              }}
            >
              Show All Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
