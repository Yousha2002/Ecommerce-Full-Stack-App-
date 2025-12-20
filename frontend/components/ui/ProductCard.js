"use client";
import { useState } from "react";
import { ShoppingCart, Heart, Eye, Star, Zap, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../store/slices/wishlistSlice";
import { Rating, Box } from "@mui/material";
import Image from "next/image";


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

export default function ProductCard({
  product,
  onAddToCart,
  viewMode = "grid",
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);


  const isWishlisted = wishlistItems.some(
    (item) => item.productId === product.id
  );

  const isDiscountActive = () => {
    if (!product.discount || product.discount === 0) return false;
    
    const now = new Date();
    const startDate = product.discountStartDate ? new Date(product.discountStartDate) : null;
    const endDate = product.discountEndDate ? new Date(product.discountEndDate) : null;
    
    if (startDate && endDate) {
      return now >= startDate && now <= endDate;
    }

    return true;
  };


  const isNewProduct = () => {
    if (!product.isNew) return false;
    
    const now = new Date();
    const newUntil = product.newUntil ? new Date(product.newUntil) : null;
    
    if (newUntil) {
      return now <= newUntil;
    }
    
 
    return true;
  };


  const calculateDiscountedPrice = () => {
    if (!isDiscountActive()) return null;
    
    const discountAmount = (product.price * product.discount) / 100;
    return product.price - discountAmount;
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setSnackbar({
        open: true,
        message: "Please login to add to wishlist",
        severity: "warning",
      });
      return;
    }

    setWishlistLoading(true);
    try {
      if (isWishlisted) {
        const wishlistItem = wishlistItems.find(
          (item) => item.productId === product.id
        );
        if (wishlistItem) {
          await dispatch(removeFromWishlist(wishlistItem.id)).unwrap();
          setSnackbar({
            open: true,
            message: "Removed from wishlist",
            severity: "info",
          });
        }
      } else {
        await dispatch(addToWishlist(product.id)).unwrap();
        setSnackbar({
          open: true,
          message: "Added to wishlist",
          severity: "success",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error?.message || "Failed to update wishlist",
        severity: "error",
      });
    } finally {
      setWishlistLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const discountedPrice = calculateDiscountedPrice();
  const showDiscount = isDiscountActive();
  const showNewBadge = isNewProduct();


  const WishlistButton = () => (
    <button
      onClick={handleWishlistToggle}
      disabled={wishlistLoading}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className="p-2 backdrop-blur-sm rounded-lg shadow-lg hover:scale-110 transition-all duration-300 disabled:opacity-50"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.9)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "white";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
      }}
    >
      <Heart
        className={`w-4 h-4 ${
          isWishlisted ? "fill-red-500 text-red-500" : ""
        } ${wishlistLoading ? "animate-pulse" : ""}`}
        style={{ color: isWishlisted ? COLORS.error : COLORS.text }}
      />
    </button>
  );

  if (viewMode === "list") {
    return (
      <div
        className="group rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border h-full"
        style={{
          backgroundColor: "white",
          borderColor: COLORS.border,
        }}
      >
        <div className="flex flex-col md:flex-row h-full">
          <div className="relative md:w-80 flex-shrink-0 overflow-hidden">
            <img
              src={
                product.featuredImage ||
                "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=600"
              }
              alt={product.name}
              className={`w-full h-64 md:h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div
                className="absolute inset-0 animate-pulse"
                style={{ backgroundColor: COLORS.secondaryBg }}
              />
            )}

            
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {showNewBadge && (
                <span
                  className="px-3 py-1 text-xs font-bold text-white rounded-lg shadow-lg"
                  style={{ backgroundColor: COLORS.success }}
                >
                  NEW
                </span>
              )}
              {showDiscount && (
                <span
                  className="px-3 py-1 text-xs font-bold text-white rounded-lg shadow-lg"
                  style={{ backgroundColor: COLORS.error }}
                >
                  {product.discount}% OFF
                </span>
              )}
            </div>

            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
              <WishlistButton />

              <Link href={`/products/${product.id}`}>
                <button
                  className="p-2 backdrop-blur-sm rounded-lg shadow-lg hover:scale-110 transition-all duration-300"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(255, 255, 255, 0.9)";
                  }}
                >
                  <Eye className="w-4 h-4" style={{ color: COLORS.text }} />
                </button>
              </Link>
            </div>
          </div>

          <div className="flex-1 p-8 flex flex-col">
            <div className="mb-6">
              <h3
                className="text-2xl font-bold cursor-pointer line-clamp-2 mb-4 leading-tight transition-colors"
                style={{ color: COLORS.text }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = COLORS.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = COLORS.text;
                }}
              >
                {product.name}
              </h3>

              <p
                className="line-clamp-3 mb-6 leading-relaxed"
                style={{ color: COLORS.textLight }}
              >
                {product.description}
              </p>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
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
                    className="text-sm font-medium"
                    style={{ color: COLORS.textLight }}
                  >
                    ({product.reviewCount} reviews)
                  </span>
                </div>

                {(product.stock ?? 10) > 0 ? (
                  <span
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg"
                    style={{
                      color: COLORS.success,
                      backgroundColor: "#ECFDF5",
                    }}
                  >
                    <Zap className="w-3 h-3" />
                    In Stock
                  </span>
                ) : (
                  <span
                    className="px-3 py-1 text-xs font-semibold rounded-lg"
                    style={{
                      color: COLORS.error,
                      backgroundColor: "#FEF2F2",
                    }}
                  >
                    Out of Stock
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <TrendingUp
                  className="w-4 h-4"
                  style={{ color: COLORS.textLight }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: COLORS.textLight }}
                >
                  Free shipping
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <div>
                <div className="flex items-baseline gap-3 mb-1">
                  {showDiscount ? (
                    <>
                      <p
                        className="text-4xl font-bold"
                        style={{ color: COLORS.primary }}
                      >
                        {formatPrice(discountedPrice)}
                      </p>
                      <p
                        className="text-lg line-through font-medium"
                        style={{ color: COLORS.textLight }}
                      >
                        {formatPrice(product.price)}
                      </p>
                      <p
                        className="text-sm font-bold px-2 py-1 rounded"
                        style={{ 
                          backgroundColor: COLORS.error,
                          color: 'white'
                        }}
                      >
                        Save {product.discount}%
                      </p>
                    </>
                  ) : (
                    <p
                      className="text-4xl font-bold mb-1"
                      style={{ color: COLORS.primary }}
                    >
                      {formatPrice(product.price)}
                    </p>
                  )}
                </div>
                {product.comparePrice && !showDiscount && (
                  <p
                    className="text-lg line-through font-medium"
                    style={{ color: COLORS.textLight }}
                  >
                    {formatPrice(product.comparePrice)}
                  </p>
                )}
              </div>

              <button
                onClick={handleAddToCart}
                disabled={(product.stock ?? 10) === 0}
                className="inline-flex items-center gap-2 px-8 py-3 text-base font-semibold text-white rounded-2xl shadow-lg hover:-translate-y-0.5 disabled:cursor-not-allowed transition-all duration-300"
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
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
     <div
      className="group rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border flex flex-col"
      style={{
        backgroundColor: "white",
        borderColor: COLORS.border,
        width: "400px",
      }}
    >
      {/* IMAGE SECTION */}
      <div className="relative w-full h-[240px] overflow-hidden">
        <Image
          src={
            product.featuredImage ||
            "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=600"
          }
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-700 group-hover:scale-110 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoadingComplete={() => setImageLoaded(true)}
        />

        {!imageLoaded && (
          <div
            className="absolute inset-0 animate-pulse"
            style={{ backgroundColor: COLORS.secondaryBg }}
          />
        )}

        {/* BADGES */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {showNewBadge && (
            <span
              className="px-3 py-1 text-xs text-center font-bold text-white rounded-lg shadow-lg"
              style={{ backgroundColor: COLORS.success }}
            >
              NEW
            </span>
          )}

          {showDiscount && (
            <span
              className="px-3 py-1 text-xs font-bold text-white rounded-lg shadow-lg"
              style={{ backgroundColor: COLORS.error }}
            >
              {product.discount}% OFF
            </span>
          )}
        </div>

        {/* WISHLIST + VIEW BUTTON */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
          <WishlistButton />

          <Link href={`/products/${product.id}`}>
            <button
              className="p-2 backdrop-blur-sm rounded-lg shadow-lg hover:scale-110 transition-all duration-300"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
            >
              <Eye className="w-4 h-4" style={{ color: COLORS.text }} />
            </button>
          </Link>
        </div>

        {/* QUICK ADD BUTTON */}
        <button
          onClick={handleAddToCart}
          disabled={(product.stock ?? 10) === 0}
          className="absolute bottom-0 left-0 right-0 w-full py-3 flex items-center justify-center gap-2 text-sm font-semibold text-white opacity-0 group-hover:opacity-100 transform translate-y-full group-hover:translate-y-0 transition-all duration-500 shadow-lg"
          style={{
            backgroundColor:
              (product.stock ?? 10) === 0 ? COLORS.border : COLORS.primary,
          }}
        >
          <ShoppingCart className="w-4 h-4" />
          Quick Add
        </button>
      </div>

      {/* TEXT CONTENT */}
      <div className="p-4 flex-1 flex flex-col">
        {/* PRODUCT NAME */}
        <h3
          className="text-lg font-bold cursor-pointer line-clamp-2 mb-1 leading-tight transition-colors"
          style={{ color: COLORS.text }}
          onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.primary)}
          onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.text)}
        >
          {product.name}
        </h3>

        {/* DESCRIPTION (AUTO ADJUST) */}
        <p
          className="text-sm line-clamp-2 mb-1 leading-relaxed"
          style={{ color: COLORS.textLight }}
        >
          {product.description}
        </p>

        {/* RATING */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Box className="flex items-center">
              <Rating
                value={product.averageRating || product.rating || 4.5}
                readOnly
                size="small"
                sx={{
                  "& .MuiRating-iconFilled": { color: COLORS.warning },
                  "& .MuiRating-iconEmpty": { color: COLORS.border },
                }}
              />
            </Box>
            <span
              className="text-xs font-medium"
              style={{ color: COLORS.textLight }}
            >
              ({product.totalReviews || product.reviewCount})
            </span>
          </div>

          {(product.stock ?? 10) > 0 && (
            <span
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-lg"
              style={{ color: COLORS.success, backgroundColor: "#ECFDF5" }}
            >
              <Zap className="w-3 h-3" />
              In Stock
            </span>
          )}
        </div>

        {/* PRICE */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              {showDiscount ? (
                <>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: COLORS.primary }}
                  >
                    {formatPrice(discountedPrice)}
                  </p>

                  <p
                    className="text-sm line-through font-medium"
                    style={{ color: COLORS.textLight }}
                  >
                    {formatPrice(product.price)}
                  </p>
                </>
              ) : (
                <p
                  className="text-2xl font-bold mb-1"
                  style={{ color: COLORS.primary }}
                >
                  {formatPrice(product.price)}
                </p>
              )}
            </div>

            {product.comparePrice && !showDiscount && (
              <p
                className="text-sm line-through font-medium"
                style={{ color: COLORS.textLight }}
              >
                {formatPrice(product.comparePrice)}
              </p>
            )}
          </div>

          {(product.stock ?? 10) === 0 && (
            <span
              className="text-sm font-semibold"
              style={{ color: COLORS.error }}
            >
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* SNACKBAR */}
      {snackbar.open && (
        <div
          className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 ${
            snackbar.severity === "success"
              ? "bg-green-500 text-white"
              : snackbar.severity === "error"
              ? "bg-red-500 text-white"
              : snackbar.severity === "warning"
              ? "bg-yellow-500 text-black"
              : "bg-blue-500 text-white"
          }`}
        >
          {snackbar.message}
        </div>
      )}
    </div>
  );
}
