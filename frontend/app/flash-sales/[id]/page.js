"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Home,
  ChevronRight,
  Timer,
  ShoppingCart,
  ArrowLeft,
  Check,
  Share2,
  Star,
  Minus,
  Plus,
  Heart,
} from "lucide-react";
import axios from "../../../lib/axios";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { addToCart } from "../../../store/slices/cartSlice";
import { Whatshot } from "@mui/icons-material";



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
              className="mb-6 rounded-2xl overflow-hidden aspect-video animate-pulse"
              style={{ backgroundColor: COLORS.secondaryBg }}
            ></div>
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
          </div>
        </div>
      </div>
    </div>
  </div>
);


const CountdownTimer = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate) - new Date();
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  const TimeBox = ({ value, label }) => (
    <div className="text-center">
      <div
        className="px-4 py-3 rounded-xl font-bold text-2xl min-w-[70px] shadow-lg"
        style={{
          backgroundColor: COLORS.primary,
          color: "white",
        }}
      >
        {value.toString().padStart(2, "0")}
      </div>
      <span
        className="text-xs font-semibold uppercase mt-2 block"
        style={{ color: COLORS.text }}
      >
        {label}
      </span>
    </div>
  );

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.text }}>
        Sale Ends In:
      </h3>
      <div className="flex gap-3 justify-center flex-wrap">
        <TimeBox value={timeLeft.days} label="Days" />
        <TimeBox value={timeLeft.hours} label="Hours" />
        <TimeBox value={timeLeft.minutes} label="Minutes" />
        <TimeBox value={timeLeft.seconds} label="Seconds" />
      </div>
    </div>
  );
};

