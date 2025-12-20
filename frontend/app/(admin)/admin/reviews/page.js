"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  Chip,
  Switch,
  Avatar,
  InputBase,
  Card,
  Skeleton,
  Tooltip,
  Button,
  Menu,
  MenuItem,
  Badge,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  Search,
  FilterList,
  Refresh,
  MoreVert,
  Person,
  Star,
  Visibility,
  Delete,
  Verified,
  Warning,
  ThumbUp,
  ThumbDown,
} from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "../../../../store/hooks";
import {
  getAllReviews,
  toggleReviewVerification,
  deleteReview,
  clearReviewError,
} from "../../../../store/slices/reviewSlice";
import ProtectedRoute from "../../../../components/auth/ProtectedRoute";

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

export default function AdminReviews() {
  const dispatch = useAppDispatch();
  const {
    items: reviews,
    isLoading,
    error,
  } = useAppSelector((state) => state.reviews);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllReviews());
  }, [dispatch]);

  const handleToggleVerification = (review) => {
    dispatch(
      toggleReviewVerification({
        reviewId: review.id,
        isVerified: !review.isVerified,
      })
    );
  };

  const handleDelete = (reviewId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this review? This action cannot be undone."
      )
    ) {
      dispatch(deleteReview(reviewId));
    }
  };

  const handleMenuOpen = (event, review) => {
    setAnchorEl(event.currentTarget);
    setSelectedReview(review);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReview(null);
  };

  const handleRefresh = () => {
    dispatch(getAllReviews());
  };

  const handleViewReview = (review) => {
    setSelectedReview(review);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedReview(null);
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.title?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "verified" && review.isVerified) ||
      (statusFilter === "unverified" && !review.isVerified) ||
      (statusFilter === "active" && review.isActive) ||
      (statusFilter === "inactive" && !review.isActive);

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: reviews.length,
    verified: reviews.filter((r) => r.isVerified).length,
    unverified: reviews.filter((r) => !r.isVerified).length,
    active: reviews.filter((r) => r.isActive).length,
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return COLORS.success;
    if (rating >= 3) return COLORS.warning;
    return COLORS.error;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ProtectedRoute requireAdmin>
      <Box sx={{ backgroundColor: COLORS.lightBg, minHeight: "100vh", p: 3 }}>
        {/* Header Section */}
        <Card
          sx={{
            p: 4,
            mb: 4,
            borderRadius: "16px",
            backgroundColor: "white",
            border: `1px solid ${COLORS.border}`,
            background: `linear-gradient(135deg, ${COLORS.lightBg} 0%, white 100%)`,
          }}
        >
          <Box className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: COLORS.text,
                  mb: 1,
                }}
              >
                Reviews Management
              </Typography>
              <Typography variant="body1" sx={{ color: COLORS.textLight }}>
                Manage and verify customer reviews
              </Typography>
            </Box>
            <Box className="flex items-center gap-3">
              <Typography variant="body2" sx={{ color: COLORS.textLight }}>
                Total:{" "}
                <strong style={{ color: COLORS.text }}>{reviews.length}</strong>{" "}
                reviews
              </Typography>
            </Box>
          </Box>

          {/* Stats Cards */}
          <Box className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Total Reviews",
                value: stats.total,
                icon: <Star />,
                color: COLORS.primary,
              },
              {
                label: "Verified",
                value: stats.verified,
                icon: <Verified />,
                color: COLORS.success,
              },
              {
                label: "Pending",
                value: stats.unverified,
                icon: <Warning />,
                color: COLORS.warning,
              },
              {
                label: "Active",
                value: stats.active,
                icon: <CheckCircle />,
                color: COLORS.text,
              },
            ].map((stat, index) => (
              <Paper
                key={index}
                sx={{
                  p: 3,
                  borderRadius: "12px",
                  backgroundColor: COLORS.secondaryBg,
                  border: `1px solid ${COLORS.border}`,
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    display: "inline-flex",
                    p: 1,
                    borderRadius: "8px",
                    backgroundColor: stat.color,
                    color: "white",
                    mb: 2,
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: COLORS.text, mb: 1 }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ color: COLORS.textLight }}>
                  {stat.label}
                </Typography>
              </Paper>
            ))}
          </Box>

          {/* Search and Controls */}
          <Box className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <Paper
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: { xs: "100%", lg: 400 },
                borderRadius: "12px",
                border: `1px solid ${COLORS.border}`,
                backgroundColor: COLORS.lightBg,
              }}
            >
              <InputBase
                sx={{ ml: 2, flex: 1, color: COLORS.text }}
                placeholder="Search reviews by user, product, or comment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startAdornment={
                  <Search sx={{ color: COLORS.textLight, mr: 1 }} />
                }
              />
            </Paper>

            <Box className="flex gap-2">
              <Tooltip title="Refresh">
                <IconButton
                  onClick={handleRefresh}
                  disabled={isLoading}
                  sx={{
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: "10px",
                    color: COLORS.text,
                  }}
                >
                  <Refresh />
                </IconButton>
              </Tooltip>

              <Button
                startIcon={<FilterList />}
                onClick={(e) => handleMenuOpen(e, null)}
                sx={{
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: "10px",
                  color: COLORS.text,
                  textTransform: "none",
                }}
              >
                Filter
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    borderRadius: "12px",
                    border: `1px solid ${COLORS.border}`,
                    mt: 1,
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    setStatusFilter("all");
                    handleMenuClose();
                  }}
                  selected={statusFilter === "all"}
                >
                  All Reviews
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setStatusFilter("verified");
                    handleMenuClose();
                  }}
                  selected={statusFilter === "verified"}
                >
                  Verified Only
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setStatusFilter("unverified");
                    handleMenuClose();
                  }}
                  selected={statusFilter === "unverified"}
                >
                  Pending Verification
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setStatusFilter("active");
                    handleMenuClose();
                  }}
                  selected={statusFilter === "active"}
                >
                  Active Only
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 4,
              borderRadius: "12px",
              border: `1px solid ${COLORS.error}`,
            }}
            onClose={() => dispatch(clearReviewError())}
          >
            {error}
          </Alert>
        )}

        {/* Reviews Table */}
        <Card
          sx={{
            borderRadius: "16px",
            border: `1px solid ${COLORS.border}`,
            overflow: "hidden",
          }}
        >
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: COLORS.secondaryBg }}>
                <TableRow>
                  <TableCell sx={{ color: COLORS.text, fontWeight: 600 }}>
                    User & Product
                  </TableCell>
                  <TableCell sx={{ color: COLORS.text, fontWeight: 600 }}>
                    Rating & Title
                  </TableCell>
                  <TableCell sx={{ color: COLORS.text, fontWeight: 600 }}>
                    Comment
                  </TableCell>
                  <TableCell sx={{ color: COLORS.text, fontWeight: 600 }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ color: COLORS.text, fontWeight: 600 }}>
                    Date
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: COLORS.text, fontWeight: 600 }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading
                  ? // Loading Skeletons
                    Array.from(new Array(5)).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box className="flex items-center gap-3">
                            <Skeleton variant="circular" width={40} height={40} />
                            <Box>
                              <Skeleton variant="text" width={120} height={20} />
                              <Skeleton variant="text" width={80} height={16} />
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width={100} height={20} />
                          <Skeleton variant="text" width={80} height={16} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width={200} height={40} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width={80} height={32} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width={100} height={20} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="circular" width={32} height={32} />
                          <Skeleton
                            variant="circular"
                            width={32}
                            height={32}
                            sx={{ ml: 1 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  : filteredReviews.map((review) => (
                      <TableRow
                        key={review.id}
                        sx={{
                          "&:hover": { backgroundColor: COLORS.secondaryBg },
                          transition: "background-color 0.2s",
                        }}
                      >
                        <TableCell>
                          <Box className="flex items-start gap-3">
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                backgroundColor: COLORS.primary,
                                fontWeight: 600,
                              }}
                            >
                              {review.user?.name?.charAt(0)?.toUpperCase() || "U"}
                            </Avatar>
                            <Box>
                              <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 600, color: COLORS.text }}
                              >
                                {review.user?.name || "Anonymous"}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: COLORS.textLight }}
                              >
                                {review.product?.name || "Unknown Product"}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box className="flex flex-col gap-1">
                            <Rating
                              value={review.rating}
                              readOnly
                              size="small"
                              sx={{
                                "& .MuiRating-iconFilled": {
                                  color: getRatingColor(review.rating),
                                },
                              }}
                            />
                            {review.title && (
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 500, color: COLORS.text }}
                                className="line-clamp-1"
                              >
                                {review.title}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ color: COLORS.text }}
                            className="line-clamp-2"
                          >
                            {review.comment}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box className="flex flex-col gap-1">
                            <Chip
                              icon={review.isVerified ? <Verified /> : <Warning />}
                              label={review.isVerified ? "Verified" : "Pending"}
                              color={review.isVerified ? "success" : "warning"}
                              size="small"
                              sx={{
                                borderRadius: "8px",
                                fontWeight: 500,
                              }}
                            />
                            <Chip
                              label={review.isActive ? "Active" : "Inactive"}
                              color={review.isActive ? "success" : "default"}
                              size="small"
                              sx={{
                                borderRadius: "6px",
                                fontSize: "0.7rem",
                              }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ color: COLORS.text }}
                          >
                            {formatDate(review.createdAt)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box className="flex justify-end gap-1">
                            <Tooltip title="View Review">
                              <IconButton
                                size="small"
                                onClick={() => handleViewReview(review)}
                                sx={{
                                  color: COLORS.textLight,
                                  "&:hover": {
                                    backgroundColor: COLORS.secondaryBg,
                                    color: COLORS.primary,
                                  },
                                }}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip
                              title={
                                review.isVerified ? "Unverify Review" : "Verify Review"
                              }
                            >
                              <IconButton
                                size="small"
                                onClick={() => handleToggleVerification(review)}
                                sx={{
                                  color: review.isVerified
                                    ? COLORS.warning
                                    : COLORS.success,
                                  "&:hover": {
                                    backgroundColor: review.isVerified
                                      ? "#FFFBEB"
                                      : "#ECFDF5",
                                  },
                                }}
                              >
                                {review.isVerified ? (
                                  <Cancel fontSize="small" />
                                ) : (
                                  <CheckCircle fontSize="small" />
                                )}
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Review">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(review.id)}
                                sx={{
                                  "&:hover": { backgroundColor: "#FEF2F2" },
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Empty State */}
          {!isLoading && filteredReviews.length === 0 && (
            <Box className="text-center py-12">
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  backgroundColor: COLORS.secondaryBg,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3,
                }}
              >
                <Star sx={{ fontSize: 40, color: COLORS.textLight }} />
              </Box>
              <Typography variant="h6" sx={{ color: COLORS.text, mb: 2 }}>
                {searchTerm || statusFilter !== "all"
                  ? "No reviews found"
                  : "No reviews yet"}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: COLORS.textLight,
                  mb: 4,
                  maxWidth: 400,
                  mx: "auto",
                }}
              >
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search terms or filters to find what you're looking for."
                  : "Reviews will appear here once customers start reviewing products."}
              </Typography>
            </Box>
          )}
        </Card>

        {/* Quick Actions Footer */}
        <Box className="flex justify-between items-center mt-4">
          <Typography variant="body2" sx={{ color: COLORS.textLight }}>
            Showing {filteredReviews.length} of {reviews.length} reviews
          </Typography>
          <Box className="flex gap-2">
            <Button
              startIcon={<Refresh />}
              onClick={handleRefresh}
              sx={{
                color: COLORS.text,
                textTransform: "none",
              }}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {/* Review Detail Dialog */}
        <Dialog
          open={viewDialogOpen}
          onClose={handleCloseViewDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "16px",
              backgroundColor: COLORS.lightBg,
            },
          }}
        >
          {selectedReview && (
            <>
              <DialogTitle
                sx={{
                  backgroundColor: "white",
                  borderBottom: `1px solid ${COLORS.border}`,
                  color: COLORS.text,
                  fontWeight: 600,
                }}
              >
                Review Details
              </DialogTitle>
              <DialogContent sx={{ p: 3 }}>
                <Box className="space-y-4">
                  {/* User and Product Info */}
                  <Box className="flex items-start gap-4">
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        backgroundColor: COLORS.primary,
                        fontWeight: 600,
                        fontSize: "1.25rem",
                      }}
                    >
                      {selectedReview.user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </Avatar>
                    <Box className="flex-1">
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: COLORS.text }}
                      >
                        {selectedReview.user?.name || "Anonymous"}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: COLORS.textLight, mb: 1 }}
                      >
                        on {selectedReview.product?.name || "Unknown Product"}
                      </Typography>
                      <Rating
                        value={selectedReview.rating}
                        readOnly
                        size="large"
                        sx={{
                          "& .MuiRating-iconFilled": {
                            color: getRatingColor(selectedReview.rating),
                          },
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Review Title */}
                  {selectedReview.title && (
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: COLORS.text }}
                      >
                        {selectedReview.title}
                      </Typography>
                    </Box>
                  )}

                  {/* Review Comment */}
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{ color: COLORS.text, lineHeight: 1.6 }}
                    >
                      {selectedReview.comment}
                    </Typography>
                  </Box>

                  {/* Review Metadata */}
                  <Box
                    className="grid grid-cols-2 gap-4 pt-4 border-t"
                    sx={{ borderColor: COLORS.border }}
                  >
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ color: COLORS.textLight, fontWeight: 600 }}
                      >
                        STATUS
                      </Typography>
                      <Box className="flex gap-2 mt-1">
                        <Chip
                          icon={selectedReview.isVerified ? <Verified /> : <Warning />}
                          label={selectedReview.isVerified ? "Verified" : "Pending"}
                          color={selectedReview.isVerified ? "success" : "warning"}
                          size="small"
                        />
                        <Chip
                          label={selectedReview.isActive ? "Active" : "Inactive"}
                          color={selectedReview.isActive ? "success" : "default"}
                          size="small"
                        />
                      </Box>
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ color: COLORS.textLight, fontWeight: 600 }}
                      >
                        DATE
                      </Typography>
                      <Typography variant="body2" sx={{ color: COLORS.text }}>
                        {formatDate(selectedReview.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </DialogContent>
              <DialogActions sx={{ p: 3, gap: 2 }}>
                <Button
                  onClick={handleCloseViewDialog}
                  sx={{
                    color: COLORS.text,
                    fontWeight: 600,
                  }}
                >
                  Close
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleToggleVerification(selectedReview)}
                  startIcon={
                    selectedReview.isVerified ? <Cancel /> : <CheckCircle />
                  }
                  sx={{
                    backgroundColor: selectedReview.isVerified
                      ? COLORS.warning
                      : COLORS.success,
                    color: "white",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: selectedReview.isVerified
                        ? "#DC2626"
                        : "#059669",
                    },
                  }}
                >
                  {selectedReview.isVerified ? "Unverify" : "Verify"}
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </ProtectedRoute>
  );
}