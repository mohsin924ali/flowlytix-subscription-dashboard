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
} from '@mui/material';
import {
  Add,
  Search,
  MoreVert,
  Person,
  Business,
  Email,
  Phone,
  Edit,
  Delete,
  VpnKey,
  Visibility,
} from '@mui/icons-material';
import Link from 'next/link';
import { apiClient } from '@/services/api';

interface Customer {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  address?: string;
  metadata?: {
    customer_type?: 'individual' | 'business';
    notes?: string;
  };
  created_at: string;
  updated_at: string;
}

export default function CustomersPage() {
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Mock data for demonstration - in real app this would come from API
  const mockCustomers: Customer[] = [
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'John Doe',
      email: 'john.doe@example.com',
      company: 'Acme Corp',
      phone: '+1-555-123-4567',
      address: '123 Main St, New York, NY 10001',
      metadata: {
        customer_type: 'business',
        notes: 'Premium customer',
      },
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Jane Smith',
      email: 'jane.smith@techstart.io',
      company: 'TechStart',
      phone: '+1-555-987-6543',
      address: '456 Tech Ave, San Francisco, CA 94107',
      metadata: {
        customer_type: 'business',
        notes: 'Startup customer',
      },
      created_at: '2024-01-20T14:30:00Z',
      updated_at: '2024-01-20T14:30:00Z',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Michael Johnson',
      email: 'michael.johnson@personal.com',
      phone: '+1-555-456-7890',
      address: '789 Home St, Austin, TX 73301',
      metadata: {
        customer_type: 'individual',
        notes: 'Individual user',
      },
      created_at: '2024-02-01T09:15:00Z',
      updated_at: '2024-02-01T09:15:00Z',
    },
  ];

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get('/api/v1/subscription/customers');

      if (response.success && response.data) {
        // Handle both paginated and direct array responses
        const customersData = Array.isArray(response.data) ? response.data : (response.data as any).items || [];
        setCustomers(customersData);
      } else {
        // Fallback to mock data if API fails
        console.warn('API failed, using mock data:', response.error);
        setCustomers(mockCustomers);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      // Fallback to mock data if API fails
      setCustomers(mockCustomers);
      setIsLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, customer: Customer) => {
    setAnchorEl(event.currentTarget);
    setSelectedCustomer(customer);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCustomer(null);
  };

  const handleCreateSubscription = () => {
    if (selectedCustomer) {
      router.push(`/subscriptions/create?customerId=${selectedCustomer.id}`);
    }
    handleMenuClose();
  };

  const handleViewCustomer = () => {
    if (selectedCustomer) {
      router.push(`/customers/${selectedCustomer.id}`);
    }
    handleMenuClose();
  };

  const handleEditCustomer = () => {
    if (selectedCustomer) {
      router.push(`/customers/${selectedCustomer.id}/edit`);
    }
    handleMenuClose();
  };

  // Filter customers based on search query
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (customer.company && customer.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Paginate filtered customers
  const paginatedCustomers = filteredCustomers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getCustomerTypeColor = (type?: string) => {
    switch (type) {
      case 'business':
        return 'primary';
      case 'individual':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getCustomerTypeIcon = (type?: string) => {
    switch (type) {
      case 'business':
        return <Business />;
      case 'individual':
        return <Person />;
      default:
        return <Person />;
    }
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
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant='h4' component='h1' sx={{ fontWeight: 700, color: '#1e293b' }}>
            Customers
          </Typography>
          <Typography variant='body1' color='textSecondary'>
            Manage your customer database and subscriptions
          </Typography>
        </Box>
        <Link href='/customers/create' style={{ textDecoration: 'none' }}>
          <Button variant='contained' startIcon={<Add />} size='large' sx={{ borderRadius: 2 }}>
            Add Customer
          </Button>
        </Link>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity='error' sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder='Search customers by name, email, or company...'
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Search color='action' />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align='right'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCustomers.map((customer) => (
                <TableRow key={customer.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>{customer.name.charAt(0).toUpperCase()}</Avatar>
                      <Box>
                        <Typography variant='subtitle2' fontWeight={600}>
                          {customer.name}
                        </Typography>
                        <Typography variant='body2' color='textSecondary'>
                          {customer.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getCustomerTypeIcon(customer.metadata?.customer_type)}
                      label={customer.metadata?.customer_type || 'individual'}
                      color={getCustomerTypeColor(customer.metadata?.customer_type) as any}
                      size='small'
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                        <Email fontSize='small' color='action' />
                        {customer.email}
                      </Typography>
                      {customer.phone && (
                        <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Phone fontSize='small' color='action' />
                          {customer.phone}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2'>{customer.company || '-'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2'>{new Date(customer.created_at).toLocaleDateString()}</Typography>
                  </TableCell>
                  <TableCell align='right'>
                    <IconButton onClick={(e) => handleMenuOpen(e, customer)} size='small'>
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
          count={filteredCustomers.length}
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
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleViewCustomer}>
          <ListItemIcon>
            <Visibility fontSize='small' />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEditCustomer}>
          <ListItemIcon>
            <Edit fontSize='small' />
          </ListItemIcon>
          <ListItemText>Edit Customer</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCreateSubscription}>
          <ListItemIcon>
            <VpnKey fontSize='small' />
          </ListItemIcon>
          <ListItemText>Create Subscription</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
