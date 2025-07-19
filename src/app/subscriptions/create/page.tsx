"use client";

import React, { useState, useEffect } from "react";
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
  Grid,
  Divider,
  MenuItem,
  Chip,
  FormControlLabel,
  Switch,
  InputAdornment,
  Autocomplete,
} from "@mui/material";
import {
  VpnKey,
  Business,
  Save,
  Cancel,
  ArrowBack,
  AttachMoney,
  DeviceHub,
  Schedule,
  Star,
} from "@mui/icons-material";
import Link from "next/link";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { apiClient } from "@/services/api";

interface SubscriptionFormData {
  customerId: string;
  customerName: string;
  tier: "basic" | "professional" | "enterprise" | "trial";
  duration: number; // in days
  maxDevices: number;
  price: number;
  currency: string;
  autoRenew: boolean;
  gracePeriodDays: number;
  features: string[];
  notes: string;
  startsAt: Date;
  expiresAt: Date;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  company?: string;
}

const subscriptionTiers = [
  {
    value: "trial",
    label: "Trial",
    features: ["basic_analytics", "core_features"],
    defaultPrice: 0,
    defaultDevices: 1,
    color: "#95A5A6",
  },
  {
    value: "basic",
    label: "Basic",
    features: ["basic_analytics", "core_features", "email_support"],
    defaultPrice: 99,
    defaultDevices: 3,
    color: "#45B7D1",
  },
  {
    value: "professional",
    label: "Professional",
    features: [
      "advanced_analytics",
      "core_features",
      "priority_support",
      "api_access",
    ],
    defaultPrice: 299,
    defaultDevices: 10,
    color: "#4ECDC4",
  },
  {
    value: "enterprise",
    label: "Enterprise",
    features: [
      "advanced_analytics",
      "core_features",
      "dedicated_support",
      "api_access",
      "custom_integrations",
    ],
    defaultPrice: 999,
    defaultDevices: 50,
    color: "#FF6B35",
  },
];

const availableFeatures = [
  "core_features",
  "basic_analytics",
  "advanced_analytics",
  "email_support",
  "priority_support",
  "dedicated_support",
  "api_access",
  "custom_integrations",
  "white_labeling",
  "multi_tenant",
];

// Real customers will be fetched from the backend API

