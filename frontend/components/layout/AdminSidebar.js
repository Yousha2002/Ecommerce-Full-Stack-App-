"use client";
import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
  Divider,
  Tooltip,
  Avatar,
  Collapse,
  Badge,
} from "@mui/material";
import {
  Dashboard,
  Category,
  ShoppingBag,
  People,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExpandLess,
  ExpandMore,
  Inventory,
  Analytics,
  Notifications,
  Logout,
  Slideshow,
  LocalOffer,
  Collections,
} from "@mui/icons-material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Star } from "lucide-react";

// Color theme
const colorTheme = {
  primary: "#C9B59C",
  lightBg: "#F9F8F6",
  secondaryBg: "#EFE9E3",
  border: "#D9CFC7",
  text: "#5D4037",
  textLight: "#8D6E63",
};

const menuItems = [
  { text: "Dashboard", icon: <Dashboard />, path: "/admin/dashboard" },
  // { text: "Homepage", icon: <Home />, path: "/admin/homepage" },
  { text: "Hero Banners", icon: <Slideshow />, path: "/admin/hero-banners" },
  { text: "Categories", icon: <Category />, path: "/admin/categories" },
  { text: "Products", icon: <ShoppingBag />, path: "/admin/products" },
  { text: "Users", icon: <People />, path: "/admin/users" },
  { text: "Reviews", icon: <Star />, path: "/admin/reviews" },
   { text: "Flash Deals", icon: <LocalOffer />, path: "/admin/flash-deals" },
  { text: "Comming Soon", icon: <Collections />, path: "/admin/coming-soon" },
];

const nestedMenuItems = [
  // {
  //   text: "Inventory",
  //   icon: <Inventory />,
  //   subItems: [
  //     { text: "Stock", path: "/admin/inventory/stock" },
  //     { text: "Suppliers", path: "/admin/inventory/suppliers" },
  //   ],
  // },
  // {
  //   text: "Analytics",
  //   icon: <Analytics />,
  //   subItems: [
  //     { text: "Sales Report", path: "/admin/analytics/sales" },
  //     { text: "User Analytics", path: "/admin/analytics/users" },
  //   ],
  // },
];

