"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  Chip,
  Switch,
  FormControlLabel,
  InputBase,
  Card,
  Skeleton,
  Tooltip,
  Badge,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Search,
  FilterList,
  Refresh,
  MoreVert,
  Inventory,
  TrendingUp,
  LocalOffer,
} from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "../../../../store/hooks";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  clearProductError,
} from "../../../../store/slices/productSlice";
import ProductForm from "../../../../components/forms/ProductForm";
import ProtectedRoute from "../../../../components/auth/ProtectedRoute";

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

export default function AdminProducts() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [anchorEl, setAnchorEl] = useState(null);

  const dispatch = useAppDispatch();
  const {
    items: products,
    isLoading,
    error,
  } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleOpenDialog = (product = null) => {
    setEditingProduct(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    dispatch(clearProductError());
  };

  const handleSubmit = (formData) => {
    if (editingProduct) {
      dispatch(updateProduct({ id: editingProduct.id, productData: formData }));
    } else {
      dispatch(createProduct(formData));
    }
    handleCloseDialog();
  };

  const handleDelete = (productId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      dispatch(deleteProduct(productId));
    }
  };

  const handleToggleFeatured = (product) => {
    const formData = new FormData();
    formData.append("isFeatured", (!product.isFeatured).toString());
    dispatch(updateProduct({ id: product.id, productData: formData }));
  };
