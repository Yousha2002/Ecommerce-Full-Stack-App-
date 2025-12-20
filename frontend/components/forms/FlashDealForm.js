"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  FormControlLabel,
  Switch,
  FormHelperText,
  Chip,
  Card,
  CardContent,
  Paper,
  InputAdornment,
} from "@mui/material";
import {
  CloudUpload,
  Delete,
  Discount,
  CalendarToday,
  Link,
  Palette,
} from "@mui/icons-material";
import axios from "../../lib/axios";

const COLORS = {
  primary: "#C9B59C",
  secondary: "#D9CFC7",
  lightBg: "#F9F8F6",
  lighterBg: "#EFE9E3",
  border: "#D9CFC7",
  text: "#5D4037",
  error: "#DC2626",
};

export default function FlashDealForm({ deal, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discountPercentage: "",
    startDate: "",
    endDate: "",
    buttonText: "Shop Now",
    buttonLink: "/products",
    targetUrl: "/products",
    displayOrder: 0,
    isActive: true,
    backgroundColor: "#C9B59C",
    textColor: "#FFFFFF",
    oldPrice: "", // Naya field
    currentPrice: "", // Naya field
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (deal) {
      // Format dates for datetime-local input
      const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        const offset = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() - offset);
        return localDate.toISOString().slice(0, 16);
      };

      setFormData({
        title: deal.title || "",
        description: deal.description || "",
        discountPercentage: deal.discountPercentage || "",
        startDate: deal.startDate ? formatDateForInput(deal.startDate) : "",
        endDate: deal.endDate ? formatDateForInput(deal.endDate) : "",
        buttonText: deal.buttonText || "Shop Now",
        buttonLink: deal.buttonLink || "/products",
        targetUrl: deal.targetUrl || "/products",
        displayOrder: deal.displayOrder || 0,
        isActive: deal.isActive ?? true,
        backgroundColor: deal.backgroundColor || "#C9B59C",
        textColor: deal.textColor || "#FFFFFF",
        oldPrice: deal.oldPrice || "", // Naya field
        currentPrice: deal.currentPrice || "", // Naya field
      });
      setImagePreview(deal.image || "");
    }
  }, [deal]);

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) errors.title = "Title is required";
    if (
      !formData.discountPercentage ||
      formData.discountPercentage < 1 ||
      formData.discountPercentage > 100
    ) {
      errors.discountPercentage =
        "Discount percentage must be between 1 and 100";
    }
    if (!formData.startDate) errors.startDate = "Start date is required";
    if (!formData.endDate) errors.endDate = "End date is required";
    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.startDate) >= new Date(formData.endDate)
    ) {
      errors.endDate = "End date must be after start date";
    }
    if (!image && !imagePreview) errors.image = "Image is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setFormErrors((prev) => ({
          ...prev,
          image: "Please select an image file",
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setFormErrors((prev) => ({
          ...prev,
          image: "Image size should be less than 5MB",
        }));
        return;
      }

      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setFormErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview("");
    setFormErrors((prev) => ({ ...prev, image: "Image is required" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const submitData = new FormData();

      // Append all form data
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key]);
        }
      });

      // Append image
      if (image) {
        submitData.append("image", image);
      }

      await onSubmit(submitData);
    } catch (error) {
      setError("Failed to save flash deal. Please try again.");
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Basic Information Section */}
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{ p: 3, backgroundColor: COLORS.lighterBg, borderRadius: 2 }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: COLORS.text,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Discount sx={{ mr: 1 }} />
              Basic Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Title *"
                  value={formData.title}
                  onChange={handleInputChange("title")}
                  error={!!formErrors.title}
                  helperText={formErrors.title}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: COLORS.lightBg,
                    },
                  }}
                />
              </Grid>

              {/* Naye price fields */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Original Price"
                  type="number"
                  value={formData.oldPrice}
                  onChange={handleInputChange("oldPrice")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  inputProps={{ min: 0, step: "0.01" }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: COLORS.lightBg,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Sale Price"
                  type="number"
                  value={formData.currentPrice}
                  onChange={handleInputChange("currentPrice")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  inputProps={{ min: 0, step: "0.01" }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: COLORS.lightBg,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Discount Percentage *"
                  type="number"
                  value={formData.discountPercentage}
                  onChange={handleInputChange("discountPercentage")}
                  error={!!formErrors.discountPercentage}
                  helperText={formErrors.discountPercentage}
                  required
                  inputProps={{ min: 1, max: 100 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: COLORS.lightBg,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={formData.description}
                  onChange={handleInputChange("description")}
                  placeholder="Describe your flash sale offer..."
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: COLORS.lightBg,
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Date Range Section */}
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{ p: 3, backgroundColor: COLORS.lighterBg, borderRadius: 2 }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: COLORS.text,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
              }}
            >
              <CalendarToday sx={{ mr: 1 }} />
              Date Range
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Start Date & Time *"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={handleInputChange("startDate")}
                  error={!!formErrors.startDate}
                  helperText={formErrors.startDate}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: COLORS.lightBg,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="End Date & Time *"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={handleInputChange("endDate")}
                  error={!!formErrors.endDate}
                  helperText={formErrors.endDate}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: COLORS.lightBg,
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Image Upload Section */}
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{ p: 3, backgroundColor: COLORS.lighterBg, borderRadius: 2 }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, color: COLORS.text, fontWeight: 600 }}
            >
              Image *
            </Typography>

            {imagePreview ? (
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: 200,
                    height: 150,
                    objectFit: "cover",
                    borderRadius: 8,
                    border: `2px solid ${COLORS.border}`,
                  }}
                />
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={removeImage}
                  sx={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    minWidth: 30,
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    backgroundColor: COLORS.error,
                    "&:hover": {
                      backgroundColor: "#B91C1C",
                    },
                  }}
                >
                  <Delete fontSize="small" />
                </Button>
              </Box>
            ) : (
              <Box>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUpload />}
                  sx={{
                    border: `2px dashed ${
                      formErrors.image ? COLORS.error : COLORS.border
                    }`,
                    p: 3,
                    borderRadius: 2,
                    width: "100%",
                    color: formErrors.image ? COLORS.error : COLORS.text,
                    backgroundColor: COLORS.lightBg,
                    "&:hover": {
                      backgroundColor: COLORS.secondary,
                      border: `2px dashed ${
                        formErrors.image ? COLORS.error : COLORS.primary
                      }`,
                    },
                  }}
                >
                  Upload Image (Required)
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
                {formErrors.image && (
                  <FormHelperText error sx={{ mt: 1 }}>
                    {formErrors.image}
                  </FormHelperText>
                )}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* URL Settings Section */}
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{ p: 3, backgroundColor: COLORS.lighterBg, borderRadius: 2 }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: COLORS.text,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Link sx={{ mr: 1 }} />
              URL Settings
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Button Text"
                  value={formData.buttonText}
                  onChange={handleInputChange("buttonText")}
                  helperText="Text for the call-to-action button"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: COLORS.lightBg,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Target URL"
                  value={formData.targetUrl}
                  onChange={handleInputChange("targetUrl")}
                  helperText="Where users will be redirected"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: COLORS.lightBg,
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Design Settings Section */}
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{ p: 3, backgroundColor: COLORS.lighterBg, borderRadius: 2 }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: COLORS.text,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Palette sx={{ mr: 1 }} />
              Settings
            </Typography>

            <Grid container spacing={2}>
              {/* <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Background Color"
                  type="color"
                  value={formData.backgroundColor}
                  onChange={handleInputChange("backgroundColor")}
                  helperText="Background color for the sale"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: COLORS.lightBg,
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Text Color"
                  type="color"
                  value={formData.textColor}
                  onChange={handleInputChange("textColor")}
                  helperText="Text color for the sale"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: COLORS.lightBg,
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Display Order"
                  value={formData.displayOrder}
                  onChange={handleInputChange("displayOrder")}
                  helperText="Lower numbers appear first"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: COLORS.lightBg,
                    }
                  }}
                />
              </Grid> */}

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isActive: e.target.checked,
                        }))
                      }
                      color="default"
                    />
                  }
                  label="Active"
                />
                <FormHelperText>
                  Whether this flash sale is currently active
                </FormHelperText>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Preview Section */}
        {formData.title && (
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{ p: 3, backgroundColor: COLORS.lighterBg, borderRadius: 2 }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 2, color: COLORS.text, fontWeight: 600 }}
              >
                Preview
              </Typography>
              <Card
                sx={{
                  borderRadius: 2,
                  background: formData.backgroundColor,
                  color: formData.textColor,
                  textAlign: "center",
                  border: `2px solid ${COLORS.border}`,
                  overflow: "hidden",
                  maxWidth: 400,
                  mx: "auto",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    {formData.title}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                    {formData.description || "Flash sale description"}
                  </Typography>
                  <Chip
                    label={`${formData.discountPercentage || 0}% OFF`}
                    sx={{
                      backgroundColor: formData.textColor,
                      color: formData.backgroundColor,
                      fontWeight: 700,
                      fontSize: "1rem",
                      py: 1,
                    }}
                  />
                  <Button
                    variant="contained"
                    sx={{
                      mt: 2,
                      backgroundColor: formData.textColor,
                      color: formData.backgroundColor,
                      fontWeight: 600,
                      "&:hover": {
                        backgroundColor: formData.textColor,
                        opacity: 0.9,
                      },
                    }}
                  >
                    {formData.buttonText}
                  </Button>
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        )}
      </Grid>

      <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={loading}
          sx={{
            borderColor: COLORS.primary,
            color: COLORS.primary,
            "&:hover": {
              borderColor: COLORS.text,
              backgroundColor: COLORS.lighterBg,
            },
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            backgroundColor: COLORS.primary,
            color: COLORS.text,
            fontWeight: 600,
            px: 3,
            "&:hover": {
              backgroundColor: COLORS.text,
              color: COLORS.lightBg,
            },
            "&:disabled": {
              backgroundColor: COLORS.border,
              color: COLORS.text,
            },
          }}
        >
          {loading ? "Saving..." : deal ? "Update Deal" : "Create Deal"}
        </Button>
      </Box>
    </Box>
  );
}
