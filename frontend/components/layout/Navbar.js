
"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Settings,
  Package,
  Crown,
  Bell,
  MapPin,
  Home,
  Tag,
  Grid3x3,
  Percent,
  Info,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";
import { useRouter, usePathname } from "next/navigation";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const wishlistCount = 5; // Mock data for wishlist

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    router.push("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsSearchFocused(false);
    }
  };

  const navigation = [
    { name: "Home", href: "/", icon: Home, current: pathname === "/" },
    {
      name: "Products",
      href: "/products",
      icon: Grid3x3,
      current: pathname === "/products",
    },
    {
      name: "Categories",
      href: "/categories",
      icon: Tag,
      current: pathname === "/categories",
    },
    {
      name: "Deals",
      href: "/deals",
      icon: Percent,
      current: pathname === "/deals",
    },
    {
      name: "About",
      href: "/about",
      icon: Info,
      current: pathname === "/about",
    },
    {
      name: "Contact",
      href: "/contact",
      icon: Phone,
      current: pathname === "/contact",
    },
  ];

  const userMenuItems = [
    { icon: User, label: "My Profile", href: "/profile" },
    { icon: Package, label: "My Orders", href: "/orders" },
    { icon: Heart, label: "Wishlist", href: "/wishlist", badge: wishlistCount },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  const quickCategories = [
    "Electronics",
    "Fashion",
    "Home & Kitchen",
    "Beauty",
    "Sports",
    "Books",
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 text-sm text-center relative overflow-hidden">
        <div className="flex items-center justify-center gap-2 relative z-10">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span>🎉 Free shipping on orders over $50 • </span>
          <span className="font-semibold">Shop now!</span>
        </div>
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/60"
            : "bg-white border-b border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Row */}
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left Section - Logo & Mobile Menu */}
            <div className="flex items-center gap-4 lg:gap-12">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>

              {/* Logo */}
              <Link
                href="/"
                className="flex items-center gap-2 group flex-shrink-0"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                    ShopHub
                  </span>
                  <span className="text-xs text-gray-500 -mt-1">
                    Premium Store
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      item.current
                        ? "text-blue-600 bg-blue-50 border border-blue-200"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Center Section - Search Bar */}
            <div className="flex-1 max-w-2xl mx-4 lg:mx-8">
              <div className="relative">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products, brands, and categories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() =>
                        setTimeout(() => setIsSearchFocused(false), 200)
                      }
                      className="w-full pl-12 pr-24 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all duration-200"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Search
                    </button>
                  </div>
                </form>

                {/* Search Suggestions */}
                {isSearchFocused && searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-40">
                    <div className="p-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-700">
                        Quick Categories
                      </p>
                    </div>
                    <div className="p-2">
                      {quickCategories
                        .filter((cat) =>
                          cat.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .slice(0, 4)
                        .map((category, index) => (
                          <button
                            key={index}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700 transition-colors"
                            onClick={() => {
                              setSearchQuery(category);
                              setIsSearchFocused(false);
                            }}
                          >
                            {category}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-3 lg:gap-4">
              {/* Location */}
              <button className="hidden lg:flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group p-2 rounded-lg hover:bg-gray-50">
                <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Location</span>
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 text-gray-600 hover:text-red-500 transition-colors group rounded-lg hover:bg-gray-50"
              >
                <Heart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-lg">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors group rounded-lg hover:bg-gray-50"
              >
                <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-lg">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg group-hover:shadow-xl transition-shadow">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                        isUserMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
                        <p className="font-semibold text-gray-900 truncate">
                          {user?.name}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {user?.email}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {user?.role === "admin" && (
                            <span className="inline-block px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                              👑 Admin
                            </span>
                          )}
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                            ⭐ Member
                          </span>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        {userMenuItems.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors group"
                          >
                            <item.icon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                            <span className="flex-1 font-medium">
                              {item.label}
                            </span>
                            {item.badge && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-200 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors group rounded-b-2xl"
                        >
                          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Auth Buttons */
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <button className="hidden lg:block px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors rounded-lg hover:bg-gray-50">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/register">
                    <button className="px-4 lg:px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              {/* Mobile Navigation Items */}
              <nav className="grid grid-cols-2 gap-2 mb-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                      item.current
                        ? "text-blue-600 bg-blue-50 border border-blue-200"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* Mobile Auth Section */}
              {!isAuthenticated && (
                <div className="flex gap-2 px-2 py-3 border-t border-gray-200">
                  <Link
                    href="/login"
                    className="flex-1 text-center py-3 text-gray-700 border border-gray-300 rounded-xl font-medium hover:border-blue-500 hover:text-blue-600 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="flex-1 text-center py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Overlay for dropdowns */}
        {(isUserMenuOpen || isMenuOpen) && (
          <div
            className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm lg:hidden"
            onClick={() => {
              setIsUserMenuOpen(false);
              setIsMenuOpen(false);
            }}
          />
        )}
      </nav>
    </>
  );
};

export default Navbar;
