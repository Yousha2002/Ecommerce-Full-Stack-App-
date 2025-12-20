"use client";
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import {
  Box,
  Typography,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
  Chip,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  PlayArrow,
  Pause,
  ArrowForward,
} from "@mui/icons-material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

const HeroBannerSlider = ({ banners = [] }) => {
  const [autoPlay, setAutoPlay] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const getSliderSettings = (itemsCount) => {
    return {
      dots: false,
      infinite: itemsCount > 1,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: autoPlay,
      autoplaySpeed: 5000,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
      appendDots: (dots) => (
        <Box sx={{ position: "absolute", bottom: 20, width: "100%" }}>
          <ul
            style={{
              margin: 0,
              padding: 0,
              display: "flex",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {dots}
          </ul>
        </Box>
      ),
      customPaging: (i) => (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor:
              i === banners.length - 1
                ? COLORS.primary
                : "rgba(255,255,255,0.4)",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        />
      ),
      dotsClass: "slick-dots hero-dots",
      responsive: [
        {
          breakpoint: 768,
          settings: {
            arrows: false,
          },
        },
      ],
    };
  };

  if (!banners || banners.length === 0) {
    return (
      <Box
        sx={{
          height: { xs: "50vh", md: "70vh" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: COLORS.lightBg,
          color: COLORS.text,
          borderRadius: 3,
          mx: 2,
          mt: 2,
        }}
      >
        <Typography variant="h6">No banners available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative" }}>
      {/* Slider Container */}
      <Box
        sx={{
          position: "relative",
          px: { xs: 0, md: 2 },
          "& .slick-slide": {
            padding: "0 8px",
          },
          "& .slick-list": {
            margin: "0 -8px",
          },
          "& .hero-dots li.slick-active div": {
            bgcolor: COLORS.primary,
            transform: "scale(1.2)",
          },
        }}
      >
        <Slider {...getSliderSettings(banners.length)}>
          {banners.map((banner, index) => (
            <Box key={banner.id || index}>
              <Box
                sx={{
                  height: { xs: "60vh", md: "70vh" },
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  position: "relative",
                  backgroundColor: COLORS.lightBg,
                }}
              >
                {/* Background Image */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(${
                      isMobile && banner.mobileImage
                        ? banner.mobileImage
                        : banner.image
                    })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                />

                {/* Overlay */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background:
                      banner.overlayColor ||
                      "linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%)",
                  }}
                />

                {/* Content */}
                <Box
                  sx={{
                    position: "relative",
                    zIndex: 2,
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    color: "white",
                    px: { xs: 4, md: 8, lg: 12 },
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: { xs: "100%", md: "50%", lg: "45%" },
                      textAlign: banner.textPosition || "left",
                    }}
                  >
                    {/* Title */}
                    <Typography
                      variant="h1"
                      sx={{
                        fontWeight: 800,
                        mb: 3,
                        fontSize: {
                          xs: "2.2rem",
                          sm: "3rem",
                          md: "3.5rem",
                          lg: "4rem",
                        },
                        lineHeight: 1.1,
                        textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
                      }}
                    >
                      {banner.title}
                    </Typography>

                    {/* Subtitle */}
                    {banner.subtitle && (
                      <Typography
                        variant="h4"
                        sx={{
                          mb: 4,
                          fontWeight: 600,
                          fontSize: {
                            xs: "1.1rem",
                            sm: "1.5rem",
                            md: "1.75rem",
                          },
                          opacity: 0.95,
                          color: COLORS.lightBg,
                        }}
                      >
                        {banner.subtitle}
                      </Typography>
                    )}

                    {/* Description */}
                    {banner.description && (
                      <Typography
                        variant="body1"
                        sx={{
                          mb: 5,
                          fontSize: { xs: "1rem", md: "1.1rem" },
                          lineHeight: 1.6,
                          opacity: 0.9,
                          maxWidth: "90%",
                        }}
                      >
                        {banner.description}
                      </Typography>
                    )}

                    {/* Action Buttons */}
                    <Box
                      sx={{
                        display: "flex",
                        gap: 3,
                        flexWrap: { xs: "wrap", sm: "nowrap" },
                        alignItems: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        size="large"
                        href={banner.button1Link}
                        sx={{
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                          bgcolor: COLORS.primary,
                          color: COLORS.white,
                          fontWeight: 600,
                          fontSize: "1rem",
                          textTransform: "none",
                          minWidth: { xs: "140px", md: "160px" },
                          "&:hover": {
                            bgcolor: COLORS.primaryDark,
                            transform: "translateY(-2px)",
                          },
                          transition: "all 0.3s ease",
                          boxShadow: "0 8px 20px rgba(201, 181, 156, 0.3)",
                        }}
                        endIcon={<ArrowForward />}
                      >
                        {banner.button1Text || "Shop Now"}
                      </Button>

                      {banner.button2Text && (
                        <Button
                          variant="outlined"
                          size="large"
                          href={banner.button2Link}
                          sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: 2,
                            borderColor: COLORS.white,
                            borderWidth: 2,
                            color: COLORS.white,
                            fontWeight: 600,
                            fontSize: "1rem",
                            textTransform: "none",
                            minWidth: { xs: "140px", md: "160px" },
                            "&:hover": {
                              bgcolor: "rgba(255,255,255,0.15)",
                              borderColor: COLORS.lightBg,
                              transform: "translateY(-2px)",
                            },
                            transition: "all 0.3s ease",
                          }}
                        >
                          {banner.button2Text}
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Box>

                {/* Auto-play Control */}
                {banners.length > 1 && (
                  <IconButton
                    onClick={() => setAutoPlay(!autoPlay)}
                    sx={{
                      position: "absolute",
                      top: 20,
                      right: 20,
                      zIndex: 3,
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "white",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.3)",
                      },
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    {autoPlay ? <Pause /> : <PlayArrow />}
                  </IconButton>
                )}
              </Box>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default HeroBannerSlider;
