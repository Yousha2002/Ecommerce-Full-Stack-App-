

"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Typography,
  Grid,
  Paper,
  Alert,
  InputAdornment,
  Chip,
  IconButton,
  Card,
  CardMedia,
  Divider,
  CircularProgress,
  FormLabel,
  Switch
 
} from "@mui/material";
import {
  CloudUpload,
  Delete,
  AttachMoney,
  Inventory,
  Category,
  Code,
  LocalOffer,
  Visibility,
} from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "../../store/hooks";

const COLORS = {
  primary: "#C9B59C",
  lightBg: "#F9F8F6",
  secondaryBg: "#EFE9E3",
  border: "#D9CFC7",
  text: "#5D4037",
  textLight: "#8D6E63",
  success: "#10B981",
  error: "#EF4444",
};

const ProductForm = ({ product, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    comparePrice: "",
    categoryId: "",
    stock: "",
    sku: "",
    isFeatured: false,
    discount: product?.discount || 0,
    isNew: product?.isNew || false,
    discountStartDate: product?.discountStartDate || "",
    discountEndDate: product?.discountEndDate || "",
    newUntil: product?.newUntil || "",
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const { items: categories } = useAppSelector((state) => state.categories);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        comparePrice: product.comparePrice || "",
        categoryId: product.categoryId,
        stock: product.stock,
        sku: product.sku,
        isFeatured: product.isFeatured,
      });
      setImagePreviews(product.images || []);
    }
  }, [product]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (error[name]) {
      setError((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleDiscountChange = (e) => {
    const value = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
    setFormData((prev) => ({ ...prev, discount: value }));
  };
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB");
        return false;
      }
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed");
        return false;
      }
      return true;
    });

    const newImages = [...images, ...validFiles];
    setImages(newImages);

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setError("");
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.price || !formData.categoryId) {
      setError("Please fill all required fields");
      return;
    }

    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== "" && formData[key] !== null) {
        submitData.append(key, formData[key]);
      }
    });

    images.forEach((image) => {
      submitData.append("images", image);
    });

    onSubmit(submitData);
  };

  const hasDiscount =
    formData.comparePrice &&
    parseFloat(formData.comparePrice) > parseFloat(formData.price);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ backgroundColor: COLORS.lightBg }}
    >
      {error && (
        <Alert
          severity="error"
          sx={{
            m: 3,
            mb: 0,
            borderRadius: "12px",
            border: `1px solid ${COLORS.error}`,
          }}
        >
          {error}
        </Alert>
      )}
      <Grid container spacing={3} sx={{ p: 3 }}>
        <Grid item xs={12} md={8}>
          {/* Product Information Card */}
          <Card
            sx={{
              p: 4,
              borderRadius: "16px",
              border: `1px solid ${COLORS.border}`,
              mb: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: COLORS.text,
                fontWeight: 600,
                mb: 3,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Inventory sx={{ color: COLORS.primary }} />
              Product Information
            </Typography>

            <TextField
              fullWidth
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: COLORS.lightBg,
                  "&:hover fieldset": { borderColor: COLORS.primary },
                  "&.Mui-focused fieldset": { borderColor: COLORS.primary },
                },
              }}
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              multiline
              rows={4}
              placeholder="Describe your product features, benefits, and specifications..."
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: COLORS.lightBg,
                  "&:hover fieldset": { borderColor: COLORS.primary },
                  "&.Mui-focused fieldset": { borderColor: COLORS.primary },
                },
              }}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  inputProps={{ step: "0.01", min: "0" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney sx={{ color: COLORS.textLight }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: COLORS.lightBg,
                      "&:hover fieldset": { borderColor: COLORS.primary },
                      "&.Mui-focused fieldset": { borderColor: COLORS.primary },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Compare Price"
                  name="comparePrice"
                  type="number"
                  value={formData.comparePrice}
                  onChange={handleInputChange}
                  inputProps={{ step: "0.01", min: "0" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney sx={{ color: COLORS.textLight }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: COLORS.lightBg,
                      "&:hover fieldset": { borderColor: COLORS.primary },
                      "&.Mui-focused fieldset": { borderColor: COLORS.primary },
                    },
                  }}
                />
                {hasDiscount && (
                  <Chip
                    label={`Save $${(
                      parseFloat(formData.comparePrice) -
                      parseFloat(formData.price)
                    ).toFixed(2)}`}
                    color="success"
                    size="small"
                    sx={{ mt: 1, borderRadius: "8px" }}
                  />
                )}
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Stock Quantity"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  inputProps={{ min: "0" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Inventory sx={{ color: COLORS.textLight }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: COLORS.lightBg,
                      "&:hover fieldset": { borderColor: COLORS.primary },
                      "&.Mui-focused fieldset": { borderColor: COLORS.primary },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="SKU"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  placeholder="Auto-generated if empty"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Code sx={{ color: COLORS.textLight }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: COLORS.lightBg,
                      "&:hover fieldset": { borderColor: COLORS.primary },
                      "&.Mui-focused fieldset": { borderColor: COLORS.primary },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Settings Card */}
          <Card
            sx={{
              p: 4,
              borderRadius: "16px",
              border: `1px solid ${COLORS.border}`,
              mb: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: COLORS.text,
                fontWeight: 600,
                mb: 3,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Category sx={{ color: COLORS.primary }} />
              Settings
            </Typography>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Category</InputLabel>
              <Select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                required
                label="Category"
                sx={{
                  borderRadius: "12px",
                  backgroundColor: COLORS.lightBg,
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: COLORS.primary,
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: COLORS.primary,
                  },
                }}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  sx={{
                    color: COLORS.primary,
                    "&.Mui-checked": {
                      color: COLORS.primary,
                    },
                  }}
                />
              }
              label="Featured Product"
              sx={{ color: COLORS.text }}
            />
          </Card>

          {/* Product Images Card */}
          <Card
            sx={{
              p: 4,
              borderRadius: "16px",
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: COLORS.text,
                fontWeight: 600,
                mb: 3,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <CloudUpload sx={{ color: COLORS.primary }} />
              Product Images
            </Typography>

            <Alert
              severity="info"
              sx={{
                mb: 3,
                borderRadius: "12px",
                backgroundColor: COLORS.secondaryBg,
                color: COLORS.text,
                border: `1px solid ${COLORS.border}`,
              }}
            >
              Images are stored locally for now.
            </Alert>

            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              fullWidth
              sx={{
                borderRadius: "12px",
                border: `2px dashed ${COLORS.border}`,
                color: COLORS.text,
                backgroundColor: COLORS.lightBg,
                py: 2,
                mb: 3,
                "&:hover": {
                  borderColor: COLORS.primary,
                  backgroundColor: COLORS.secondaryBg,
                },
              }}
            >
              Upload Images
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>

            <Box className="grid grid-cols-2 gap-3">
              {imagePreviews.map((preview, index) => (
                <Card
                  key={index}
                  sx={{
                    position: "relative",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={preview}
                    alt={`Preview ${index}`}
                    sx={{ height: 80 }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      backgroundColor: "white",
                      "&:hover": { backgroundColor: COLORS.secondaryBg },
                    }}
                    onClick={() => removeImage(index)}
                  >
                    <Delete fontSize="small" sx={{ color: COLORS.error }} />
                  </IconButton>
                </Card>
              ))}
            </Box>

            {imagePreviews.length > 0 && (
              <Typography
                variant="caption"
                sx={{ color: COLORS.textLight, mt: 2, display: "block" }}
              >
                {imagePreviews.length} image(s) selected
              </Typography>
            )}
          </Card>
        </Grid>
      </Grid>
      <Box
        sx={{
          mt: 4,
          p: 4,
          borderRadius: 3,
          background: COLORS.secondaryBg,
          boxShadow: "0px 4px 18px rgba(0,0,0,0.06)",
          border: `1px solid ${COLORS.border}`,
        }}
      >
        {/* Section Heading */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 3,
            pb: 2,
            borderBottom: `1px solid ${COLORS.border}`,
          }}
        >
          <LocalOffer sx={{ color: COLORS.primary }} />
          <Typography variant="h6" sx={{ color: COLORS.text, fontWeight: 700 }}>
            Discount & New Arrival Settings
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Discount Settings */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: "white",
                border: `1px solid ${COLORS.border}`,
                boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <Typography
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  color: COLORS.text,
                  fontSize: "1rem",
                }}
              >
                Discount Settings
              </Typography>

              <FormControl fullWidth>
                <FormLabel sx={{ color: COLORS.text, mb: 1, fontWeight: 500 }}>
                  Discount Percentage
                </FormLabel>
                <TextField
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleDiscountChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#fff",
                      borderRadius: "10px",
                    },
                  }}
                />
              </FormControl>

              {/* Switch */}
              <Box
                sx={{
                  mt: 3,
                  backgroundColor: COLORS.secondaryBg,
                  p: 2,
                  borderRadius: 2,
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.discount > 0}
                      onChange={(e) => {
                        if (!e.target.checked) {
                          setFormData((prev) => ({
                            ...prev,
                            discount: 0,
                            discountStartDate: "",
                            discountEndDate: "",
                          }));
                        }
                      }}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: COLORS.success,
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: COLORS.success,
                          },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ color: COLORS.text, fontWeight: 600 }}>
                      Enable Discount
                    </Typography>
                  }
                />
              </Box>

              {/* Discount Dates */}
              {formData.discount > 0 && (
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      type="date"
                      label="Start Date"
                      name="discountStartDate"
                      value={formData.discountStartDate}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      type="date"
                      label="End Date"
                      name="discountEndDate"
                      value={formData.discountEndDate}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              )}
            </Box>
          </Grid>

          {/* New Arrival Settings */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: "white",
                border: `1px solid ${COLORS.border}`,
                boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <Typography
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  color: COLORS.text,
                  fontSize: "1rem",
                }}
              >
                New Arrival Settings
              </Typography>

              <FormControl fullWidth>
                <FormControlLabel
                  control={
                    <Switch
                      name="isNew"
                      checked={formData.isNew}
                      onChange={handleChange}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: COLORS.primary,
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: COLORS.primary,
                          },
                      }}
                    />
                  }
                  label={
                    <Box>
                      <Typography sx={{ fontWeight: 600, color: COLORS.text }}>
                        Mark as New Arrival
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: COLORS.textLight }}
                      >
                        Displays “NEW” badge on product
                      </Typography>
                    </Box>
                  }
                />
              </FormControl>

              {formData.isNew && (
                <TextField
                  type="date"
                  label="New Until"
                  name="newUntil"
                  value={formData.newUntil}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={{ mt: 2 }}
                />
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Preview Section */}
        {(formData.discount > 0 || formData.isNew) && (
          <Box
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 2,
              backgroundColor: "white",
              border: `1px solid ${COLORS.border}`,
              boxShadow: "0px 3px 12px rgba(0,0,0,0.05)",
            }}
          >
            <Typography
              sx={{
                mb: 2,
                fontWeight: 600,
                color: COLORS.text,
                fontSize: "0.95rem",
              }}
            >
              Preview On Product:
            </Typography>

            <Box sx={{ display: "flex", gap: 1 }}>
              {formData.isNew && (
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    backgroundColor: COLORS.success,
                    color: "white",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  NEW
                </Box>
              )}

              {formData.discount > 0 && (
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    backgroundColor: COLORS.error,
                    color: "white",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  {formData.discount}% OFF
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
      {/* Section Visibility Control */}
      <Card
        sx={{
          p: 4,
          borderRadius: "16px",
          border: `1px solid ${COLORS.border}`,
          mb: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: COLORS.text,
            fontWeight: 600,
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Visibility sx={{ color: COLORS.primary }} />
          Frontend Section Visibility
        </Typography>

        <Grid container spacing={3}>
          {/* <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  name="showInHeroBanner"
                  checked={formData.showInHeroBanner}
                  onChange={handleInputChange}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: COLORS.primary,
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: COLORS.primary,
                    },
                  }}
                />
              }
              label={
                <Box>
                  <Typography sx={{ fontWeight: 600, color: COLORS.text }}>
                    Show in Hero Banner
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: COLORS.textLight }}
                  >
                    Display in main slider on homepage
                  </Typography>
                </Box>
              }
            />

            {formData.showInHeroBanner && (
              <TextField
                fullWidth
                label="Banner Order"
                name="heroBannerOrder"
                type="number"
                value={formData.heroBannerOrder}
                onChange={handleInputChange}
                sx={{ mt: 2, mb: 2 }}
              />
            )}
          </Grid> */}

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  name="showInNewArrivals"
                  checked={formData.showInNewArrivals}
                  onChange={handleInputChange}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: COLORS.primary,
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: COLORS.primary,
                    },
                  }}
                />
              }
              label={
                <Box>
                  <Typography sx={{ fontWeight: 600, color: COLORS.text }}>
                    Show in New Arrivals
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: COLORS.textLight }}
                  >
                    Display in new arrivals section
                  </Typography>
                </Box>
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  name="showInTrending"
                  checked={formData.showInTrending}
                  onChange={handleInputChange}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: COLORS.primary,
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: COLORS.primary,
                    },
                  }}
                />
              }
              label={
                <Box>
                  <Typography sx={{ fontWeight: 600, color: COLORS.text }}>
                    Show in Trending
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: COLORS.textLight }}
                  >
                    Display in trending products section
                  </Typography>
                </Box>
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  name="showInBestSelling"
                  checked={formData.showInBestSelling}
                  onChange={handleInputChange}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: COLORS.primary,
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: COLORS.primary,
                    },
                  }}
                />
              }
              label={
                <Box>
                  <Typography sx={{ fontWeight: 600, color: COLORS.text }}>
                    Show in Best Selling
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: COLORS.textLight }}
                  >
                    Display in best selling section
                  </Typography>
                </Box>
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  name="showInMostPopular"
                  checked={formData.showInMostPopular}
                  onChange={handleInputChange}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: COLORS.primary,
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: COLORS.primary,
                    },
                  }}
                />
              }
              label={
                <Box>
                  <Typography sx={{ fontWeight: 600, color: COLORS.text }}>
                    Show in Most Popular
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: COLORS.textLight }}
                  >
                    Display in most popular section
                  </Typography>
                </Box>
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  name="showInFeatured"
                  checked={formData.showInFeatured}
                  onChange={handleInputChange}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: COLORS.primary,
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: COLORS.primary,
                    },
                  }}
                />
              }
              label={
                <Box>
                  <Typography sx={{ fontWeight: 600, color: COLORS.text }}>
                    Show in Featured
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: COLORS.textLight }}
                  >
                    Display in featured products section
                  </Typography>
                </Box>
              }
            />
          </Grid>
        </Grid>
      </Card>
      {/* Form Actions */}
      <Box
        sx={{
          p: 3,
          borderTop: `0px solid ${COLORS.border}`,
          backgroundColor: "white",
          borderBottomLeftRadius: "16px",
          borderBottomRightRadius: "16px",
        }}
      >
        <Box className="flex justify-end gap-2 space-x-3">
          <Button
            onClick={onCancel}
            variant="outlined"
            disabled={isLoading}
            sx={{
              borderRadius: "12px",
              borderColor: COLORS.border,
              color: COLORS.text,
              px: 4,
              "&:hover": {
                borderColor: COLORS.primary,
                backgroundColor: COLORS.secondaryBg,
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={16} /> : null}
            sx={{
              borderRadius: "12px",
              backgroundColor: COLORS.primary,
              color: "white",
              px: 4,
              "&:hover": {
                backgroundColor: COLORS.text,
              },
              "&:disabled": {
                backgroundColor: COLORS.border,
              },
            }}
          >
            {isLoading
              ? "Saving..."
              : product
              ? "Update Product"
              : "Create Product"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductForm;
