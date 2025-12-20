
// "use client";
// import React, { useState } from "react";
// import {
//   User,
//   ShoppingBag,
//   History,
//   Settings,
//   Heart,
//   MapPin,
//   Shield,
//   CreditCard,
//   Bell,
//   LogOut,
//   Edit3,
//   Camera,
//   Award,
//   Star,
//   Package,
//   Truck,
//   CheckCircle,
// } from "lucide-react";
// import ProtectedRoute from "../../components/auth/ProtectedRoute";
// import ProfileForm from "../../components/forms/ProfileForm";
// import { useAppSelector } from "../../store/hooks";
// import { getInitials } from "../../lib/utils";

// const Profile = () => {
//   const { user } = useAppSelector((state) => state.auth);
//   const [activeTab, setActiveTab] = useState("profile");

//   // Mock data for demonstration
//   const userStats = {
//     orders: 12,
//     reviews: 8,
//     wishlist: 23,
//     joined: "2023",
//   };

//   const recentActivities = [
//     {
//       id: 1,
//       type: "order",
//       message: "Order #1234 delivered",
//       time: "2 hours ago",
//       status: "delivered",
//     },
//     {
//       id: 2,
//       type: "review",
//       message: 'You reviewed "Wireless Headphones"',
//       time: "1 day ago",
//       status: "completed",
//     },
//     {
//       id: 3,
//       type: "wishlist",
//       message: 'Added "Smart Watch" to wishlist',
//       time: "2 days ago",
//       status: "added",
//     },
//   ];

//   const menuItems = [
//     { id: "profile", icon: User, label: "Profile Information", active: true },
//     {
//       id: "orders",
//       icon: ShoppingBag,
//       label: "My Orders",
//       badge: userStats.orders,
//     },
//     {
//       id: "wishlist",
//       icon: Heart,
//       label: "Wishlist",
//       badge: userStats.wishlist,
//     },
//     { id: "addresses", icon: MapPin, label: "Saved Addresses" },
//     { id: "payment", icon: CreditCard, label: "Payment Methods" },
//     {
//       id: "reviews",
//       icon: Star,
//       label: "My Reviews",
//       badge: userStats.reviews,
//     },
//     { id: "notifications", icon: Bell, label: "Notifications" },
//     { id: "security", icon: Shield, label: "Security" },
//     { id: "settings", icon: Settings, label: "Settings" },
//   ];

//   return (
//     <ProtectedRoute>
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
//         {/* Navigation */}
//         <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/60">
//           <div className="w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="flex justify-between items-center py-4">
//               <nav className="flex items-center gap-2 text-sm">
//                 <span className="text-gray-600">Account</span>
//                 <span className="text-gray-400">›</span>
//                 <span className="text-blue-600 font-semibold">My Profile</span>
//               </nav>
//             </div>
//           </div>
//         </div>

//         <div className="w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           {/* Header */}
//           <div className="text-center mb-12">
//             <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl mb-6">
//               <User className="w-10 h-10 text-white" />
//             </div>
//             <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
//               My Account
//             </h1>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               Manage your profile, orders, and preferences
//             </p>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//             {/* Sidebar */}
//             <div className="lg:col-span-1">
//               <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-8">
//                 {/* User Profile Card */}
//                 <div className="text-center mb-6">
//                   <div className="relative inline-block mb-4">
//                     <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
//                       {getInitials(user?.name || "User")}
//                     </div>
//                     <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
//                       <Camera className="w-4 h-4 text-gray-600" />
//                     </button>
//                   </div>

//                   <h3 className="text-lg font-bold text-gray-900 mb-1">
//                     {user?.name || "User Name"}
//                   </h3>

//                   <p className="text-sm text-gray-600 mb-3">
//                     {user?.email || "user@example.com"}
//                   </p>

//                   {/* Member Since Badge */}
//                   <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
//                     <Award className="w-3 h-3" />
//                     Member since {userStats.joined}
//                   </div>
//                 </div>

