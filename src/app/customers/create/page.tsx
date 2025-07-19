'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
} from '@mui/material';
import { PersonAdd, Business, Email, Phone, LocationOn, Save, Cancel, ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import { apiClient } from '@/services/api';

interface CustomerFormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  address: string;
  customerType: 'individual' | 'business';
  notes: string;
}

export default function CreateCustomerPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<CustomerFormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    address: '',
    customerType: 'business',
    notes: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      errors.name = 'Customer name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (formData.customerType === 'business' && !formData.company.trim()) {
      errors.company = 'Company name is required for business customers';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
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
      const response = await apiClient.post('/api/v1/subscription/customers', {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        company: formData.company.trim() || null,
        phone: formData.phone.trim(),
        address: formData.address.trim() || null,
        metadata: {
          customer_type: formData.customerType,
          notes: formData.notes.trim() || null,
          created_via: 'dashboard',
          created_at: new Date().toISOString(),
        },
      });

      if (response.success) {
        setSuccess('Customer created successfully!');
        // Redirect to customer list or subscription creation after 2 seconds
        setTimeout(() => {
          router.push('/customers');
        }, 2000);
      } else {
        setError(response.error || 'Failed to create customer');
      }
    } catch (error) {
      console.error('Customer creation failed:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof CustomerFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleCancel = () => {
    router.push('/customers');
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Link href='/customers' style={{ textDecoration: 'none' }}>
            <Button variant='outlined' startIcon={<ArrowBack />} sx={{ minWidth: 'auto' }}>
              Back
            </Button>
          </Link>
          <Typography variant='h4' component='h1' sx={{ fontWeight: 700, color: '#1e293b' }}>
            Create New Customer
          </Typography>
        </Box>
        <Typography variant='body1' color='textSecondary'>
          Add a new customer to the Flowlytix subscription system
        </Typography>
      </Box>

      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          {/* Success Alert */}
          {success && (
            <Alert severity='success' sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert severity='error' sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Customer Type */}
              <Grid item xs={12}>
                <Typography variant='h6' gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonAdd color='primary' />
                  Customer Type
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip
                    label='Business'
                    clickable
                    color={formData.customerType === 'business' ? 'primary' : 'default'}
                    onClick={() => setFormData((prev) => ({ ...prev, customerType: 'business' }))}
                    icon={<Business />}
                  />
                  <Chip
                    label='Individual'
                    clickable
                    color={formData.customerType === 'individual' ? 'primary' : 'default'}
                    onClick={() => setFormData((prev) => ({ ...prev, customerType: 'individual' }))}
                    icon={<PersonAdd />}
                  />
                </Box>
                <Divider sx={{ my: 2 }} />
              </Grid>

              {/* Basic Information */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label='Customer Name'
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  error={!!validationErrors.name}
                  helperText={validationErrors.name}
                  disabled={isLoading}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label='Email Address'
                  type='email'
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  error={!!validationErrors.email}
                  helperText={validationErrors.email}
                  disabled={isLoading}
                  required
                />
              </Grid>

              {/* Company (only for business customers) */}
              {formData.customerType === 'business' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='Company Name'
                    value={formData.company}
                    onChange={handleInputChange('company')}
                    error={!!validationErrors.company}
                    helperText={validationErrors.company}
                    disabled={isLoading}
                    required
                  />
                </Grid>
              )}

              {/* Contact Information */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label='Phone Number'
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  error={!!validationErrors.phone}
                  helperText={validationErrors.phone}
                  disabled={isLoading}
                  placeholder='+1-555-123-4567'
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label='Address'
                  value={formData.address}
                  onChange={handleInputChange('address')}
                  error={!!validationErrors.address}
                  helperText={validationErrors.address}
                  disabled={isLoading}
                  placeholder='123 Main St, City, State 12345'
                />
              </Grid>

              {/* Notes */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Notes (Optional)'
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={handleInputChange('notes')}
                  disabled={isLoading}
                  placeholder='Additional information about the customer...'
                />
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button variant='outlined' onClick={handleCancel} disabled={isLoading} startIcon={<Cancel />}>
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    variant='contained'
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} /> : <Save />}
                    sx={{ minWidth: 140 }}
                  >
                    {isLoading ? 'Creating...' : 'Create Customer'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