export default function FlashSaleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [flashSale, setFlashSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
    const { isAuthenticated } = useAppSelector((state) => state.auth);
      const dispatch = useAppDispatch();
  useEffect(() => {
    if (params.id) {
      fetchFlashSale();
    }
  }, [params.id]);


const handleAddToCart = () => {
  if (!isAuthenticated) {
    router.push("/login");
    return;
  }
  
 dispatch(addToCart({
      flashSaleId: flashSale.id, 
      quantity: 1
    }));
};
  const fetchFlashSale = async () => {
    try {
      setLoading(true);
      console.log("Fetching flash sale with ID:", params.id);

      try {
        const response = await axios.get(`/flash-sales/${params.id}`);
        console.log("API Response:", response.data);
        setFlashSale(response.data);
      } catch (apiError) {
        console.error("API Error:", apiError);
     
        setFlashSale({
          id: params.id,
          title: "Tomatoes Flash Sale",
          description:
            "Fresh tomatoes at amazing discounts! Limited time offer on premium quality tomatoes. Perfect for your kitchen needs.",
          discountPercentage: 90,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          image:
            "https://res.cloudinary.com/dxcwm1ulg/image/upload/v1763889106/ecommerce/emmazuixwoh5ng7y2vax.png",
          buttonText: "Shop Now",
          buttonLink: "/products",
          targetUrl: "/products",
          isActive: true,
          saleCode: "FLASH3GRYU",
          backgroundColor: "#C9B59C",
          textColor: "#FFFFFF",
        });
      }
    } catch (error) {
      console.error("General Error:", error);
      setError("Failed to load flash sale details");
    } finally {
      setLoading(false);
    }
  };

  const isSaleActive = () => {
    if (!flashSale) return false;
    const now = new Date();
    return (
      flashSale.isActive &&
      new Date(flashSale.startDate) <= now &&
      new Date(flashSale.endDate) >= now
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) return <LoadingSkeleton />;

  if (error || !flashSale) {
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
            <p className="font-semibold">{error || "Flash sale not found"}</p>
          </div>
          <div className="mb-3">
            <p className="text-sm" style={{ color: COLORS.textLight }}>
              Debug Info: ID = {params.id}
            </p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl shadow-lg transition-all duration-300"
            style={{ backgroundColor: COLORS.primary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.text;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.primary;
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: COLORS.lightBg }} className="min-h-screen">
      <div className="w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm mb-8">
          <a
            href="/"
            className="flex items-center gap-1 hover:underline transition-colors"
            style={{ color: COLORS.textLight }}
          >
            <Home className="w-4 h-4" />
            Home
          </a>
          <ChevronRight
            className="w-4 h-4"
            style={{ color: COLORS.textLight }}
          />
          <a
            href="/#flash-deals"
            className="hover:underline transition-colors"
            style={{ color: COLORS.textLight }}
          >
            Flash Deals
          </a>
          <ChevronRight
            className="w-4 h-4"
            style={{ color: COLORS.textLight }}
          />
          <span style={{ color: COLORS.text }} className="font-semibold">
            {flashSale.title}
          </span>
        </div>

        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 mb-6 text-sm font-semibold transition-colors hover:underline"
          style={{ color: COLORS.primary }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        {/* Flash Sale Content */}
        <div
          className="rounded-2xl shadow-lg border p-8 mb-8"
          style={{
            backgroundColor: "white",
            borderColor: COLORS.border,
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Section */}
            <div className="flex flex-col">
              <div
                className="rounded-2xl overflow-hidden shadow-lg"
                style={{ backgroundColor: COLORS.secondaryBg }}
              >
                <img
                  src={flashSale.image}
                  alt={flashSale.title}
                  className="w-full aspect-square object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=800&h=400&fit=crop";
                  }}
                />
              </div>
            </div>

            {/* Flash Sale Info */}
            <div className="flex flex-col">
              {/* Status Badges */}
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <span
                  className="inline-flex items-center gap-1 px-3 py-1 text-sm font-bold text-white rounded-lg"
                  style={{ backgroundColor: COLORS.error }}
                >
                  <Whatshot className="w-4 h-4" />
                  {flashSale.discountPercentage}% OFF
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-semibold rounded-lg ${
                    isSaleActive()
                      ? "text-emerald-700 bg-emerald-50"
                      : "text-gray-700 bg-gray-100"
                  }`}
                >
                  <Timer className="w-4 h-4" />
                  {isSaleActive() ? "Active Now" : "Expired"}
                </span>
                {flashSale.saleCode && (
                  <span
                    className="px-3 py-1 text-sm font-semibold border rounded-lg font-mono"
                    style={{
                      borderColor: COLORS.border,
                      color: COLORS.text,
                    }}
                  >
                    Code: {flashSale.saleCode}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1
                className="text-4xl font-bold mb-4 leading-tight"
                style={{ color: COLORS.text }}
              >
                {flashSale.title}
              </h1>

              {/* Description */}
              {flashSale.description && (
                <p
                  className="text-lg leading-relaxed mb-6"
                  style={{ color: COLORS.textLight }}
                >
                  {flashSale.description}
                </p>
              )}

              {/* Sale Period */}
              <div
                className="p-4 rounded-xl mb-6"
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  border: `1px solid ${COLORS.border}`,
                }}
              >
                <p
                  className="text-sm font-semibold mb-1"
                  style={{ color: COLORS.text }}
                >
                  🗓️ Sale Period:
                </p>
                <p className="text-sm" style={{ color: COLORS.textLight }}>
                  {formatDate(flashSale.startDate)} -{" "}
                  {formatDate(flashSale.endDate)}
                </p>
              </div>
              {/* Price Section */}

              {/* Price Section */}
              {(flashSale.oldPrice || flashSale.currentPrice) && (
                <div
                  className="rounded-2xl p-6 mb-6"
                  style={{ backgroundColor: COLORS.secondaryBg }}
                >
                  <div className="flex items-baseline gap-4 mb-2">
                    {flashSale.currentPrice && (
                      <span
                        className="text-5xl font-bold"
                        style={{ color: COLORS.primary }}
                      >
                        ${parseFloat(flashSale.currentPrice).toFixed(2)}
                      </span>
                    )}
                    {flashSale.oldPrice && (
                      <>
                        <span
                          className="text-2xl line-through"
                          style={{ color: COLORS.textLight }}
                        >
                          ${parseFloat(flashSale.oldPrice).toFixed(2)}
                        </span>
                        {flashSale.currentPrice && (
                          <span
                            className="inline-block px-3 py-1 text-sm font-bold text-white rounded-lg"
                            style={{ backgroundColor: COLORS.error }}
                          >
                            Save $
                            {(
                              parseFloat(flashSale.oldPrice) -
                              parseFloat(flashSale.currentPrice)
                            ).toFixed(2)}
                          </span>
                        )}
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
              )}

              {/* Countdown Timer */}
              {isSaleActive() && <CountdownTimer endDate={flashSale.endDate} />}

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
                  className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white rounded-xl shadow-lg hover:-translate-y-0.5 disabled:cursor-not-allowed transition-all duration-300"
                  style={{
                    backgroundColor: COLORS.primary,
                    transition: "0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.text;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.primary;
                  }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
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
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div
          className="rounded-2xl shadow-lg border p-8"
          style={{
            backgroundColor: "white",
            borderColor: COLORS.border,
          }}
        >
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: COLORS.text }}
          >
            About This Flash Sale
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: COLORS.text }}
              >
                🎯 What's Included
              </h3>
              <p
                style={{ color: COLORS.textLight }}
                className="leading-relaxed"
              >
                This flash sale offers amazing discounts on{" "}
                {flashSale.title.toLowerCase()}. Don't miss this limited time
                opportunity to grab your favorite items at unbeatable prices
                with up to {flashSale.discountPercentage}% off.
              </p>
            </div>
            <div>
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: COLORS.text }}
              >
                ⚡ Quick Actions
              </h3>
              <div className="space-y-2">
                <a
                  href="/products?category=trending"
                  className="block w-full text-left px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                  style={{
                    borderColor: COLORS.border,
                    color: COLORS.text,
                  }}
                >
                  View Trending Products
                </a>
                <a
                  href="/products?category=featured"
                  className="block w-full text-left px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                  style={{
                    borderColor: COLORS.border,
                    color: COLORS.text,
                  }}
                >
                  View Featured Items
                </a>
                <a
                  href="/categories"
                  className="block w-full text-left px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                  style={{
                    borderColor: COLORS.border,
                    color: COLORS.text,
                  }}
                >
                  Browse All Categories
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
