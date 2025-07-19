"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  Link as MuiLink,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  Email,
  Lock,
  Dashboard,
} from "@mui/icons-material";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";

// Separate component that uses useSearchParams
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loading, error } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check for success message from registration
  useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      setSuccessMessage(message);
    }
  }, [searchParams]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await login(formData.email, formData.password);
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
      // Clear validation error when user starts typing
      if (validationErrors[field]) {
        setValidationErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }
    };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card
        elevation={24}
        sx={{
          maxWidth: 450,
          width: "100%",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #513ff2 0%, #6b52f5 100%)",
            color: "white",
            p: 4,
            textAlign: "center",
          }}
        >
          <Dashboard sx={{ fontSize: 48, mb: 2 }} />
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            Subscription Dashboard
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            Admin Portal Login
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          {/* Success Message */}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {successMessage}
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleInputChange("email")}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              disabled={loading}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            {/* Password Field */}
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange("password")}
              error={!!validationErrors.password}
              helperText={validationErrors.password}
              disabled={loading}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            {/* Login Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={
                loading ? <CircularProgress size={20} /> : <LoginIcon />
              }
              sx={{
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: "bold",
                mb: 3,
              }}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>

            <Divider sx={{ my: 3 }} />

            {/* Register Link */}
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="textSecondary">
                Don't have an account?{" "}
                <Link href="/auth/register" passHref>
                  <MuiLink
                    component="span"
                    sx={{
                      color: "primary.main",
                      textDecoration: "none",
                      fontWeight: 600,
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Create Account
                  </MuiLink>
                </Link>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

// Loading fallback component
function LoginLoading() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card
        elevation={24}
        sx={{
          maxWidth: 450,
          width: "100%",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #513ff2 0%, #6b52f5 100%)",
            color: "white",
            p: 4,
            textAlign: "center",
          }}
        >
          <Dashboard sx={{ fontSize: 48, mb: 2 }} />
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            Subscription Dashboard
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            Admin Portal Login
          </Typography>
        </Box>
        <CardContent sx={{ p: 4, textAlign: "center" }}>
          <CircularProgress size={48} />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Loading...
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

// Main component with Suspense boundary
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  );
}
