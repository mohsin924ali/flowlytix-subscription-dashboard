/**
 * Analytics Dashboard Page
 * Comprehensive analytics and reporting dashboard
 */

'use client';

import React, { useEffect, useState } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import { useAnalytics } from '@/hooks/useAnalytics';
import {
  Assessment,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Person,
  DeviceHub,
  Refresh,
  GetApp,
  DateRange,
  Speed,
  Business,
  CheckCircle,
  Warning,
  Error,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

// Sample data for charts
const subscriptionTrends = [
  { month: 'Jan', active: 150, new: 25, cancelled: 5 },
  { month: 'Feb', active: 170, new: 30, cancelled: 10 },
  { month: 'Mar', active: 195, new: 35, cancelled: 8 },
  { month: 'Apr', active: 220, new: 40, cancelled: 12 },
  { month: 'May', active: 248, new: 45, cancelled: 15 },
  { month: 'Jun', active: 273, new: 50, cancelled: 18 },
];

const revenueData = [
  { month: 'Jan', revenue: 45000, target: 50000 },
  { month: 'Feb', revenue: 52000, target: 55000 },
  { month: 'Mar', revenue: 58500, target: 60000 },
  { month: 'Apr', revenue: 65000, target: 65000 },
  { month: 'May', revenue: 72000, target: 70000 },
  { month: 'Jun', revenue: 78000, target: 75000 },
];

const tierDistribution = [
  { name: 'Basic', value: 45, color: '#8884d8' },
  { name: 'Premium', value: 35, color: '#82ca9d' },
  { name: 'Enterprise', value: 20, color: '#ffc658' },
];

const deviceUsage = [
  { month: 'Jan', devices: 342, activations: 45 },
  { month: 'Feb', devices: 378, activations: 52 },
  { month: 'Mar', devices: 415, activations: 58 },
  { month: 'Apr', devices: 452, activations: 65 },
  { month: 'May', devices: 489, activations: 72 },
  { month: 'Jun', devices: 526, activations: 78 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [error, setError] = useState<string | null>(null);

  const {
    dashboardData,
    subscriptionAnalytics,
    deviceAnalytics,
    revenueData,
    systemHealth,
    isLoadingDashboard,
    isLoadingSubscriptions,
    isLoadingDevices,
    isLoadingRevenue,
    error: analyticsError,
    refreshDashboard,
    fetchSubscriptionAnalytics,
    fetchDeviceAnalytics,
    fetchRevenueAnalytics,
    fetchSystemHealth,
  } = useAnalytics();

  const loading = isLoadingDashboard || isLoadingSubscriptions || isLoadingDevices || isLoadingRevenue;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          refreshDashboard(),
          fetchSubscriptionAnalytics(),
          fetchDeviceAnalytics(),
          fetchRevenueAnalytics(),
          fetchSystemHealth(),
        ]);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setError('Failed to load analytics data');
      }
    };

    fetchInitialData();
  }, [timeRange]);

  const handleRefresh = async () => {
    try {
      setError(null);
      await Promise.all([
        refreshDashboard(),
        fetchSubscriptionAnalytics(),
        fetchDeviceAnalytics(),
        fetchRevenueAnalytics(),
        fetchSystemHealth(),
      ]);
    } catch (error) {
      console.error('Error refreshing analytics:', error);
      setError('Failed to refresh analytics data');
    }
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting analytics data...');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant='h4' component='h1' sx={{ fontWeight: 'bold', color: '#1e293b' }}>
            Analytics Dashboard
          </Typography>
          <Typography variant='subtitle1' sx={{ color: '#64748b', mt: 1 }}>
            Comprehensive insights and performance metrics
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size='small' sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} label='Time Range'>
              <MenuItem value='7days'>Last 7 days</MenuItem>
              <MenuItem value='30days'>Last 30 days</MenuItem>
              <MenuItem value='3months'>Last 3 months</MenuItem>
              <MenuItem value='6months'>Last 6 months</MenuItem>
              <MenuItem value='1year'>Last year</MenuItem>
            </Select>
          </FormControl>
          <Button variant='outlined' startIcon={<Refresh />} onClick={handleRefresh}>
            Refresh
          </Button>
          <Button variant='contained' startIcon={<GetApp />} onClick={handleExport}>
            Export
          </Button>
        </Box>
      </Box>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AttachMoney sx={{ fontSize: 40, color: '#10b981', mb: 1 }} />
              <Typography variant='h5' component='div' sx={{ fontWeight: 'bold' }}>
                ${dashboardData?.monthlyRevenue?.toLocaleString() || '0'}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Monthly Revenue
              </Typography>
              <Chip
                icon={<TrendingUp />}
                label={`+${dashboardData?.growthRate?.toFixed(1) || '0'}%`}
                color='success'
                size='small'
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Person sx={{ fontSize: 40, color: '#3b82f6', mb: 1 }} />
              <Typography variant='h5' component='div' sx={{ fontWeight: 'bold' }}>
                {dashboardData?.totalSubscriptions || 0}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Total Subscriptions
              </Typography>
              <Chip
                icon={<TrendingUp />}
                label={`+${dashboardData?.growthRate?.toFixed(1) || '0'}%`}
                color='success'
                size='small'
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <DeviceHub sx={{ fontSize: 40, color: '#8b5cf6', mb: 1 }} />
              <Typography variant='h5' component='div' sx={{ fontWeight: 'bold' }}>
                {dashboardData?.totalDevices || 0}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Total Devices
              </Typography>
              <Chip
                icon={<TrendingUp />}
                label={`+${dashboardData?.growthRate?.toFixed(1) || '0'}%`}
                color='success'
                size='small'
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Speed sx={{ fontSize: 40, color: '#f59e0b', mb: 1 }} />
              <Typography variant='h5' component='div' sx={{ fontWeight: 'bold' }}>
                {dashboardData?.churnRate?.toFixed(1) || '0.0'}%
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Churn Rate
              </Typography>
              <Chip icon={<TrendingDown />} label='-2.1%' color='success' size='small' sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: '#10b981', mb: 1 }} />
              <Typography variant='h5' component='div' sx={{ fontWeight: 'bold' }}>
                {dashboardData?.growthRate?.toFixed(1) || '0.0'}%
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Growth Rate
              </Typography>
              <Chip icon={<TrendingUp />} label='+3.2%' color='success' size='small' sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AttachMoney sx={{ fontSize: 40, color: '#6366f1', mb: 1 }} />
              <Typography variant='h5' component='div' sx={{ fontWeight: 'bold' }}>
                $
                {dashboardData?.monthlyRevenue && dashboardData?.totalSubscriptions
                  ? (dashboardData.monthlyRevenue / dashboardData.totalSubscriptions).toFixed(0)
                  : '0'}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                ARPU
              </Typography>
              <Chip icon={<TrendingUp />} label='+5.7%' color='success' size='small' sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Grid */}
      <Grid container spacing={3}>
        {/* Subscription Trends */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant='h6' component='h2' sx={{ mb: 2, fontWeight: 'bold' }}>
                Subscription Trends
              </Typography>
              <ResponsiveContainer width='100%' height={300}>
                <LineChart data={subscriptionTrends}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='month' />
                  <YAxis />
                  <Tooltip />
                  <Line type='monotone' dataKey='active' stroke='#3b82f6' strokeWidth={2} />
                  <Line type='monotone' dataKey='new' stroke='#10b981' strokeWidth={2} />
                  <Line type='monotone' dataKey='cancelled' stroke='#ef4444' strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Subscription Tier Distribution */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant='h6' component='h2' sx={{ mb: 2, fontWeight: 'bold' }}>
                Subscription Tiers
              </Typography>
              <ResponsiveContainer width='100%' height={300}>
                <PieChart>
                  <Pie
                    data={tierDistribution}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill='#8884d8'
                    dataKey='value'
                  >
                    {tierDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Revenue vs Target */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant='h6' component='h2' sx={{ mb: 2, fontWeight: 'bold' }}>
                Revenue vs Target
              </Typography>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='month' />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey='revenue' fill='#3b82f6' />
                  <Bar dataKey='target' fill='#e5e7eb' />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Device Usage */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant='h6' component='h2' sx={{ mb: 2, fontWeight: 'bold' }}>
                Device Usage
              </Typography>
              <ResponsiveContainer width='100%' height={300}>
                <AreaChart data={deviceUsage}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='month' />
                  <YAxis />
                  <Tooltip />
                  <Area type='monotone' dataKey='devices' stackId='1' stroke='#8884d8' fill='#8884d8' />
                  <Area type='monotone' dataKey='activations' stackId='2' stroke='#82ca9d' fill='#82ca9d' />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* System Status */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant='h6' component='h2' sx={{ mb: 2, fontWeight: 'bold' }}>
                System Health Status
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: '#f0f9ff', borderRadius: 1 }}>
                    <CheckCircle sx={{ color: '#10b981', mr: 2 }} />
                    <Box>
                      <Typography variant='subtitle2' sx={{ fontWeight: 'bold' }}>
                        API Response Time
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        125ms (Excellent)
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: '#f0f9ff', borderRadius: 1 }}>
                    <CheckCircle sx={{ color: '#10b981', mr: 2 }} />
                    <Box>
                      <Typography variant='subtitle2' sx={{ fontWeight: 'bold' }}>
                        Database Performance
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        23ms (Excellent)
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: '#fffbeb', borderRadius: 1 }}>
                    <Warning sx={{ color: '#f59e0b', mr: 2 }} />
                    <Box>
                      <Typography variant='subtitle2' sx={{ fontWeight: 'bold' }}>
                        Cache Hit Rate
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        82% (Good)
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: '#f0f9ff', borderRadius: 1 }}>
                    <CheckCircle sx={{ color: '#10b981', mr: 2 }} />
                    <Box>
                      <Typography variant='subtitle2' sx={{ fontWeight: 'bold' }}>
                        Server Uptime
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        99.98% (Excellent)
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