//                 <div className="border-t border-gray-200 pt-6">
//                   {/* Navigation Menu */}
//                   <nav className="space-y-2">
//                     {menuItems.map((item) => (
//                       <button
//                         key={item.id}
//                         onClick={() => setActiveTab(item.id)}
//                         className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
//                           activeTab === item.id
//                             ? "bg-blue-50 text-blue-700 border border-blue-200"
//                             : "text-gray-700 hover:bg-gray-50"
//                         }`}
//                       >
//                         <item.icon
//                           className={`w-5 h-5 ${
//                             activeTab === item.id
//                               ? "text-blue-600"
//                               : "text-gray-400"
//                           }`}
//                         />
//                         <span className="flex-1 font-medium">{item.label}</span>
//                         {item.badge && (
//                           <span
//                             className={`px-2 py-1 text-xs rounded-full ${
//                               activeTab === item.id
//                                 ? "bg-blue-600 text-white"
//                                 : "bg-gray-200 text-gray-700"
//                             }`}
//                           >
//                             {item.badge}
//                           </span>
//                         )}
//                       </button>
//                     ))}
//                   </nav>

//                   {/* Logout Button */}
//                   <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left text-red-600 hover:bg-red-50 mt-6 border-t border-gray-200 pt-6 transition-colors">
//                     <LogOut className="w-5 h-5" />
//                     <span className="font-medium">Logout</span>
//                   </button>
//                 </div>
//               </div>

//               {/* Quick Stats */}
//               {/* <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white mt-6">
//                 <h4 className="font-semibold mb-4">Your Activity</h4>
//                 <div className="space-y-3">
//                   <div className="flex items-center justify-between">
//                     <span className="text-blue-100">Orders</span>
//                     <span className="font-semibold">{userStats.orders}</span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-blue-100">Reviews</span>
//                     <span className="font-semibold">{userStats.reviews}</span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-blue-100">Wishlist</span>
//                     <span className="font-semibold">{userStats.wishlist}</span>
//                   </div>
//                 </div>
//               </div> */}
//             </div>

//             {/* Main Content */}
//             <div className="lg:col-span-3">
//               {/* Profile Header */}
//               <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <div>
//                     <h2 className="text-2xl font-bold text-gray-900">
//                       Profile Information
//                     </h2>
//                     <p className="text-gray-600 mt-1">
//                       Update your personal details and preferences
//                     </p>
//                   </div>
//                   <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl font-medium transition-colors">
//                     <Edit3 className="w-4 h-4" />
//                     Edit Profile
//                   </button>
//                 </div>

//                 {/* Status Indicators */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//                   <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
//                     <CheckCircle className="w-5 h-5 text-green-600" />
//                     <div>
//                       <p className="text-sm font-medium text-green-900">
//                         Email Verified
//                       </p>
//                       <p className="text-xs text-green-700">
//                         Your email is confirmed
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
//                     <Shield className="w-5 h-5 text-blue-600" />
//                     <div>
//                       <p className="text-sm font-medium text-blue-900">
//                         Account Secure
//                       </p>
//                       <p className="text-xs text-blue-700">2FA not enabled</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
//                     <Star className="w-5 h-5 text-amber-600" />
//                     <div>
//                       <p className="text-sm font-medium text-amber-900">
//                         Loyal Customer
//                       </p>
//                       <p className="text-xs text-amber-700">
//                         12 successful orders
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Profile Form */}
//               <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
//                 <ProfileForm />
//               </div>

//               {/* Recent Activity */}
//               <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-xl font-bold text-gray-900">
//                     Recent Activity
//                   </h3>
//                   <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
//                     View All
//                   </button>
//                 </div>

