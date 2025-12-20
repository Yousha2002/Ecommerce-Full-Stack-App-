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
  Truck,
  Star,
  Shield,
  Gift,
} from "lucide-react";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";
import { useRouter, usePathname } from "next/navigation";

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

const AdminHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const { items: wishlistItems = [] } = useAppSelector(
    (state) => state.wishlist
  );
  const wishlistItemCount = wishlistItems?.length || 0;

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
    router.push("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };
const { userReviews = [] } = useAppSelector((state) => state.reviews);
const reviewsCount = userReviews?.length ;
  const navigation = [
    { name: "Home", href: "/", current: pathname === "/" },
    { name: "Products", href: "/products", current: pathname === "/products" },
    {
      name: "Categories",
      href: "/categories",
      current: pathname === "/categories",
    },
    { name: "Contact", href: "/contact", current: pathname === "/contact" },
    { name: "About", href: "/about", current: pathname === "/about" },
  ];

  const userMenuItems = [
    { icon: User, label: "My Profile", href: "/profile" },
    { icon: Package, label: "My Orders", href: "/orders" },
    {
      icon: Heart,
      label: "Wishlist",
      href: "/wishlist",
      badge: wishlistItemCount,
    },
   { icon: Star, label: "My Reviews", href: "/user/reviews", badge: reviewsCount },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  if (user?.role === "admin") {
    userMenuItems.push({
      icon: Crown,
      label: "Admin Dashboard",
      href: "/admin/dashboard",
    });
  }

  return (
    <>
      {/* Top Announcement Bar */}
      <div
        className="py-2 px-4 text-sm text-center"
        style={{
          backgroundColor: COLORS.primary,
          color: "white",
        }}
      >
        <div className="flex items-center justify-center gap-2">
          <Truck className="w-4 h-4" />
          <span>Free shipping on orders over $50 • </span>
          <span className="font-semibold">Shop now!</span>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b"
            : "bg-white border-b"
        }`}
        style={{
          borderColor: COLORS.border,
          backgroundColor: isScrolled
            ? "rgba(249, 248, 246, 0.95)"
            : COLORS.lightBg,
        }}
      >
        <div className="w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left Section - Logo & Navigation */}
            <div className="flex items-center gap-8 lg:gap-12">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 group">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <span
                  className="text-2xl font-bold"
                  style={{ color: COLORS.text }}
                >
                  ShopHub
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative font-medium transition-all px-4 py-2 rounded-xl mx-1 ${
                      item.current
                        ? "text-white shadow-md"
                        : "text-gray-700 hover:text-white hover:shadow-sm"
                    }`}
                    style={{
                      backgroundColor: item.current
                        ? COLORS.primary
                        : "transparent",
                      color: item.current ? "white" : COLORS.text,
                    }}
                    onMouseEnter={(e) => {
                      if (!item.current) {
                        e.currentTarget.style.backgroundColor =
                          COLORS.secondaryBg;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!item.current) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    {item.name}
                    {item.current && (
                      <div
                        className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-1 rounded-full"
                        style={{ backgroundColor: "white" }}
                      />
                    )}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Center Section - Search Bar */}
            {/* <div className="flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
                    style={{ color: COLORS.textLight }}
                  />
                  <input
                    type="text"
                    placeholder="Search products, brands, and categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-24 py-3 border rounded-2xl focus:outline-none transition-colors"
                    style={{
                      backgroundColor: COLORS.lightBg,
                      borderColor: COLORS.border,
                      color: COLORS.text,
                    }}
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 text-white rounded-xl text-sm font-medium transition-colors"
                    style={{ backgroundColor: COLORS.primary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = COLORS.text;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = COLORS.primary;
                    }}
                  >
                    Search
                  </button>
                </div>
              </form>
            </div> */}

            {/* Right Section - Actions */}
            <div className="flex items-center gap-4 lg:gap-6">
              {/* Location */}
              {/* <button
                className="hidden lg:flex items-center gap-2 transition-colors group p-2 rounded-xl"
                style={{ color: COLORS.text }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.secondaryBg;
                  e.currentTarget.style.color = COLORS.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = COLORS.text;
                }}
              >
                <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Location</span>
              </button> */}

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 transition-colors group rounded-xl"
                style={{ color: COLORS.text }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.secondaryBg;
                  e.currentTarget.style.color = COLORS.error;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = COLORS.text;
                }}
              >
                <Heart className="w-6 h-6 group-hover:scale-110 transition-transform" />

                {isAuthenticated && wishlistItemCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 text-white text-xs rounded-full flex items-center justify-center font-semibold"
                    style={{ backgroundColor: COLORS.error }}
                  >
                    {wishlistItemCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 transition-colors group rounded-xl"
                style={{ color: COLORS.text }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.secondaryBg;
                  e.currentTarget.style.color = COLORS.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = COLORS.text;
                }}
              >
                <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                {isAuthenticated && cartItemCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 text-white text-xs rounded-full flex items-center justify-center font-semibold"
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-xl transition-colors group"
                    style={{
                      backgroundColor: isUserMenuOpen
                        ? COLORS.secondaryBg
                        : "transparent",
                      color: COLORS.text,
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md"
                      style={{ backgroundColor: COLORS.primary }}
                    >
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        isUserMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div
                      className="absolute right-0 top-full mt-2 w-64 rounded-2xl shadow-xl border py-2 z-50"
                      style={{
                        backgroundColor: COLORS.lightBg,
                        borderColor: COLORS.border,
                      }}
                    >
                      {/* User Info */}
                      <div
                        className="px-4 py-3 border-b"
                        style={{ borderColor: COLORS.border }}
                      >
                        <p
                          className="font-semibold"
                          style={{ color: COLORS.text }}
                        >
                          {user?.name}
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: COLORS.textLight }}
                        >
                          {user?.email}
                        </p>
                        {user?.role === "admin" && (
                          <span
                            className="inline-block mt-1 px-2 py-1 text-xs rounded-full font-medium"
                            style={{
                              backgroundColor: COLORS.secondaryBg,
                              color: COLORS.primary,
                            }}
                          >
                            <Crown className="w-3 h-3 inline mr-1" />
                            Admin
                          </span>
                        )}
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        {userMenuItems.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 transition-colors mx-2 rounded-lg"
                            style={{ color: COLORS.text }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor =
                                COLORS.secondaryBg;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "transparent";
                            }}
                          >
                            <item.icon
                              className="w-5 h-5"
                              style={{ color: COLORS.textLight }}
                            />
                            <span className="flex-1">{item.label}</span>
                            {item.badge && (
                              <span
                                className="px-2 py-1 text-xs rounded-full font-medium"
                                style={{
                                  backgroundColor: COLORS.secondaryBg,
                                  color: COLORS.primary,
                                }}
                              >
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>

                      {/* Logout */}
                      <div
                        className="border-t pt-2"
                        style={{ borderColor: COLORS.border }}
                      >
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2 transition-colors mx-2 rounded-lg"
                          style={{ color: COLORS.error }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#FEF2F2";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }}
                        >
                          <LogOut className="w-5 h-5" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Auth Buttons */
                <div className="flex items-center gap-3">
                  <Link href="/login">
                    <button
                      className="px-4 py-2 font-medium transition-colors rounded-xl"
                      style={{ color: COLORS.text }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          COLORS.secondaryBg;
                        e.currentTarget.style.color = COLORS.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = COLORS.text;
                      }}
                    >
                      Sign In
                    </button>
                  </Link>
                  <Link href="/register">
                    <button
                      className="px-6 py-2 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
                      style={{ backgroundColor: COLORS.primary }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = COLORS.text;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = COLORS.primary;
                      }}
                    >
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 transition-colors rounded-xl"
                style={{ color: COLORS.text }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.secondaryBg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div
              className="lg:hidden border-t py-4"
              style={{ borderColor: COLORS.border }}
            >
              <nav className="flex flex-col space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                      item.current ? "text-white" : ""
                    }`}
                    style={{
                      backgroundColor: item.current
                        ? COLORS.primary
                        : "transparent",
                      color: item.current ? "white" : COLORS.text,
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
                {!isAuthenticated && (
                  <div className="flex gap-2 px-4 py-3">
                    <Link
                      href="/login"
                      className="flex-1 text-center py-2 rounded-lg font-medium border"
                      style={{
                        color: COLORS.text,
                        borderColor: COLORS.border,
                      }}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="flex-1 text-center py-2 rounded-lg font-medium text-white"
                      style={{ backgroundColor: COLORS.primary }}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>

        {/* Overlay for dropdowns */}
        {(isUserMenuOpen || isMenuOpen) && (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => {
              setIsUserMenuOpen(false);
              setIsMenuOpen(false);
            }}
          />
        )}
      </header>
    </>
  );
};

export default AdminHeader;
