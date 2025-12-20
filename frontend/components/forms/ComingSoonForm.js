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
  Card,
  CardContent,
  Paper,
  InputAdornment,
} from "@mui/material";
import { CloudUpload, Delete, CalendarToday, Palette, Title, Description } from "@mui/icons-material";
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

export default function ComingSoonForm({ section, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    buttonText: "Notify Me",
    buttonLink: "#",
    displayOrder: 0,
    isActive: true,
    backgroundColor: "#FFFFFF",
    textColor: "#000000",
    startDate: "",
    endDate: ""
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (section) {
     
      const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const offset = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() - offset);
        return localDate.toISOString().slice(0, 16);
      };

      setFormData({
        title: section.title || "",
        description: section.description || "",
        buttonText: section.buttonText || "Notify Me",
        buttonLink: section.buttonLink || "#",
        displayOrder: section.displayOrder || 0,
        isActive: section.isActive ?? true,
        backgroundColor: section.backgroundColor || "#FFFFFF",
        textColor: section.textColor || "#000000",
        startDate: section.startDate ? formatDateForInput(section.startDate) : "",
        endDate: section.endDate ? formatDateForInput(section.endDate) : ""
      });
      setImagePreview(section.image || "");
    }
  }, [section]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.description.trim()) errors.description = "Description is required";
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
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
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setFormErrors(prev => ({ ...prev, image: 'Please select an image file' }));
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
        return;
      }
      
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setFormErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview("");
    setFormErrors(prev => ({ ...prev, image: 'Image is required' }));
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
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key]);
        }
      });

      if (image) {
        submitData.append("image", image);
      }

      await onSubmit(submitData);
    } catch (error) {
      setError("Failed to save coming soon section. Please try again.");
      console.error('Submission error:', error);
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
          <Paper elevation={0} sx={{ p: 3, backgroundColor: COLORS.lighterBg, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, color: COLORS.text, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              <Title sx={{ mr: 1 }} />
              Basic Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title *"
                  value={formData.title}
                  onChange={handleInputChange("title")}
                  error={!!formErrors.title}
                  helperText={formErrors.title}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: COLORS.lightBg,
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description *"
                  value={formData.description}
                  onChange={handleInputChange("description")}
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                  required
                  placeholder="Describe what's coming soon..."
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
                  label="Button Text"
                  value={formData.buttonText}
                  onChange={handleInputChange("buttonText")}
                  helperText="Text for the call-to-action button"
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
                  label="Button Link"
                  value={formData.buttonLink}
                  onChange={handleInputChange("buttonLink")}
                  helperText="URL for the button"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: COLORS.lightBg,
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Date Range Section */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 3, backgroundColor: COLORS.lighterBg, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, color: COLORS.text, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              <CalendarToday sx={{ mr: 1 }} />
              Date Range (Optional)
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Start Date & Time"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={handleInputChange("startDate")}
                  InputLabelProps={{ shrink: true }}
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
                  label="End Date & Time"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={handleInputChange("endDate")}
                  error={!!formErrors.endDate}
                  helperText={formErrors.endDate}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: COLORS.lightBg,
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Image Upload Section */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 3, backgroundColor: COLORS.lighterBg, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, color: COLORS.text, fontWeight: 600 }}>
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
                    '&:hover': {
                      backgroundColor: '#B91C1C',
                    }
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
                    border: `2px dashed ${formErrors.image ? COLORS.error : COLORS.border}`,
                    p: 3,
                    borderRadius: 2,
                    width: "100%",
                    color: formErrors.image ? COLORS.error : COLORS.text,
                    backgroundColor: COLORS.lightBg,
                    '&:hover': {
                      backgroundColor: COLORS.secondary,
                      border: `2px dashed ${formErrors.image ? COLORS.error : COLORS.primary}`,
                    }
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

        {/* Settings Section */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 3, backgroundColor: COLORS.lighterBg, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, color: COLORS.text, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              <Palette sx={{ mr: 1 }} />
              Settings
            </Typography>
            
            <Grid container spacing={2}>
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
              </Grid>

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
                  Whether this section is currently visible
                </FormHelperText>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Preview Section */}
        {formData.title && (
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, backgroundColor: COLORS.lighterBg, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, color: COLORS.text, fontWeight: 600 }}>
                Preview
              </Typography>
              <Card
                sx={{
                  borderRadius: 2,
                  background: formData.backgroundColor,
                  color: formData.textColor,
                  border: `2px solid ${COLORS.border}`,
                  overflow: 'hidden',
                  maxWidth: 600,
                  mx: 'auto'
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Grid container spacing={4} alignItems="center">
                    {/* Left Side - Content */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                        {formData.title}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 3, opacity: 0.9, lineHeight: 1.6 }}>
                        {formData.description}
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: formData.textColor,
                          color: formData.backgroundColor,
                          fontWeight: 600,
                          px: 4,
                          '&:hover': {
                            backgroundColor: formData.textColor,
                            opacity: 0.9
                          }
                        }}
                      >
                        {formData.buttonText}
                      </Button>
                    </Grid>
                    
                    {/* Right Side - Image */}
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          width: '100%',
                          height: 200,
                          backgroundColor: COLORS.secondary,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `2px dashed ${COLORS.border}`
                        }}
                      >
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: 8
                            }}
                          />
                        ) : (
                          <Typography sx={{ color: COLORS.textLight }}>
                            Image Preview
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
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
            '&:hover': {
              borderColor: COLORS.text,
              backgroundColor: COLORS.lighterBg
            }
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
            '&:hover': {
              backgroundColor: COLORS.text,
              color: COLORS.lightBg
            },
            '&:disabled': {
              backgroundColor: COLORS.border,
              color: COLORS.text
            }
          }}
        >
          {loading ? "Saving..." : section ? "Update Section" : "Create Section"}
        </Button>
      </Box>
    </Box>
  );
}