//                 <div className="space-y-4">
//                   {recentActivities.map((activity) => (
//                     <div
//                       key={activity.id}
//                       className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
//                     >
//                       <div
//                         className={`w-10 h-10 rounded-full flex items-center justify-center ${
//                           activity.type === "order"
//                             ? "bg-blue-100 text-blue-600"
//                             : activity.type === "review"
//                             ? "bg-green-100 text-green-600"
//                             : "bg-purple-100 text-purple-600"
//                         }`}
//                       >
//                         {activity.type === "order" && (
//                           <Package className="w-5 h-5" />
//                         )}
//                         {activity.type === "review" && (
//                           <Star className="w-5 h-5" />
//                         )}
//                         {activity.type === "wishlist" && (
//                           <Heart className="w-5 h-5" />
//                         )}
//                       </div>
//                       <div className="flex-1">
//                         <p className="font-medium text-gray-900">
//                           {activity.message}
//                         </p>
//                         <p className="text-sm text-gray-600">{activity.time}</p>
//                       </div>
//                       <div
//                         className={`px-3 py-1 rounded-full text-xs font-medium ${
//                           activity.status === "delivered"
//                             ? "bg-green-100 text-green-700"
//                             : activity.status === "completed"
//                             ? "bg-blue-100 text-blue-700"
//                             : "bg-purple-100 text-purple-700"
//                         }`}
//                       >
//                         {activity.status}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Security Tips */}
//               <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 mt-6">
//                 <div className="flex items-start gap-4">
//                   <Shield className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
//                   <div>
//                     <h4 className="font-semibold text-gray-900 mb-2">
//                       Keep Your Account Secure
//                     </h4>
//                     <ul className="text-sm text-gray-700 space-y-1">
//                       <li>• Use a strong, unique password</li>
//                       <li>• Enable two-factor authentication</li>
//                       <li>• Review your login activity regularly</li>
//                       <li>• Keep your contact information updated</li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// };

// export default Profile;



"use client";
import React, { useState } from "react";
import {
  User,
  ShoppingBag,
  History,
  Settings,
  Heart,
  MapPin,
  Shield,
  CreditCard,
  Bell,
  LogOut,
  Edit3,
  Camera,
  Award,
  Star,
  Package,
  Truck,
  CheckCircle,
  Home,
  ChevronRight,
} from "lucide-react";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import ProfileForm from "../../components/forms/ProfileForm";
import { useAppSelector } from "../../store/hooks";
import { getInitials } from "../../lib/utils";
import Link from "next/link";


