import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Typography, Box, Button, TextField, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Alert,
  CircularProgress, Grid, Card, CardContent, Chip, InputAdornment,
  FormControl, InputLabel, Select, MenuItem, Snackbar
} from '@mui/material';

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import ArrowDownward from "@mui/icons-material/ArrowDownward";

import { useAuth } from '../context/AuthContext';
import { productAPI } from '../services/api';


const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ name: '', description: '', price: '', quantity: '' });

  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [totalProducts, setTotalProducts] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [recentAddedCount, setRecentAddedCount] = useState(0);

  const [quantityWarning, setQuantityWarning] = useState(false);
  
  // Sorting and snackbar states
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' // 'success' or 'error'
  });
  

  useEffect(() => { fetchProducts(); }, [pageSize, sortBy, sortDirection, searchTerm]);

  const fetchProducts = useCallback(async (page = currentPage) => {
    try {
      setLoading(true);
      console.log('Fetching products with params:', { page, pageSize, sortBy, sortDirection, searchTerm });
      
      const response = await productAPI.getAllProducts(
        page, 
        pageSize, 
        sortBy, 
        sortDirection, 
        searchTerm
      );
      
      console.log('API Response:', response);
      
      if (!response || !response.data) {
        throw new Error('Invalid response format from server');
      }
      
      const fetchedProducts = response.data.content || [];
      console.log('Fetched products:', fetchedProducts);
      
      setProducts(fetchedProducts);
      setCurrentPage(response.data.number || 0);
      setTotalPages(response.data.totalPages || 1);
      setTotalElements(response.data.totalElements || 0);

      // Summary stats
      setTotalProducts(response.data.totalElements || fetchedProducts.length);
      setLowStockCount(fetchedProducts.filter(p => p.quantity < 5).length);
      const recent = fetchedProducts.filter(p => {
        const created = new Date(p.createdAt);
        const today = new Date();
        return (today - created) / (1000 * 60 * 60 * 24) <= 7;
      });
      setRecentAddedCount(recent.length);
      setError('');
    } catch (error) { 
      console.error('Error fetching products:', {
        error,
        response: error.response,
        message: error.message,
        stack: error.stack
      });
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load products';
      setError(errorMessage);
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally { 
      setLoading(false); 
    }
  }, [currentPage, pageSize, sortBy, sortDirection, searchTerm]);

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setCurrentPage(0);
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    setCurrentPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0);
  };


  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        quantity: product.quantity.toString()
      });
      setQuantityWarning(product.quantity < 5);
    } else {
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', quantity: '' });
      setQuantityWarning(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: '', quantity: '' });
    setQuantityWarning(false);
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, quantity: value });
    setQuantityWarning(value && parseInt(value) < 5);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      setLoading(true);
      
      // Validate and format the product data
      const productName = (formData.name || '').trim();
      const productDescription = (formData.description || '').trim();
      const priceValue = parseFloat(formData.price) || 0;
      const quantityValue = parseInt(formData.quantity, 10) || 0;
      
      // Client-side validation
      if (!productName) throw new Error('Product name is required');
      if (productName.length < 2 || productName.length > 100) {
        throw new Error('Product name must be between 2 and 100 characters');
      }
      if (!productDescription) throw new Error('Product description is required');
      if (isNaN(priceValue) || priceValue <= 0) {
        throw new Error('Please enter a valid price greater than 0');
      }
      if (isNaN(quantityValue) || quantityValue < 0) {
        throw new Error('Quantity must be a non-negative number');
      }
      
      const productData = {
        name: productName,
        description: productDescription,
        price: priceValue,
        quantity: quantityValue
      };

      // Perform the API call
      if (editingProduct) {
        await productAPI.updateProduct(editingProduct.id, productData);
        showSuccessMessage(`Product "${productName}" updated successfully!`);
      } else {
        await productAPI.createProduct(productData);
        showSuccessMessage(`Product "${productName}" created successfully!`);
      }
      
      handleCloseDialog();
      fetchProducts();
    } catch (error) {
      console.error('Error submitting product:', error);
      showErrorMessage(getErrorMessage(error));
    } finally { 
      setLoading(false); 
    }
  };

  // Helper function to extract error messages consistently
  const getErrorMessage = (error) => {
    if (error.message) return error.message;
    if (error.response?.data?.message) return error.response.data.message;
    if (error.response?.status === 409) {
      return `A product with the name '${formData.name}' already exists.`;
    }
    if (error.response?.status === 400) {
      return 'Invalid data provided. Please check your inputs.';
    }
    if (error.response?.data?.errors) {
      return Object.values(error.response.data.errors).join(' ');
    }
    return 'An unexpected error occurred. Please try again.';
  };

  // Helper functions for consistent messaging
  const showSuccessMessage = (message) => {
    setSnackbar({ open: true, message, severity: 'success' });
  };

  const showErrorMessage = (message) => {
    setSnackbar({ open: true, message, severity: 'error' });
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.deleteProduct(productId);
        showSuccessMessage('Product deleted successfully!');
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        showErrorMessage(getErrorMessage(error));
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        mb: 4, p: 2, backgroundColor: '#1976d2', borderRadius: 2, color: '#fff'
      }}>
        <Typography variant="h4">Product Dashboard</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip label={`Hi, ${user?.username}`} sx={{ backgroundColor: '#fff', color: '#1976d2' }} />
          <Button
            onClick={logout}
            sx={{
              backgroundColor: '#f44336',
              color: '#fff',
              '&:hover': { backgroundColor: '#d32f2f' },
              fontWeight: 'bold'
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Products</Typography>
            <Typography variant="h4" color="primary">{totalProducts}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Low Stock</Typography>
            <Typography variant="h4" color="error">{lowStockCount}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Recently Added</Typography>
            <Typography variant="h4" color="success.main">{recentAddedCount}</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Search & Controls */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select 
                value={sortBy} 
                onChange={handleSortChange}
                label="Sort By"
              >
                <MenuItem value="id">ID</MenuItem>
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="price">Price</MenuItem>
                <MenuItem value="quantity">Quantity</MenuItem>
                <MenuItem value="createdAt">Date Created</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button 
              onClick={toggleSortDirection}
              variant="outlined"
              size="small"
              fullWidth
            >
              {sortDirection === 'asc' ? <ArrowUpward /> : <ArrowDownward />}
              {sortDirection.toUpperCase()}
            </Button>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                onClick={() => handleOpenDialog()}
                size="small"
              >
                Add Product
              </Button>
              <Button 
                onClick={() => fetchProducts()} 
                disabled={loading}
                variant="outlined"
                size="small"
              >
                <RefreshIcon />
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Products Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="h6">Product Inventory ({totalProducts} items)</Typography>
          </Box>
          <Box sx={{ p: 3 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <Typography variant="h6" color="text.secondary">
                            {searchTerm ? `No products found for "${searchTerm}"` : 'No products available'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {searchTerm ? 'Try adjusting your search term' : 'Add your first product to get started'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.map((product, index) => (
                        <TableRow key={product.id}>
                          <TableCell>#{product.id}</TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell sx={{ maxWidth: 200 }}>
                            {product.description.length > 50 
                              ? `${product.description.substring(0, 50)}...` 
                              : product.description
                            }
                          </TableCell>
                          <TableCell align="right">${product.price}</TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                              <Typography color={product.quantity < 5 ? 'error' : 'success.main'}>
                                {product.quantity}
                              </Typography>
                              {product.quantity < 5 && (
                                <Chip 
                                  label="Low Stock" 
                                  size="small"
                                  color="error"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            {new Date(product.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <IconButton 
                                size="small" 
                                onClick={() => handleOpenDialog(product)}
                                color="primary"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                onClick={() => handleDeleteProduct(product.id)}
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>

          {/* Pagination */}
          <Box sx={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: 'center',
            gap: 2,
            p: 2,
            borderTop: '1px solid #e0e0e0'
          }}>
            <Button 
              disabled={currentPage === 0} 
              onClick={() => {
                const newPage = currentPage - 1;
                setCurrentPage(newPage);
                fetchProducts(newPage);
              }}
              variant="outlined"
              size="small"
            >
              Previous
            </Button>
            
            <Typography variant="body2">
              Page {currentPage + 1} of {totalPages}
            </Typography>
            
            <Button 
              disabled={currentPage + 1 >= totalPages} 
              onClick={() => {
                const newPage = currentPage + 1;
                setCurrentPage(newPage);
                fetchProducts(newPage);
              }}
              variant="outlined"
              size="small"
            >
              Next
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {['name','description','price'].map((field,i)=>(
              <TextField
                key={i}
                margin="dense"
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                fullWidth
                variant="outlined"
                required
                type={field==='price'?'number':'text'}
                value={formData[field]}
                onChange={(e)=>setFormData({...formData,[field]:e.target.value})}
                sx={{ mb:2 }}
              />
            ))}

            {/* Quantity with warning */}
            <TextField
              margin="dense"
              label="Quantity"
              fullWidth
              variant="outlined"
              required
              type="number"
              value={formData.quantity}
              onChange={handleQuantityChange}
              sx={{ mb:1 }}
            />
            {quantityWarning && (
              <Typography variant="caption" color="error" sx={{ display: 'block', mb: 1 }}>
                Warning: Stock is low (less than 5)
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : editingProduct ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

    </Container>
  );
};

export default Dashboard;
