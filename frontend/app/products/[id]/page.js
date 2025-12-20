// products/[id]/page.js
"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { fetchProductById } from "../../../store/slices/productSlice";
import { addToCart } from "../../../store/slices/cartSlice";
import { formatPrice } from "../../../lib/utils";
import ReviewSection from "../../../components/reviews/ReviewSection";
import {
  Home,
  ChevronRight,
  Star,
  Check,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  RotateCcw,
  Shield,
  MessageCircle,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Minus,
  Plus,
  Package,
  Award,
  Clock,
} from "lucide-react";


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


const LoadingSkeleton = () => (
  <div style={{ backgroundColor: COLORS.lightBg }} className="min-h-screen">
    <div className="w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 text-sm mb-8">
        <div
          className="w-4 h-4 rounded animate-pulse"
          style={{ backgroundColor: COLORS.secondaryBg }}
        ></div>
        <div
          className="w-4 h-4 rounded animate-pulse"
          style={{ backgroundColor: COLORS.secondaryBg }}
        ></div>
        <div
          className="w-20 h-4 rounded animate-pulse"
          style={{ backgroundColor: COLORS.secondaryBg }}
        ></div>
      </div>
      <div
        className="rounded-2xl shadow-lg border p-8"
        style={{
          backgroundColor: "white",
          borderColor: COLORS.border,
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="flex flex-col">
            <div
              className="mb-6 rounded-2xl overflow-hidden aspect-square animate-pulse"
              style={{ backgroundColor: COLORS.secondaryBg }}
            ></div>
            <div className="flex gap-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-24 h-24 rounded-xl animate-pulse"
                  style={{ backgroundColor: COLORS.secondaryBg }}
                ></div>
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <div
              className="w-20 h-6 rounded-lg animate-pulse mb-4"
              style={{ backgroundColor: COLORS.secondaryBg }}
            ></div>
            <div
              className="w-3/4 h-8 rounded animate-pulse mb-4"
              style={{ backgroundColor: COLORS.secondaryBg }}
            ></div>
            <div
              className="w-1/2 h-6 rounded animate-pulse mb-6"
              style={{ backgroundColor: COLORS.secondaryBg }}
            ></div>
            <div
              className="w-full h-4 rounded animate-pulse mb-2"
              style={{ backgroundColor: COLORS.secondaryBg }}
            ></div>
            <div
              className="w-2/3 h-4 rounded animate-pulse mb-6"
              style={{ backgroundColor: COLORS.secondaryBg }}
            ></div>
            <div
              className="w-32 h-12 rounded-2xl animate-pulse mb-6"
              style={{ backgroundColor: COLORS.secondaryBg }}
            ></div>
            <div
              className="w-48 h-6 rounded animate-pulse mb-8"
              style={{ backgroundColor: COLORS.secondaryBg }}
            ></div>
            <div className="flex gap-4 mb-8">
              <div
                className="flex-1 h-14 rounded-xl animate-pulse"
                style={{ backgroundColor: COLORS.secondaryBg }}
              ></div>
              <div
                className="w-14 h-14 rounded-xl animate-pulse"
                style={{ backgroundColor: COLORS.secondaryBg }}
              ></div>
              <div
                className="w-14 h-14 rounded-xl animate-pulse"
                style={{ backgroundColor: COLORS.secondaryBg }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { currentProduct, isLoading, error } = useAppSelector(
    (state) => state.products
  );
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchProductById(params.id));
    }
  }, [dispatch, params.id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (currentProduct) {
      dispatch(
        addToCart({
          productId: currentProduct.id,
          quantity: quantity,
          product: currentProduct,
        })
      );
      alert("Product added to cart!");
    }
  };

  const toggleWishlist = () => setIsWishlisted(!isWishlisted);

  if (isLoading) return <LoadingSkeleton />;

  if (error)
    return (
      <div
        style={{ backgroundColor: COLORS.lightBg }}
        className="min-h-screen flex items-center justify-center"
      >
        <div
          className="rounded-2xl shadow-lg border p-8 text-center max-w-md w-full"
          style={{
            backgroundColor: "white",
            borderColor: COLORS.border,
          }}
        >
          <div
            className="mb-4 p-4 rounded-xl"
            style={{
              backgroundColor: "#FEF2F2",
              color: COLORS.error,
            }}
          >
            <p className="font-semibold">{error}</p>
          </div>
          <button
            onClick={() => router.push("/products")}
            className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl shadow-lg transition-all duration-300"
            style={{ backgroundColor: COLORS.primary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.text;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.primary;
            }}
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Products
          </button>
        </div>
      </div>
    );

  if (!currentProduct)
    return (
      <div
        style={{ backgroundColor: COLORS.lightBg }}
        className="min-h-screen flex items-center justify-center"
      >
        <div
          className="rounded-2xl shadow-lg border p-8 text-center max-w-md w-full"
          style={{
            backgroundColor: "white",
            borderColor: COLORS.border,
          }}
        >
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: COLORS.text }}
          >
            Product not found
          </h2>
          <p className="mb-6" style={{ color: COLORS.textLight }}>
            The product you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.push("/products")}
            className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl shadow-lg transition-all duration-300"
            style={{ backgroundColor: COLORS.primary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.text;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.primary;
            }}
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Products
          </button>
        </div>
      </div>
    );

  const product = currentProduct;

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [
          product.featuredImage ||
            "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=600",
        ];

  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders over $50",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "30-day guarantee",
    },
    {
      icon: Shield,
      title: "2-Year Warranty",
      description: "Product protection",
    },
    {
      icon: Clock,
      title: "Fast Delivery",
      description: "2-3 business days",
    },
  ];

  return (
    <div style={{ backgroundColor: COLORS.lightBg }} className="min-h-screen">
      <div className="w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Home className="w-4 h-4" style={{ color: COLORS.textLight }} />
          <ChevronRight className="w-4 h-4" style={{ color: COLORS.border }} />
          <button
            onClick={() => router.push("/products")}
            className="transition-colors"
            style={{ color: COLORS.textLight }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = COLORS.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = COLORS.textLight;
            }}
          >
            Products
          </button>
          <ChevronRight className="w-4 h-4" style={{ color: COLORS.border }} />
          <span className="font-semibold" style={{ color: COLORS.primary }}>
            {product.name}
          </span>
        </nav>

        {/* Product Section */}
        <div
          className="rounded-2xl shadow-lg border p-8 mb-8"
          style={{
            backgroundColor: "white",
            borderColor: COLORS.border,
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images Column */}
            <div className="flex flex-col">
              <div
                className="mb-6 rounded-2xl overflow-hidden"
                style={{ backgroundColor: COLORS.secondaryBg }}
              >
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full aspect-square object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? "shadow-md"
                          : "hover:border-gray-400"
                      }`}
                      style={{
                        borderColor:
                          selectedImage === index
                            ? COLORS.primary
                            : COLORS.border,
                      }}
                    >
                      <img
                        src={image}
                        alt={`Product view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info Column */}
            <div className="flex flex-col">
              <div className="mb-6">
                <span
                  className="inline-block px-3 py-1 text-xs font-semibold rounded-lg mb-4"
                  style={{
                    color: COLORS.primary,
                    backgroundColor: COLORS.secondaryBg,
                  }}
                >
                  {product.category?.name || "Uncategorized"}
                </span>
                <h1
                  className="text-4xl font-bold mb-4 leading-tight"
                  style={{ color: COLORS.text }}
                >
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating || 4.5)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: COLORS.text }}
                  >
                    {product.rating || 4.5}/5
                  </span>
                  <span className="text-sm" style={{ color: COLORS.textLight }}>
                    ({product.reviewCount || 24} reviews)
                  </span>
                </div>

                <p
                  className="text-lg leading-relaxed"
                  style={{ color: COLORS.textLight }}
                >
                  {product.fullDescription ||
                    product.description ||
                    "No description available."}
                </p>
              </div>

              {/* Price Section */}
              <div
                className="rounded-2xl p-6 mb-6"
                style={{ backgroundColor: COLORS.secondaryBg }}
              >
                <div className="flex items-baseline gap-4 mb-2">
                  <span
                    className="text-5xl font-bold"
                    style={{ color: COLORS.primary }}
                  >
                    {formatPrice
                      ? formatPrice(product.price)
                      : `$${product.price}`}
                  </span>
                  {product.comparePrice && (
                    <>
                      <span
                        className="text-2xl line-through"
                        style={{ color: COLORS.textLight }}
                      >
                        {formatPrice
                          ? formatPrice(product.comparePrice)
                          : `$${product.comparePrice}`}
                      </span>
                      <span
                        className="inline-block px-3 py-1 text-sm font-bold text-white rounded-lg"
                        style={{ backgroundColor: COLORS.error }}
                      >
                        Save{" "}
                        {Math.round(
                          (1 -
                            product.price /
                              (product.comparePrice || product.price)) *
                            100
                        )}
                        %
                      </span>
                    </>
                  )}
                </div>
                <p
                  className="text-sm font-semibold flex items-center gap-2"
                  style={{ color: COLORS.success }}
                >
                  <Check className="w-4 h-4" />
                  Includes all taxes & shipping
                </p>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-3 mb-8">
                <div
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    (product.stock ?? 10) > 0
                      ? "text-emerald-700"
                      : "text-red-700"
                  }`}
                  style={{
                    backgroundColor:
                      (product.stock ?? 10) > 0 ? "#ECFDF5" : "#FEF2F2",
                  }}
                >
                  {(product.stock ?? 10) > 0
                    ? `${product.stock} In Stock`
                    : "Out of Stock"}
                </div>
                {product.sku && (
                  <p className="text-sm" style={{ color: COLORS.textLight }}>
                    SKU:{" "}
                    <span
                      className="font-semibold"
                      style={{ color: COLORS.text }}
                    >
                      {product.sku?.code || product.sku}
                    </span>
                  </p>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <label
                  className="text-sm font-semibold"
                  style={{ color: COLORS.text }}
                >
                  Quantity:
                </label>
                <div
                  className="flex items-center border rounded-lg"
                  style={{ borderColor: COLORS.border }}
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 transition-colors hover:bg-gray-50"
                    style={{ color: COLORS.text }}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span
                    className="w-12 text-center font-semibold"
                    style={{ color: COLORS.text }}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 transition-colors hover:bg-gray-50"
                    style={{ color: COLORS.text }}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={(product.stock ?? 10) === 0}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white rounded-xl shadow-lg hover:-translate-y-0.5 disabled:cursor-not-allowed transition-all duration-300"
                  style={{
                    backgroundColor:
                      (product.stock ?? 10) === 0
                        ? COLORS.border
                        : COLORS.primary,
                  }}
                  onMouseEnter={(e) => {
                    if ((product.stock ?? 10) > 0) {
                      e.currentTarget.style.backgroundColor = COLORS.text;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if ((product.stock ?? 10) > 0) {
                      e.currentTarget.style.backgroundColor = COLORS.primary;
                    }
                  }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>

                <button
                  onClick={toggleWishlist}
                  className="px-4 py-4 border-2 rounded-xl transition-all duration-300"
                  style={{
                    borderColor: COLORS.border,
                    backgroundColor: isWishlisted ? "#FEF2F2" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = COLORS.error;
                    e.currentTarget.style.backgroundColor = "#FEF2F2";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = COLORS.border;
                    if (!isWishlisted) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <Heart
                    className={`w-6 h-6 ${
                      isWishlisted
                        ? "fill-red-500 text-red-500"
                        : "text-gray-600"
                    }`}
                  />
                </button>

                <button
                  className="px-4 py-4 border-2 rounded-xl transition-all duration-300"
                  style={{ borderColor: COLORS.border }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = COLORS.primary;
                    e.currentTarget.style.backgroundColor = COLORS.secondaryBg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = COLORS.border;
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <Share2 className="w-6 h-6" style={{ color: COLORS.text }} />
                </button>
              </div>

              {/* Benefits */}
              <div
                className="space-y-3 pt-8 border-t"
                style={{ borderColor: COLORS.border }}
              >
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <feature.icon
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: COLORS.primary }}
                    />
                    <span
                      className="font-medium"
                      style={{ color: COLORS.text }}
                    >
                      {feature.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        {/* Tabs Section - Reviews Tab Add Karen */}
        <div
          className="rounded-2xl shadow-lg border overflow-hidden"
          style={{
            backgroundColor: "white",
            borderColor: COLORS.border,
          }}
        >
          {/* Tab Navigation */}
          <div className="flex border-b" style={{ borderColor: COLORS.border }}>
            {[
              { id: "description", label: "Product Details" },
              { id: "specifications", label: "Specifications" },
              // { id: "reviews", label: `Reviews (${currentProduct?.totalReviews || 0})` }, // Review count add karen
              // products/[id]/page.js mein
              {
                id: "reviews",
                label: `Reviews (${
                  currentProduct?.reviews?.filter((r) => r.isVerified)
                    ?.length || 0
                })`,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-all ${
                  activeTab === tab.id ? "border-b-2" : "hover:text-gray-900"
                }`}
                style={{
                  color:
                    activeTab === tab.id ? COLORS.primary : COLORS.textLight,
                  borderColor:
                    activeTab === tab.id ? COLORS.primary : "transparent",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === "description" && (
              <div className="prose prose-sm max-w-none">
                <div
                  className="leading-relaxed whitespace-pre-wrap"
                  style={{ color: COLORS.text }}
                >
                  {product.fullDescription ||
                    product.description ||
                    "No description available."}
                </div>
              </div>
            )}

            {activeTab === "specifications" && (
              <div>
                <h3
                  className="text-2xl font-bold mb-8"
                  style={{ color: COLORS.text }}
                >
                  Product Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div
                      className="flex justify-between items-center pb-4 border-b"
                      style={{ borderColor: COLORS.border }}
                    >
                      <span
                        className="font-semibold"
                        style={{ color: COLORS.text }}
                      >
                        Brand
                      </span>
                      <span style={{ color: COLORS.textLight }}>
                        {product.brand?.name || "N/A"}
                      </span>
                    </div>
                    <div
                      className="flex justify-between items-center pb-4 border-b"
                      style={{ borderColor: COLORS.border }}
                    >
                      <span
                        className="font-semibold"
                        style={{ color: COLORS.text }}
                      >
                        Model
                      </span>
                      <span style={{ color: COLORS.textLight }}>
                        {product.sku || "N/A"}
                      </span>
                    </div>
                    <div
                      className="flex justify-between items-center pb-4 border-b"
                      style={{ borderColor: COLORS.border }}
                    >
                      <span
                        className="font-semibold"
                        style={{ color: COLORS.text }}
                      >
                        Category
                      </span>
                      <span style={{ color: COLORS.textLight }}>
                        {product.category?.name || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && currentProduct && (
              <ReviewSection product={currentProduct} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
