/**
 * Subscription Dashboard Home Page
 * Professional dashboard with comprehensive analytics and subscribers table
 */

'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert,
  Button,
  CircularProgress,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  LinearProgress,
  IconButton,
} from '@mui/material';
import {
  Assessment,
  TrendingUp,
  Person,
  Business,
  AttachMoney,
  Speed,
  Add,
  CheckCircle,
  Warning,
  Error,
  CloudOff,
  TrendingDown,
  People,
  DeviceHub,
  Notifications,
  Refresh,
  FilterList,
  Search,
  MoreVert,
  Launch,
  Timeline,
  Security,
} from '@mui/icons-material';
import Link from 'next/link';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useAuth } from '@/hooks/useAuth';

// Status color mapping
const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'inactive':
      return 'error';
    case 'suspended':
      return 'warning';
    default:
      return 'default';
  }
};

// Tier color mapping
const getTierColor = (tier: string) => {
  switch (tier) {
    case 'premium':
      return '#FF6B35';
    case 'pro':
      return '#4ECDC4';
    case 'basic':
      return '#45B7D1';
    default:
      return '#95A5A6';
  }
};

export default function Dashboard() {
  const { subscriptions, totalCount, isLoading, error: subscriptionsError, fetchSubscriptions } = useSubscriptions();
  const { dashboardData, systemHealth, isLoadingDashboard, error: analyticsError, fetchSystemHealth } = useAnalytics();
  // Auth is handled by AuthGuard, no need to destructure here
  useAuth();

  const [serverStatus, setServerStatus] = useState<'checking' | 'healthy' | 'error'>('checking');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Ensure subscriptions is always an array to prevent filter errors
  const safeSubscriptions = Array.isArray(subscriptions) ? subscriptions : [];

  // Check server health
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('http://localhost:8000/health');
        if (response.ok) {
          setServerStatus('healthy');
        } else {
          setServerStatus('error');
        }
      } catch (error) {
        setServerStatus('error');
      }
    };

    checkHealth();
  }, []);

  // Fetch initial data
  useEffect(() => {
    fetchSubscriptions();
    fetchSystemHealth();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const activeSubscriptions = safeSubscriptions.filter((sub) => sub.status === 'active').length;
  const expiredSubscriptions = safeSubscriptions.filter((sub) => sub.status === 'expired').length;

  // Calculate pagination for table
  const paginatedSubscriptions = safeSubscriptions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ px: 2, py: 1 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant='h4' component='h1' sx={{ fontWeight: 700, color: '#1e293b' }}>
            Dashboard
          </Typography>
          <Typography variant='body1' color='textSecondary'>
            Welcome to your subscription management dashboard
          </Typography>
        </Box>
        <Link href='/subscriptions/create' style={{ textDecoration: 'none' }}>
          <Button variant='contained' startIcon={<Add />} size='large' sx={{ borderRadius: 2 }}>
            New Subscription
          </Button>
        </Link>
      </Box>

      {/* Error Messages */}
      {subscriptionsError && (
        <Alert severity='error' sx={{ mb: 3 }}>
          <strong>Subscriptions Error:</strong> {subscriptionsError}
        </Alert>
      )}
      {analyticsError && (
        <Alert severity='error' sx={{ mb: 3 }}>
          <strong>Analytics Error:</strong> {analyticsError}
        </Alert>
      )}

      {/* Server Status Banner */}
      <Card sx={{ mb: 3, bgcolor: serverStatus === 'healthy' ? '#f0f9ff' : '#fef2f2' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {serverStatus === 'checking' && (
              <>
                <CircularProgress size={24} />
                <Typography>Checking server connection...</Typography>
              </>
            )}
            {serverStatus === 'healthy' && (
              <>
                <CheckCircle sx={{ color: '#10b981' }} />
                <Typography sx={{ color: '#065f46', fontWeight: 600 }}>Server Status: Healthy & Running</Typography>
                <Chip label='Live' size='small' sx={{ bgcolor: '#10b981', color: 'white' }} />
              </>
            )}
            {serverStatus === 'error' && (
              <>
                <CloudOff sx={{ color: '#ef4444' }} />
                <Typography sx={{ color: '#dc2626', fontWeight: 600 }}>Server Connection Failed</Typography>
                <Chip label='Offline' size='small' sx={{ bgcolor: '#ef4444', color: 'white' }} />
              </>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                opacity: 0.1,
                fontSize: 120,
              }}
            >
              <People />
            </Box>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <People sx={{ fontSize: 40 }} />
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                  Total Subscribers
                </Typography>
              </Box>
              <Typography variant='h3' sx={{ fontWeight: 700, mb: 1 }}>
                {isLoading ? <CircularProgress size={24} color='inherit' /> : totalCount?.toLocaleString() || '0'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp sx={{ fontSize: 16 }} />
                <Typography variant='body2'>+12% from last month</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                opacity: 0.1,
                fontSize: 120,
              }}
            >
              <CheckCircle />
            </Box>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <CheckCircle sx={{ fontSize: 40 }} />
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                  Active Subscriptions
                </Typography>
              </Box>
              <Typography variant='h3' sx={{ fontWeight: 700, mb: 1 }}>
                {isLoading ? <CircularProgress size={24} color='inherit' /> : activeSubscriptions.toLocaleString()}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp sx={{ fontSize: 16 }} />
                <Typography variant='body2'>
                  {totalCount > 0 ? `${((activeSubscriptions / totalCount) * 100).toFixed(1)}%` : '0%'} active rate
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                opacity: 0.1,
                fontSize: 120,
              }}
            >
              <AttachMoney />
            </Box>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <AttachMoney sx={{ fontSize: 40 }} />
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                  Monthly Revenue
                </Typography>
              </Box>
              <Typography variant='h3' sx={{ fontWeight: 700, mb: 1 }}>
                ${dashboardData?.monthlyRevenue?.toLocaleString() || '0'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp sx={{ fontSize: 16 }} />
                <Typography variant='body2'>+8% from last month</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                opacity: 0.1,
                fontSize: 120,
              }}
            >
              <Speed />
            </Box>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Speed sx={{ fontSize: 40 }} />
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                  System Performance
                </Typography>
              </Box>
              <Typography variant='h3' sx={{ fontWeight: 700, mb: 1 }}>
                {systemHealth?.uptime || '99.9%'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp sx={{ fontSize: 16 }} />
                <Typography variant='body2'>Excellent uptime</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Subscribers Table */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant='h6' sx={{ fontWeight: 600, color: '#1e293b' }}>
              Subscribers
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant='outlined' size='small' startIcon={<FilterList />} sx={{ borderRadius: 2 }}>
                Filter
              </Button>
              <Button variant='outlined' size='small' startIcon={<Search />} sx={{ borderRadius: 2 }}>
                Search
              </Button>
              <Button
                variant='contained'
                size='small'
                startIcon={<Refresh />}
                onClick={() => fetchSubscriptions()}
                sx={{ borderRadius: 2 }}
              >
                Refresh
              </Button>
            </Box>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #e2e8f0' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>License Key</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Plan</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Devices</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Expires</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : paginatedSubscriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant='body2' color='text.secondary'>
                        No subscribers found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedSubscriptions.map((subscription) => (
                    <TableRow key={subscription.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: getTierColor(subscription.tier), width: 40, height: 40 }}>
                            {subscription.customerName.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant='body2' sx={{ fontWeight: 600 }}>
                              {subscription.customerName}
                            </Typography>
                            <Typography variant='caption' color='text.secondary'>
                              ID: {subscription.customerId}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2' sx={{ fontFamily: 'monospace' }}>
                          {subscription.licenseKey}
                        </Typography>
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
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <DeviceHub sx={{ fontSize: 16, color: '#64748b' }} />
                          <Typography variant='body2'>
                            {subscription.devicesConnected}/{subscription.maxDevices}
                          </Typography>
                          <LinearProgress
                            variant='determinate'
                            value={(subscription.devicesConnected / subscription.maxDevices) * 100}
                            sx={{
                              width: 40,
                              height: 6,
                              borderRadius: 3,
                              bgcolor: '#e2e8f0',
                              '& .MuiLinearProgress-bar': {
                                bgcolor:
                                  subscription.devicesConnected === subscription.maxDevices ? '#ef4444' : '#10b981',
                              },
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2' color='text.secondary'>
                          {new Date(subscription.expiresAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton size='small'>
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component='div'
            count={safeSubscriptions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' sx={{ fontWeight: 600, mb: 2 }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant='outlined'
                  startIcon={<Launch />}
                  href='http://localhost:8000/docs'
                  target='_blank'
                  sx={{ borderRadius: 2 }}
                >
                  API Documentation
                </Button>
                <Button
                  variant='outlined'
                  startIcon={<Security />}
                  href='http://localhost:8000/health'
                  target='_blank'
                  sx={{ borderRadius: 2 }}
                >
                  Health Check
                </Button>
                <Button
                  variant='outlined'
                  startIcon={<Timeline />}
                  onClick={() => window.location.reload()}
                  sx={{ borderRadius: 2 }}
                >
                  Refresh Data
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' sx={{ fontWeight: 600, mb: 2 }}>
                System Status
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant='body2'>Frontend (Next.js)</Typography>
                  <Chip label='Running' color='success' size='small' />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant='body2'>Backend (FastAPI)</Typography>
                  <Chip
                    label={serverStatus === 'healthy' ? 'Healthy' : 'Error'}
                    color={serverStatus === 'healthy' ? 'success' : 'error'}
                    size='small'
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant='body2'>Database</Typography>
                  <Chip label='Connected' color='success' size='small' />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
