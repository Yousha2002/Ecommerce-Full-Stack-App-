"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Rating,
  Chip,
} from "@mui/material";
import {
  MoreVert,
  Edit,
  Delete,
  Verified,
  CheckCircle,
} from "@mui/icons-material";


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

const ReviewCard = ({ 
  review, 
  onEdit, 
  onDelete, 
  currentUserId,
  showActions = true 
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(review);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(review.id);
    handleMenuClose();
  };

  const isOwner = currentUserId === review.userId;
  const comment = review.comment || '';
  const shouldTruncate = comment.length > 200;

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: "12px",
        border: `1px solid ${COLORS.border}`,
        backgroundColor: "white",
        "&:hover": {
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box className="flex items-start justify-between mb-3">
          <Box className="flex items-center gap-3">
            <Avatar
              sx={{
                width: 48,
                height: 48,
                backgroundColor: COLORS.primary,
                fontWeight: 600,
              }}
            >
              {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
            <Box>
              <Box className="flex items-center gap-2 mb-1">
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: COLORS.text }}
                >
                  {review.user?.name || 'Anonymous'}
                </Typography>
                {review.isVerified && (
                  <Verified 
                    sx={{ 
                      fontSize: 18, 
                      color: COLORS.success 
                    }} 
                  />
                )}
              </Box>
              <Box className="flex items-center gap-2">
                <Rating
                  value={review.rating}
                  readOnly
                  size="small"
                  sx={{
                    "& .MuiRating-iconFilled": {
                      color: COLORS.warning,
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ color: COLORS.textLight }}
                >
                  {new Date(review.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          </Box>

          {showActions && isOwner && (
            <Box>
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                sx={{
                  color: COLORS.textLight,
                  "&:hover": {
                    backgroundColor: COLORS.secondaryBg,
                    color: COLORS.primary,
                  },
                }}
              >
                <MoreVert />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    borderRadius: "8px",
                    border: `1px solid ${COLORS.border}`,
                    mt: 1,
                  },
                }}
              >
                <MenuItem onClick={handleEdit}>
                  <Edit sx={{ fontSize: 18, mr: 1 }} />
                  Edit Review
                </MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: COLORS.error }}>
                  <Delete sx={{ fontSize: 18, mr: 1 }} />
                  Delete Review
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>

        {/* Review Title */}
        {review.title && (
          <Typography
            variant="h6"
            sx={{ 
              fontWeight: 600, 
              color: COLORS.text,
              mb: 2 
            }}
          >
            {review.title}
          </Typography>
        )}

        {/* Review Comment */}
        <Typography
          variant="body1"
          sx={{ 
            color: COLORS.text,
            lineHeight: 1.6,
            mb: 2 
          }}
        >
          {shouldTruncate && !isExpanded 
            ? `${comment.substring(0, 200)}...`
            : comment
          }
          {shouldTruncate && (
            <Typography
              component="span"
              onClick={() => setIsExpanded(!isExpanded)}
              sx={{
                color: COLORS.primary,
                fontWeight: 600,
                cursor: "pointer",
                ml: 1,
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {isExpanded ? "Show less" : "Read more"}
            </Typography>
          )}
        </Typography>

        {/* Verified Purchase Badge */}
        {review.isVerified && (
          <Chip
            icon={<CheckCircle sx={{ fontSize: 16 }} />}
            label="Verified Purchase"
            size="small"
            sx={{
              backgroundColor: "#ECFDF5",
              color: "#065F46",
              fontWeight: 500,
              borderRadius: "6px",
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewCard;