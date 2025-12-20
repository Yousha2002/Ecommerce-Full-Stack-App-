"use client";
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  Card,
  IconButton,
  Chip,
  Skeleton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ArrowForward,
  Timer,
  LocalFireDepartment,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  NotificationsActive,
  CalendarToday,
} from "@mui/icons-material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductCard from "../components/ui/ProductCard";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { addToCart } from "../store/slices/cartSlice";
import Link from "next/link";
import axios from "../lib/axios";
import HeroBannerSlider from "@/components/ui/HeroBannerSlider";
import Star from "@mui/icons-material/Star";

const COLORS = {
  primary: "#C9B59C",
  primaryLight: "#D9CFC7",
  primaryDark: "#B8A289",
  lightBg: "#F9F8F6",
  secondaryBg: "#EFE9E3",
  border: "#D9CFC7",
  text: "#5D4037",
  textLight: "#8D6E63",
  white: "#FFFFFF",
  error: "#DC2626",
  success: "#059669",
};


const NextArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      right: { xs: -10, md: -20 },
      top: "50%",
      transform: "translateY(-50%)",
      bgcolor: COLORS.white,
      color: COLORS.primary,
      border: `2px solid ${COLORS.primaryLight}`,
      width: 40,
      height: 40,
      zIndex: 2,
      "&:hover": {
        bgcolor: COLORS.primary,
        color: COLORS.white,
      },
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    }}
  >
    <ChevronRight />
  </IconButton>
);

const PrevArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      left: { xs: -10, md: -20 },
      top: "50%",
      transform: "translateY(-50%)",
      bgcolor: COLORS.white,
      color: COLORS.primary,
      border: `2px solid ${COLORS.primaryLight}`,
      width: 40,
      height: 40,
      zIndex: 2,
      "&:hover": {
        bgcolor: COLORS.primary,
        color: COLORS.white,
      },
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    }}
  >
    <ChevronLeft />
  </IconButton>
);

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [sections, setSections] = useState({
    heroBanners: [],
    flashDeals: [],
    // featuredCollections: [],
    testimonials: [],
    newArrivals: [],
    trending: [],
    bestSelling: [],
    mostPopular: [],
    comingSoon: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllSections();
  }, []);

  const fetchAllSections = async () => {
    try {
      setLoading(true);
      const [
        heroBannersRes,
        flashDealsRes,
        // featuredCollectionsRes,
        testimonialsRes,
        newArrivalsRes,
        trendingRes,
        bestSellingRes,
        mostPopularRes,
        comingSoonRes,
      ] = await Promise.all([
        axios.get("/hero-banners/active"),
        axios.get("/flash-sales/active"),
        // axios.get("/featured-collections/active"),
        axios.get("/reviews/testimonials?limit=6"),
        axios.get("/products/section/new-arrivals"),
        axios.get("/products/section/trending"),
        axios.get("/products/section/best-selling"),
        axios.get("/products/section/most-popular"),
        axios.get("/coming-soon/active"),
      ]);

      setSections({
        heroBanners: heroBannersRes.data ?? [],
        flashDeals: flashDealsRes.data ?? [],
        // featuredCollections: featuredCollectionsRes.data ?? [],
        testimonials: testimonialsRes.data ?? [],
        newArrivals: newArrivalsRes.data ?? [],
        trending: trendingRes.data ?? [],
        bestSelling: bestSellingRes.data ?? [],
        mostPopular: mostPopularRes.data ?? [],
        comingSoon: comingSoonRes.data ?? [],
      });
    } catch (error) {
      console.error("Error fetching sections:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    dispatch(addToCart({ productId: product.id, quantity: 1 }));
  };

  // Slider settings for different screen sizes
  const getSliderSettings = (itemsCount, itemsToShow = null) => {
    const baseSettings = {
      dots: false,
      infinite: itemsCount > (itemsToShow || 5),
      speed: 500,
      slidesToShow: itemsToShow || Math.min(5, itemsCount),
      slidesToScroll: Math.min(2, itemsCount),
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
      appendDots: (dots) => (
        <Box sx={{ position: "relative", bottom: -20 }}>
          <ul style={{ margin: 0, padding: 0 }}>{dots}</ul>
        </Box>
      ),
      dotsClass: "slick-dots custom-dots",
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: Math.min(itemsToShow || 4, itemsCount),
            slidesToScroll: Math.min(2, itemsCount),
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: Math.min(itemsToShow || 3, itemsCount),
            slidesToScroll: Math.min(2, itemsCount),
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: Math.min(itemsToShow || 2, itemsCount),
            slidesToScroll: Math.min(1, itemsCount),
            arrows: false,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
          },
        },
      ],
    };
    return baseSettings;
  };

