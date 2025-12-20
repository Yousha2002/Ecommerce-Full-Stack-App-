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
import { Add, Edit, Delete, LocalOffer, Timer, Visibility, ContentCopy } from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "../../../../store/hooks";
import {
  fetchFlashDeals,
  createFlashDeal,
  updateFlashDeal,
  deleteFlashDeal,
  clearFlashDealError,
} from "../../../../store/slices/flashDealSlice";
import FlashDealForm from "../../../../components/forms/FlashDealForm";
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

export default function AdminFlashDeals() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  
  const dispatch = useAppDispatch();
  const { items: flashDeals, isLoading, error } = useAppSelector((state) => state.flashDeals);

  useEffect(() => {
    dispatch(fetchFlashDeals());
  }, [dispatch]);

  const handleOpenDialog = (deal = null) => {
    setEditingDeal(deal);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDeal(null);
    dispatch(clearFlashDealError());
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingDeal) {
        await dispatch(updateFlashDeal({ id: editingDeal.id, dealData: formData })).unwrap();
        setSuccessMessage("Flash deal updated successfully!");
      } else {
        await dispatch(createFlashDeal(formData)).unwrap();
        setSuccessMessage("Flash deal created successfully!");
      }
      handleCloseDialog();
      dispatch(fetchFlashDeals());
    } catch (error) {
      console.error('Error submitting flash deal:', error);
    }
  };

  const handleDelete = async (dealId) => {
    if (window.confirm("Are you sure you want to delete this flash deal?")) {
      try {
        await dispatch(deleteFlashDeal(dealId)).unwrap();
        setSuccessMessage("Flash deal deleted successfully!");
        dispatch(fetchFlashDeals());
      } catch (error) {
        console.error('Error deleting flash deal:', error);
      }
    }
  };

  const handleViewDetails = (deal) => {
    window.open(`/flash-sales/${deal.id}`, '_blank');
  };

  const handleCopyLink = (deal) => {
    const url = `${window.location.origin}/flash-sales/${deal.id}`;
    navigator.clipboard.writeText(url);
    setSuccessMessage("Link copied to clipboard!");
  };

  const isDealActive = (deal) => {
    if (!deal.isActive) return false;
    const now = new Date();
    const startDate = new Date(deal.startDate);
    const endDate = new Date(deal.endDate);
    return startDate <= now && endDate >= now;
  };

  const formatDate = (dateString) => {
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
                Flash Deals Management
              </Typography>
              <Typography variant="body1" sx={{ color: COLORS.textLight }}>
                Create and manage promotional flash sales
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
              Create Deal
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
            onClose={() => dispatch(clearFlashDealError())}
          >
            {error}
          </Alert>
        )}

        {/* Flash Deals Table */}
        <Card sx={{ borderRadius: "16px", border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: COLORS.secondaryBg }}>
                <TableRow>
                  <TableCell sx={{ color: COLORS.text, fontWeight: 600 }}>Image</TableCell>
                  <TableCell sx={{ color: COLORS.text, fontWeight: 600 }}>Title</TableCell>
                  <TableCell sx={{ color: COLORS.text, fontWeight: 600 }}>Discount</TableCell>
                  <TableCell sx={{ color: COLORS.text, fontWeight: 600 }}>Sale Code</TableCell>
                  <TableCell sx={{ color: COLORS.text, fontWeight: 600 }}>Duration</TableCell>
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
                      <TableCell><Box sx={{ width: 80, height: 20, bgcolor: COLORS.secondaryBg, borderRadius: 1 }} /></TableCell>
                      <TableCell><Box sx={{ width: 100, height: 20, bgcolor: COLORS.secondaryBg, borderRadius: 1 }} /></TableCell>
                      <TableCell><Box sx={{ width: 150, height: 20, bgcolor: COLORS.secondaryBg, borderRadius: 1 }} /></TableCell>
                      <TableCell><Box sx={{ width: 80, height: 20, bgcolor: COLORS.secondaryBg, borderRadius: 1 }} /></TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Box sx={{ width: 32, height: 32, bgcolor: COLORS.secondaryBg, borderRadius: 1 }} />
                          <Box sx={{ width: 32, height: 32, bgcolor: COLORS.secondaryBg, borderRadius: 1 }} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : flashDeals.length > 0 ? (
                  flashDeals.map((deal) => (
                    <TableRow 
                      key={deal.id} 
                      sx={{ 
                        "&:hover": { backgroundColor: COLORS.secondaryBg },
                        opacity: deal.isActive ? 1 : 0.7
                      }}
                    >
                      <TableCell>
                        <img
                          src={deal.image || "/placeholder-image.jpg"}
                          alt={deal.title}
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
                          {deal.title}
                        </Typography>
                        {deal.description && (
                          <Typography variant="body2" sx={{ color: COLORS.textLight, mt: 0.5 }}>
                            {deal.description.substring(0, 50)}...
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${deal.discountPercentage}% OFF`}
                          color="error"
                          size="small"
                          sx={{ borderRadius: "8px", fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: COLORS.text, fontWeight: 600, fontFamily: 'monospace' }}>
                          {deal.saleCode}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: COLORS.text }}>
                          {formatDate(deal.startDate)} - {formatDate(deal.endDate)}
                        </Typography>
                        {isDealActive(deal) && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                            <Timer sx={{ fontSize: 14, color: COLORS.success }} />
                            <Typography variant="caption" sx={{ color: COLORS.success, fontWeight: 600 }}>
                              Active
                            </Typography>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={isDealActive(deal) ? "Active" : "Inactive"}
                          color={isDealActive(deal) ? "success" : "default"}
                          size="small"
                          sx={{ borderRadius: "8px", fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleCopyLink(deal)}
                            sx={{ color: COLORS.primary }}
                            title="Copy Link"
                          >
                            <ContentCopy />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(deal)}
                            sx={{ color: COLORS.primary }}
                            title="View Details"
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(deal)}
                            sx={{ color: COLORS.primary }}
                            title="Edit"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(deal.id)}
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
                        <LocalOffer sx={{ fontSize: 64, color: COLORS.textLight, mb: 2 }} />
                        <Typography variant="h6" sx={{ color: COLORS.text, mb: 2 }}>
                          No flash deals found
                        </Typography>
                        <Typography variant="body2" sx={{ color: COLORS.textLight, mb: 4 }}>
                          Create promotional flash sales to attract customers
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
                          Create First Deal
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Add/Edit Flash Deal Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: "16px" } }}
        >
          <DialogTitle sx={{ fontWeight: 600, color: COLORS.text }}>
            {editingDeal ? "Edit Flash Deal" : "Create New Flash Deal"}
          </DialogTitle>
          <DialogContent>
            <FlashDealForm
              deal={editingDeal}
              onSubmit={handleSubmit}
              onCancel={handleCloseDialog}
            />
          </DialogContent>
        </Dialog>
      </Box>
    </ProtectedRoute>
  );
}