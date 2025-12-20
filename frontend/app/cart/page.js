"use client";
import React, { useEffect, useState } from "react";
import {
  Home,
  ChevronRight,
  ShoppingCart,
  ArrowRight,
  Plus,
  Minus,
  Heart,
  Trash2,
  Truck,
  Shield,
  RotateCcw,
  Sparkles,
  Zap,
  Clock,
  Tag,
  Crown,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  getCartItems,
  updateCartItem,
  removeFromCart,
  clearCartError,
} from "../../store/slices/cartSlice";
import { formatPrice } from "../../lib/utils";
import Link from "next/link";


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

export default function Cart() {
  const dispatch = useAppDispatch();
  const {
    items: cartItems,
    isLoading,
    error,
  } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCartItems());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {

    const initialQuantities = {};
    cartItems.forEach((item) => {
      initialQuantities[item.id] = item.quantity;
    });
    setQuantities(initialQuantities);
  }, [cartItems]);

  const handleUpdateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    setQuantities((prev) => ({ ...prev, [cartItemId]: newQuantity }));
    dispatch(updateCartItem({ cartItemId, quantity: newQuantity }));
  };

  const handleRemoveItem = (cartItemId) => {
    dispatch(removeFromCart(cartItemId));
  };

  
  const subtotal = cartItems.reduce((total, item) => {
    let itemPrice = 0;
    
    if (item.itemType === 'product' && item.product) {
      itemPrice = item.product.price || 0;
    } else if (item.itemType === 'flash_sale' && item.flashSale) {
      itemPrice = item.flashSale.currentPrice || item.flashSale.oldPrice || 0;
    }
    
    return total + itemPrice * (quantities[item.id] || item.quantity);
  }, 0);

  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const savings = cartItems.reduce((total, item) => {
    let originalPrice = 0;
    let currentPrice = 0;
    
    if (item.itemType === 'product' && item.product) {
      originalPrice = item.product.comparePrice || item.product.price || 0;
      currentPrice = item.product.price || 0;
    } else if (item.itemType === 'flash_sale' && item.flashSale) {
      originalPrice = item.flashSale.oldPrice || item.flashSale.currentPrice || 0;
      currentPrice = item.flashSale.currentPrice || 0;
    }
    
    return total + (originalPrice - currentPrice) * (quantities[item.id] || item.quantity);
  }, 0);


  const recommendedProducts = [
    {
      id: 1,
      name: "Wireless Earbuds Pro",
      price: 129.99,
      comparePrice: 179.99,
      image: "https://images.unsplash.com/photo-1590658165737-15a047b8b5e3?w=400&h=400&fit=crop",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Smart Watch Series 8",
      price: 299.99,
      comparePrice: 399.99,
      image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&h=400&fit=crop",
      rating: 4.6,
    },
    {
      id: 3,
      name: "Laptop Stand Aluminum",
      price: 49.99,
      comparePrice: 69.99,
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop",
      rating: 4.7,
    },
  ];

  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders over $50",
    },
    {
      icon: Shield,
      title: "2-Year Warranty",
      description: "Product protection",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "30-day guarantee",
    },
    {
      icon: Zap,
      title: "Fast Delivery",
      description: "2-3 business days",
    },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.lightBg }}>
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg" style={{ backgroundColor: COLORS.primary }}>
            <ShoppingCart className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4" style={{ color: COLORS.text }}>
            Please Login
          </h2>
          <p className="mb-8" style={{ color: COLORS.textLight }}>
            Sign in to view your shopping cart and continue shopping
          </p>
          <Link href="/login">
            <button
              className="px-8 py-3 text-white rounded-xl font-semibold transition-colors"
              style={{ backgroundColor: COLORS.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.text;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.primary;
              }}
            >
              Login to Continue
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const SkeletonLoader = () => (
    <div className="space-y-6">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border p-6 shadow-lg animate-pulse"
          style={{
            backgroundColor: "white",
            borderColor: COLORS.border,
          }}
        >
          <div className="flex gap-6">
            <div className="w-24 h-24 rounded-xl" style={{ backgroundColor: COLORS.secondaryBg }}></div>
            <div className="flex-1">
              <div className="rounded h-6 w-3/4 mb-3" style={{ backgroundColor: COLORS.secondaryBg }}></div>
              <div className="rounded h-4 w-1/2 mb-4" style={{ backgroundColor: COLORS.secondaryBg }}></div>
              <div className="flex items-center gap-4">
                <div className="rounded h-10 w-32" style={{ backgroundColor: COLORS.secondaryBg }}></div>
                <div className="rounded h-10 w-32" style={{ backgroundColor: COLORS.secondaryBg }}></div>
              </div>
            </div>
            <div className="rounded h-6 w-20" style={{ backgroundColor: COLORS.secondaryBg }}></div>
          </div>
        </div>
      ))}
    </div>
  );


  const getItemDetails = (item) => {
    if (item.itemType === 'product' && item.product) {
      return {
        image: item.product.featuredImage || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
        name: item.product.name,
        description: item.product.description,
        price: item.product.price,
        comparePrice: item.product.comparePrice,
        link: `/products/${item.product.id}`,
        isFlashSale: false
      };
    } else if (item.itemType === 'flash_sale' && item.flashSale) {
      return {
        image: item.flashSale.image,
        name: item.flashSale.title,
        description: item.flashSale.description,
        price: item.flashSale.currentPrice,
        comparePrice: item.flashSale.oldPrice,
        link: item.flashSale.targetUrl || '/flash-sales',
        isFlashSale: true,
        discountPercentage: item.flashSale.discountPercentage
      };
    }
  
    return {
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
      name: "Unknown Item",
      description: "Item not available",
      price: 0,
      comparePrice: null,
      link: '/products',
      isFlashSale: false
    };
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.lightBg }}>
      {/* Navigation */}
      <div
        className="border-b backdrop-blur-md"
        style={{
          backgroundColor: "rgba(249, 248, 246, 0.8)",
          borderColor: COLORS.border,
        }}
      >
        <div className="w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link
                href="/"
                className="flex items-center gap-2 transition-colors"
                style={{ color: COLORS.textLight }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = COLORS.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = COLORS.textLight;
                }}
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              <ChevronRight className="w-4 h-4" style={{ color: COLORS.border }} />
              <span className="font-semibold" style={{ color: COLORS.primary }}>
                Shopping Cart
              </span>
            </nav>
          </div>
        </div>
      </div>

      <div className="w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl shadow-xl mb-6"
            style={{ backgroundColor: COLORS.primary }}
          >
            <ShoppingCart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: COLORS.text }}>
            Shopping Cart
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: COLORS.textLight }}>
            Review your items and proceed to checkout
          </p>
        </div>

        {error && (
          <div
            className="border rounded-2xl p-4 mb-6"
            style={{
              backgroundColor: "#FEF2F2",
              borderColor: COLORS.error,
            }}
          >
            <div className="flex items-center justify-between">
              <p style={{ color: COLORS.error }} className="font-medium">
                {error}
              </p>
              <button
                onClick={() => dispatch(clearCartError())}
                style={{ color: COLORS.error }}
                className="hover:opacity-70"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div
            className="text-center py-20 rounded-2xl shadow-lg border"
            style={{
              backgroundColor: "white",
              borderColor: COLORS.border,
            }}
          >
            <div className="max-w-md mx-auto">
              <ShoppingCart className="w-20 h-20 mx-auto mb-6" style={{ color: COLORS.border }} />
              <h3 className="text-2xl font-bold mb-4" style={{ color: COLORS.text }}>
                Your cart is empty
              </h3>
              <p className="mb-8" style={{ color: COLORS.textLight }}>
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link href="/products">
                <button
                  className="inline-flex items-center gap-2 px-8 py-3 text-white rounded-xl font-semibold transition-colors"
                  style={{ backgroundColor: COLORS.primary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.text;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.primary;
                  }}
                >
                  Continue Shopping
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div
                className="rounded-2xl shadow-lg border p-6 mb-6"
                style={{
                  backgroundColor: "white",
                  borderColor: COLORS.border,
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold" style={{ color: COLORS.text }}>
                    Cart Items ({cartItems.length})
                  </h2>
                  <button
                    onClick={() => cartItems.forEach((item) => handleRemoveItem(item.id))}
                    style={{ color: COLORS.error }}
                    className="hover:opacity-70 font-medium text-sm"
                  >
                    Clear All
                  </button>
                </div>

                {isLoading ? (
                  <SkeletonLoader />
                ) : (
                  <div className="space-y-6">
                    {cartItems.map((item) => {
                      const itemDetails = getItemDetails(item);
                      const currentQuantity = quantities[item.id] || item.quantity;
                      
                      return (
                        <div
                          key={item.id}
                          className="group rounded-2xl p-6 border transition-all duration-300"
                          style={{
                            backgroundColor: COLORS.secondaryBg,
                            borderColor: COLORS.border,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "white";
                            e.currentTarget.style.borderColor = COLORS.primary;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = COLORS.secondaryBg;
                            e.currentTarget.style.borderColor = COLORS.border;
                          }}
                        >
                          <div className="flex flex-col md:flex-row gap-6">
                            {/* Item Image */}
                            <div className="flex-shrink-0 relative">
                              <img
                                src={itemDetails.image}
                                alt={itemDetails.name}
                                className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover shadow-md"
                              />
                              {itemDetails.isFlashSale && (
                                <div className="absolute -top-2 -right-2">
                                  <span
                                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold text-white rounded-full shadow-lg"
                                    style={{ backgroundColor: COLORS.error }}
                                  >
                                    <Zap className="w-3 h-3" />
                                    Flash Sale
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Item Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <h3
                                  className="text-lg font-semibold transition-colors"
                                  style={{ color: COLORS.text }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.color = COLORS.primary;
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.color = COLORS.text;
                                  }}
                                >
                                  <Link href={itemDetails.link}>
                                    {itemDetails.name}
                                  </Link>
                                </h3>
                                {itemDetails.isFlashSale && itemDetails.discountPercentage && (
                                  <span
                                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold text-white rounded-lg ml-2"
                                    style={{ backgroundColor: COLORS.success }}
                                  >
                                    <Tag className="w-3 h-3" />
                                    {itemDetails.discountPercentage}% OFF
                                  </span>
                                )}
                              </div>
                              
                              <p className="text-sm mb-4 line-clamp-2" style={{ color: COLORS.textLight }}>
                                {itemDetails.description}
                              </p>

                              {/* Item Type Badge */}
                              <div className="flex items-center gap-2 mb-3">
                                <span
                                  className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                                    itemDetails.isFlashSale 
                                      ? 'text-yellow-800 bg-yellow-100' 
                                      : 'text-blue-800 bg-blue-100'
                                  }`}
                                >
                                  {itemDetails.isFlashSale ? 'Flash Sale' : 'Regular Product'}
                                </span>
                                {item.itemType === 'flash_sale' && item.flashSale && (
                                  <div className="flex items-center gap-1 text-xs" style={{ color: COLORS.warning }}>
                                    <Clock className="w-3 h-3" />
                                    <span>Ends soon</span>
                                  </div>
                                )}
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-4 mb-4">
                                <div
                                  className="flex items-center border rounded-lg bg-white"
                                  style={{ borderColor: COLORS.border }}
                                >
                                  <button
                                    onClick={() => handleUpdateQuantity(item.id, currentQuantity - 1)}
                                    className="p-2 transition-colors rounded-l-lg hover:bg-gray-100"
                                    style={{ color: COLORS.text }}
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span
                                    className="w-12 text-center font-semibold"
                                    style={{ color: COLORS.text }}
                                  >
                                    {currentQuantity}
                                  </span>
                                  <button
                                    onClick={() => handleUpdateQuantity(item.id, currentQuantity + 1)}
                                    className="p-2 transition-colors rounded-r-lg hover:bg-gray-100"
                                    style={{ color: COLORS.text }}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                  <button
                                    className="p-2 transition-colors hover:text-red-500"
                                    style={{ color: COLORS.textLight }}
                                  >
                                    <Heart className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="p-2 transition-colors hover:text-red-500"
                                    style={{ color: COLORS.textLight }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="flex-shrink-0 text-right">
                              <p className="text-2xl font-bold mb-1" style={{ color: COLORS.text }}>
                                {formatPrice
                                  ? formatPrice(itemDetails.price * currentQuantity)
                                  : `$${(itemDetails.price * currentQuantity).toFixed(2)}`}
                              </p>
                              
                              {itemDetails.comparePrice && itemDetails.comparePrice > itemDetails.price && (
                                <p className="text-sm line-through mb-1" style={{ color: COLORS.textLight }}>
                                  {formatPrice
                                    ? formatPrice(itemDetails.comparePrice * currentQuantity)
                                    : `$${(itemDetails.comparePrice * currentQuantity).toFixed(2)}`}
                                </p>
                              )}

                              <p className="text-sm mt-1" style={{ color: COLORS.textLight }}>
                                {formatPrice
                                  ? formatPrice(itemDetails.price)
                                  : `$${itemDetails.price.toFixed(2)}`}{" "}
                                each
                              </p>

                              {itemDetails.isFlashSale && (
                                <div className="mt-2 flex items-center justify-end gap-1">
                                  <Crown className="w-4 h-4" style={{ color: COLORS.warning }} />
                                  <span className="text-xs font-semibold" style={{ color: COLORS.warning }}>
                                    Limited Time Offer
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Trust Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="rounded-xl p-4 text-center border"
                    style={{
                      backgroundColor: "white",
                      borderColor: COLORS.border,
                    }}
                  >
                    <feature.icon className="w-8 h-8 mx-auto mb-2" style={{ color: COLORS.primary }} />
                    <p className="text-sm font-semibold mb-1" style={{ color: COLORS.text }}>
                      {feature.title}
                    </p>
                    <p className="text-xs" style={{ color: COLORS.textLight }}>
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Recommended Products */}
              <div
                className="rounded-2xl shadow-lg border p-6"
                style={{
                  backgroundColor: "white",
                  borderColor: COLORS.border,
                }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5" style={{ color: COLORS.warning }} />
                  <h3 className="text-xl font-bold" style={{ color: COLORS.text }}>
                    Frequently Bought Together
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="group text-center p-4 rounded-xl transition-colors"
                      style={{ backgroundColor: COLORS.secondaryBg }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = COLORS.secondaryBg;
                      }}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-24 h-24 mx-auto mb-3 rounded-lg object-cover group-hover:scale-105 transition-transform"
                      />
                      <h4 className="font-semibold text-sm mb-2" style={{ color: COLORS.text }}>
                        {product.name}
                      </h4>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-lg font-bold" style={{ color: COLORS.text }}>
                          {formatPrice ? formatPrice(product.price) : `$${product.price}`}
                        </span>
                        {product.comparePrice && (
                          <span className="text-sm line-through" style={{ color: COLORS.textLight }}>
                            {formatPrice ? formatPrice(product.comparePrice) : `$${product.comparePrice}`}
                          </span>
                        )}
                      </div>
                      <button
                        className="w-full py-2 text-white rounded-lg text-sm font-medium transition-colors"
                        style={{ backgroundColor: COLORS.primary }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = COLORS.text;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = COLORS.primary;
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div
                className="rounded-2xl shadow-lg border p-6 sticky top-8"
                style={{
                  backgroundColor: "white",
                  borderColor: COLORS.border,
                }}
              >
                <h3 className="text-2xl font-bold mb-6" style={{ color: COLORS.text }}>
                  Order Summary
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span style={{ color: COLORS.textLight }}>Subtotal</span>
                    <span className="font-semibold" style={{ color: COLORS.text }}>
                      {formatPrice ? formatPrice(subtotal) : `$${subtotal.toFixed(2)}`}
                    </span>
                  </div>

                  {savings > 0 && (
                    <div className="flex justify-between">
                      <span style={{ color: COLORS.success }}>Savings</span>
                      <span className="font-semibold" style={{ color: COLORS.success }}>
                        -{formatPrice ? formatPrice(savings) : `$${savings.toFixed(2)}`}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span style={{ color: COLORS.textLight }}>Shipping</span>
                    <span className="font-semibold" style={{ color: COLORS.text }}>
                      {shipping === 0 ? "FREE" : formatPrice ? formatPrice(shipping) : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span style={{ color: COLORS.textLight }}>Tax</span>
                    <span className="font-semibold" style={{ color: COLORS.text }}>
                      {formatPrice ? formatPrice(tax) : `$${tax.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="border-t pt-4" style={{ borderColor: COLORS.border }}>
                    <div className="flex justify-between">
                      <span className="text-lg font-bold" style={{ color: COLORS.text }}>
                        Total
                      </span>
                      <span className="text-lg font-bold" style={{ color: COLORS.text }}>
                        {formatPrice ? formatPrice(total) : `$${total.toFixed(2)}`}
                      </span>
                    </div>
                  </div>
                </div>

                {subtotal < 50 && (
                  <div
                    className="border rounded-xl p-4 mb-6"
                    style={{
                      backgroundColor: COLORS.secondaryBg,
                      borderColor: COLORS.primary,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="w-4 h-4" style={{ color: COLORS.primary }} />
                      <span className="text-sm font-semibold" style={{ color: COLORS.primary }}>
                        Free Shipping!
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: COLORS.text }}>
                      Add {formatPrice ? formatPrice(50 - subtotal) : `$${(50 - subtotal).toFixed(2)}`} more to get free shipping
                    </p>
                  </div>
                )}

                <button
                  className="w-full py-4 text-white rounded-xl font-semibold text-lg mb-4 transition-all shadow-lg hover:shadow-xl"
                  style={{ backgroundColor: COLORS.primary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.text;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.primary;
                  }}
                >
                  Proceed to Checkout
                </button>

                <Link href="/products">
                  <button
                    className="w-full py-3 border-2 text-gray-700 hover:border-blue-500 hover:text-blue-600 rounded-xl font-semibold transition-all"
                    style={{
                      borderColor: COLORS.border,
                      color: COLORS.text,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = COLORS.primary;
                      e.currentTarget.style.color = COLORS.primary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = COLORS.border;
                      e.currentTarget.style.color = COLORS.text;
                    }}
                  >
                    Continue Shopping
                  </button>
                </Link>

                {/* Security Badge */}
                <div className="mt-6 pt-6 border-t text-center" style={{ borderColor: COLORS.border }}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Shield className="w-4 h-4" style={{ color: COLORS.success }} />
                    <span className="text-sm font-medium" style={{ color: COLORS.textLight }}>
                      Secure Checkout
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: COLORS.textLight }}>
                    Your payment information is encrypted and secure
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}