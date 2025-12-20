"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  Snackbar,
} from "@mui/material";
import { Add, Edit, Delete, Visibility, CalendarToday, Image } from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "../../../../store/hooks";
import {
  fetchComingSoonSections,
  createComingSoon,
  updateComingSoon,
  deleteComingSoon,
  clearComingSoonError,
} from "../../../../store/slices/comingSoonSlice.js";
import ComingSoonForm from "../../../../components/forms/ComingSoonForm";
import ProtectedRoute from "../../../../components/auth/ProtectedRoute";

const COLORS = {
  primary: "#C9B59C",
  lightBg: "#F9F8F6",
  secondaryBg: "#EFE9E3",
  border: "#D9CFC7",
  text: "#5D4037",
  textLight: "#8D6E63",
  success: "#059669",
  error: "#DC2626",
};

export default function AdminComingSoon() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  
  const dispatch = useAppDispatch();
  const { items: comingSoonSections, isLoading, error } = useAppSelector((state) => state.comingSoon);

  useEffect(() => {
    dispatch(fetchComingSoonSections());
  }, [dispatch]);

  const handleOpenDialog = (section = null) => {
    setEditingSection(section);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSection(null);
    dispatch(clearComingSoonError());
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingSection) {
        await dispatch(updateComingSoon({ id: editingSection.id, sectionData: formData })).unwrap();
        setSuccessMessage("Coming soon section updated successfully!");
      } else {
        await dispatch(createComingSoon(formData)).unwrap();
        setSuccessMessage("Coming soon section created successfully!");
      }
      handleCloseDialog();
      dispatch(fetchComingSoonSections());
    } catch (error) {
      console.error('Error submitting coming soon section:', error);
    }
  };

  const handleDelete = async (sectionId) => {
    if (window.confirm("Are you sure you want to delete this coming soon section?")) {
      try {
        await dispatch(deleteComingSoon(sectionId)).unwrap();
        setSuccessMessage("Coming soon section deleted successfully!");
        dispatch(fetchComingSoonSections());
      } catch (error) {
        console.error('Error deleting coming soon section:', error);
      }
    }
  };

  const isSectionActive = (section) => {
    if (!section.isActive) return false;
    
    const now = new Date();
    const startDate = section.startDate ? new Date(section.startDate) : null;
    const endDate = section.endDate ? new Date(section.endDate) : null;

    if (startDate && endDate) {
      return startDate <= now && endDate >= now;
    } else if (startDate) {
      return startDate <= now;
    } else if (endDate) {
      return endDate >= now;
    }
    
    return true;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <ProtectedRoute requireAdmin>
      <Box sx={{ backgroundColor: COLORS.lightBg, minHeight: "100vh", p: 3 }}>
        {/* Header Section */}
        <Card sx={{ p: 4, mb: 4, borderRadius: "16px", backgroundColor: "white" }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'start', lg: 'center' }, gap: 4, mb: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: COLORS.text, mb: 1 }}>
                Coming Soon Sections
              </Typography>
              <Typography variant="body1" sx={{ color: COLORS.textLight }}>
                Manage upcoming product announcements and promotions
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              sx={{
                borderRadius: "12px",
                backgroundColor: COLORS.primary,
                color: "white",
                px: 4,
                py: 1.5,
                fontWeight: 600,
                "&:hover": { backgroundColor: COLORS.text }
              }}
            >
              Create Section
            </Button>
          </Box>
        </Card>

        {/* Success Message */}
        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage("")}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            severity="success" 
            onClose={() => setSuccessMessage("")}
            sx={{ borderRadius: "12px" }}
          >
            {successMessage}
          </Alert>
        </Snackbar>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 4, borderRadius: "12px" }} 
            onClose={() => dispatch(clearComingSoonError())}
          >
            {error}
          </Alert>
        )}

        {/* Coming Soon Sections Table */}
        <Card sx={{ borderRadius: "16px", border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: COLORS.secondaryBg }}>
                <TableRow>
                  <TableCell sx={{ color: COLORS.text, fontWeight: 600 }}>Image</TableCell>
                  <TableCell sx={{ color: COLORS.text, fontWeight: 600 }}>Title</TableCell>
                  <TableCell sx={{ color: COLORS.text, fontWeight: 600 }}>Description</TableCell>
                  <TableCell sx={{ color: COLORS.text, fontWeight: 600 }}>Dates</TableCell>
                  <TableCell sx={{ color: COLORS.text, fontWeight: 600 }}>Order</TableCell>
                  <TableCell sx={{ color: COLORS.text, fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ color: COLORS.text, fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  // Loading Skeletons
                  Array.from(new Array(5)).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Box sx={{ width: 80, height: 60, bgcolor: COLORS.secondaryBg, borderRadius: 1 }} /></TableCell>
                      <TableCell><Box sx={{ width: 120, height: 20, bgcolor: COLORS.secondaryBg, borderRadius: 1 }} /></TableCell>
                      <TableCell><Box sx={{ width: 200, height: 20, bgcolor: COLORS.secondaryBg, borderRadius: 1 }} /></TableCell>
                      <TableCell><Box sx={{ width: 150, height: 20, bgcolor: COLORS.secondaryBg, borderRadius: 1 }} /></TableCell>
                      <TableCell><Box sx={{ width: 50, height: 20, bgcolor: COLORS.secondaryBg, borderRadius: 1 }} /></TableCell>
                      <TableCell><Box sx={{ width: 80, height: 20, bgcolor: COLORS.secondaryBg, borderRadius: 1 }} /></TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Box sx={{ width: 32, height: 32, bgcolor: COLORS.secondaryBg, borderRadius: 1 }} />
                          <Box sx={{ width: 32, height: 32, bgcolor: COLORS.secondaryBg, borderRadius: 1 }} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : comingSoonSections.length > 0 ? (
                  comingSoonSections.map((section) => (
                    <TableRow 
                      key={section.id} 
                      sx={{ 
                        "&:hover": { backgroundColor: COLORS.secondaryBg },
                        opacity: section.isActive ? 1 : 0.7
                      }}
                    >
                      <TableCell>
                        <img
                          src={section.image || "/placeholder-image.jpg"}
                          alt={section.title}
                          style={{ 
                            width: 80, 
                            height: 60, 
                            objectFit: "cover", 
                            borderRadius: 8,
                            border: `1px solid ${COLORS.border}`
                          }}
                          onError={(e) => {
                            e.target.src = "/placeholder-image.jpg";
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: COLORS.text }}>
                          {section.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: COLORS.textLight }}>
                          {section.description.substring(0, 100)}...
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <CalendarToday sx={{ fontSize: 14, color: COLORS.textLight }} />
                            <Typography variant="caption" sx={{ color: COLORS.textLight }}>
                              Start: {formatDate(section.startDate)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <CalendarToday sx={{ fontSize: 14, color: COLORS.textLight }} />
                            <Typography variant="caption" sx={{ color: COLORS.textLight }}>
                              End: {formatDate(section.endDate)}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: COLORS.text, fontWeight: 600 }}>
                          {section.displayOrder}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={isSectionActive(section) ? "Active" : "Inactive"}
                          color={isSectionActive(section) ? "success" : "default"}
                          size="small"
                          sx={{ borderRadius: "8px", fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(section)}
                            sx={{ color: COLORS.primary }}
                            title="Edit"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(section.id)}
                            title="Delete"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Box sx={{ textAlign: "center", py: 8 }}>
                        <Image sx={{ fontSize: 64, color: COLORS.textLight, mb: 2 }} />
                        <Typography variant="h6" sx={{ color: COLORS.text, mb: 2 }}>
                          No coming soon sections found
                        </Typography>
                        <Typography variant="body2" sx={{ color: COLORS.textLight, mb: 4 }}>
                          Create announcement sections for upcoming products
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<Add />}
                          onClick={() => handleOpenDialog()}
                          sx={{
                            borderRadius: "12px",
                            backgroundColor: COLORS.primary,
                            color: "white",
                            "&:hover": { backgroundColor: COLORS.text }
                          }}
                        >
                          Create First Section
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Add/Edit Coming Soon Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: "16px" } }}
        >
          <DialogTitle sx={{ fontWeight: 600, color: COLORS.text }}>
            {editingSection ? "Edit Coming Soon Section" : "Create New Coming Soon Section"}
          </DialogTitle>
          <DialogContent>
            <ComingSoonForm
              section={editingSection}
              onSubmit={handleSubmit}
              onCancel={handleCloseDialog}
            />
          </DialogContent>
        </Dialog>
      </Box>
    </ProtectedRoute>
  );
}