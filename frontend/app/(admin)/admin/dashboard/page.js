"use client";
import React, { useEffect, useState } from "react";
import {
  Users,
  ShoppingBag,
  Tag,
  Receipt,
  TrendingUp,
  DollarSign,
  Eye,
  MoreVertical,
  ArrowUp,
  ArrowDown,
  Calendar,
  Package,
  UserPlus,
  ShoppingCart,
  BarChart3,
  Settings,
  Menu,
  X,
  Home,
  CreditCard,
  Truck,
  RefreshCw,
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../../../store/hooks";
import { fetchDashboardStats } from "../../../../store/slices/adminSlice";

// Color theme constants
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

const StatCard = ({
  title,
  value,
  icon,
  change,
  changeType,
  subtitle,
  color = "primary",
}) => {
  const colorConfig = {
    primary: {
      bg: COLORS.secondaryBg,
      border: COLORS.primary,
      iconBg: COLORS.primary,
    },
    success: {
      bg: "#ECFDF5",
      border: "#10B981",
      iconBg: "#10B981",
    },
    warning: {
      bg: "#FFFBEB",
      border: "#F59E0B",
      iconBg: "#F59E0B",
    },
    error: {
      bg: "#FEF2F2",
      border: "#EF4444",
      iconBg: "#EF4444",
    },
    info: {
      bg: "#EFF6FF",
      border: "#3B82F6",
      iconBg: "#3B82F6",
    },
  };

  const config = colorConfig[color] || colorConfig.primary;

  return (
    <div
      className="rounded-2xl border-2 p-6 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden"
      style={{
        backgroundColor: config.bg,
        borderColor: config.border,
      }}
    >
      {/* Background pattern */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-5 transform translate-x-8 -translate-y-8">
        {React.cloneElement(icon, {
          className: "w-20 h-20",
          style: { color: config.iconBg },
        })}
      </div>

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div
          className="p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300"
          style={{ backgroundColor: config.iconBg }}
        >
          {React.cloneElement(icon, { className: "w-6 h-6 text-white" })}
        </div>
        <button className="opacity-0 group-hover:opacity-100 p-2 transition-all duration-300 hover:bg-white/50 rounded-lg">
          <MoreVertical className="w-4 h-4" style={{ color: COLORS.text }} />
        </button>
      </div>

      <div className="relative z-10">
        <p
          className="text-sm font-medium mb-1"
          style={{ color: COLORS.textLight }}
        >
          {title}
        </p>
        <div className="flex items-baseline gap-2 mb-2">
          <h3 className="text-3xl font-bold" style={{ color: COLORS.text }}>
            {value}
          </h3>
          {change && (
            <span
              className="flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full"
              style={{
                backgroundColor:
                  changeType === "positive" ? "#ECFDF5" : "#FEF2F2",
                color: changeType === "positive" ? "#065F46" : "#991B1B",
              }}
            >
              {changeType === "positive" ? (
                <ArrowUp className="w-3 h-3" />
              ) : (
                <ArrowDown className="w-3 h-3" />
              )}
              {change}%
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs" style={{ color: COLORS.textLight }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, active = false, tooltip, onClick }) => (
  <button
    onClick={onClick}
    className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 group ${
      active ? "text-white shadow-lg" : "hover:bg-white/50"
    }`}
    style={{
      backgroundColor: active ? COLORS.primary : "transparent",
      color: active ? "white" : COLORS.text,
    }}
  >
    {icon}
    <div
      className="absolute left-full ml-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
      style={{ backgroundColor: COLORS.text, color: "white" }}
    >
      {tooltip}
      <div
        className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent"
        style={{ borderRightColor: COLORS.text }}
      ></div>
    </div>
  </button>
);

export default function AdminDashboard() {
  const dispatch = useAppDispatch();
  const { stats, recentProducts, recentUsers, isLoading, error } =
    useAppSelector((state) => state.admin);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [timeRange, setTimeRange] = useState("Last 30 days");

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(fetchDashboardStats());
  };

  const statsData = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: <Users className="w-6 h-6" />,
      change: "12.5",
      changeType: "positive",
      subtitle: "Since last month",
      color: "primary",
    },
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      icon: <ShoppingBag className="w-6 h-6" />,
      change: "8.2",
      changeType: "positive",
      subtitle: "24 new this week",
      color: "success",
    },
    {
      title: "Categories",
      value: stats?.totalCategories || 0,
      icon: <Tag className="w-6 h-6" />,
      change: "3.1",
      changeType: "positive",
      subtitle: "2 new categories",
      color: "warning",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: <Receipt className="w-6 h-6" />,
      change: "15.3",
      changeType: "positive",
      subtitle: "98% completion rate",
      color: "info",
    },
    {
      title: "Revenue",
      value: `$${stats?.totalRevenue || "0.00"}`,
      icon: <DollarSign className="w-6 h-6" />,
      change: "22.4",
      changeType: "positive",
      subtitle: "This month",
      color: "success",
    },
    {
      title: "Conversion Rate",
      value: "3.24%",
      icon: <TrendingUp className="w-6 h-6" />,
      change: "2.1",
      changeType: "positive",
      subtitle: "Overall performance",
      color: "error",
    },
  ];

  const sidebarItems = [
    { icon: <Home className="w-5 h-5" />, label: "Dashboard", id: "dashboard" },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      label: "Analytics",
      id: "analytics",
    },
    {
      icon: <ShoppingBag className="w-5 h-5" />,
      label: "Products",
      id: "products",
    },
    { icon: <Users className="w-5 h-5" />, label: "Users", id: "users" },
    { icon: <Receipt className="w-5 h-5" />, label: "Orders", id: "orders" },
    {
      icon: <CreditCard className="w-5 h-5" />,
      label: "Payments",
      id: "payments",
    },
    { icon: <Truck className="w-5 h-5" />, label: "Shipping", id: "shipping" },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
      id: "settings",
    },
  ];

  const timeRanges = ["Today", "Last 7 days", "Last 30 days", "Last 90 days"];

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: COLORS.lightBg }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: COLORS.primary }}
          ></div>
          <p style={{ color: COLORS.text }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: COLORS.lightBg }}
      >
        <div className="text-center max-w-md">
          <div
            className="border px-4 py-3 rounded-lg mb-4"
            style={{
              backgroundColor: "#FEF2F2",
              borderColor: COLORS.error,
              color: COLORS.error,
            }}
          >
            <strong>Error Loading Dashboard: </strong>
            <div className="mt-2 text-sm">{error}</div>
          </div>
          <div
            className="border px-4 py-3 rounded-lg mb-4"
            style={{
              backgroundColor: "#FFFBEB",
              borderColor: COLORS.warning,
              color: COLORS.text,
            }}
          >
            <p className="text-sm">
              <strong>Note:</strong> This might be because the Order table is
              not created yet.
            </p>
          </div>
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-6 py-3 rounded-lg hover:shadow-md transition-all mx-auto"
            style={{ backgroundColor: COLORS.primary, color: "white" }}
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: COLORS.lightBg }}
    >
      {/* Main Content */}
      <div className="flex-1">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1
                className="text-3xl lg:text-4xl font-bold mb-2"
                style={{ color: COLORS.text }}
              >
                Dashboard Overview
              </h1>
              <p style={{ color: COLORS.textLight }}>
                Welcome back! Here's what's happening with your store today.
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative hidden md:block">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                  style={{ color: COLORS.textLight }}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: COLORS.lightBg,
                    borderColor: COLORS.border,
                    color: COLORS.text,
                  }}
                />
              </div>

              {/* Notifications */}
              <button
                className="relative p-2 rounded-xl hover:shadow-sm transition-all"
                style={{ backgroundColor: COLORS.secondaryBg }}
              >
                <Bell className="w-5 h-5" style={{ color: COLORS.text }} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {/* Time Range Selector */}
              <div className="relative">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="appearance-none pl-4 pr-8 py-2 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: COLORS.lightBg,
                    borderColor: COLORS.border,
                    color: COLORS.text,
                  }}
                >
                  {timeRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4"
                  style={{ color: COLORS.textLight }}
                />
              </div>

              <button
                onClick={handleRetry}
                className="p-2 hover:shadow-sm rounded-xl transition-all"
                style={{
                  backgroundColor: COLORS.secondaryBg,
                  color: COLORS.text,
                }}
                title="Refresh Data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {statsData.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Charts and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Products */}
            <div
              className="rounded-2xl border-2 p-6 shadow-sm"
              style={{ backgroundColor: "white", borderColor: COLORS.border }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3
                  className="text-xl font-bold"
                  style={{ color: COLORS.text }}
                >
                  Recent Products
                </h3>
                <button
                  className="font-medium text-sm hover:underline transition-all"
                  style={{ color: COLORS.primary }}
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {(recentProducts || []).slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 p-3 rounded-xl hover:shadow-sm transition-all group"
                    style={{ backgroundColor: COLORS.secondaryBg }}
                  >
                    <img
                      src={
                        product.featuredImage ||
                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop"
                      }
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-xl shadow-sm group-hover:shadow-md transition-shadow"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-medium truncate"
                        style={{ color: COLORS.text }}
                      >
                        {product.name}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: COLORS.textLight }}
                      >
                        ${product.price}
                      </p>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 p-2 transition-all hover:bg-white/50 rounded-lg">
                      <Eye
                        className="w-4 h-4"
                        style={{ color: COLORS.primary }}
                      />
                    </button>
                  </div>
                ))}
                {(recentProducts || []).length === 0 && (
                  <p
                    className="text-center py-4"
                    style={{ color: COLORS.textLight }}
                  >
                    No products found
                  </p>
                )}
              </div>
            </div>

            {/* Recent Users */}
            <div
              className="rounded-2xl border-2 p-6 shadow-sm"
              style={{ backgroundColor: "white", borderColor: COLORS.border }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3
                  className="text-xl font-bold"
                  style={{ color: COLORS.text }}
                >
                  Recent Users
                </h3>
                <button
                  className="font-medium text-sm hover:underline transition-all"
                  style={{ color: COLORS.primary }}
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {(recentUsers || []).slice(0, 5).map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-4 p-3 rounded-xl hover:shadow-sm transition-all"
                    style={{ backgroundColor: COLORS.secondaryBg }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: COLORS.primary }}
                    >
                      <span className="font-medium text-white text-sm">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-medium truncate"
                        style={{ color: COLORS.text }}
                      >
                        {user.name}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: COLORS.textLight }}
                      >
                        {user.email}
                      </p>
                    </div>
                  </div>
                ))}
                {(recentUsers || []).length === 0 && (
                  <p
                    className="text-center py-4"
                    style={{ color: COLORS.textLight }}
                  >
                    No users found
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h3
              className="text-xl font-bold mb-6"
              style={{ color: COLORS.text }}
            >
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  icon: <UserPlus className="w-6 h-6" />,
                  label: "Add User",
                  color: COLORS.success,
                },
                {
                  icon: <Package className="w-6 h-6" />,
                  label: "Add Product",
                  color: COLORS.primary,
                },
                {
                  icon: <ShoppingCart className="w-6 h-6" />,
                  label: "New Order",
                  color: COLORS.warning,
                },
                {
                  icon: <BarChart3 className="w-6 h-6" />,
                  label: "View Reports",
                  color: COLORS.info,
                },
              ].map((action, index) => (
                <button
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-xl border-2 hover:shadow-md transition-all"
                  style={{
                    backgroundColor: COLORS.secondaryBg,
                    borderColor: COLORS.border,
                  }}
                >
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: action.color }}
                  >
                    {React.cloneElement(action.icon, {
                      className: "w-5 h-5 text-white",
                    })}
                  </div>
                  <span style={{ color: COLORS.text }}>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
