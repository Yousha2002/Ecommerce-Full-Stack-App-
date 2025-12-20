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
  Person,
  Email,
  Lock,
  Phone,
  Home,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import {
  registerUser,
  clearError,
  clearRegistrationSuccess,
} from "../../../store/slices/authSlice";
import { useRouter } from "next/navigation";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const { isLoading, error, registrationSuccess } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (registrationSuccess) {
      const timer = setTimeout(() => {
        dispatch(clearRegistrationSuccess());
        router.push("/login?fromRegister=true");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [registrationSuccess, dispatch, router]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  const password = watch("password");

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  // Color theme
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
        <Zoom in={true} timeout={700}>
          <Paper
            elevation={8}
            className="p-10 rounded-2xl shadow-xl border"
            sx={{
              backgroundColor: colors.light,
              border: `1px solid ${colors.secondary}`,
            }}
          >
            {/* Header */}
            <Box className="text-center mb-8">
              <Box
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                sx={{ backgroundColor: colors.primary }}
              >
                <Person sx={{ fontSize: 32, color: colors.background }} />
              </Box>
              <Typography
                variant="h4"
                className="font-bold"
                sx={{ color: colors.textDark }}
              >
                Create Account
              </Typography>
              <Typography
                variant="body2"
                className="mt-1"
                sx={{ color: colors.textLight }}
              >
                Join us today and get started
              </Typography>
            </Box>

            {/* Alerts */}
            <Fade in={!!error}>
              <Box className="mb-4">
                {error && (
                  <Alert
                    severity="error"
                    onClose={() => dispatch(clearError())}
                    className="rounded-xl border-l-4"
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

            <Fade in={registrationSuccess}>
              <Box className="mb-4">
                {registrationSuccess && (
                  <Alert
                    severity="success"
                    className="rounded-xl border-l-4"
                    sx={{
                      borderColor: "#4CAF50",
                      backgroundColor: "#E8F5E8",
                      color: colors.textDark,
                    }}
                  >
                    Registration successful! Redirecting...
                  </Alert>
                )}
              </Box>
            </Fade>

            {/* Form */}
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {/* Full Name */}
              <TextField
                fullWidth
                label="Full Name"
                {...register("name", { required: "Full name is required" })}
                error={!!errors.name}
                helperText={errors.name?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: colors.textLight }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
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

              {/* Email */}
              <TextField
                fullWidth
                label="Email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email",
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

              {/* Password */}
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Min 6 characters" },
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
                        onClick={handleClickShowPassword}
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

              {/* Confirm Password */}
              <TextField
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Please confirm password",
                  validate: (v) => v === password || "Passwords do not match",
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: colors.textLight }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowConfirmPassword}
                        sx={{
                          color: colors.textLight,
                          "&:hover": {
                            color: colors.primary,
                            backgroundColor: colors.secondary,
                          },
                        }}
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
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

              {/* Phone Number */}
              <TextField
                fullWidth
                label="Phone Number"
                {...register("phone")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone sx={{ color: colors.textLight }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
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

              {/* Address */}
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={3}
                {...register("address")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Home
                        sx={{ color: colors.textLight, marginTop: "8px" }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
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

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={isLoading || registrationSuccess}
                sx={{
                  py: 1.5,
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  backgroundColor: colors.primary,
                  color: colors.background,
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
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>

              {/* Login Link */}
              <Box className="text-center mt-4">
                <Typography variant="body2" sx={{ color: colors.textLight }}>
                  Already have an account?{" "}
                  <Link
                    href="/login"
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
                    Sign in
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

export default Register;
