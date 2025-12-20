"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  Skeleton,
  Chip,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import {
  Favorite,
  ShoppingBag,
  HeartBroken,
  Delete,
  Share,
  ArrowRight,
  Home,
  ChevronRight,
  ShoppingCart,
  TrendingUp,
  AutoAwesome,
} from "@mui/icons-material";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  getWishlist,
  removeFromWishlist,
} from "../../store/slices/wishlistSlice";
import { addToCart } from "../../store/slices/cartSlice";
import ProductCard from "../../components/ui/ProductCard";

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

const Wishlist = () => {
  const dispatch = useAppDispatch();
  const { items: wishlistItems, isLoading } = useAppSelector(
    (state) => state.wishlist
  );
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      setSnackbar({
        open: true,
        message: "Please login to add to cart",
        severity: "warning",
      });
      return;
    }

    try {
      await dispatch(
        addToCart({ productId: product.id, quantity: 1 })
      ).unwrap();
      setSnackbar({
        open: true,
        message: "Added to cart successfully!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error?.message || "Failed to add to cart",
        severity: "error",
      });
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await dispatch(removeFromWishlist(productId)).unwrap();
      setSnackbar({
        open: true,
        message: "Removed from wishlist",
        severity: "info",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error?.message || "Failed to remove from wishlist",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };


  const wishlistProducts = wishlistItems.map((item) => ({
    ...item.product,
    id: item.product.id,
    name: item.product.name,
    price: item.product.price,
    featuredImage: item.product.featuredImage,
    description: item.product.description,
    rating: item.product.rating || 4.5,
    reviewCount: item.product.reviewCount || 24,
    stock: item.product.stock,
    comparePrice: item.product.comparePrice,
    isNew: item.product.isNew || false,
    discount: item.product.discount,
  }));

  const SkeletonLoader = () => (
    <Grid container spacing={3}>
      {[...Array(6)].map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <Skeleton variant="rectangular" height={200} />
            <CardContent>
              <Skeleton variant="text" height={30} />
              <Skeleton variant="text" height={20} width="60%" />
              <Skeleton variant="text" height={25} width="40%" />
            </CardContent>
            <CardActions>
              <Skeleton
                variant="rectangular"
                height={40}
                width="100%"
                sx={{ borderRadius: 2 }}
              />
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  if (!isAuthenticated) {
    return (
      <Box sx={{ backgroundColor: COLORS.lightBg, minHeight: "100vh", py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Favorite sx={{ fontSize: 80, color: COLORS.border, mb: 3 }} />
            <Typography
              variant="h4"
              sx={{ color: COLORS.text, mb: 2, fontWeight: 600 }}
            >
              Please Login
            </Typography>
            <Typography variant="body1" sx={{ color: COLORS.textLight, mb: 4 }}>
              Sign in to view your wishlist and save your favorite items
            </Typography>
            <Link href="/login" passHref>
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: COLORS.primary,
                  color: "white",
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  "&:hover": {
                    backgroundColor: COLORS.text,
                  },
                }}
              >
                Login to Continue
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: COLORS.lightBg, minHeight: "100vh", py: 4 }}>
      <Container maxWidth="xl">
        {/* Breadcrumb Navigation */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Link href="/" passHref>
              <Typography
                sx={{
                  color: COLORS.textLight,
                  cursor: "pointer",
                  "&:hover": { color: COLORS.primary },
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Home sx={{ fontSize: 20 }} />
                Home
              </Typography>
            </Link>
            <ChevronRight sx={{ color: COLORS.border }} />
            <Typography sx={{ color: COLORS.primary, fontWeight: 600 }}>
              My Wishlist
            </Typography>
          </Box>
        </Box>

        {/* Header Section */}
        <Paper
          sx={{
            p: 4,
            mb: 6,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${COLORS.secondaryBg} 0%, white 100%)`,
            border: `1px solid ${COLORS.border}`,
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                backgroundColor: COLORS.primary,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <Favorite sx={{ fontSize: 40 }} />
            </Box>
          </Box>
          <Typography
            variant="h3"
            sx={{ color: COLORS.text, mb: 2, fontWeight: 700 }}
          >
            My Wishlist
          </Typography>
          <Typography variant="h6" sx={{ color: COLORS.textLight, mb: 3 }}>
            {wishlistItems.length}{" "}
            {wishlistItems.length === 1 ? "item" : "items"} saved for later
          </Typography>

          {/* Stats */}
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 4, mt: 3 }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h4"
                sx={{ color: COLORS.primary, fontWeight: 700 }}
              >
                {wishlistItems.length}
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textLight }}>
                Items Saved
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h4"
                sx={{ color: COLORS.success, fontWeight: 700 }}
              >
                {wishlistProducts.filter((p) => p.discount > 0).length}
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textLight }}>
                On Sale
              </Typography>
            </Box>
          </Box>
        </Paper>

        {isLoading ? (
          <SkeletonLoader />
        ) : wishlistItems.length > 0 ? (
          <>
            {/* Quick Actions */}
            <Box sx={{ mb: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Chip
                icon={<TrendingUp />}
                label={`${
                  wishlistProducts.filter((p) => p.discount > 0).length
                } items on sale`}
                sx={{
                  backgroundColor: COLORS.success,
                  color: "white",
                  fontWeight: 600,
                }}
              />
              <Chip
                icon={<AutoAwesome />}
                label={`${
                  wishlistProducts.filter((p) => p.isNew).length
                } new arrivals`}
                sx={{
                  backgroundColor: COLORS.primary,
                  color: "white",
                  fontWeight: 600,
                }}
              />
            </Box>
            {wishlistProducts?.length > 0 && (
              <Grid container spacing={3}>
                {wishlistProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                      viewMode="grid"
                      showDelete={true}
                      onDelete={() => handleRemoveFromWishlist(product.id)}
                    />
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Bottom CTA */}
            <Paper
              sx={{
                p: 4,
                mt: 6,
                borderRadius: 3,
                backgroundColor: COLORS.secondaryBg,
                border: `1px solid ${COLORS.border}`,
                textAlign: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: COLORS.text, mb: 2, fontWeight: 600 }}
              >
                Ready to complete your collection?
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: COLORS.textLight, mb: 3 }}
              >
                Move all your wishlist items to cart in one click
              </Typography>
              <Button
                variant="outlined"
                endIcon={<ArrowRight />}
                sx={{
                  borderColor: COLORS.primary,
                  color: COLORS.primary,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: COLORS.primary,
                    color: "white",
                    borderColor: COLORS.primary,
                  },
                }}
              >
                Move All to Cart
              </Button>
            </Paper>
          </>
        ) : (
          // Empty Wishlist State
          <Paper
            sx={{
              textAlign: "center",
              py: 10,
              px: 4,
              borderRadius: 3,
              backgroundColor: "white",
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <HeartBroken sx={{ fontSize: 80, color: COLORS.border, mb: 3 }} />
            <Typography
              variant="h4"
              sx={{ color: COLORS.text, mb: 2, fontWeight: 600 }}
            >
              Your Wishlist is Empty
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: COLORS.textLight, mb: 4, maxWidth: 400, mx: "auto" }}
            >
              Start exploring our products and add your favorite items to your
              wishlist for easy access later.
            </Typography>
            <Link href="/products" passHref>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingBag />}
                sx={{
                  backgroundColor: COLORS.primary,
                  color: "white",
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: COLORS.text,
                  },
                }}
              >
                Start Shopping
              </Button>
            </Link>
          </Paper>
        )}

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Wishlist;
