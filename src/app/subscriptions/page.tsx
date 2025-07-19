'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Alert,
  CircularProgress,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Snackbar,
  Backdrop,
} from '@mui/material';
import {
  Add,
  Search,
  MoreVert,
  VpnKey,
  Business,
  Person,
  Edit,
  Delete,
  Visibility,
  Pause,
  PlayArrow,
  DeviceHub,
  Warning,
} from '@mui/icons-material';
import Link from 'next/link';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { Subscription, SubscriptionTier } from '@/types';

export default function SubscriptionsPage() {
  const router = useRouter();
  const {
    subscriptions,
    isLoading,
    error,
    deleteSubscription,
    updateSubscription,
    suspendSubscription,
    resumeSubscription,
    fetchSubscriptions,
    isDeleting,
    isUpdating,
    clearError,
  } = useSubscriptions();

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subscriptionToDelete, setSubscriptionToDelete] = useState<Subscription | null>(null);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [subscriptionToEdit, setSubscriptionToEdit] = useState<Subscription | null>(null);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, subscription: Subscription) => {
    setAnchorEl(event.currentTarget);
    setSelectedSubscription(subscription);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSubscription(null);
  };

  const handleViewSubscription = () => {
    if (selectedSubscription) {
      router.push(`/subscriptions/${selectedSubscription.id}`);
    }
    handleMenuClose();
  };

  const handleEditSubscription = () => {
    if (selectedSubscription) {
      setSubscriptionToEdit(selectedSubscription);
      setEditModalOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteSubscription = () => {
    if (selectedSubscription) {
      setSubscriptionToDelete(selectedSubscription);
      setDeleteDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleSuspendSubscription = async () => {
    if (selectedSubscription) {
      try {
        const result = await suspendSubscription(selectedSubscription.id, 'Suspended by administrator');
        if (result.success) {
          showSnackbar('Subscription suspended successfully', 'success');
          fetchSubscriptions(); // Refresh the list
        } else {
          showSnackbar(result.error || 'Failed to suspend subscription', 'error');
        }
      } catch (error) {
        showSnackbar('Failed to suspend subscription', 'error');
      }
    }
    handleMenuClose();
  };

  const handleResumeSubscription = async () => {
    if (selectedSubscription) {
      try {
        const result = await resumeSubscription(selectedSubscription.id);
        if (result.success) {
          showSnackbar('Subscription resumed successfully', 'success');
          fetchSubscriptions(); // Refresh the list
        } else {
          showSnackbar(result.error || 'Failed to resume subscription', 'error');
        }
      } catch (error) {
        showSnackbar('Failed to resume subscription', 'error');
      }
    }
    handleMenuClose();
  };

  const confirmDeleteSubscription = async () => {
    if (subscriptionToDelete) {
      try {
        const result = await deleteSubscription(subscriptionToDelete.id);
        if (result.success) {
          showSnackbar('Subscription deleted successfully', 'success');
          fetchSubscriptions(); // Refresh the list
        } else {
          showSnackbar(result.error || 'Failed to delete subscription', 'error');
        }
      } catch (error) {
        showSnackbar('Failed to delete subscription', 'error');
      }
    }
    setDeleteDialogOpen(false);
    setSubscriptionToDelete(null);
  };

  const cancelDeleteSubscription = () => {
    setDeleteDialogOpen(false);
    setSubscriptionToDelete(null);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleEditSubmit = async (id: string, data: any) => {
    try {
      const result = await updateSubscription(id, data);
      if (result.success) {
        showSnackbar('Subscription updated successfully', 'success');
        setEditModalOpen(false);
        setSubscriptionToEdit(null);
        fetchSubscriptions(); // Refresh the list
      } else {
        showSnackbar(result.error || 'Failed to update subscription', 'error');
      }
    } catch (error) {
      showSnackbar('Failed to update subscription', 'error');
    }
  };

  // Filter subscriptions based on search query
  const filteredSubscriptions = (subscriptions || []).filter(
    (subscription) =>
      subscription.licenseKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subscription.tier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subscription.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subscription.customerId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Paginate filtered subscriptions
  const paginatedSubscriptions = filteredSubscriptions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'suspended':
        return 'warning';
      case 'expired':
        return 'error';
      case 'cancelled':
        return 'default';
      default:
        return 'default';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'basic':
        return '#64748b';
      case 'professional':
        return '#3b82f6';
      case 'enterprise':
        return '#8b5cf6';
      default:
        return '#64748b';
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString();
  };

  const isExpiringSoon = (expiresAt: string | Date) => {
    const expirationDate = new Date(expiresAt);
    const today = new Date();
    const daysUntilExpiration = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiration <= 30 && daysUntilExpiration > 0;
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  return (
    <Box sx={{ px: 2, py: 1 }}>
      {/* Loading Backdrop */}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isDeleting || isUpdating}>
        <CircularProgress color='inherit' />
      </Backdrop>

      {/* Error Display */}
      {error && (
        <Alert severity='error' sx={{ mb: 2 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant='h4' component='h1' fontWeight='bold' color='primary'>
            Subscriptions
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Manage licenses and subscription plans
          </Typography>
        </Box>
        <Link href='/subscriptions/create' passHref>
          <Button variant='contained' startIcon={<Add />} sx={{ borderRadius: 2 }}>
            Create Subscription
          </Button>
        </Link>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              placeholder='Search subscriptions...'
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ flex: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>License Key</TableCell>
                <TableCell>Tier</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Devices</TableCell>
                <TableCell>Expires</TableCell>
                <TableCell>Revenue</TableCell>
                <TableCell align='right'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedSubscriptions.map((subscription) => (
                <TableRow key={subscription.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {subscription.customerName?.charAt(0).toUpperCase() || 'U'}
                      </Avatar>
                      <Box>
                        <Typography variant='subtitle2' fontWeight={600}>
                          {subscription.customerName || 'Unknown Customer'}
                        </Typography>
                        <Typography variant='body2' color='textSecondary'>
                          {subscription.customerId}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <VpnKey sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant='body2' sx={{ fontFamily: 'monospace' }}>
                        {subscription.licenseKey}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={subscription.tier.toUpperCase()}
                      size='small'
                      sx={{
                        bgcolor: getTierColor(subscription.tier),
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={subscription.status.toUpperCase()}
                      size='small'
                      color={getStatusColor(subscription.status) as any}
                      variant='filled'
                    />
                    {isExpiringSoon(subscription.expiresAt) && (
                      <Chip label='Expiring Soon' size='small' color='warning' variant='outlined' sx={{ ml: 1 }} />
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DeviceHub sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant='body2'>
                        {subscription.devicesConnected || 0}/{subscription.maxDevices}
                      </Typography>
                      <LinearProgress
                        variant='determinate'
                        value={((subscription.devicesConnected || 0) / subscription.maxDevices) * 100}
                        sx={{
                          width: 40,
                          height: 6,
                          borderRadius: 3,
                          bgcolor: '#e2e8f0',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: subscription.devicesConnected === subscription.maxDevices ? '#ef4444' : '#10b981',
                          },
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' color='text.secondary'>
                      {formatDate(subscription.expiresAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' fontWeight={600}>
                      {(() => {
                        // Calculate revenue based on tier
                        let price = 0;
                        switch (subscription.tier) {
                          case SubscriptionTier.BASIC:
                            price = 299;
                            break;
                          case SubscriptionTier.PROFESSIONAL:
                            price = 599;
                            break;
                          case SubscriptionTier.ENTERPRISE:
                            price = 1299;
                            break;
                          default:
                            price = 299;
                        }
                        return `PKR ${price.toLocaleString()}`;
                      })()}
                    </Typography>
                  </TableCell>
                  <TableCell align='right'>
                    <IconButton onClick={(event) => handleMenuOpen(event, subscription)}>
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={filteredSubscriptions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleViewSubscription}>
          <ListItemIcon>
            <Visibility fontSize='small' />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEditSubscription}>
          <ListItemIcon>
            <Edit fontSize='small' />
          </ListItemIcon>
          <ListItemText>Edit Subscription</ListItemText>
        </MenuItem>
        {selectedSubscription?.status === 'suspended' ? (
          <MenuItem onClick={handleResumeSubscription}>
            <ListItemIcon>
              <PlayArrow fontSize='small' />
            </ListItemIcon>
            <ListItemText>Resume</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem onClick={handleSuspendSubscription}>
            <ListItemIcon>
              <Pause fontSize='small' />
            </ListItemIcon>
            <ListItemText>Suspend</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={handleDeleteSubscription} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize='small' color='error' />
          </ListItemIcon>
          <ListItemText>Delete Subscription</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={cancelDeleteSubscription} maxWidth='sm' fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color='error' />
          Confirm Delete Subscription
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this subscription? This action cannot be undone.
          </DialogContentText>
          {subscriptionToDelete && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant='subtitle2' fontWeight={600}>
                Subscription Details:
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Customer: {subscriptionToDelete.customerName}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                License Key: {subscriptionToDelete.licenseKey}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Tier: {subscriptionToDelete.tier}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Status: {subscriptionToDelete.status}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeleteSubscription} color='primary'>
            Cancel
          </Button>
          <Button onClick={confirmDeleteSubscription} color='error' variant='contained' disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Subscription Modal */}
      <EditSubscriptionModal
        open={editModalOpen}
        subscription={subscriptionToEdit}
        onClose={() => {
          setEditModalOpen(false);
          setSubscriptionToEdit(null);
        }}
        onSubmit={handleEditSubmit}
        isUpdating={isUpdating}
      />

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

// Edit Subscription Modal Component
interface EditSubscriptionModalProps {
  open: boolean;
  subscription: Subscription | null;
  onClose: () => void;
  onSubmit: (id: string, data: any) => void;
  isUpdating: boolean;
}

const EditSubscriptionModal: React.FC<EditSubscriptionModalProps> = ({
  open,
  subscription,
  onClose,
  onSubmit,
  isUpdating,
}) => {
  const [formData, setFormData] = useState({
    tier: '',
    features: [] as string[],
    maxDevices: 1,
    expiresAt: '',
    gracePeriodDays: 0,
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Available tiers
  const tiers = [
    { value: 'basic', label: 'Basic', color: '#64748b' },
    { value: 'professional', label: 'Professional', color: '#3b82f6' },
    { value: 'enterprise', label: 'Enterprise', color: '#8b5cf6' },
  ];

  // Available features
  const availableFeatures = [
    'analytics',
    'reporting',
    'api_access',
    'priority_support',
    'custom_branding',
    'advanced_security',
    'bulk_operations',
    'multi_tenant',
  ];

  useEffect(() => {
    if (subscription) {
      setFormData({
        tier: (subscription.tier as string) || '',
        features: subscription.features || [],
        maxDevices: subscription.maxDevices || 1,
        expiresAt: subscription.expiresAt ? new Date(subscription.expiresAt).toISOString().split('T')[0] : '',
        gracePeriodDays: subscription.gracePeriodDays || 0,
        notes: subscription.notes || '',
      });
      setErrors({});
    }
  }, [subscription]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.tier) {
      newErrors.tier = 'Tier is required';
    }

    if (formData.maxDevices < 1) {
      newErrors.maxDevices = 'Max devices must be at least 1';
    }

    if (formData.maxDevices > 1000) {
      newErrors.maxDevices = 'Max devices cannot exceed 1000';
    }

    if (!formData.expiresAt) {
      newErrors.expiresAt = 'Expiration date is required';
    } else {
      const expirationDate = new Date(formData.expiresAt);
      const today = new Date();
      if (expirationDate <= today) {
        newErrors.expiresAt = 'Expiration date must be in the future';
      }
    }

    if (formData.gracePeriodDays < 0) {
      newErrors.gracePeriodDays = 'Grace period cannot be negative';
    }

    if (formData.gracePeriodDays > 365) {
      newErrors.gracePeriodDays = 'Grace period cannot exceed 365 days';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!subscription || !validateForm()) return;

    const updateData = {
      tier: formData.tier as SubscriptionTier,
      features: formData.features,
      maxDevices: formData.maxDevices,
      expiresAt: new Date(formData.expiresAt),
      gracePeriodDays: formData.gracePeriodDays,
      notes: formData.notes || undefined,
    };

    onSubmit(subscription.id, updateData);
  };

  const handleClose = () => {
    setFormData({
      tier: '',
      features: [],
      maxDevices: 1,
      expiresAt: '',
      gracePeriodDays: 0,
      notes: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Edit color='primary' />
        Edit Subscription
      </DialogTitle>
      <DialogContent dividers>
        {subscription && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant='subtitle2' fontWeight={600} gutterBottom>
              Subscription Information
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Typography variant='body2' color='text.secondary'>
                <strong>Customer:</strong> {subscription.customerName}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                <strong>License Key:</strong> {subscription.licenseKey}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                <strong>Status:</strong> {subscription.status}
              </Typography>
            </Box>
          </Box>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Tier Selection */}
          <Box>
            <Typography variant='subtitle2' fontWeight={600} gutterBottom>
              Subscription Tier *
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {tiers.map((tier) => (
                <Button
                  key={tier.value}
                  variant={formData.tier === tier.value ? 'contained' : 'outlined'}
                  onClick={() => handleInputChange('tier', tier.value)}
                  sx={{
                    ...(formData.tier === tier.value && {
                      bgcolor: tier.color,
                      '&:hover': { bgcolor: tier.color },
                    }),
                  }}
                >
                  {tier.label}
                </Button>
              ))}
            </Box>
            {errors.tier && (
              <Typography variant='body2' color='error' sx={{ mt: 1 }}>
                {errors.tier}
              </Typography>
            )}
          </Box>

          {/* Max Devices */}
          <Box>
            <Typography variant='subtitle2' fontWeight={600} gutterBottom>
              Maximum Devices *
            </Typography>
            <TextField
              type='number'
              value={formData.maxDevices}
              onChange={(e) => handleInputChange('maxDevices', parseInt(e.target.value) || 1)}
              error={!!errors.maxDevices}
              helperText={errors.maxDevices}
              inputProps={{ min: 1, max: 1000 }}
              sx={{ width: '200px' }}
            />
          </Box>

          {/* Expiration Date */}
          <Box>
            <Typography variant='subtitle2' fontWeight={600} gutterBottom>
              Expiration Date *
            </Typography>
            <TextField
              type='date'
              value={formData.expiresAt}
              onChange={(e) => handleInputChange('expiresAt', e.target.value)}
              error={!!errors.expiresAt}
              helperText={errors.expiresAt}
              sx={{ width: '200px' }}
            />
          </Box>

          {/* Grace Period */}
          <Box>
            <Typography variant='subtitle2' fontWeight={600} gutterBottom>
              Grace Period (Days)
            </Typography>
            <TextField
              type='number'
              value={formData.gracePeriodDays}
              onChange={(e) => handleInputChange('gracePeriodDays', parseInt(e.target.value) || 0)}
              error={!!errors.gracePeriodDays}
              helperText={errors.gracePeriodDays || 'Number of days after expiration before subscription is cancelled'}
              inputProps={{ min: 0, max: 365 }}
              sx={{ width: '200px' }}
            />
          </Box>

          {/* Features */}
          <Box>
            <Typography variant='subtitle2' fontWeight={600} gutterBottom>
              Features
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {availableFeatures.map((feature) => (
                <Chip
                  key={feature}
                  label={feature.replace('_', ' ').toUpperCase()}
                  clickable
                  variant={formData.features.includes(feature) ? 'filled' : 'outlined'}
                  color={formData.features.includes(feature) ? 'primary' : 'default'}
                  onClick={() => handleFeatureToggle(feature)}
                  size='small'
                />
              ))}
            </Box>
          </Box>

          {/* Notes */}
          <Box>
            <Typography variant='subtitle2' fontWeight={600} gutterBottom>
              Notes
            </Typography>
            <TextField
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder='Add any additional notes or comments...'
              fullWidth
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          Cancel
        </Button>
        <Button onClick={handleSubmit} color='primary' variant='contained' disabled={isUpdating}>
          {isUpdating ? 'Updating...' : 'Update Subscription'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
