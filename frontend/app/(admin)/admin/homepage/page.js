"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  Switch,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Grid,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  DragIndicator,
  Reorder,
} from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "../../../../store/hooks";
import {
  fetchAllSections,
  createSection,
  updateSection,
  deleteSection,
  clearError,
} from "../../../../store/slices/homeSectionSlice";
import ProtectedRoute from "../../../../components/auth/ProtectedRoute";

const sectionTypes = [
  { value: 'hero_banner', label: 'Hero Banner' },
  { value: 'category_navigation', label: 'Category Navigation' },
  { value: 'new_brands', label: 'New Brands' },
  { value: 'trending_products', label: 'Trending Products' },
  { value: 'best_selling', label: 'Best Selling' },
  { value: 'popular_products', label: 'Popular Products' },
  { value: 'new_arrivals', label: 'New Arrivals' },
  { value: 'flash_sale', label: 'Flash Sale' },
  { value: 'featured_collections', label: 'Featured Collections' },
  { value: 'testimonials', label: 'Testimonials' },
];

export default function AdminHomeSections() {
  const dispatch = useAppDispatch();
  const { allSections, isLoading, error } = useAppSelector((state) => state.homeSections);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({
    sectionType: '',
    title: '',
    subtitle: '',
    displayOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    dispatch(fetchAllSections());
  }, [dispatch]);

  const handleOpenDialog = (section = null) => {
    if (section) {
      setEditingSection(section);
      setFormData({
        sectionType: section.sectionType,
        title: section.title,
        subtitle: section.subtitle || '',
        displayOrder: section.displayOrder,
        isActive: section.isActive,
      });
    } else {
      setEditingSection(null);
      setFormData({
        sectionType: '',
        title: '',
        subtitle: '',
        displayOrder: allSections.length,
        isActive: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSection(null);
    dispatch(clearError());
  };

  const handleSubmit = async () => {
    try {
      if (editingSection) {
        await dispatch(updateSection({
          id: editingSection.id,
          sectionData: formData
        })).unwrap();
      } else {
        await dispatch(createSection(formData)).unwrap();
      }
      handleCloseDialog();
      dispatch(fetchAllSections());
    } catch (error) {
      console.error('Error saving section:', error);
    }
  };

  const handleDelete = async (sectionId) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      try {
        await dispatch(deleteSection(sectionId));
        dispatch(fetchAllSections());
      } catch (error) {
        console.error('Error deleting section:', error);
      }
    }
  };

  const handleToggleActive = async (section) => {
    try {
      await dispatch(updateSection({
        id: section.id,
        sectionData: { isActive: !section.isActive }
      })).unwrap();
      dispatch(fetchAllSections());
    } catch (error) {
      console.error('Error updating section:', error);
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Homepage Sections Management
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage which sections appear on your homepage and their order
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearError())}>
            {error}
          </Alert>
        )}

        {/* Add Section Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{ borderRadius: 2 }}
          >
            Add New Section
          </Button>
        </Box>

        {/* Sections Grid */}
        <Grid container spacing={3}>
          {allSections.map((section) => (
            <Grid item xs={12} md={6} key={section.id}>
              <Card sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {section.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {sectionTypes.find(st => st.value === section.sectionType)?.label}
                    </Typography>
                    {section.subtitle && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {section.subtitle}
                      </Typography>
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Switch
                      checked={section.isActive}
                      onChange={() => handleToggleActive(section)}
                      color="success"
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(section)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(section.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="textSecondary">
                    Order: {section.displayOrder}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: section.isActive ? 'success.light' : 'grey.300',
                      color: section.isActive ? 'success.dark' : 'grey.600',
                      fontWeight: 600,
                    }}
                  >
                    {section.isActive ? 'Active' : 'Inactive'}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Empty State */}
        {allSections.length === 0 && !isLoading && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
              No sections configured yet
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
            >
              Create First Section
            </Button>
          </Box>
        )}

        {/* Add/Edit Section Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingSection ? 'Edit Section' : 'Add New Section'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Section Type</InputLabel>
                <Select
                  value={formData.sectionType}
                  label="Section Type"
                  onChange={(e) => setFormData({ ...formData, sectionType: e.target.value })}
                >
                  {sectionTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                fullWidth
              />

              <TextField
                label="Subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                fullWidth
                multiline
                rows={2}
              />

              <TextField
                label="Display Order"
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              disabled={!formData.sectionType || !formData.title}
            >
              {editingSection ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ProtectedRoute>
  );
}