"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Container,
  Grid,
  Rating,
  Avatar,
  Chip,
  Skeleton,
} from "@mui/material";
import {
  RateReview,
  Delete,
  Edit,
  ShoppingBag,
  Home,
  ChevronRight,
} from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import {
  getUserReviews,
  deleteReview,
  clearReviewError,
} from "../../../store/slices/reviewSlice";
import ReviewForm from "../../../components/reviews/ReviewForm";
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

export default function UserReviews() {
  const dispatch = useAppDispatch();
  const { userReviews, isLoading, error } = useAppSelector(
    (state) => state.reviews
  );
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [editingReview, setEditingReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUserReviews());
    }
  }, [dispatch, isAuthenticated]);

  const handleDeleteReview = (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      dispatch(deleteReview(reviewId));
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

  if (!isAuthenticated) {
    return (
      <Box sx={{ backgroundColor: COLORS.lightBg, minHeight: "100vh", py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", py: 10 }}>
            <RateReview sx={{ fontSize: 80, color: COLORS.border, mb: 3 }} />
            <Typography
              variant="h4"
              sx={{ color: COLORS.text, mb: 2, fontWeight: 600 }}
            >
              Please Login
            </Typography>
            <Typography variant="body1" sx={{ color: COLORS.textLight, mb: 4 }}>
              Sign in to view and manage your product reviews
            </Typography>
            <Link href="/login" passHref>
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: COLORS.primary,
                  color: "white",
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  "&:hover": {
                    backgroundColor: COLORS.text,
                  },
                }}
              >
                Login to Continue
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: COLORS.lightBg, minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* Breadcrumb */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Link href="/" passHref>
              <Typography
                sx={{
                  color: COLORS.textLight,
                  cursor: "pointer",
                  "&:hover": { color: COLORS.primary },
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Home sx={{ fontSize: 20 }} />
                Home
              </Typography>
            </Link>
            <ChevronRight sx={{ color: COLORS.border }} />
            <Typography sx={{ color: COLORS.primary, fontWeight: 600 }}>
              My Reviews
            </Typography>
          </Box>
        </Box>

        {/* Header */}
        <Card
          sx={{
            p: 4,
            mb: 4,
            borderRadius: "16px",
            backgroundColor: "white",
            border: `1px solid ${COLORS.border}`,
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                backgroundColor: COLORS.primary,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <RateReview sx={{ fontSize: 40 }} />
            </Box>
          </Box>
          <Typography
            variant="h3"
            sx={{ color: COLORS.text, mb: 2, fontWeight: 700 }}
          >
            My Reviews
          </Typography>
          <Typography variant="h6" sx={{ color: COLORS.textLight, mb: 3 }}>
            {userReviews.length}{" "}
            {userReviews.length === 1 ? "review" : "reviews"} written
          </Typography>
        </Card>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 4, borderRadius: "12px" }}
            onClose={() => dispatch(clearReviewError())}
          >
            {error}
          </Alert>
        )}

        {/* Reviews Grid */}
        {isLoading ? (
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} key={index}>
                <Card sx={{ borderRadius: "12px", p: 3 }}>
                  <Box className="flex items-start gap-3">
                    <Skeleton variant="circular" width={48} height={48} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Skeleton variant="text" height={30} width="60%" />
                      <Skeleton variant="text" height={20} width="40%" />
                      <Skeleton variant="text" height={60} />
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : userReviews.length > 0 ? (
          <Grid container spacing={3}>
            {userReviews.map((review) => (
              <Grid item xs={12} key={review.id}>
                <Card
                  sx={{
                    borderRadius: "12px",
                    border: `1px solid ${COLORS.border}`,
                    "&:hover": {
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box className="flex flex-col lg:flex-row gap-4">
                      {/* Product Info */}
                      <Box className="flex items-start gap-3 flex-1">
                        <img
                          src={review.product?.featuredImage}
                          alt={review.product?.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <Box className="flex-1">
                          <Link
                            href={`/products/${review.product?.id}`}
                            passHref
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                color: COLORS.text,
                                fontWeight: 600,
                                mb: 1,
                                cursor: "pointer",
                                "&:hover": {
                                  color: COLORS.primary,
                                },
                              }}
                            >
                              {review.product?.name}
                            </Typography>
                          </Link>
                          <Rating
                            value={review.rating}
                            readOnly
                            size="small"
                            sx={{
                              "& .MuiRating-iconFilled": {
                                color: COLORS.warning,
                              },
                              mb: 1,
                            }}
                          />
                          {review.title && (
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 600, color: COLORS.text, mb: 1 }}
                            >
                              {review.title}
                            </Typography>
                          )}
                          <Typography
                            variant="body1"
                            sx={{ color: COLORS.text, lineHeight: 1.6 }}
                          >
                            {review.comment}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: COLORS.textLight, mt: 1 }}
                          >
                            Reviewed on{" "}
                            {new Date(review.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Actions */}
                      <Box className="flex gap-2">
                        <Button
                          startIcon={<Edit />}
                          onClick={() => handleEditReview(review)}
                          sx={{
                            color: COLORS.primary,
                            border: `1px solid ${COLORS.primary}`,
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: 600,
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          startIcon={<Delete />}
                          onClick={() => handleDeleteReview(review.id)}
                          sx={{
                            color: COLORS.error,
                            border: `1px solid ${COLORS.error}`,
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: 600,
                          }}
                        >
                          Delete
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Card
            sx={{
              textAlign: "center",
              py: 10,
              borderRadius: "16px",
              border: `1px solid ${COLORS.border}`,
              backgroundColor: COLORS.secondaryBg,
            }}
          >
            <RateReview sx={{ fontSize: 80, color: COLORS.border, mb: 3 }} />
            <Typography variant="h4" sx={{ color: COLORS.text, mb: 2 }}>
              No Reviews Yet
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: COLORS.textLight, mb: 4, maxWidth: 400, mx: "auto" }}
            >
              You haven't written any reviews yet. Start sharing your experiences
              with products you've purchased.
            </Typography>
            <Link href="/products" passHref>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingBag />}
                sx={{
                  backgroundColor: COLORS.primary,
                  color: "white",
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: COLORS.text,
                  },
                }}
              >
                Browse Products
              </Button>
            </Link>
          </Card>
        )}

        {/* Review Form */}
        {editingReview && (
          <ReviewForm
            open={showReviewForm}
            onClose={handleCloseReviewForm}
            onSubmit={(reviewData) => {
   
              handleCloseReviewForm();
            }}
            product={editingReview.product}
            review={editingReview}
          />
        )}
      </Container>
    </Box>
  );
}