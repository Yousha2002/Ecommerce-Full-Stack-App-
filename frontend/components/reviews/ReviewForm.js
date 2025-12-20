"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Star, Send } from "@mui/icons-material";

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

const ReviewForm = ({
  open,
  onClose,
  onSubmit,
  product,
  review = null,
  isLoading = false,
  error = null,
}) => {
  const [rating, setRating] = useState(review?.rating || 0);
  const [title, setTitle] = useState(review?.title || "");
  const [comment, setComment] = useState(review?.comment || "");
  const [hover, setHover] = useState(-1);

  const labels = {
    1: "Very Poor",
    2: "Poor",
    3: "Average",
    4: "Good",
    5: "Excellent",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    if (!comment.trim()) {
      alert("Please write a review comment");
      return;
    }

    onSubmit({
      productId: product.id,
      rating,
      title: title.trim(),
      comment: comment.trim(),
    });
  };

  const handleClose = () => {
    setRating(review?.rating || 0);
    setTitle(review?.title || "");
    setComment(review?.comment || "");
    onClose();
  };

  const isEditing = !!review;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          backgroundColor: COLORS.lightBg,
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: "white",
          borderBottom: `1px solid ${COLORS.border}`,
          color: COLORS.text,
          fontWeight: 600,
        }}
      >
        {isEditing ? "Edit Your Review" : "Write a Review"}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: "8px" }}>
              {error}
            </Alert>
          )}

          {/* Product Info */}
          <Box className="flex items-center gap-3 mb-4 p-3 rounded-lg" sx={{ backgroundColor: COLORS.secondaryBg }}>
            <img
              src={product.featuredImage}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: COLORS.text }}>
                {product.name}
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textLight }}>
                Share your experience with this product
              </Typography>
            </Box>
          </Box>

          {/* Rating Section */}
          <Box className="text-center mb-6">
            <Typography variant="h6" sx={{ color: COLORS.text, mb: 2 }}>
              How would you rate this product?
            </Typography>
            <Box className="flex flex-col items-center gap-2">
              <Rating
                name="rating"
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
                onChangeActive={(event, newHover) => {
                  setHover(newHover);
                }}
                size="large"
                icon={<Star sx={{ fontSize: 40 }} />}
                emptyIcon={<Star sx={{ fontSize: 40 }} />}
                sx={{
                  "& .MuiRating-iconFilled": {
                    color: COLORS.warning,
                  },
                  "& .MuiRating-iconEmpty": {
                    color: COLORS.border,
                  },
                }}
              />
              {rating !== null && (
                <Typography variant="body1" sx={{ color: COLORS.text, fontWeight: 600 }}>
                  {labels[hover !== -1 ? hover : rating]}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Review Title */}
          <TextField
            fullWidth
            label="Review Title (Optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your experience in a few words"
            sx={{ mb: 3 }}
            InputProps={{
              sx: {
                borderRadius: "8px",
                backgroundColor: "white",
              },
            }}
          />

          {/* Review Comment */}
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Review *"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share detailed feedback about the product quality, features, and your overall experience..."
            required
            InputProps={{
              sx: {
                borderRadius: "8px",
                backgroundColor: "white",
              },
            }}
          />

          <Typography variant="caption" sx={{ color: COLORS.textLight, mt: 1 }}>
            * Required fields
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={handleClose}
            disabled={isLoading}
            sx={{
              color: COLORS.text,
              fontWeight: 600,
              borderRadius: "8px",
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || rating === 0 || !comment.trim()}
            startIcon={isLoading ? <CircularProgress size={20} /> : <Send />}
            sx={{
              backgroundColor: COLORS.primary,
              color: "white",
              fontWeight: 600,
              borderRadius: "8px",
              px: 3,
              "&:hover": {
                backgroundColor: COLORS.text,
              },
              "&:disabled": {
                backgroundColor: COLORS.border,
              },
            }}
          >
            {isLoading ? "Submitting..." : isEditing ? "Update Review" : "Submit Review"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ReviewForm;