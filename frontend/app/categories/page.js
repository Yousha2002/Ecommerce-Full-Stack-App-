"use client";
import React, { useEffect, useState } from "react";
import {
  Home,
  ChevronRight,
  ShoppingBag,
  Tag,
  TrendingUp,
  Shield,
  Star,
  Zap,
  ArrowRight,
  Search,
  Filter,
  Grid3x3,
  List,
  Sparkles,
  Crown,
  Award,
  CheckCircle,
  Truck,
  Clock,
  Users,
  Package,
  X,
} from "lucide-react";
import CategoryCard from "../../components/ui/CategoryCard";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { fetchCategories } from "../../store/slices/categorySlice";

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

export default function Categories() {
  const dispatch = useAppDispatch();
  const { items: categories, isLoading } = useAppSelector(
    (state) => state.categories
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);


  const filteredCategories = categories.filter((category) =>
    category.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "featured")
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    return 0;
  });

  const featuredCategories = categories
    .filter((cat) => cat.isFeatured)
    .slice(0, 4);

  const SkeletonLoader = () => (
    <div
      className={`grid gap-6 ${
        viewMode === "list"
          ? "grid-cols-1"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      }`}
    >
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="group rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border h-full flex flex-col"
          style={{
            backgroundColor: "white",
            borderColor: COLORS.border,
          }}
        >
          <div className="relative overflow-hidden">
            <div className="relative pt-[75%]">
              <div
                className="absolute inset-0 animate-pulse"
                style={{ backgroundColor: COLORS.secondaryBg }}
              />
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <div
              className="rounded h-6 mb-3 animate-pulse"
              style={{ backgroundColor: COLORS.secondaryBg }}
            ></div>
            <div
              className="rounded h-4 mb-4 animate-pulse"
              style={{ backgroundColor: COLORS.secondaryBg }}
            ></div>
            <div className="flex items-center justify-between mt-auto">
              <div
                className="rounded h-6 w-20 animate-pulse"
                style={{ backgroundColor: COLORS.secondaryBg }}
              ></div>
              <div
                className="rounded h-4 w-16 animate-pulse"
                style={{ backgroundColor: COLORS.secondaryBg }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const stats = [
    { icon: ShoppingBag, value: "10K+", label: "Products" },
    { icon: Users, value: "50K+", label: "Customers" },
    { icon: Award, value: "99%", label: "Satisfaction" },
    { icon: Truck, value: "24/7", label: "Support" },
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure Shopping",
      description: "256-bit SSL encryption",
    },
    {
      icon: Zap,
      title: "Fast Delivery",
      description: "Free shipping over $50",
    },
    {
      icon: CheckCircle,
      title: "Quality Guarantee",
      description: "30-day returns",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Always here to help",
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.lightBg }}>
      {/* Navigation Bar */}
      <div
        className="border-b top-0 z-40"
        style={{
          backgroundColor: COLORS.lightBg,
          borderColor: COLORS.border,
        }}
      >
        <div className="w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <nav className="flex mt-6 items-center gap-2 text-sm mb-8">
              <Home className="w-4 h-4" style={{ color: COLORS.textLight }} />
              <ChevronRight
                className="w-4 h-4"
                style={{ color: COLORS.border }}
              />
              <span className="font-semibold" style={{ color: COLORS.primary }}>
                Categories
              </span>
            </nav>
            <div className="flex items-center gap-4">
              <div
                className="hidden md:flex items-center gap-2 text-sm"
                style={{ color: COLORS.textLight }}
              >
                <TrendingUp
                  className="w-4 h-4"
                  style={{ color: COLORS.success }}
                />
                <span className="font-medium">Live Deals Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl shadow-xl mb-6"
            style={{ backgroundColor: COLORS.primary }}
          >
            <Package className="w-10 h-10 text-white" />
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
            Premium categories curated just for you with unbeatable quality and
            value
          </p>
        </div>
      </div>

      <div className="w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
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
                  placeholder="Search categories..."
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
                <Filter className="w-5 h-5" />
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
                  <option value="featured">Featured First</option>
                </select>
                <ChevronRight
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none rotate-90"
                  style={{ color: COLORS.textLight }}
                />
              </div>

              {(searchQuery || sortBy !== "name") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSortBy("name");
                  }}
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

          {/* Additional Filters */}
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
                Quick Filters:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSortBy("featured")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    sortBy === "featured"
                      ? "text-white shadow-md"
                      : "hover:bg-gray-200"
                  }`}
                  style={{
                    backgroundColor:
                      sortBy === "featured"
                        ? COLORS.primary
                        : COLORS.secondaryBg,
                    color: sortBy === "featured" ? "white" : COLORS.text,
                  }}
                >
                  <Crown className="w-4 h-4 inline mr-2" />
                  Featured
                </button>
                <button
                  onClick={() => setSortBy("name")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    sortBy === "name"
                      ? "text-white shadow-md"
                      : "hover:bg-gray-200"
                  }`}
                  style={{
                    backgroundColor:
                      sortBy === "name" ? COLORS.primary : COLORS.secondaryBg,
                    color: sortBy === "name" ? "white" : COLORS.text,
                  }}
                >
                  A-Z
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-2xl font-bold" style={{ color: COLORS.text }}>
              {sortedCategories.length}{" "}
              {sortedCategories.length === 1 ? "Category" : "Categories"}
            </p>
            <p className="text-sm mt-1" style={{ color: COLORS.textLight }}>
              {searchQuery && `Results for "${searchQuery}"`}
              {!searchQuery && "Showing all categories"}
            </p>
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
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
              Clear Search
            </button>
          )}
        </div>

        {/* Featured Categories Section */}
        {featuredCategories.length > 0 && !isLoading && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Crown className="w-6 h-6" style={{ color: COLORS.warning }} />
              <h2 className="text-2xl font-bold" style={{ color: COLORS.text }}>
                Featured Categories
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {featuredCategories.map((category) => (
                <div key={category.id} className="relative group">
                  <div
                    className="absolute -inset-1 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"
                    style={{
                      background: `linear-gradient(45deg, ${COLORS.primary}, ${COLORS.warning})`,
                    }}
                  ></div>
                  <div className="relative">
                    <CategoryCard category={category} featured />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Categories Grid */}
        {isLoading ? (
          <SkeletonLoader />
        ) : sortedCategories.length > 0 ? (
          <>
            <div
              className={`grid gap-6 mb-8 ${
                viewMode === "list"
                  ? "grid-cols-1"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              }`}
            >
              {sortedCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  viewMode={viewMode}
                />
              ))}
            </div>

            {/* Pagination */}
            {Math.ceil(sortedCategories.length / 12) > 1 && (
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
                  {[...Array(Math.ceil(sortedCategories.length / 12))].map(
                    (_, i) => (
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
                    )
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(Math.ceil(sortedCategories.length / 12), p + 1)
                    )
                  }
                  disabled={
                    currentPage === Math.ceil(sortedCategories.length / 12)
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
              No categories found
            </h3>
            <p className="mb-8" style={{ color: COLORS.textLight }}>
              {searchQuery
                ? `No categories match your search for "${searchQuery}"`
                : "No categories available at the moment"}
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSortBy("name");
              }}
              className="px-6 py-3 text-white rounded-xl shadow-lg font-semibold transition-all"
              style={{ backgroundColor: COLORS.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.text;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.primary;
              }}
            >
              Show All Categories
            </button>
          </div>
        )}

        {/* Trust Section */}
        <div
          className="rounded-3xl p-8 md:p-12 text-white mb-8 relative overflow-hidden"
          style={{ backgroundColor: COLORS.primary }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -translate-x-24 translate-y-24"></div>

          <div className="relative text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Shop With Us?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
                >
                  <feature.icon className="w-12 h-12 text-white mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-white/80">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