const ComingSoonSection = () => {
  if (sections.comingSoon.length === 0) return null;

  const comingSoonSettings = {
    dots: false,
    infinite: sections.comingSoon.length > 1,
    speed: 500,
    slidesToShow: Math.min(1, sections.comingSoon.length), 
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: (dots) => (
      <Box sx={{ position: "relative", bottom: -20 }}>
        <ul style={{ margin: 0, padding: 0 }}>{dots}</ul>
      </Box>
    ),
    dotsClass: "slick-dots custom-dots",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

  return (
    <Box >
      <Box sx={{ textAlign: "center", mb: 8 }}>
        <Chip
          label="Coming Soon"
          icon={<NotificationsActive />}
          sx={{
            bgcolor: "#C9B59C",
            color: "#F9F8F6",
            fontWeight: 700,
            fontSize: "0.9rem",
            px: 3,
            py: 1,
          
            height: 36,
          }}
        />

        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            mb: 2,
            fontSize: { xs: "2rem", md: "2.5rem" },
            background: `linear-gradient(135deg, #5a4c3e 0%, #C9B59C 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Exciting Things Ahead
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: "#8a7a6a",
            fontWeight: 400,
            maxWidth: 600,
            mx: "auto",
            lineHeight: 1.6,
            fontSize: { xs: "1rem", md: "1.1rem" },
          }}
        >
          Get ready for our upcoming launches and exclusive offers
        </Typography>
      </Box>

      {/* Slider Container with proper styling */}
      <Box sx={{ 
        position: "relative",
        px: { xs: 0, md: 2 },
        '& .slick-slide': {
          padding: '0 8px'
        },
        '& .slick-list': {
          margin: '0 -8px'
        }
      }}>
        <Slider {...comingSoonSettings}>
          {sections.comingSoon.map((section, index) => (
            <Box key={index}>
              <Box
                sx={{
              
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                  backgroundColor: "#F9F8F6",
                  border: "1px solid #EFE9E3",
                  mx: 1, // Add horizontal margin
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", lg: "row" },
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: { xs: 4, md: 6 },
                  }}
                >
                  {/* TEXT CONTENT */}
                  <Box sx={{ 
                    flex: 1, 
                    mb: { xs: 6, lg: 0 },
                    pr: { lg: 4 }
                  }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        mb: 3,
                        fontSize: { xs: "1.8rem", md: "2.25rem", lg: "2.5rem" },
                        color: "#5a4c3e",
                        lineHeight: 1.2,
                      }}
                    >
                      {section.title}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        color: "#8a7a6a",
                        mb: 4,
                        fontSize: { xs: "1rem", md: "1.1rem" },
                        lineHeight: 1.6,
                        maxWidth: "100%",
                      }}
                    >
                      {section.description}
                    </Typography>

                    {/* Dates */}
                    {(section.startDate || section.endDate) && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 4,
                          p: 3,
                          borderRadius: 3,
                          bgcolor: "#EFE9E3",
                          border: `1px solid #D9CFC7`,
                          maxWidth: "fit-content",
                        }}
                      >
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: "#C9B59C",
                            color: "#F9F8F6",
                          }}
                        >
                          <CalendarToday sx={{ fontSize: 24 }} />
                        </Box>

                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: "#5a4c3e",
                              mb: 0.5,
                            }}
                          >
                            Launch Timeline
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{ color: "#8a7a6a", fontSize: "0.9rem" }}
                          >
                            {section.startDate && section.endDate
                              ? `${new Date(section.startDate).toLocaleDateString()} - ${new Date(section.endDate).toLocaleDateString()}`
                              : section.startDate
                              ? `Starts ${new Date(section.startDate).toLocaleDateString()}`
                              : section.endDate
                              ? `Until ${new Date(section.endDate).toLocaleDateString()}`
                              : "Coming Soon"}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    <Button
                      component={Link}
                      href={section.buttonLink || "#"}
                      variant="contained"
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        bgcolor: "#C9B59C",
                        color: "#F9F8F6",
                        fontWeight: 600,
                        fontSize: "1rem",
                        textTransform: "none",
                        '&:hover': {
                          bgcolor: "#B8A289",
                        }
                      }}
                      endIcon={<ArrowForward />}
                    >
                      {section.buttonText || "Notify Me"}
                    </Button>
                  </Box>

                  {/* IMAGE */}
                  <Box sx={{ 
                    flex: 1, 
                    display: "flex", 
                    justifyContent: "center",
                    pl: { lg: 4 }
                  }}>
                    <Box
                      sx={{
                        width: "100%",
                        maxWidth: 400,
                        borderRadius: 3,
                        overflow: "hidden",
                        border: "1px solid #EFE9E3",
                      }}
                    >
                      <img
                        src={section.image}
                        alt={section.title || "Coming Soon"}
                        style={{ 
                          width: "100%", 
                          height: "auto", 
                          display: "block",
                          objectFit: "cover"
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

  const ProductSection = ({ title, products, viewAllLink }) => {
    if (products.length === 0) return null;

    const sliderSettings = getSliderSettings(products.length);

    return (
      <Box sx={{ mb: 8, position: "relative" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            p: 3,
            bgcolor: COLORS.white,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(201, 181, 156, 0.08)",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: COLORS.text,
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            {title}
          </Typography>
          <Link href={viewAllLink} style={{ textDecoration: "none" }}>
            <Button
              endIcon={<ArrowForward />}
              sx={{
                color: COLORS.primary,
                fontWeight: 600,
                borderRadius: 2,
                px: 3,
                "&:hover": {
                  bgcolor: COLORS.secondaryBg,
                  transform: "translateX(4px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              View All
            </Button>
          </Link>
        </Box>

        <Box
          sx={{
            position: "relative",
            px: { xs: 0, md: 2 },
          }}
        >
          <Slider {...sliderSettings}>
            {products.map((product) => (
              <Box key={product.id} sx={{ px: 1 }}>
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  colors={COLORS}
                />
              </Box>
            ))}
          </Slider>
        </Box>
      </Box>
    );
  };


  const FlashDealsSection = () => {
    const [flashDeals, setFlashDeals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetchFlashDeals();
    }, []);

    const fetchFlashDeals = async () => {
      try {
        const response = await axios.get("/flash-sales/active");
        setFlashDeals(response.data || []);
      } catch (error) {
        console.error("Error fetching flash deals:", error);
      } finally {
        setLoading(false);
      }
    };

    if (loading) {
      return (
        <Box sx={{ mb: 8 }}>
          <Skeleton
            variant="rectangular"
            height={300}
            sx={{ borderRadius: 2, mb: 2 }}
          />
          <Grid container spacing={2}>
            {[...Array(2)].map((_, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Skeleton
                  variant="rectangular"
                  height={200}
                  sx={{ borderRadius: 2 }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      );
    }

    if (flashDeals.length === 0) {
      return null;
    }

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
        <Box sx={{ textAlign: "center" }}>
          <Box
            sx={{
              bgcolor: COLORS.primary,
              color: "white",
              px: 2,
              py: 1,
              borderRadius: 2,
              fontWeight: 700,
              fontSize: { xs: "0.9rem", md: "1.1rem" },
              minWidth: 50,
            }}
          >
            {value.toString().padStart(2, "0")}
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: COLORS.text,
              textTransform: "uppercase",
              fontWeight: 600,
              mt: 0.5,
              display: "block",
              fontSize: { xs: "0.7rem", md: "0.8rem" },
            }}
          >
            {label}
          </Typography>
        </Box>
      );

      return (
        <Box sx={{ display: "flex", gap: 1, justifyContent: "center", mb: 2 }}>
          <TimeBox value={timeLeft.days} label="Days" />
          <TimeBox value={timeLeft.hours} label="Hours" />
          <TimeBox value={timeLeft.minutes} label="Minutes" />
          <TimeBox value={timeLeft.seconds} label="Seconds" />
        </Box>
      );
    };


    const flashDealsSliderSettings = getSliderSettings(flashDeals.length, 3);

    return (
      <Box sx={{ mb: 8 }} id="flash-deals">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            p: 3,
            bgcolor: COLORS.white,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(201, 181, 156, 0.08)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <LocalFireDepartment
              sx={{
                color: COLORS.primary,
                fontSize: { xs: 28, md: 32 },
              }}
            />
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: COLORS.text,
                  fontSize: { xs: "1.5rem", md: "2rem" },
                }}
              >
                Flash Deals
              </Typography>
              <Typography
                sx={{
                  color: COLORS.textLight,
                  fontSize: { xs: "0.9rem", md: "1rem" },
                }}
              >
                Limited time offers. Don't miss out!
              </Typography>
            </Box>
          </Box>
          <Link href="/flash-sales" style={{ textDecoration: "none" }}>
            <Button
              endIcon={<ArrowForward />}
              sx={{
                color: COLORS.primary,
                fontWeight: 600,
                borderRadius: 2,
                px: 3,
                "&:hover": {
                  bgcolor: COLORS.secondaryBg,
                  transform: "translateX(4px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              View All
            </Button>
          </Link>
        </Box>

        <Box
          sx={{
            position: "relative",
            px: { xs: 0, md: 2 },
          }}
        >
          <Slider {...flashDealsSliderSettings}>
            {flashDeals.map((deal) => (
              <Box key={deal.id} sx={{ px: 1, height: "100%" }}>
                <Card
                  sx={{
                    p: { xs: 2, md: 3 },
                    bgcolor: COLORS.white,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 3,
                    height: "100%",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 40px rgba(201, 181, 156, 0.2)",
                    },
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={5}>
                      <Box
                        component="img"
                        src={deal.image}
                        alt={deal.title}
                        sx={{
                          width: "100%",
                          height: 180,
                          objectFit: "cover",
                          borderRadius: 2,
                          border: `1px solid ${COLORS.border}`,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={7}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          mb: 1,
                          color: COLORS.text,
                          fontSize: { xs: "1.1rem", md: "1.25rem" },
                        }}
                      >
                        {deal.title}
                      </Typography>
                      <Typography
                        sx={{
                          color: COLORS.textLight,
                          mb: 2,
                          fontSize: "0.9rem",
                        }}
                      >
                        {deal.description}
                      </Typography>

                      <CountdownTimer endDate={deal.endDate} />

                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <Button
                          variant="contained"
                          href={`/flash-sales/${deal.id}`}
                          sx={{
                            bgcolor: COLORS.primary,
                            color: COLORS.white,
                            px: 3,
                            py: 1,
                            fontWeight: 600,
                            borderRadius: 2,
                            fontSize: { xs: "0.8rem", md: "0.9rem" },
                            "&:hover": {
                              bgcolor: COLORS.primaryDark,
                              transform: "translateY(-1px)",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          Shop Now ({deal.discountPercentage}% OFF)
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </Box>
            ))}
          </Slider>
        </Box>
      </Box>
    );
  };

  
  const TestimonialsSection = () => {
    if (sections.testimonials.length === 0) return null;
    const testimonialsSliderSettings = getSliderSettings(
      sections.testimonials.length,
      3
    );

    return (
      <Box sx={{ mb: 10 }}>
        <Box
          sx={{ textAlign: "center", mb: 8, position: "relative", zIndex: 1 }}
        >
          <Chip
            label="Testimonials"
            sx={{
              bgcolor: COLORS.primary,
              color: COLORS.white,
              fontWeight: 600,
              fontSize: "0.8rem",
              px: 2,
              mb: 2,
              height: 32,
            }}
          />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: COLORS.text,
              mb: 2,
              fontSize: { xs: "2rem", md: "2.5rem" },
              background: `linear-gradient(135deg, ${COLORS.text} 0%, ${COLORS.textLight} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Voices of Satisfaction
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: COLORS.textLight,
              fontWeight: 400,
              maxWidth: 600,
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Discover what our valued customers have to say about their
            experience with our products
          </Typography>
        </Box>

        <Box
          sx={{
            position: "relative",
            px: { xs: 0, md: 2 },
          }}
        >
          <Slider {...testimonialsSliderSettings}>
            {sections.testimonials.map((testimonial) => (
              <Box key={testimonial.id} sx={{ px: 1, height: "100%" }}>
                <Card
                  sx={{
                    p: 4,
                    height: "100%",
                    borderRadius: 4,
                    background: "rgba(255,255,255,0.75)",
                    backdropFilter: "blur(8px)",
                    border: `1px solid ${COLORS.primaryLight}`,
                    boxShadow:
                      "0 8px 24px rgba(201, 181, 156, 0.15), 0 2px 8px rgba(0,0,0,0.05)",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow:
                        "0 12px 32px rgba(201, 181, 156, 0.25), 0 4px 12px rgba(0,0,0,0.08)",
                    },
                  }}
                >
                  {/* Avatar + Name */}
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: 700,
                        fontSize: "1.2rem",
                        mr: 2.5,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                      }}
                    >
                      {testimonial.user?.name?.charAt(0) || "U"}
                    </Box>

                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: COLORS.text }}
                      >
                        {testimonial.user?.name || "Anonymous"}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: COLORS.textLight, fontSize: "0.9rem" }}
                      >
                        {testimonial.product?.name}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Stars */}
                  <Box sx={{ display: "flex", mb: 2, gap: 0.5 }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        sx={{
                          opacity: 0,
                          animation: `fadeStar 0.4s ease ${i * 0.1}s forwards`,
                          color:
                            i < testimonial.rating
                              ? "#F59E0B"
                              : "rgba(0,0,0,0.15)",
                          fontSize: 24,
                          "@keyframes fadeStar": {
                            from: { opacity: 0, transform: "scale(0.5)" },
                            to: { opacity: 1, transform: "scale(1)" },
                          },
                        }}
                      />
                    ))}
                  </Box>

                  {/* Comment */}
                  <Box
                    sx={{
                      background: COLORS.secondaryBg,
                      borderLeft: `4px solid ${COLORS.primary}`,
                      p: 2,
                      borderRadius: 2,
                      mb: 2.5,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: COLORS.text,
                        fontStyle: "italic",
                        lineHeight: 1.6,
                      }}
                    >
                      "{testimonial.comment}"
                    </Typography>
                  </Box>

                  {/* Optional Title */}
                  {testimonial.title && (
                    <Typography
                      variant="h6"
                      sx={{
                        mt: 1,
                        fontWeight: 700,
                        color: COLORS.text,
                        textAlign: "right",
                      }}
                    >
                      — {testimonial.title}
                    </Typography>
                  )}
                </Card>
              </Box>
            ))}
          </Slider>
        </Box>
      </Box>
    );
  };


  if (loading) {
    return (
      <Box
        sx={{
          bgcolor: COLORS.lightBg,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{
              color: COLORS.primary,
              mb: 2,
              fontWeight: 600,
            }}
          >
            Loading...
          </Typography>
          <Box
            sx={{
              width: 80,
              height: 4,
              bgcolor: COLORS.primary,
              borderRadius: 2,
              mx: "auto",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: -40,
                width: 40,
                height: 4,
                bgcolor: COLORS.primaryDark,
                animation: "loading 1.5s infinite",
              },
              "@keyframes loading": {
                "0%": { left: -40 },
                "100%": { left: "100%" },
              },
            }}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: COLORS.lightBg, minHeight: "100vh" }}>
      <HeroBannerSlider banners={sections.heroBanners} />
      <Container
        maxWidth={false}
        disableGutters
        sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 4 } }}
      >
        {/* Flash Deals with Slider */}
        <FlashDealsSection />

        {/* New Arrivals with Carousel */}
        <ProductSection
          title="New Arrivals"
          products={sections.newArrivals}
          viewAllLink="/products?filter=new"
        />

        {/* Trending Products with Carousel */}
        <ProductSection
          title="Trending Products"
          products={sections.trending}
          viewAllLink="/products?filter=trending"
        />

        {/* Best Selling with Carousel */}
        <ProductSection
          title="Best Selling"
          products={sections.bestSelling}
          viewAllLink="/products?filter=bestselling"
        />

        {/* Most Popular with Carousel */}
        <ProductSection
          title="Most Popular"
          products={sections.mostPopular}
          viewAllLink="/products?filter=mostPopular"
        />

        {/* Testimonials with Slider */}
        <TestimonialsSection />
        {/* Coming Soon Sections */}
        <ComingSoonSection />
      </Container>
    </Box>
  );
}
