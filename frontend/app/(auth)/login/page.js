"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  Fade,
  Zoom,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { loginUser, clearError } from "../../../store/slices/authSlice";
import { useRouter, useSearchParams } from "next/navigation";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { isLoading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showRegistrationMessage, setShowRegistrationMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fromRegister = searchParams.get("fromRegister");
    if (fromRegister === "true") {
      setShowRegistrationMessage(true);
    }

    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router, searchParams]);

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const colors = {
    background: "#F9F8F6",
    light: "#EFE9E3",
    secondary: "#D9CFC7",
    primary: "#C9B59C",
    textDark: "#5D4037",
    textLight: "#8D6E63",
  };

  return (
    <Box
      className="min-h-screen flex items-center justify-center"
      sx={{ backgroundColor: colors.background }}
    >
      <Container maxWidth="sm">
        <Zoom in={true} timeout={800}>
          <Paper
            elevation={8}
            className="p-8 rounded-2xl shadow-2xl"
            sx={{
              backgroundColor: colors.light,
              border: `1px solid ${colors.secondary}`,
            }}
          >
            {/* Header Section */}
            <Box className="text-center mb-8">
              <Box
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                sx={{
                  backgroundColor: colors.primary,
                }}
              >
                <Person sx={{ fontSize: 32, color: colors.background }} />
              </Box>
              <Typography
                variant="h4"
                className="font-bold"
                sx={{ color: colors.textDark }}
              >
                Welcome Back
              </Typography>
              <Typography
                variant="body2"
                className="mt-2"
                sx={{ color: colors.textLight }}
              >
                Sign in to your account to continue
              </Typography>
            </Box>

            {/* Messages */}
            <Fade in={showRegistrationMessage || !!error}>
              <Box className="mb-6">
                {showRegistrationMessage && (
                  <Alert
                    severity="success"
                    className="mb-3 rounded-xl border-l-4"
                    icon={<Person />}
                    sx={{
                      borderColor: "#4CAF50",
                      backgroundColor: "#E8F5E8",
                      color: colors.textDark,
                    }}
                  >
                    Registration successful! Please login with your credentials.
                  </Alert>
                )}

                {error && (
                  <Alert
                    severity="error"
                    className="mb-3 rounded-xl border-l-4"
                    onClose={() => dispatch(clearError())}
                    icon={<Lock />}
                    sx={{
                      borderColor: "#F44336",
                      backgroundColor: "#FFEBEE",
                      color: colors.textDark,
                    }}
                  >
                    {error}
                  </Alert>
                )}
              </Box>
            </Fade>

            {/* Login Form */}
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {/* Email Field */}
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                variant="outlined"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Please enter a valid email address",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: colors.textLight }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    backgroundColor: colors.background,
                    "&:hover fieldset": {
                      borderColor: colors.primary,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: colors.primary,
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: colors.textLight,
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: colors.primary,
                  },
                }}
              />

              {/* Password Field with Toggle */}
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: colors.textLight }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                        sx={{
                          color: colors.textLight,
                          "&:hover": {
                            color: colors.primary,
                            backgroundColor: colors.secondary,
                          },
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    backgroundColor: colors.background,
                    "&:hover fieldset": {
                      borderColor: colors.primary,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: colors.primary,
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: colors.textLight,
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: colors.primary,
                  },
                }}
              />

              {/* Login Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={isLoading}
                className="py-3 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300"
                sx={{
                  backgroundColor: colors.primary,
                  color: colors.background,
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: colors.textDark,
                    transform: "translateY(-2px)",
                    boxShadow: `0 8px 20px ${colors.secondary}`,
                  },
                  "&:disabled": {
                    backgroundColor: colors.secondary,
                    color: colors.textLight,
                  },
                }}
              >
                {isLoading ? (
                  <Box className="flex items-center justify-center space-x-2">
                    <Box
                      className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                      sx={{
                        borderColor: `${colors.background} ${colors.background} transparent ${colors.background}`,
                      }}
                    />
                    <span>Signing in...</span>
                  </Box>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Links Section */}
              <Box className="text-center space-y-3 pt-4">
                <Typography variant="body2" sx={{ color: colors.textLight }}>
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    sx={{
                      color: colors.primary,
                      fontWeight: "semibold",
                      textDecoration: "none",
                      "&:hover": {
                        color: colors.textDark,
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Create account
                  </Link>
                </Typography>

                <Typography variant="body2" sx={{ color: colors.textLight }}>
                  Admin access?{" "}
                  <Link
                    href="/admin"
                    sx={{
                      color: colors.textDark,
                      fontWeight: "semibold",
                      textDecoration: "none",
                      "&:hover": {
                        color: colors.primary,
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Admin Login
                  </Link>
                </Typography>

                {/* Forgot Password */}
                <Typography variant="body2" sx={{ color: colors.textLight }}>
                  <Link
                    href="/forgot-password"
                    sx={{
                      color: colors.textLight,
                      fontWeight: "medium",
                      textDecoration: "none",
                      "&:hover": {
                        color: colors.textDark,
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Forgot your password?
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Zoom>
      </Container>
    </Box>
  );
};

export default Login;
