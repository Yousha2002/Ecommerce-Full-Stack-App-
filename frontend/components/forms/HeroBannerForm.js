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
  Switch,
  Typography,
  Grid,
  Card,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { CloudUpload, Delete, ColorLens } from "@mui/icons-material";

const COLORS = {
  primary: "#C9B59C",
  lightBg: "#F9F8F6",
  border: "#D9CFC7",
  text: "#5D4037",
};

const HeroBannerForm = ({ banner, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    buttonText: "Shop Now",
    buttonLink: "/products",
    textColor: "#FFFFFF",
    overlayColor: "rgba(0,0,0,0.4)",
    displayOrder: 0,
    isActive: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title,
        description: banner.description,
        buttonText: banner.buttonText,
        buttonLink: banner.buttonLink,
        textColor: banner.textColor,
        overlayColor: banner.overlayColor,
        displayOrder: banner.displayOrder,
        isActive: banner.isActive
      });
      setImagePreview(banner.image);
    }
  }, [banner]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });
    
    if (imageFile) {
      submitData.append('image', imageFile);
    }

    onSubmit(submitData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, color: COLORS.text }}>
              Banner Content
            </Typography>

            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              required
              sx={{ mb: 3 }}
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Button Text"
                  name="buttonText"
                  value={formData.buttonText}
                  onChange={handleChange}
                  sx={{ mb: 3 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Button Link"
                  name="buttonLink"
                  value={formData.buttonLink}
                  onChange={handleChange}
                  sx={{ mb: 3 }}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Display Order"
              name="displayOrder"
              type="number"
              value={formData.displayOrder}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            <FormControlLabel
              control={
                <Switch
                  name="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    isActive: e.target.checked
                  }))}
                />
              }
              label="Active Banner"
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, color: COLORS.text }}>
              Banner Image
            </Typography>

            {imagePreview ? (
              <Box sx={{ position: 'relative', mb: 2 }}>
                <img
                  src={imagePreview}
                  alt="Banner preview"
                  style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <IconButton
                  sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'white' }}
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview("");
                  }}
                >
                  <Delete />
                </IconButton>
              </Box>
            ) : (
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
                fullWidth
                sx={{ height: '150px', borderStyle: 'dashed', mb: 2 }}
              >
                Upload Banner Image
                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
              </Button>
            )}

            <Typography variant="caption" sx={{ color: COLORS.textLight }}>
              Recommended: 1920x800px for best results
            </Typography>
          </Card>

          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, color: COLORS.text }}>
              Design Settings
            </Typography>

            <TextField
              fullWidth
              label="Text Color"
              name="textColor"
              value={formData.textColor}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ColorLens sx={{ color: formData.textColor }} />
                  </InputAdornment>
                )
              }}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Overlay Color"
              name="overlayColor"
              value={formData.overlayColor}
              onChange={handleChange}
              helperText="Use rgba for transparency"
              sx={{ mb: 3 }}
            />
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button onClick={onCancel} variant="outlined">
          Cancel
        </Button>
        <Button type="submit" variant="contained" sx={{ bgcolor: COLORS.primary }}>
          {banner ? 'Update Banner' : 'Create Banner'}
        </Button>
      </Box>
    </Box>
  );
};

export default HeroBannerForm;