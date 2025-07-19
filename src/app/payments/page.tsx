/**
 * Payment Management Page
 * Main page for managing payments in the subscription dashboard
 * Following Instructions file standards with comprehensive payment management
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Stack,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
} from '@mui/material';
import { Add, Download, Refresh, CheckCircle, Cancel, History, Analytics } from '@mui/icons-material';
import { PaymentTable } from '@/components/molecules/PaymentTable';
import { PaymentFilters } from '@/components/molecules/PaymentFilters';
import { PaymentStatusChip, AmountDisplay } from '@/components/atoms';
import { usePayments } from '@/hooks';
import {
  Payment,
  PaymentFilters as PaymentFiltersType,
  PaymentStatus,
  PaymentMethod,
  PaymentType,
  CreatePaymentForm,
} from '@/types';

// Component state
interface PaymentPageState {
  selectedPayments: string[];
  showCreateDialog: boolean;
  showProcessDialog: boolean;
  showFailDialog: boolean;
  showRefundDialog: boolean;
  processingPaymentId: string | null;
  snackbar: {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  };
}

/**
 * Payment Management Page Component
 */
export default function PaymentsPage() {
  // Payment management hook
  const {
    payments,
    totalCount,
    isLoading,
    isProcessing,
    error,
    filters,
    stats,
    fetchPayments,
    processPayment,
    failPayment,
    refundPayment,
    createPayment,
    bulkProcessPayments,
    setFilters,
    clearFilters,
    exportPayments,
    clearError,
  } = usePayments();

  // Component state
  const [state, setState] = useState<PaymentPageState>({
    selectedPayments: [],
    showCreateDialog: false,
    showProcessDialog: false,
    showFailDialog: false,
    showRefundDialog: false,
    processingPaymentId: null,
    snackbar: {
      open: false,
      message: '',
      severity: 'info',
    },
  });

  // Form state for dialogs
  const [createForm, setCreateForm] = useState<Partial<CreatePaymentForm>>({
    paymentMethod: PaymentMethod.MANUAL,
    paymentType: PaymentType.SUBSCRIPTION,
    currency: 'USD',
  });
  const [processNotes, setProcessNotes] = useState('');
  const [failReason, setFailReason] = useState('');
  const [refundReason, setRefundReason] = useState('');

  // Load payments on mount
  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Show success/error messages
  const showSnackbar = useCallback((message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setState((prev) => ({
      ...prev,
      snackbar: { open: true, message, severity },
    }));
  }, []);

  // Handle payment actions
  const handlePaymentAction = useCallback(
    async (paymentId: string, action: string) => {
      setState((prev) => ({ ...prev, processingPaymentId: paymentId }));

      switch (action) {
        case 'process':
          setState((prev) => ({ ...prev, showProcessDialog: true }));
          break;
        case 'fail':
          setState((prev) => ({ ...prev, showFailDialog: true }));
          break;
        case 'refund':
          setState((prev) => ({ ...prev, showRefundDialog: true }));
          break;
        case 'view':
          // TODO: Implement payment details view
          showSnackbar('Payment details view - Coming soon', 'info');
          break;
        case 'edit':
          // TODO: Implement payment editing
          showSnackbar('Payment editing - Coming soon', 'info');
          break;
        case 'delete':
          // TODO: Implement payment deletion with confirmation
          showSnackbar('Payment deletion - Coming soon', 'info');
          break;
        case 'history':
          // TODO: Implement payment history view
          showSnackbar('Payment history view - Coming soon', 'info');
          break;
        default:
          showSnackbar(`Unknown action: ${action}`, 'warning');
      }
    },
    [showSnackbar]
  );

  // Handle process payment
  const handleProcessPayment = useCallback(async () => {
    if (!state.processingPaymentId) return;

    try {
      const result = await processPayment(state.processingPaymentId, processNotes);
      if (result.success) {
        showSnackbar('Payment processed successfully', 'success');
        setState((prev) => ({
          ...prev,
          showProcessDialog: false,
          processingPaymentId: null,
        }));
        setProcessNotes('');
      } else {
        showSnackbar(result.error || 'Failed to process payment', 'error');
      }
    } catch (error) {
      showSnackbar('Failed to process payment', 'error');
    }
  }, [state.processingPaymentId, processNotes, processPayment, showSnackbar]);

  // Handle fail payment
  const handleFailPayment = useCallback(async () => {
    if (!state.processingPaymentId || !failReason.trim()) return;

    try {
      const result = await failPayment(state.processingPaymentId, failReason);
      if (result.success) {
        showSnackbar('Payment marked as failed', 'success');
        setState((prev) => ({
          ...prev,
          showFailDialog: false,
          processingPaymentId: null,
        }));
        setFailReason('');
      } else {
        showSnackbar(result.error || 'Failed to mark payment as failed', 'error');
      }
    } catch (error) {
      showSnackbar('Failed to mark payment as failed', 'error');
    }
  }, [state.processingPaymentId, failReason, failPayment, showSnackbar]);

  // Handle refund payment
  const handleRefundPayment = useCallback(async () => {
    if (!state.processingPaymentId) return;

    try {
      const result = await refundPayment(state.processingPaymentId, undefined, refundReason);
      if (result.success) {
        showSnackbar('Payment refunded successfully', 'success');
        setState((prev) => ({
          ...prev,
          showRefundDialog: false,
          processingPaymentId: null,
        }));
        setRefundReason('');
      } else {
        showSnackbar(result.error || 'Failed to refund payment', 'error');
      }
    } catch (error) {
      showSnackbar('Failed to refund payment', 'error');
    }
  }, [state.processingPaymentId, refundReason, refundPayment, showSnackbar]);

  // Handle create payment
  const handleCreatePayment = useCallback(async () => {
    if (!createForm.subscriptionId || !createForm.amount) return;

    try {
      const result = await createPayment(createForm as CreatePaymentForm);
      if (result.success) {
        showSnackbar('Payment created successfully', 'success');
        setState((prev) => ({ ...prev, showCreateDialog: false }));
        setCreateForm({
          paymentMethod: PaymentMethod.MANUAL,
          paymentType: PaymentType.SUBSCRIPTION,
          currency: 'USD',
        });
      } else {
        showSnackbar(result.error || 'Failed to create payment', 'error');
      }
    } catch (error) {
      showSnackbar('Failed to create payment', 'error');
    }
  }, [createForm, createPayment, showSnackbar]);

  // Handle bulk actions
  const handleBulkProcess = useCallback(async () => {
    if (state.selectedPayments.length === 0) return;

    try {
      const result = await bulkProcessPayments(state.selectedPayments);
      if (result.success) {
        showSnackbar(`Processed ${result.data?.processed || 0} payments`, 'success');
        setState((prev) => ({ ...prev, selectedPayments: [] }));
      } else {
        showSnackbar(result.error || 'Failed to process payments', 'error');
      }
    } catch (error) {
      showSnackbar('Failed to process payments', 'error');
    }
  }, [state.selectedPayments, bulkProcessPayments, showSnackbar]);

  // Handle export
  const handleExport = useCallback(async () => {
    try {
      const result = await exportPayments();
      if (result.success) {
        showSnackbar('Payments exported successfully', 'success');
      } else {
        showSnackbar(result.error || 'Failed to export payments', 'error');
      }
    } catch (error) {
      showSnackbar('Failed to export payments', 'error');
    }
  }, [exportPayments, showSnackbar]);

  return (
    <Container maxWidth='xl' sx={{ py: 3 }}>
      {/* Page Header */}
      <Box mb={3}>
        <Typography variant='h4' component='h1' gutterBottom>
          Payment Management
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Manage subscription payments, process manual payments, and track payment history
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity='error' sx={{ mb: 3 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant='h6' color='primary'>
                  Total Payments
                </Typography>
                <Typography variant='h4'>{stats.totalPayments}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant='h6' color='success.main'>
                  Total Revenue
                </Typography>
                <AmountDisplay amount={stats.totalRevenue} currency='USD' size='large' colorVariant='success' />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant='h6' color='info.main'>
                  Pending Payments
                </Typography>
                <Typography variant='h4'>{stats.pendingPayments || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant='h6' color='warning.main'>
                  Failed Payments
                </Typography>
                <Typography variant='h4'>{stats.failedPayments || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Actions Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction='row' spacing={2} alignItems='center' flexWrap='wrap'>
            <Button
              variant='contained'
              startIcon={<Add />}
              onClick={() => setState((prev) => ({ ...prev, showCreateDialog: true }))}
            >
              Create Payment
            </Button>
            <Button variant='outlined' startIcon={<Download />} onClick={handleExport} disabled={isLoading}>
              Export
            </Button>
            <Button
              variant='outlined'
              startIcon={<Refresh />}
              onClick={() => fetchPayments(1, true)}
              disabled={isLoading}
            >
              Refresh
            </Button>
            {state.selectedPayments.length > 0 && (
              <>
                <Button
                  variant='outlined'
                  startIcon={<CheckCircle />}
                  onClick={handleBulkProcess}
                  disabled={isProcessing}
                  color='success'
                >
                  Process Selected ({state.selectedPayments.length})
                </Button>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Filters */}
      <Box mb={3}>
        <PaymentFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={clearFilters}
          loading={isLoading}
        />
      </Box>

      {/* Payments Table */}
      <Card>
        <PaymentTable
          payments={payments}
          loading={isLoading}
          selectable
          selectedPayments={state.selectedPayments}
          onSelectionChange={(selected: string[]) => setState((prev) => ({ ...prev, selectedPayments: selected }))}
          onPaymentAction={handlePaymentAction}
        />
      </Card>

      {/* Create Payment Dialog */}
      <Dialog
        open={state.showCreateDialog}
        onClose={() => setState((prev) => ({ ...prev, showCreateDialog: false }))}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>Create New Payment</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label='Subscription ID'
              value={createForm.subscriptionId || ''}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, subscriptionId: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              label='Amount'
              type='number'
              value={createForm.amount || ''}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, amount: Number(e.target.value) }))}
              fullWidth
              required
            />
            <FormControl fullWidth>
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={createForm.paymentMethod || PaymentMethod.MANUAL}
                label='Payment Method'
                onChange={(e) => setCreateForm((prev) => ({ ...prev, paymentMethod: e.target.value as PaymentMethod }))}
              >
                <MenuItem value={PaymentMethod.MANUAL}>Manual</MenuItem>
                <MenuItem value={PaymentMethod.BANK_TRANSFER}>Bank Transfer</MenuItem>
                <MenuItem value={PaymentMethod.CREDIT_CARD}>Credit Card</MenuItem>
                <MenuItem value={PaymentMethod.CASH}>Cash</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label='Description'
              value={createForm.description || ''}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, description: e.target.value }))}
              fullWidth
              multiline
              rows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setState((prev) => ({ ...prev, showCreateDialog: false }))}>Cancel</Button>
          <Button
            onClick={handleCreatePayment}
            variant='contained'
            disabled={!createForm.subscriptionId || !createForm.amount}
          >
            Create Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Process Payment Dialog */}
      <Dialog
        open={state.showProcessDialog}
        onClose={() => setState((prev) => ({ ...prev, showProcessDialog: false }))}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>Process Payment</DialogTitle>
        <DialogContent>
          <TextField
            label='Processing Notes (Optional)'
            value={processNotes}
            onChange={(e) => setProcessNotes(e.target.value)}
            fullWidth
            multiline
            rows={3}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setState((prev) => ({ ...prev, showProcessDialog: false }))}>Cancel</Button>
          <Button onClick={handleProcessPayment} variant='contained' color='success' disabled={isProcessing}>
            Process Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Fail Payment Dialog */}
      <Dialog
        open={state.showFailDialog}
        onClose={() => setState((prev) => ({ ...prev, showFailDialog: false }))}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>Mark Payment as Failed</DialogTitle>
        <DialogContent>
          <TextField
            label='Failure Reason'
            value={failReason}
            onChange={(e) => setFailReason(e.target.value)}
            fullWidth
            multiline
            rows={3}
            required
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setState((prev) => ({ ...prev, showFailDialog: false }))}>Cancel</Button>
          <Button
            onClick={handleFailPayment}
            variant='contained'
            color='error'
            disabled={isProcessing || !failReason.trim()}
          >
            Mark as Failed
          </Button>
        </DialogActions>
      </Dialog>

      {/* Refund Payment Dialog */}
      <Dialog
        open={state.showRefundDialog}
        onClose={() => setState((prev) => ({ ...prev, showRefundDialog: false }))}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>Refund Payment</DialogTitle>
        <DialogContent>
          <TextField
            label='Refund Reason (Optional)'
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            fullWidth
            multiline
            rows={3}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setState((prev) => ({ ...prev, showRefundDialog: false }))}>Cancel</Button>
          <Button onClick={handleRefundPayment} variant='contained' color='warning' disabled={isProcessing}>
            Process Refund
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={state.snackbar.open}
        autoHideDuration={6000}
        onClose={() => setState((prev) => ({ ...prev, snackbar: { ...prev.snackbar, open: false } }))}
      >
        <Alert
          severity={state.snackbar.severity}
          onClose={() => setState((prev) => ({ ...prev, snackbar: { ...prev.snackbar, open: false } }))}
        >
          {state.snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
