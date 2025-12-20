"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  Chip,
  CircularProgress,
} from "@mui/material";
import { Add, Edit, Delete, Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "../../../../lib/axios";
import HeroBannerForm from "../../../../components/forms/HeroBannerForm";
import ProtectedRoute from "../../../../components/auth/ProtectedRoute";

const COLORS = {
  primary: "#C9B59C",
  lightBg: "#F9F8F6",
  secondaryBg: "#EFE9E3",
  border: "#D9CFC7",
  text: "#5D4037",
  textLight: "#8D6E63",
};

export default function AdminHeroBanners() {
  const [banners, setBanners] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get('/hero-banners/admin');
      setBanners(response.data);
    } catch (error) {
      setError('Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingBanner) {
        await axios.put(`/hero-banners/${editingBanner.id}`, formData);
        setSuccess('Banner updated successfully');
      } else {
        await axios.post('/hero-banners', formData);
        setSuccess('Banner created successfully');
      }
      setOpenDialog(false);
      setEditingBanner(null);
      fetchBanners();
    } catch (error) {
      setError('Failed to save banner');
    }
  };

  const handleDelete = async (bannerId) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await axios.delete(`/hero-banners/${bannerId}`);
        setSuccess('Banner deleted successfully');
        fetchBanners();
      } catch (error) {
        setError('Failed to delete banner');
      }
    }
  };

  const toggleBannerStatus = async (banner) => {
    try {
      const formData = new FormData();
      formData.append('isActive', !banner.isActive);
      
      await axios.put(`/hero-banners/${banner.id}`, formData);
      setSuccess(`Banner ${!banner.isActive ? 'activated' : 'deactivated'} successfully`);
      fetchBanners();
    } catch (error) {
      setError('Failed to update banner status');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress sx={{ color: COLORS.primary }} />
      </Box>
    );
  }

  return (
    <ProtectedRoute requireAdmin>
    <Box sx={{ backgroundColor: COLORS.lightBg, minHeight: '100vh', p: 3 }}>
      {/* Header */}
      <Card sx={{ p: 4, mb: 4, borderRadius: '16px' }}>
        <Box className="flex justify-between items-center mb-6">
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: COLORS.text }}>
              Hero Banners Management
            </Typography>
            <Typography sx={{ color: COLORS.textLight }}>
              Manage homepage hero banner slides ({banners.length} banners)
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
            sx={{
              backgroundColor: COLORS.primary,
              '&:hover': { backgroundColor: COLORS.text }
            }}
          >
            Add New Banner
          </Button>
        </Box>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 4 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Banners Grid */}
      {banners.length === 0 ? (
        <Card sx={{ p: 8, textAlign: 'center', borderRadius: '16px' }}>
          <Typography variant="h6" sx={{ color: COLORS.textLight, mb: 2 }}>
            No banners found
          </Typography>
          <Typography sx={{ color: COLORS.textLight, mb: 4 }}>
            Create your first hero banner to display on the homepage
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
            sx={{
              backgroundColor: COLORS.primary,
              '&:hover': { backgroundColor: COLORS.text }
            }}
          >
            Create First Banner
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {banners.map((banner) => (
            <Grid item xs={12} md={6} lg={4} key={banner.id}>
              <Card sx={{ 
                borderRadius: '16px', 
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                }
              }}>
                <Box sx={{ position: 'relative', height: '200px' }}>
                  <img
                    src={banner.image}
                    alt={banner.title}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }}
                  />
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0,
                    background: banner.overlayColor || 'rgba(0,0,0,0.3)'
                  }} />
                  
                  {/* Banner Info Overlay */}
                  <Box sx={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    left: 0, 
                    right: 0, 
                    p: 2,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    color: 'white'
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                      {banner.title}
                    </Typography>
                    {banner.subtitle && (
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {banner.subtitle}
                      </Typography>
                    )}
                  </Box>

                  {/* Status Badge */}
                  <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
                    <Chip
                      label={banner.isActive ? 'Active' : 'Inactive'}
                      color={banner.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>

                  {/* Position Badge */}
                  <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                    <Chip
                      label={`Order: ${banner.position}`}
                      variant="outlined"
                      size="small"
                      sx={{ 
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        fontWeight: 600
                      }}
                    />
                  </Box>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ 
                  p: 2, 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'white'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ color: COLORS.textLight }}>
                      {new Date(banner.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => toggleBannerStatus(banner)}
                      color={banner.isActive ? "success" : "default"}
                    >
                      {banner.isActive ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setEditingBanner(banner);
                        setOpenDialog(true);
                      }}
                      sx={{ color: COLORS.primary }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(banner.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditingBanner(null);
        }}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '16px' }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: COLORS.lightBg,
          borderBottom: `1px solid ${COLORS.border}`
        }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: COLORS.text }}>
            {editingBanner ? 'Edit Banner' : 'Create New Banner'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <HeroBannerForm
            banner={editingBanner}
            onSubmit={handleSubmit}
            onCancel={() => {
              setOpenDialog(false);
              setEditingBanner(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
    </ProtectedRoute>
  );
}