const AdminSidebar = ({ open, onClose}) => {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [collapsed, setCollapsed] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});

  const toggleSubmenu = (index) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const drawerWidth = collapsed ? 80 : 280;

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? open : true}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard,
          }),
          backgroundColor: colorTheme.lightBg,
          color: colorTheme.text,
          border: "none",
          boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
          overflowX: "hidden",
        },
      }}
    >
      {/* Header Section */}
      <Box
        className="p-4 flex items-center justify-between"
        sx={{
          backgroundColor: colorTheme.secondaryBg,
          borderBottom: `1px solid ${colorTheme.border}`,
        }}
      >
        <Collapse in={!collapsed} orientation="horizontal">
          <Box className="flex items-center gap-2">
            <Box
              sx={{
                width: 32,
                height: 32,
                backgroundColor: colorTheme.primary,
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              A
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: colorTheme.text,
                fontSize: "1.25rem",
              }}
            >
              Admin Panel
            </Typography>
          </Box>
        </Collapse>

        {!isMobile && (
          <IconButton
            onClick={() => setCollapsed(!collapsed)}
            sx={{
              color: colorTheme.text,
              backgroundColor: colorTheme.lightBg,
              "&:hover": {
                backgroundColor: colorTheme.border,
              },
            }}
            size="small"
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        )}
      </Box>

      {/* User Profile Section */}
      {!collapsed && (
        <Box
          className="px-4 py-6 flex flex-col items-center"
          sx={{
            borderBottom: `1px solid ${colorTheme.border}`,
            backgroundColor: colorTheme.secondaryBg,
          }}
        >
          <Avatar
            sx={{
              width: 72,
              height: 72,
              mb: 2,
              backgroundColor: colorTheme.primary,
              border: `3px solid ${colorTheme.lightBg}`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
            src="/admin-avatar.jpg"
          >
            A
          </Avatar>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: colorTheme.text }}
          >
            Admin User
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: colorTheme.textLight, mt: 0.5 }}
          >
            Administrator
          </Typography>

          {/* Quick Stats */}
          <Box className="flex gap-4 mt-4">
            <Box className="text-center">
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: colorTheme.primary }}
              >
                24
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: colorTheme.textLight }}
              >
                Orders
              </Typography>
            </Box>
            <Box className="text-center">
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: colorTheme.primary }}
              >
                156
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: colorTheme.textLight }}
              >
                Users
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Main Menu */}
      <List className="mt-4 px-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Tooltip
              key={item.text}
              title={collapsed ? item.text : ""}
              placement="right"
            >
              <ListItem
                component={Link}
                href={item.path}
                sx={{
                  minHeight: 52,
                  justifyContent: collapsed ? "center" : "initial",
                  px: 2,
                  borderRadius: "12px",
                  mb: 1,
                  backgroundColor: isActive
                    ? colorTheme.primary
                    : "transparent",
                  color: isActive ? "white" : colorTheme.text,
                  "&:hover": {
                    backgroundColor: isActive
                      ? colorTheme.primary
                      : colorTheme.secondaryBg,
                    transform: "translateX(4px)",
                  },
                  transition: "all 0.2s ease-in-out",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": isActive
                    ? {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "4px",
                        height: "60%",
                        backgroundColor: colorTheme.text,
                        borderRadius: "0 2px 2px 0",
                      }
                    : {},
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: collapsed ? 0 : 2.5,
                    justifyContent: "center",
                    color: isActive ? "white" : colorTheme.textLight,
                  }}
                >
                  {item.badge ? (
                    <Badge
                      badgeContent={item.badge}
                      color="error"
                      sx={{
                        "& .MuiBadge-badge": {
                          fontSize: "0.6rem",
                          height: "16px",
                          minWidth: "16px",
                        },
                      }}
                    >
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>

                <Collapse in={!collapsed} orientation="horizontal">
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: "0.95rem",
                      fontWeight: isActive ? 600 : 500,
                    }}
                  />
                </Collapse>
              </ListItem>
            </Tooltip>
          );
        })}
      </List>

      <Divider sx={{ borderColor: colorTheme.border, my: 2 }} />

      {/* Nested Menu Items */}
      <List className="px-2">
        {nestedMenuItems.map((item, index) => {
          const isSubmenuOpen = openSubmenus[index];
          const hasActiveSubitem = item.subItems.some(
            (subItem) => pathname === subItem.path
          );

          return (
            <React.Fragment key={item.text}>
              <Tooltip title={collapsed ? item.text : ""} placement="right">
                <ListItem
                  button
                  onClick={() => toggleSubmenu(index)}
                  sx={{
                    minHeight: 52,
                    justifyContent: collapsed ? "center" : "initial",
                    px: 2,
                    borderRadius: "12px",
                    mb: 1,
                    backgroundColor: hasActiveSubitem
                      ? colorTheme.secondaryBg
                      : "transparent",
                    color: colorTheme.text,
                    "&:hover": {
                      backgroundColor: colorTheme.secondaryBg,
                      transform: "translateX(4px)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: collapsed ? 0 : 2.5,
                      justifyContent: "center",
                      color: hasActiveSubitem
                        ? colorTheme.primary
                        : colorTheme.textLight,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  <Collapse in={!collapsed} orientation="horizontal">
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: "0.95rem",
                        fontWeight: hasActiveSubitem ? 600 : 500,
                      }}
                    />
                  </Collapse>

                  {!collapsed && (
                    <Collapse in={!collapsed} orientation="horizontal">
                      {isSubmenuOpen ? (
                        <ExpandLess sx={{ color: colorTheme.textLight }} />
                      ) : (
                        <ExpandMore sx={{ color: colorTheme.textLight }} />
                      )}
                    </Collapse>
                  )}
                </ListItem>
              </Tooltip>

              {!collapsed && (
                <Collapse in={isSubmenuOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => {
                      const isSubItemActive = pathname === subItem.path;

                      return (
                        <ListItem
                          key={subItem.text}
                          component={Link}
                          href={subItem.path}
                          sx={{
                            minHeight: 44,
                            pl: 4,
                            pr: 2,
                            py: 1,
                            mb: 0.5,
                            borderRadius: "8px",
                            backgroundColor: isSubItemActive
                              ? colorTheme.primary
                              : "transparent",
                            color: isSubItemActive
                              ? "white"
                              : colorTheme.textLight,
                            "&:hover": {
                              backgroundColor: isSubItemActive
                                ? colorTheme.primary
                                : colorTheme.secondaryBg,
                            },
                            transition: "all 0.2s ease-in-out",
                          }}
                        >
                          <ListItemText
                            primary={subItem.text}
                            primaryTypographyProps={{
                              fontSize: "0.875rem",
                              fontWeight: isSubItemActive ? 600 : 400,
                            }}
                          />
                          {subItem.badge && (
                            <Badge
                              badgeContent={subItem.badge}
                              color="error"
                              sx={{
                                "& .MuiBadge-badge": {
                                  fontSize: "0.55rem",
                                  height: "14px",
                                  minWidth: "14px",
                                },
                              }}
                            />
                          )}
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          );
        })}
      </List>

      {/* Bottom Actions */}
      <Box sx={{ mt: "auto", p: 2 }}>
        {/* Notifications */}
        {/* <Tooltip title={collapsed ? "Notifications" : ""} placement="right">
          <ListItem
            button
            sx={{
              minHeight: 48,
              justifyContent: collapsed ? "center" : "initial",
              px: 2.5,
              borderRadius: "12px",
              mb: 1,
              color: colorTheme.text,
              "&:hover": {
                backgroundColor: colorTheme.secondaryBg,
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: collapsed ? 0 : 2,
                justifyContent: "center",
                color: colorTheme.textLight,
              }}
            >
              <Badge badgeContent={7} color="error">
                <Notifications />
              </Badge>
            </ListItemIcon>

            <Collapse in={!collapsed} orientation="horizontal">
              <ListItemText
                primary="Notifications"
                primaryTypographyProps={{ fontSize: "0.9rem" }}
              />
            </Collapse>
          </ListItem>
        </Tooltip> */}

        {/* Settings */}
        {/* <Tooltip title={collapsed ? "Settings" : ""} placement="right">
          <ListItem
            component={Link}
            href="/admin/settings"
            sx={{
              minHeight: 48,
              justifyContent: collapsed ? "center" : "initial",
              px: 2.5,
              borderRadius: "12px",
              mb: 1,
              backgroundColor:
                pathname === "/admin/settings"
                  ? colorTheme.primary
                  : "transparent",
              color: pathname === "/admin/settings" ? "white" : colorTheme.text,
              "&:hover": {
                backgroundColor:
                  pathname === "/admin/settings"
                    ? colorTheme.primary
                    : colorTheme.secondaryBg,
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: collapsed ? 0 : 2,
                justifyContent: "center",
                color:
                  pathname === "/admin/settings"
                    ? "white"
                    : colorTheme.textLight,
              }}
            >
              <Settings />
            </ListItemIcon>

            <Collapse in={!collapsed} orientation="horizontal">
              <ListItemText
                primary="Settings"
                primaryTypographyProps={{ fontSize: "0.9rem" }}
              />
            </Collapse>
          </ListItem>
        </Tooltip> */}

        {/* Logout */}
        <Tooltip title={collapsed ? "Logout" : ""} placement="right">
          <ListItem
            button
            sx={{
              minHeight: 48,
              justifyContent: collapsed ? "center" : "initial",
              px: 2.5,
              borderRadius: "12px",
              color: colorTheme.textLight,
              "&:hover": {
                backgroundColor: "#FFE5E5",
                color: "#D32F2F",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: collapsed ? 0 : 2,
                justifyContent: "center",
                color: "inherit",
              }}
            >
              <Logout />
            </ListItemIcon>

            <Collapse in={!collapsed} orientation="horizontal">
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{ fontSize: "0.9rem" }}
              />
            </Collapse>
          </ListItem>
        </Tooltip>
      </Box>
    </Drawer>
  );
};

export default AdminSidebar;