// Admin products page mein
const handleToggleNew = (product) => {
  const formData = new FormData();
  formData.append("isNew", (!product.isNew).toString());
  dispatch(updateProduct({ id: product.id, productData: formData }));
};
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRefresh = () => {
    dispatch(fetchProducts());
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && product.isActive) ||
      (statusFilter === "inactive" && !product.isActive);
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: products.length,
    active: products.filter((p) => p.isActive).length,
    featured: products.filter((p) => p.isFeatured).length,
    lowStock: products.filter((p) => p.stock < 10).length,
  };

  return (
    <ProtectedRoute requireAdmin>
      <Box sx={{ backgroundColor: COLORS.lightBg, minHeight: "100vh", p: 3 }}>
        {/* Header Section */}
        <Card
          sx={{
            p: 4,
            mb: 4,
            borderRadius: "16px",
            backgroundColor: "white",
            border: `1px solid ${COLORS.border}`,
            background: `linear-gradient(135deg, ${COLORS.lightBg} 0%, white 100%)`,
          }}
        >
          <Box className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: COLORS.text,
                  mb: 1,
                }}
              >
                Products Management
              </Typography>
              <Typography variant="body1" sx={{ color: COLORS.textLight }}>
                Manage your product catalog and inventory
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
                "&:hover": {
                  backgroundColor: COLORS.text,
                },
              }}
            >
              Add Product
            </Button>
          </Box>

          {/* Stats Cards */}
          <Box className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Total Products",
                value: stats.total,
                icon: <Inventory />,
                color: COLORS.primary,
              },
              {
                label: "Active",
                value: stats.active,
                icon: <TrendingUp />,
                color: COLORS.success,
              },
              {
                label: "Featured",
                value: stats.featured,
                icon: <LocalOffer />,
                color: COLORS.warning,
              },
              {
                label: "Low Stock",
                value: stats.lowStock,
                icon: <Inventory />,
                color: COLORS.error,
              },
            ].map((stat, index) => (
              <Paper
                key={index}
                sx={{
                  p: 3,
                  borderRadius: "12px",
                  backgroundColor: COLORS.secondaryBg,
                  border: `1px solid ${COLORS.border}`,
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    display: "inline-flex",
                    p: 1,
                    borderRadius: "8px",
                    backgroundColor: stat.color,
                    color: "white",
                    mb: 2,
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: COLORS.text, mb: 1 }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ color: COLORS.textLight }}>
                  {stat.label}
                </Typography>
              </Paper>
            ))}
          </Box>

          {/* Search and Controls */}
          <Box className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <Paper
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: { xs: "100%", lg: 400 },
                borderRadius: "12px",
                border: `1px solid ${COLORS.border}`,
                backgroundColor: COLORS.lightBg,
              }}
            >
              <InputBase
                sx={{ ml: 2, flex: 1, color: COLORS.text }}
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startAdornment={
                  <Search sx={{ color: COLORS.textLight, mr: 1 }} />
                }
              />
            </Paper>

            <Box className="flex gap-2">
              <Tooltip title="Refresh">
                <IconButton
                  onClick={handleRefresh}
                  disabled={isLoading}
                  sx={{
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: "10px",
                    color: COLORS.text,
                  }}
                >
                  <Refresh />
                </IconButton>
              </Tooltip>

              <Button
                startIcon={<FilterList />}
                onClick={handleMenuOpen}
                sx={{
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: "10px",
                  color: COLORS.text,
                  textTransform: "none",
                }}
              >
                Filter
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    borderRadius: "12px",
                    border: `1px solid ${COLORS.border}`,
                    mt: 1,
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    setStatusFilter("all");
                    handleMenuClose();
                  }}
                >
                  All Status
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setStatusFilter("active");
                    handleMenuClose();
                  }}
                >
                  Active Only
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setStatusFilter("inactive");
                    handleMenuClose();
                  }}
                >
                  Inactive Only
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 4,
              borderRadius: "12px",
              border: `1px solid ${COLORS.error}`,
            }}
            onClose={() => dispatch(clearProductError())}
          >
            {error}
          </Alert>
        )}

        {/* Products Table */}
        <Card
          sx={{
            borderRadius: "16px",
            border: `1px solid ${COLORS.border}`,
            overflow: "hidden",
          }}
        >
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: COLORS.secondaryBg }}>
                <TableRow>
                  <TableCell sx={{ color: COLORS.text, fontWeight: 600 }}>
                    Product
                  </TableCell>
                  <TableCell sx={{ color: COLORS.text, fontWeight: 600 }}>
                    Category
                  </TableCell>
                  <TableCell sx={{ color: COLORS.text, fontWeight: 600 }}>
                    Price
                  </TableCell>
                  <TableCell sx={{ color: COLORS.text, fontWeight: 600 }}>
                    Stock
                  </TableCell>
                  <TableCell sx={{ color: COLORS.text, fontWeight: 600 }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ color: COLORS.text, fontWeight: 600 }}>
                    Featured
                  </TableCell>
                  <TableCell sx={{ color: COLORS.text, fontWeight: 600 }}>
                    Discount
                  </TableCell>
                  <TableCell sx={{ color: COLORS.text, fontWeight: 600 }}>
                    New Arrival
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: COLORS.text, fontWeight: 600 }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading
                  ? // Loading Skeletons
                    Array.from(new Array(5)).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton
                            variant="rectangular"
                            width={60}
                            height={60}
                            sx={{ borderRadius: "8px" }}
                          />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width={120} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width={80} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width={60} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width={80} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width={60} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="circular" width={32} height={32} />
                          <Skeleton
                            variant="circular"
                            width={32}
                            height={32}
                            sx={{ ml: 1 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  : filteredProducts.map((product) => (
                      <TableRow
                        key={product.id}
                        sx={{
                          "&:hover": { backgroundColor: COLORS.secondaryBg },
                          transition: "background-color 0.2s",
                        }}
                      >
                        <TableCell>
                          <Box className="flex items-center gap-3">
                            <img
                              src={
                                product.featuredImage ||
                                "/images/placeholder.jpg"
                              }
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg shadow-sm"
                            />
                            <Box>
                              <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 600, color: COLORS.text }}
                              >
                                {product.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: COLORS.textLight }}
                              >
                                SKU: {product.sku || "N/A"}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={product.category?.name || "Uncategorized"}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderRadius: "8px",
                              borderColor: COLORS.primary,
                              color: COLORS.text,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, color: COLORS.text }}
                            >
                              ${parseFloat(product.price).toFixed(2)}
                            </Typography>
                            {product.comparePrice && (
                              <Typography
                                variant="body2"
                                sx={{
                                  color: COLORS.textLight,
                                  textDecoration: "line-through",
                                }}
                              >
                                ${parseFloat(product.comparePrice).toFixed(2)}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Badge
                            color={
                              product.stock > 10
                                ? "success"
                                : product.stock > 0
                                ? "warning"
                                : "error"
                            }
                            variant="dot"
                            sx={{
                              "& .MuiBadge-dot": {
                                backgroundColor:
                                  product.stock > 10
                                    ? COLORS.success
                                    : product.stock > 0
                                    ? COLORS.warning
                                    : COLORS.error,
                              },
                            }}
                          >
                            <Chip
                              label={product.stock}
                              size="small"
                              sx={{
                                borderRadius: "8px",
                                backgroundColor:
                                  product.stock > 10
                                    ? "#ECFDF5"
                                    : product.stock > 0
                                    ? "#FFFBEB"
                                    : "#FEF2F2",
                                color:
                                  product.stock > 10
                                    ? "#065F46"
                                    : product.stock > 0
                                    ? "#92400E"
                                    : "#991B1B",
                                fontWeight: 500,
                              }}
                            />
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={product.isActive ? "Active" : "Inactive"}
                            color={product.isActive ? "success" : "default"}
                            size="small"
                            sx={{
                              borderRadius: "8px",
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={product.isFeatured}
                                onChange={() => handleToggleFeatured(product)}
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
                          />
                        </TableCell>
                        <TableCell>
                          {product.discount > 0 ? (
                            <Chip
                              label={`${product.discount}% OFF`}
                              size="small"
                              sx={{
                                borderRadius: "8px",
                                backgroundColor: "#FEF2F2",
                                color: COLORS.error,
                                fontWeight: 600,
                              }}
                            />
                          ) : (
                            <Typography
                              variant="body2"
                              sx={{ color: COLORS.textLight }}
                            >
                              No discount
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={product.isNew}
                                onChange={() => handleToggleNew(product)}
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
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Box className="flex justify-end gap-1">
                            {/* <Tooltip title="View Product">
                              <IconButton
                                size="small"
                                sx={{
                                  color: COLORS.textLight,
                                  "&:hover": {
                                    backgroundColor: COLORS.secondaryBg,
                                    color: COLORS.primary,
                                  },
                                }}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip> */}
                            <Tooltip title="Edit Product">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenDialog(product)}
                                sx={{
                                  color: COLORS.textLight,
                                  "&:hover": {
                                    backgroundColor: COLORS.secondaryBg,
                                    color: COLORS.primary,
                                  },
                                }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Product">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(product.id)}
                                sx={{
                                  "&:hover": { backgroundColor: "#FEF2F2" },
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Empty State */}
          {!isLoading && filteredProducts.length === 0 && (
            <Box className="text-center py-12">
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  backgroundColor: COLORS.secondaryBg,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3,
                }}
              >
                <Inventory sx={{ fontSize: 40, color: COLORS.textLight }} />
              </Box>
              <Typography variant="h6" sx={{ color: COLORS.text, mb: 2 }}>
                {searchTerm || statusFilter !== "all"
                  ? "No products found"
                  : "No products yet"}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: COLORS.textLight,
                  mb: 4,
                  maxWidth: 400,
                  mx: "auto",
                }}
              >
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search terms or filters to find what you're looking for."
                  : "Get started by adding your first product to your catalog."}
              </Typography>
              {!searchTerm && statusFilter === "all" && (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => handleOpenDialog()}
                  sx={{
                    borderRadius: "12px",
                    backgroundColor: COLORS.primary,
                    color: "white",
                    px: 4,
                    "&:hover": {
                      backgroundColor: COLORS.text,
                    },
                  }}
                >
                  Create First Product
                </Button>
              )}
            </Box>
          )}
        </Card>

        {/* Add/Edit Product Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="lg"
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
              borderBottom: `0px solid ${COLORS.border}`,
              color: COLORS.text,
              fontWeight: 600,
            }}
          >
            {editingProduct ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogContent sx={{ p: 1 }}>
            <ProductForm
              product={editingProduct}
              onSubmit={handleSubmit}
              onCancel={handleCloseDialog}
            />
          </DialogContent>
        </Dialog>
      </Box>
    </ProtectedRoute>
  );
}
