// components/analytics/FlashDealAnalytics.js
"use client";
import React, { useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  TrendingUp,
  Visibility,
  ShoppingCart,
  AttachMoney,
  Inventory,
  Schedule,
} from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { fetchFlashDealAnalytics } from "../../../store/slices/flashDealSlice";

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

export default function FlashDealAnalytics({ dealId }) {
  const dispatch = useAppDispatch();
  const { analytics, isLoading } = useAppSelector((state) => state.flashDeals);

  useEffect(() => {
    if (dealId) {
      dispatch(fetchFlashDealAnalytics(dealId));
    }
  }, [dispatch, dealId]);

  if (isLoading || !analytics) {
    return <div>Loading analytics...</div>;
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatTimeLeft = (milliseconds) => {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: COLORS.text }}>
        Deal Analytics
      </Typography>

      <Grid container spacing={3}>
        {/* Key Metrics */}
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, textAlign: 'center', backgroundColor: COLORS.secondaryBg }}>
            <Visibility sx={{ fontSize: 40, color: COLORS.primary, mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: COLORS.text }}>
              {analytics.viewCount}
            </Typography>
            <Typography sx={{ color: COLORS.textLight }}>Total Views</Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, textAlign: 'center', backgroundColor: COLORS.secondaryBg }}>
            <ShoppingCart sx={{ fontSize: 40, color: COLORS.success, mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: COLORS.text }}>
              {analytics.totalSold}
            </Typography>
            <Typography sx={{ color: COLORS.textLight }}>Units Sold</Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, textAlign: 'center', backgroundColor: COLORS.secondaryBg }}>
            <AttachMoney sx={{ fontSize: 40, color: COLORS.warning, mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: COLORS.text }}>
              {formatCurrency(analytics.totalValue)}
            </Typography>
            <Typography sx={{ color: COLORS.textLight }}>Total Revenue</Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, textAlign: 'center', backgroundColor: COLORS.secondaryBg }}>
            <Inventory sx={{ fontSize: 40, color: COLORS.error, mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: COLORS.text }}>
              {analytics.totalProducts}
            </Typography>
            <Typography sx={{ color: COLORS.textLight }}>Products</Typography>
          </Card>
        </Grid>

        {/* Progress */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, backgroundColor: COLORS.secondaryBg }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: COLORS.text, fontWeight: 600 }}>
                Deal Progress
              </Typography>
              <Chip 
                label={`${analytics.progressPercentage}% Complete`}
                color="primary"
              />
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={analytics.progressPercentage} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: COLORS.border,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: COLORS.primary,
                }
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2" sx={{ color: COLORS.textLight }}>
                Time Left: {formatTimeLeft(analytics.timeLeft)}
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textLight }}>
                {analytics.progressPercentage}% Complete
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Top Products */}
        <Grid item xs={12}>
          <Card sx={{ backgroundColor: COLORS.secondaryBg }}>
            <Box sx={{ p: 3, borderBottom: `1px solid ${COLORS.border}` }}>
              <Typography variant="h6" sx={{ color: COLORS.text, fontWeight: 600 }}>
                Top Performing Products
              </Typography>
            </Box>
            <List>
              {analytics.products.slice(0, 5).map((product, index) => (
                <React.Fragment key={product.id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body1" sx={{ fontWeight: 600, color: COLORS.text }}>
                            {product.name}
                          </Typography>
                          <Chip 
                            label={`${product.soldCount} sold`}
                            size="small"
                            color="success"
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Typography variant="body2" sx={{ color: COLORS.textLight }}>
                            Price: {formatCurrency(product.price)}
                          </Typography>
                          <Typography variant="body2" sx={{ color: COLORS.textLight }}>
                            Revenue: {formatCurrency(product.revenue)}
                          </Typography>
                          <Typography variant="body2" sx={{ color: COLORS.textLight }}>
                            Stock: {product.stock}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < analytics.products.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}