export default function CreateSubscriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCustomerId = searchParams.get("customerId");

  const [formData, setFormData] = useState<SubscriptionFormData>({
    customerId: preselectedCustomerId || "",
    customerName: "",
    tier: "basic",
    duration: 365,
    maxDevices: 3,
    price: 99,
    currency: "USD",
    autoRenew: false,
    gracePeriodDays: 7,
    features: ["basic_analytics", "core_features", "email_support"],
    notes: "",
    startsAt: new Date(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
  });

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  // Fetch customers from the backend
  const fetchCustomers = async () => {
    setIsLoadingCustomers(true);
    try {
      const response = await apiClient.get("/api/v1/subscription/customers");
      if (response.success) {
        const customersData = (response.data as any)?.items || [];
        setCustomers(customersData);
      } else {
        console.error("Failed to fetch customers:", response.error);
        setError("Failed to load customers. Please try refreshing the page.");
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      setError("Failed to load customers. Please check your connection.");
    } finally {
      setIsLoadingCustomers(false);
    }
  };

  // Load customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (preselectedCustomerId) {
      const customer = customers.find((c) => c.id === preselectedCustomerId);
      if (customer) {
        setFormData((prev) => ({
          ...prev,
          customerId: customer.id,
          customerName: customer.name,
        }));
      }
    }
  }, [preselectedCustomerId, customers]);

  useEffect(() => {
    // Update expiry date when start date or duration changes
    const newExpiryDate = new Date(formData.startsAt);
    newExpiryDate.setDate(newExpiryDate.getDate() + formData.duration);
    setFormData((prev) => ({ ...prev, expiresAt: newExpiryDate }));
  }, [formData.startsAt, formData.duration]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.customerId) {
      errors.customerId = "Customer is required";
    }

    if (!formData.tier) {
      errors.tier = "Subscription tier is required";
    }

    if (formData.duration < 1) {
      errors.duration = "Duration must be at least 1 day";
    }

    if (formData.maxDevices < 1) {
      errors.maxDevices = "Max devices must be at least 1";
    }

    if (formData.price < 0) {
      errors.price = "Price cannot be negative";
    }

    if (formData.gracePeriodDays < 0) {
      errors.gracePeriodDays = "Grace period cannot be negative";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Prepare the data according to the API schema
      const subscriptionData = {
        customer_id: formData.customerId,
        tier: formData.tier,
        duration_days: parseInt(formData.duration.toString()),
        max_devices: parseInt(formData.maxDevices.toString()),
        price: parseFloat(formData.price.toString()) || null,
        currency: formData.currency,
        auto_renew: formData.autoRenew,
        grace_period_days: parseInt(formData.gracePeriodDays.toString()),
        metadata: formData.notes.trim()
          ? {
              notes: formData.notes.trim(),
              created_via: "dashboard",
              created_at: new Date().toISOString(),
            }
          : null,
        custom_features:
          formData.features.length > 0
            ? {
                enabled_features: formData.features,
              }
            : null,
      };

      console.log("Sending subscription data:", subscriptionData);

      const response = await apiClient.post(
        "/api/v1/subscription/subscriptions",
        subscriptionData
      );

      if (response.success) {
        setSuccess(
          "Subscription created successfully! License key has been generated."
        );
        // Redirect after 3 seconds
        setTimeout(() => {
          router.push("/subscriptions");
        }, 3000);
      } else {
        setError(response.error || "Failed to create subscription");
      }
    } catch (error) {
      console.error("Subscription creation failed:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTierChange = (tier: string) => {
    const tierConfig = subscriptionTiers.find((t) => t.value === tier);
    if (tierConfig) {
      setFormData((prev) => ({
        ...prev,
        tier: tier as any,
        features: tierConfig.features,
        price: tierConfig.defaultPrice,
        maxDevices: tierConfig.defaultDevices,
      }));
    }
  };

  const handleInputChange =
    (field: keyof SubscriptionFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        e.target.type === "number"
          ? parseFloat(e.target.value) || 0
          : e.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear validation error
      if (validationErrors[field]) {
        setValidationErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }
    };

  const handleCancel = () => {
    router.push("/subscriptions");
  };

  const getTierColor = (tier: string) => {
    const tierConfig = subscriptionTiers.find((t) => t.value === tier);
    return tierConfig?.color || "#95A5A6";
  };

  const selectedCustomer = customers.find((c) => c.id === formData.customerId);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ px: 2, py: 1, maxWidth: 900, mx: "auto" }}>
        {/* Header */}
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 700, color: "#1e293b" }}
            >
              Create Subscription
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Generate a new subscription and license key for a customer
            </Typography>
          </Box>
          <Link href="/subscriptions" style={{ textDecoration: "none" }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              size="large"
              sx={{ borderRadius: 2 }}
            >
              Back to Subscriptions
            </Button>
          </Link>
        </Box>

        <Card elevation={3}>
          <CardContent sx={{ p: 4 }}>
            {/* Success Alert */}
            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Customer Selection */}
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Business color="primary" />
                    Customer Information
                  </Typography>
                  <Autocomplete
                    value={selectedCustomer || null}
                    onChange={(_, newValue) => {
                      setFormData((prev) => ({
                        ...prev,
                        customerId: newValue?.id || "",
                        customerName: newValue?.name || "",
                      }));
                    }}
                    options={customers}
                    getOptionLabel={(option) =>
                      `${option.name} (${option.email})`
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Customer"
                        error={!!validationErrors.customerId}
                        helperText={validationErrors.customerId}
                        required
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        <Box>
                          <Typography variant="body1">{option.name}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {option.email}
                            {option.company && ` • ${option.company}`}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    disabled={isLoading || isLoadingCustomers}
                    fullWidth
                  />
                  <Divider sx={{ my: 2 }} />
                </Grid>

                {/* Subscription Tier */}
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Star color="primary" />
                    Subscription Tier
                  </Typography>
                  <Box
                    sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}
                  >
                    {subscriptionTiers.map((tier) => (
                      <Chip
                        key={tier.value}
                        label={tier.label}
                        clickable
                        color={
                          formData.tier === tier.value ? "primary" : "default"
                        }
                        onClick={() => handleTierChange(tier.value)}
                        sx={{
                          borderColor:
                            formData.tier === tier.value
                              ? undefined
                              : tier.color,
                          color:
                            formData.tier === tier.value
                              ? undefined
                              : tier.color,
                        }}
                      />
                    ))}
                  </Box>
                  <Divider sx={{ my: 2 }} />
                </Grid>

                {/* Subscription Details */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Duration (Days)"
                    type="number"
                    value={formData.duration}
                    onChange={handleInputChange("duration")}
                    error={!!validationErrors.duration}
                    helperText={validationErrors.duration}
                    disabled={isLoading}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Schedule color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Max Devices"
                    type="number"
                    value={formData.maxDevices}
                    onChange={handleInputChange("maxDevices")}
                    error={!!validationErrors.maxDevices}
                    helperText={validationErrors.maxDevices}
                    disabled={isLoading}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DeviceHub color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Pricing */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange("price")}
                    error={!!validationErrors.price}
                    helperText={validationErrors.price}
                    disabled={isLoading}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Currency"
                    select
                    value={formData.currency}
                    onChange={handleInputChange("currency")}
                    disabled={isLoading}
                  >
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem>
                    <MenuItem value="GBP">GBP</MenuItem>
                  </TextField>
                </Grid>

                {/* Dates */}
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Start Date"
                    value={formData.startsAt}
                    onChange={(newValue) => {
                      if (newValue) {
                        setFormData((prev) => ({
                          ...prev,
                          startsAt: newValue,
                        }));
                      }
                    }}
                    disabled={isLoading}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Expires At"
                    value={formData.expiresAt}
                    onChange={(newValue) => {
                      if (newValue) {
                        setFormData((prev) => ({
                          ...prev,
                          expiresAt: newValue,
                        }));
                      }
                    }}
                    disabled={true} // Auto-calculated
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        helperText:
                          "Auto-calculated based on start date and duration",
                      },
                    }}
                  />
                </Grid>

                {/* Settings */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Grace Period (Days)"
                    type="number"
                    value={formData.gracePeriodDays}
                    onChange={handleInputChange("gracePeriodDays")}
                    error={!!validationErrors.gracePeriodDays}
                    helperText={validationErrors.gracePeriodDays}
                    disabled={isLoading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.autoRenew}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            autoRenew: e.target.checked,
                          }))
                        }
                        disabled={isLoading}
                      />
                    }
                    label="Auto Renew"
                    sx={{ mt: 2 }}
                  />
                </Grid>

                {/* Features */}
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    value={formData.features}
                    onChange={(_, newValue) => {
                      setFormData((prev) => ({ ...prev, features: newValue }));
                    }}
                    options={availableFeatures}
                    getOptionLabel={(option) =>
                      option
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())
                    }
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          variant="outlined"
                          label={option
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Features"
                        placeholder="Select features..."
                      />
                    )}
                    disabled={isLoading}
                  />
                </Grid>

                {/* Notes */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes (Optional)"
                    multiline
                    rows={3}
                    value={formData.notes}
                    onChange={handleInputChange("notes")}
                    disabled={isLoading}
                    placeholder="Additional information about this subscription..."
                  />
                </Grid>

                {/* Action Buttons */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box
                    sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
                  >
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      disabled={isLoading}
                      startIcon={<Cancel />}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isLoading}
                      startIcon={
                        isLoading ? <CircularProgress size={20} /> : <VpnKey />
                      }
                      sx={{ minWidth: 160 }}
                    >
                      {isLoading ? "Creating..." : "Generate License"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
}