const COLORS = {
  primary: '#C9B59C',
  lightBg: '#F9F8F6',
  secondaryBg: '#EFE9E3',
  border: '#D9CFC7',
  text: '#5D4037',
  textLight: '#8D6E63',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

const Profile = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("profile");

  const userStats = {
    orders: 12,
    reviews: 8,
    wishlist: 23,
    joined: "2023",
  };

  const recentActivities = [
    {
      id: 1,
      type: "order",
      message: "Order #1234 delivered",
      time: "2 hours ago",
      status: "delivered",
    },
    {
      id: 2,
      type: "review",
      message: 'You reviewed "Wireless Headphones"',
      time: "1 day ago",
      status: "completed",
    },
    {
      id: 3,
      type: "wishlist",
      message: 'Added "Smart Watch" to wishlist',
      time: "2 days ago",
      status: "added",
    },
  ];

  const menuItems = [
    { id: "profile", icon: User, label: "Profile Information", active: true },
    {
      id: "orders",
      icon: ShoppingBag,
      label: "My Orders",
      badge: userStats.orders,
    },
    {
      id: "wishlist",
      icon: Heart,
      label: "Wishlist",
      badge: userStats.wishlist,
    },
    { id: "addresses", icon: MapPin, label: "Saved Addresses" },
    { id: "payment", icon: CreditCard, label: "Payment Methods" },
    {
      id: "reviews",
      icon: Star,
      label: "My Reviews",
      badge: userStats.reviews,
    },
    { id: "notifications", icon: Bell, label: "Notifications" },
    { id: "security", icon: Shield, label: "Security" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <ProtectedRoute>
      <div 
        className="min-h-screen"
        style={{ backgroundColor: COLORS.lightBg }}
      >
        {/* Navigation */}
        <div 
          className="border-b backdrop-blur-md"
          style={{ 
            backgroundColor: 'rgba(249, 248, 246, 0.8)',
            borderColor: COLORS.border
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
                <span 
                  className="font-semibold"
                  style={{ color: COLORS.primary }}
                >
                  My Profile
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
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: COLORS.text }}
            >
              My Account
            </h1>
            <p 
              className="text-lg max-w-2xl mx-auto"
              style={{ color: COLORS.textLight }}
            >
              Manage your profile, orders, and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div 
                className="rounded-2xl shadow-lg border p-6 sticky top-8"
                style={{ 
                  backgroundColor: 'white',
                  borderColor: COLORS.border
                }}
              >
                {/* User Profile Card */}
                <div className="text-center mb-6">
                  <div className="relative inline-block mb-4">
                    <div 
                      className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                      style={{ 
                        background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.text})`
                      }}
                    >
                      {getInitials(user?.name || "User")}
                    </div>
                    <button 
                      className="absolute -bottom-2 -right-2 w-8 h-8 bg-white border rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
                      style={{ borderColor: COLORS.border }}
                    >
                      <Camera className="w-4 h-4" style={{ color: COLORS.text }} />
                    </button>
                  </div>

                  <h3 
                    className="text-lg font-bold mb-1"
                    style={{ color: COLORS.text }}
                  >
                    {user?.name || "User Name"}
                  </h3>

                  <p 
                    className="text-sm mb-3"
                    style={{ color: COLORS.textLight }}
                  >
                    {user?.email || "user@example.com"}
                  </p>

                  {/* Member Since Badge */}
                  <div 
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: COLORS.secondaryBg,
                      color: COLORS.text
                    }}
                  >
                    <Award className="w-3 h-3" />
                    Member since {userStats.joined}
                  </div>
                </div>

                <div className="border-t pt-6" style={{ borderColor: COLORS.border }}>
                  {/* Navigation Menu */}
                  <nav className="space-y-2">
                    {menuItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
                          activeTab === item.id
                            ? "text-white border"
                            : "hover:bg-gray-50"
                        }`}
                        style={{
                          backgroundColor: activeTab === item.id ? COLORS.primary : 'transparent',
                          borderColor: activeTab === item.id ? COLORS.primary : 'transparent',
                          color: activeTab === item.id ? 'white' : COLORS.text,
                        }}
                      >
                        <item.icon
                          className="w-5 h-5"
                          style={{ 
                            color: activeTab === item.id ? 'white' : COLORS.textLight
                          }}
                        />
                        <span className="flex-1 font-medium">{item.label}</span>
                        {item.badge && (
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              activeTab === item.id
                                ? "bg-white text-gray-700"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </nav>

                  {/* Logout Button */}
                  <button 
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left mt-6 border-t pt-6 transition-colors"
                    style={{ 
                      color: COLORS.error,
                      borderColor: COLORS.border
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FEF2F2';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Profile Header */}
              <div 
                className="rounded-2xl shadow-lg border p-6 mb-6"
                style={{ 
                  backgroundColor: 'white',
                  borderColor: COLORS.border
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 
                      className="text-2xl font-bold"
                      style={{ color: COLORS.text }}
                    >
                      Profile Information
                    </h2>
                    <p 
                      className="mt-1"
                      style={{ color: COLORS.textLight }}
                    >
                      Update your personal details and preferences
                    </p>
                  </div>
                  <button 
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors"
                    style={{ 
                      color: COLORS.primary,
                      backgroundColor: COLORS.secondaryBg
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = COLORS.border;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = COLORS.secondaryBg;
                    }}
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>

                {/* Status Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div 
                    className="flex items-center gap-3 p-4 border rounded-xl"
                    style={{ 
                      backgroundColor: '#ECFDF5',
                      borderColor: COLORS.success
                    }}
                  >
                    <CheckCircle className="w-5 h-5" style={{ color: COLORS.success }} />
                    <div>
                      <p 
                        className="text-sm font-medium"
                        style={{ color: COLORS.success }}
                      >
                        Email Verified
                      </p>
                      <p 
                        className="text-xs"
                        style={{ color: COLORS.success }}
                      >
                        Your email is confirmed
                      </p>
                    </div>
                  </div>
                  <div 
                    className="flex items-center gap-3 p-4 border rounded-xl"
                    style={{ 
                      backgroundColor: COLORS.secondaryBg,
                      borderColor: COLORS.primary
                    }}
                  >
                    <Shield className="w-5 h-5" style={{ color: COLORS.primary }} />
                    <div>
                      <p 
                        className="text-sm font-medium"
                        style={{ color: COLORS.text }}
                      >
                        Account Secure
                      </p>
                      <p 
                        className="text-xs"
                        style={{ color: COLORS.textLight }}
                      >
                        2FA not enabled
                      </p>
                    </div>
                  </div>
                  <div 
                    className="flex items-center gap-3 p-4 border rounded-xl"
                    style={{ 
                      backgroundColor: '#FFFBEB',
                      borderColor: COLORS.warning
                    }}
                  >
                    <Star className="w-5 h-5" style={{ color: COLORS.warning }} />
                    <div>
                      <p 
                        className="text-sm font-medium"
                        style={{ color: COLORS.warning }}
                      >
                        Loyal Customer
                      </p>
                      <p 
                        className="text-xs"
                        style={{ color: COLORS.warning }}
                      >
                        12 successful orders
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <div 
                className="rounded-2xl shadow-lg border p-6 mb-6"
                style={{ 
                  backgroundColor: 'white',
                  borderColor: COLORS.border
                }}
              >
                <ProfileForm />
              </div>

              {/* Recent Activity */}
              <div 
                className="rounded-2xl shadow-lg border p-6"
                style={{ 
                  backgroundColor: 'white',
                  borderColor: COLORS.border
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 
                    className="text-xl font-bold"
                    style={{ color: COLORS.text }}
                  >
                    Recent Activity
                  </h3>
                  <button 
                    className="font-medium text-sm transition-colors"
                    style={{ color: COLORS.primary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = COLORS.text;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = COLORS.primary;
                    }}
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-4 p-4 rounded-xl transition-colors"
                      style={{ backgroundColor: COLORS.secondaryBg }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = COLORS.lightBg;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = COLORS.secondaryBg;
                      }}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.type === "order"
                            ? "bg-blue-100 text-blue-600"
                            : activity.type === "review"
                            ? "bg-green-100 text-green-600"
                            : "bg-purple-100 text-purple-600"
                        }`}
                      >
                        {activity.type === "order" && (
                          <Package className="w-5 h-5" />
                        )}
                        {activity.type === "review" && (
                          <Star className="w-5 h-5" />
                        )}
                        {activity.type === "wishlist" && (
                          <Heart className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p 
                          className="font-medium"
                          style={{ color: COLORS.text }}
                        >
                          {activity.message}
                        </p>
                        <p 
                          className="text-sm"
                          style={{ color: COLORS.textLight }}
                        >
                          {activity.time}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          activity.status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : activity.status === "completed"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {activity.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Tips */}
              <div 
                className="rounded-2xl p-6 border mt-6"
                style={{ 
                  backgroundColor: COLORS.secondaryBg,
                  borderColor: COLORS.primary
                }}
              >
                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: COLORS.primary }} />
                  <div>
                    <h4 
                      className="font-semibold mb-2"
                      style={{ color: COLORS.text }}
                    >
                      Keep Your Account Secure
                    </h4>
                    <ul 
                      className="text-sm space-y-1"
                      style={{ color: COLORS.text }}
                    >
                      <li>• Use a strong, unique password</li>
                      <li>• Enable two-factor authentication</li>
                      <li>• Review your login activity regularly</li>
                      <li>• Keep your contact information updated</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;