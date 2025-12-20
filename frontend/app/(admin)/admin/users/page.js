"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  Chip,
  Switch,
  Avatar,
  InputBase,
  Card,
  Skeleton,
  Tooltip,
  Button,
  Menu,
  MenuItem,
  Badge,
  Divider,
} from "@mui/material";
import {
  Block,
  CheckCircle,
  Delete,
  Search,
  FilterList,
  Refresh,
  MoreVert,
  Person,
  Email,
  Phone,
  CalendarToday,
  Visibility,
  Edit,
} from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "../../../../store/hooks";
import {
  fetchUsers,
  updateUserStatus,
  deleteUser,
  clearUserError,
} from "../../../../store/slices/userSlice";
import ProtectedRoute from "../../../../components/auth/ProtectedRoute";
import { getInitials } from "../../../../lib/utils";

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

export default function AdminUsers() {
  const dispatch = useAppDispatch();
  const {
    items: users,
    isLoading,
    error,
  } = useAppSelector((state) => state.users);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleToggleStatus = (user) => {
    dispatch(
      updateUserStatus({
        userId: user.id,
        isActive: !user.isActive,
      })
    );
  };

  const handleDelete = (userId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      dispatch(deleteUser(userId));
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRefresh = () => {
    dispatch(fetchUsers());
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && user.isActive) ||
      (statusFilter === "inactive" && !user.isActive);
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: users.length,
    active: users.filter((u) => u.isActive).length,
    inactive: users.filter((u) => !u.isActive).length,
    recent: users.filter((u) => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return new Date(u.createdAt) > oneWeekAgo;
    }).length,
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
                Users Management
              </Typography>
              <Typography variant="body1" sx={{ color: COLORS.textLight }}>
                Manage user accounts and access permissions
              </Typography>
            </Box>
            <Box className="flex items-center gap-3">
              <Typography variant="body2" sx={{ color: COLORS.textLight }}>
                Total:{" "}
                <strong style={{ color: COLORS.text }}>{users.length}</strong>{" "}
                users
              </Typography>
            </Box>
          </Box>

          {/* Stats Cards */}
          <Box className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Total Users",
                value: stats.total,
                icon: <Person />,
                color: COLORS.primary,
              },
              {
                label: "Active",
                value: stats.active,
                icon: <CheckCircle />,
                color: COLORS.success,
              },
              {
                label: "Inactive",
                value: stats.inactive,
                icon: <Block />,
                color: COLORS.warning,
              },
              {
                label: "New This Week",
                value: stats.recent,
                icon: <CalendarToday />,
                color: COLORS.text,
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
                placeholder="Search users by name, email, or phone..."
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
                  selected={statusFilter === "all"}
                >
                  All Users
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setStatusFilter("active");
                    handleMenuClose();
                  }}
                  selected={statusFilter === "active"}
                >
                  Active Only
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setStatusFilter("inactive");
                    handleMenuClose();
                  }}
                  selected={statusFilter === "inactive"}
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
            onClose={() => dispatch(clearUserError())}
          >
            {error}
          </Alert>
        )}

        {/* Users Table */}
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
                    User
                  </TableCell>
                  <TableCell sx={{ color: COLORS.text, fontWeight: 600 }}>
                    Contact
                  </TableCell>
                  <TableCell sx={{ color: COLORS.text, fontWeight: 600 }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ color: COLORS.text, fontWeight: 600 }}>
                    Joined Date
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
                          <Box className="flex items-center gap-3">
                            <Skeleton
                              variant="circular"
                              width={40}
                              height={40}
                            />
                            <Box>
                              <Skeleton
                                variant="text"
                                width={120}
                                height={20}
                              />
                              <Skeleton variant="text" width={80} height={16} />
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width={150} height={20} />
                          <Skeleton variant="text" width={100} height={16} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width={80} height={32} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width={100} height={20} />
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
                  : filteredUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        sx={{
                          "&:hover": { backgroundColor: COLORS.secondaryBg },
                          transition: "background-color 0.2s",
                        }}
                      >
                        <TableCell>
                          <Box className="flex items-center gap-3">
                            <Badge
                              color={user.isActive ? "success" : "default"}
                              variant="dot"
                              overlap="circular"
                              anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                              }}
                            >
                              <Avatar
                                sx={{
                                  width: 48,
                                  height: 48,
                                  backgroundColor: COLORS.primary,
                                  fontWeight: 600,
                                }}
                              >
                                {getInitials(user.name)}
                              </Avatar>
                            </Badge>
                            <Box>
                              <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 600, color: COLORS.text }}
                              >
                                {user.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: COLORS.textLight }}
                              >
                                ID: {String(user.id).slice(0, 8)}...
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box className="flex flex-col gap-1">
                            <Box className="flex items-center gap-2">
                              <Email
                                sx={{ fontSize: 16, color: COLORS.textLight }}
                              />
                              <Typography
                                variant="body2"
                                sx={{ color: COLORS.text }}
                              >
                                {user.email}
                              </Typography>
                            </Box>
                            {user.phone && (
                              <Box className="flex items-center gap-2">
                                <Phone
                                  sx={{ fontSize: 16, color: COLORS.textLight }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{ color: COLORS.textLight }}
                                >
                                  {user.phone}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box className="flex items-center gap-2">
                            <Switch
                              checked={user.isActive}
                              onChange={() => handleToggleStatus(user)}
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
                            <Chip
                              label={user.isActive ? "Active" : "Inactive"}
                              color={user.isActive ? "success" : "default"}
                              size="small"
                              sx={{
                                borderRadius: "8px",
                                fontWeight: 500,
                                minWidth: 80,
                              }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box className="flex items-center gap-2">
                            <CalendarToday
                              sx={{ fontSize: 16, color: COLORS.textLight }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ color: COLORS.text }}
                            >
                              {new Date(user.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </Typography>
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{ color: COLORS.textLight, ml: 3 }}
                          >
                            {new Date(user.createdAt).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box className="flex justify-end gap-1">
                            {/* <Tooltip title="View Profile">
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
                            <Tooltip
                              title={
                                user.isActive
                                  ? "Deactivate User"
                                  : "Activate User"
                              }
                            >
                              <IconButton
                                size="small"
                                onClick={() => handleToggleStatus(user)}
                                sx={{
                                  color: user.isActive
                                    ? COLORS.warning
                                    : COLORS.success,
                                  "&:hover": {
                                    backgroundColor: user.isActive
                                      ? "#FFFBEB"
                                      : "#ECFDF5",
                                  },
                                }}
                              >
                                {user.isActive ? (
                                  <Block fontSize="small" />
                                ) : (
                                  <CheckCircle fontSize="small" />
                                )}
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete User">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(user.id)}
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
          {!isLoading && filteredUsers.length === 0 && (
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
                <Person sx={{ fontSize: 40, color: COLORS.textLight }} />
              </Box>
              <Typography variant="h6" sx={{ color: COLORS.text, mb: 2 }}>
                {searchTerm || statusFilter !== "all"
                  ? "No users found"
                  : "No users yet"}
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
                  : "Users will appear here once they register on your platform."}
              </Typography>
            </Box>
          )}
        </Card>

        {/* Quick Actions Footer */}
        <Box className="flex justify-between items-center mt-4">
          <Typography variant="body2" sx={{ color: COLORS.textLight }}>
            Showing {filteredUsers.length} of {users.length} users
          </Typography>
          <Box className="flex gap-2">
            <Button
              startIcon={<Refresh />}
              onClick={handleRefresh}
              sx={{
                color: COLORS.text,
                textTransform: "none",
              }}
            >
              Refresh
            </Button>
          </Box>
        </Box>
      </Box>
    </ProtectedRoute>
  );
}
