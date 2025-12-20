"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Rating,
  LinearProgress,
  Alert,
  Tabs,
  Tab,
  Card,
  CardContent,
} from "@mui/material";
import {
  Star,
  RateReview,
  Sort,
  TrendingUp,
  NewReleases,
} from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  getProductReviews,
  addReview,
  updateReview,
  deleteReview,
  clearReviewError,
} from "../../store/slices/reviewSlice";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";

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

const ReviewSection = ({ product }) => {
  const dispatch = useAppDispatch();
  const {
    currentProductReviews,
    ratingDistribution,
    totalReviews,
    isLoading,
    error,
  } = useAppSelector((state) => state.reviews);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (product?.id) {
      dispatch(getProductReviews(product.id));
    }
  }, [dispatch, product?.id]);

  const handleAddReview = (reviewData) => {
    dispatch(addReview(reviewData))
      .unwrap()
      .then(() => {
        setShowReviewForm(false);
        dispatch(getProductReviews(product.id));
      });
  };

  const handleUpdateReview = (reviewData) => {
    dispatch(updateReview({ reviewId: editingReview.id, reviewData }))
      .unwrap()
      .then(() => {
        setEditingReview(null);
        setShowReviewForm(false);
        dispatch(getProductReviews(product.id));
      });
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      dispatch(deleteReview(reviewId))
        .unwrap()
        .then(() => {
          dispatch(getProductReviews(product.id));
        });
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleCloseReviewForm = () => {
    setShowReviewForm(false);
    setEditingReview(null);
    dispatch(clearReviewError());
  };

  // Check if user has already reviewed this product
  const userReview = currentProductReviews.find(
    (review) => review.userId === user?.id
  );

  // Calculate rating statistics
  const averageRating =
    currentProductReviews.reduce((sum, review) => sum + review.rating, 0) /
    (currentProductReviews.length || 1);

  // Sort reviews
//   const sortedReviews = [...currentProductReviews].sort((a, b) => {
//     switch (sortBy) {
//       case "highest":
//         return b.rating - a.rating;
//       case "lowest":
//         return a.rating - b.rating;
//       case "newest":
//       default:
//         return new Date(b.createdAt) - new Date(a.createdAt);
//     }
//   });
// components/reviews/ReviewSection.js mein
const sortedReviews = [...currentProductReviews]
  .filter(review => review.isVerified) // Sirf verified reviews show karen
  .sort((a, b) => {
    switch (sortBy) {
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      case "newest":
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });
  const ratingPercentages = [0, 0, 0, 0, 0];
  ratingDistribution.forEach((item) => {
    if (item.rating >= 1 && item.rating <= 5) {
      ratingPercentages[5 - item.rating] = Math.round(
        (item.count / totalReviews) * 100
      );
    }
  });

  return (
    <Box sx={{ mt: 6 }}>
      {/* Header */}
      <Box className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: COLORS.text, mb: 2 }}
        >
          Customer Reviews
        </Typography>

        {isAuthenticated && !userReview && (
          <Button
            variant="contained"
            startIcon={<RateReview />}
            onClick={() => setShowReviewForm(true)}
            sx={{
              backgroundColor: COLORS.primary,
              color: "white",
              borderRadius: "8px",
              px: 3,
              py: 1,
              fontWeight: 600,
              "&:hover": {
                backgroundColor: COLORS.text,
              },
            }}
          >
            Write a Review
          </Button>
        )}
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 4, borderRadius: "8px" }}
          onClose={() => dispatch(clearReviewError())}
        >
          {error}
        </Alert>
      )}

      <Card
        sx={{
          borderRadius: "16px",
          border: `1px solid ${COLORS.border}`,
          overflow: "hidden",
          mb: 4,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Rating Overview */}
          <Box className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6">
            {/* Average Rating */}
            <Box className="text-center">
              <Typography
                variant="h2"
                sx={{ fontWeight: 700, color: COLORS.text, mb: 1 }}
              >
                {averageRating.toFixed(1)}
              </Typography>
              <Rating
                value={averageRating}
                readOnly
                precision={0.1}
                sx={{
                  "& .MuiRating-iconFilled": {
                    color: COLORS.warning,
                  },
                  mb: 1,
                }}
              />
              <Typography variant="body2" sx={{ color: COLORS.textLight }}>
                Based on {totalReviews} reviews
              </Typography>
            </Box>

            {/* Rating Distribution */}
            <Box className="lg:col-span-2">
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: COLORS.text, mb: 3 }}
              >
                Rating Breakdown
              </Typography>
              {[5, 4, 3, 2, 1].map((rating, index) => (
                <Box key={rating} className="flex items-center gap-3 mb-2">
                  <Typography
                    variant="body2"
                    sx={{ color: COLORS.text, minWidth: 20 }}
                  >
                    {rating}
                  </Typography>
                  <Star sx={{ fontSize: 20, color: COLORS.warning }} />
                  <LinearProgress
                    variant="determinate"
                    value={ratingPercentages[index]}
                    sx={{
                      flexGrow: 1,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: COLORS.secondaryBg,
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: COLORS.warning,
                        borderRadius: 4,
                      },
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ color: COLORS.textLight, minWidth: 40 }}
                  >
                    {ratingPercentages[index]}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Sort Controls */}
          <Box className="flex flex-wrap items-center gap-4 mb-4">
            <Typography variant="body1" sx={{ color: COLORS.text, fontWeight: 600 }}>
              Sort by:
            </Typography>
            {[
              { value: "newest", label: "Newest", icon: <NewReleases /> },
              { value: "highest", label: "Highest Rated", icon: <TrendingUp /> },
              { value: "lowest", label: "Lowest Rated", icon: <Sort /> },
            ].map((option) => (
              <Button
                key={option.value}
                startIcon={option.icon}
                onClick={() => setSortBy(option.value)}
                variant={sortBy === option.value ? "contained" : "outlined"}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 600,
                  ...(sortBy === option.value
                    ? {
                        backgroundColor: COLORS.primary,
                        color: "white",
                        "&:hover": {
                          backgroundColor: COLORS.text,
                        },
                      }
                    : {
                        borderColor: COLORS.border,
                        color: COLORS.text,
                        "&:hover": {
                          borderColor: COLORS.primary,
                          backgroundColor: COLORS.secondaryBg,
                        },
                      }),
                }}
              >
                {option.label}
              </Button>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Reviews List */}
      {isLoading ? (
        // Loading Skeletons
        Array.from(new Array(3)).map((_, index) => (
          <Card key={index} sx={{ mb: 2, borderRadius: "12px" }}>
            <CardContent sx={{ p: 3 }}>
              <Box className="flex items-center gap-3 mb-3">
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    backgroundColor: COLORS.secondaryBg,
                  }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      height: 20,
                      backgroundColor: COLORS.secondaryBg,
                      borderRadius: 1,
                      mb: 1,
                      width: "60%",
                    }}
                  />
                  <Box
                    sx={{
                      height: 16,
                      backgroundColor: COLORS.secondaryBg,
                      borderRadius: 1,
                      width: "40%",
                    }}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  height: 16,
                  backgroundColor: COLORS.secondaryBg,
                  borderRadius: 1,
                  mb: 1,
                  width: "80%",
                }}
              />
              <Box
                sx={{
                  height: 16,
                  backgroundColor: COLORS.secondaryBg,
                  borderRadius: 1,
                  width: "90%",
                }}
              />
            </CardContent>
          </Card>
        ))
      ) : sortedReviews.length > 0 ? (
        <Box>
          {sortedReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onEdit={handleEditReview}
              onDelete={handleDeleteReview}
              currentUserId={user?.id}
              showActions={isAuthenticated}
            />
          ))}
        </Box>
      ) : (
        <Card
          sx={{
            textAlign: "center",
            py: 6,
            borderRadius: "16px",
            border: `1px solid ${COLORS.border}`,
            backgroundColor: COLORS.secondaryBg,
          }}
        >
          <RateReview sx={{ fontSize: 64, color: COLORS.border, mb: 3 }} />
          <Typography variant="h6" sx={{ color: COLORS.text, mb: 2 }}>
            No Reviews Yet
          </Typography>
          <Typography variant="body1" sx={{ color: COLORS.textLight, mb: 4 }}>
            Be the first to share your experience with this product
          </Typography>
          {isAuthenticated && (
            <Button
              variant="contained"
              startIcon={<RateReview />}
              onClick={() => setShowReviewForm(true)}
              sx={{
                backgroundColor: COLORS.primary,
                color: "white",
                borderRadius: "8px",
                px: 3,
                py: 1,
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: COLORS.text,
                },
              }}
            >
              Write First Review
            </Button>
          )}
        </Card>
      )}

      {/* Review Form Dialog */}
      <ReviewForm
        open={showReviewForm}
        onClose={handleCloseReviewForm}
        onSubmit={editingReview ? handleUpdateReview : handleAddReview}
        product={product}
        review={editingReview}
        isLoading={isLoading}
        error={error}
      />
    </Box>
  );
};

export default ReviewSection;