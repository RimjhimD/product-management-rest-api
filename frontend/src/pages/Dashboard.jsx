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
  
  // New sorting and snackbar states
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => { fetchProducts(); }, [pageSize, sortBy, sortDirection, searchTerm]);

  const fetchProducts = useCallback(async (page = currentPage) => {
    try {
      setLoading(true);
      const response = await productAPI.getAllProductsPaginated(
        page, 
        pageSize, 
        sortBy, 
        sortDirection, 
        searchTerm
      );
      const fetchedProducts = response.data.content || [];
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
      console.error('Error fetching products:', error);
      setError('Failed to load products'); 
    }
    finally { setLoading(false); }
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
    try {
      setLoading(true);
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      };

      if (editingProduct) {
        await productAPI.updateProduct(editingProduct.id, productData);
        setSuccess('Product updated successfully!');
      } else {
        await productAPI.createProduct(productData);
        setSuccess('Product created successfully!');
      }

      handleCloseDialog();
      fetchProducts();
      setSnackbar({
        open: true,
        message: editingProduct ? 'Product updated successfully!' : 'Product created successfully!',
        severity: 'success'
      });
    } catch (error) {
      setError(editingProduct ? 'Failed to update product' : 'Failed to create product');
      console.error(error);
    } finally { setLoading(false); }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.deleteProduct(productId);
        setSnackbar({
          open: true,
          message: 'Product deleted successfully!',
          severity: 'success'
        });
        fetchProducts();
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Failed to delete product',
          severity: 'error'
        });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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

      {/* Enhanced Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff', 
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
            borderRadius: 3,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>Total Products</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>{totalProducts}</Typography>
                </Box>
                <Box sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)', 
                  borderRadius: '50%', 
                  p: 2,
                  backdropFilter: 'blur(10px)'
                }}>
                  <Inventory2Icon sx={{ fontSize: 40 }} />
                </Box>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>📊 Total inventory items</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: '#fff', 
            boxShadow: '0 8px 32px rgba(245, 87, 108, 0.3)',
            borderRadius: 3,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 12px 40px rgba(245, 87, 108, 0.4)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>Low Stock Alert</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>{lowStockCount}</Typography>
                </Box>
                <Box sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)', 
                  borderRadius: '50%', 
                  p: 2,
                  backdropFilter: 'blur(10px)'
                }}>
                  <LowPriorityIcon sx={{ fontSize: 40 }} />
                </Box>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>⚠️ Items below 5 quantity</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: '#fff', 
            boxShadow: '0 8px 32px rgba(79, 172, 254, 0.3)',
            borderRadius: 3,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 12px 40px rgba(79, 172, 254, 0.4)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>Recently Added</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>{recentAddedCount}</Typography>
                </Box>
                <Box sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)', 
                  borderRadius: '50%', 
                  p: 2,
                  backdropFilter: 'blur(10px)'
                }}>
                  <NewReleasesIcon sx={{ fontSize: 40 }} />
                </Box>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>🆕 Added in last 7 days</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Enhanced Search & Controls Section */}
      <Card sx={{ mb: 3, p: 3, boxShadow: 3, borderRadius: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#2c3e50', fontWeight: 600 }}>
          🔍 Search & Sort Controls
        </Typography>
        
        <Grid container spacing={3} alignItems="center">
          {/* Search Bar */}
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              placeholder="🔎 Search products by name or description..."
              value={searchTerm}
              onChange={handleSearchChange}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#1976d2' }} />
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: '#fff',
                  borderRadius: 3,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: '#1976d2' },
                    '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                  }
                }
              }}
              sx={{ 
                '& .MuiInputLabel-root': { color: '#666' },
                '& .MuiOutlinedInput-root': {
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease'
                }
              }}
            />
          </Grid>

          {/* Sort Controls */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <FormControl fullWidth variant="outlined">
                <InputLabel sx={{ color: '#666', fontSize: '0.9rem' }}>📊 Sort By</InputLabel>
                <Select 
                  value={sortBy} 
                  onChange={handleSortChange}
                  label="📊 Sort By"
                  sx={{ 
                    backgroundColor: '#fff', 
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e0e0e0'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1976d2'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1976d2'
                    }
                  }}
                >
                  <MenuItem value="id">🆔 ID</MenuItem>
                  <MenuItem value="name">📝 Name</MenuItem>
                  <MenuItem value="price">💰 Price</MenuItem>
                  <MenuItem value="quantity">📦 Quantity</MenuItem>
                  <MenuItem value="createdAt">📅 Date Created</MenuItem>
                </Select>
              </FormControl>
              
              <IconButton 
                onClick={toggleSortDirection}
                sx={{ 
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  borderRadius: 2,
                  width: 48,
                  height: 48,
                  border: '2px solid #e0e0e0',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#1976d2',
                    color: '#fff',
                    borderColor: '#1976d2',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(25,118,210,0.3)'
                  }
                }}
                title={`Sort ${sortDirection === 'asc' ? 'Ascending' : 'Descending'}`}
              >
                {sortDirection === 'asc' ? <ArrowUpward /> : <ArrowDownward />}
              </IconButton>
            </Box>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                onClick={() => handleOpenDialog()}
                sx={{ 
                  flexGrow: 1,
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  borderRadius: 2,
                  boxShadow: '0 3px 10px rgba(33, 203, 243, 0.3)',
                  textTransform: 'none',
                  fontWeight: 600,
                  py: 1.2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 5px 15px rgba(33, 203, 243, 0.4)'
                  }
                }}
              >
                Add Product
              </Button>
              
              <IconButton 
                onClick={() => fetchProducts()} 
                disabled={loading}
                sx={{ 
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  borderRadius: 2,
                  width: 48,
                  height: 48,
                  border: '2px solid #e0e0e0',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#4caf50',
                    color: '#fff',
                    borderColor: '#4caf50',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(76,175,80,0.3)'
                  },
                  '&:disabled': {
                    backgroundColor: '#f5f5f5',
                    color: '#bdbdbd'
                  }
                }}
                title="Refresh Products"
              >
                <RefreshIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Snackbar for notifications - positioned above inventory */}
      {snackbar.open && (
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ 
            mb: 2,
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {snackbar.message}
        </Alert>
      )}

      {/* Enhanced Products Table */}
      <Card sx={{ 
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)', 
        borderRadius: 3,
        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
      }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ 
            p: 3, 
            borderBottom: '1px solid #e0e0e0',
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px 12px 0 0'
          }}>
            <Typography variant="h5" sx={{ 
              color: '#fff', 
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              📋 Products Inventory
              <Chip 
                label={`${products.length} of ${totalElements}`} 
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)'
                }} 
              />
            </Typography>
          </Box>
          <Box sx={{ p: 3 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
                <CircularProgress size={60} sx={{ color: '#667eea' }} />
              </Box>
            ) : (
              <TableContainer sx={{ 
                borderRadius: 2, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #e0e0e0'
              }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' }}>
                      {[
                        { label: '🆔 ID', align: 'left' },
                        { label: '📝 Name', align: 'left' },
                        { label: '📄 Description', align: 'left' },
                        { label: '💰 Price', align: 'right' },
                        { label: '📦 Quantity', align: 'right' },
                        { label: '📅 Created', align: 'left' },
                        { label: '⚡ Actions', align: 'center' }
                      ].map((head, i) => (
                        <TableCell 
                          key={i} 
                          align={head.align}
                          sx={{ 
                            color: '#fff', 
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            py: 2
                          }}
                        >
                          {head.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product, index) => (
                      <TableRow 
                        key={product.id} 
                        sx={{
                          '&:nth-of-type(even)': { 
                            backgroundColor: '#f8f9fa' 
                          },
                          '&:hover': { 
                            backgroundColor: '#e3f2fd',
                            transform: 'scale(1.01)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            transition: 'all 0.2s ease'
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <TableCell sx={{ fontWeight: 600, color: '#667eea' }}>
                          #{product.id}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>
                          {product.name}
                        </TableCell>
                        <TableCell sx={{ color: '#666', maxWidth: 200 }}>
                          {product.description.length > 50 
                            ? `${product.description.substring(0, 50)}...` 
                            : product.description
                          }
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: '#27ae60' }}>
                          ${product.price}
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                            <Typography sx={{ 
                              fontWeight: 600,
                              color: product.quantity < 5 ? '#e74c3c' : '#27ae60'
                            }}>
                              {product.quantity}
                            </Typography>
                            {product.quantity < 5 && (
                              <Chip 
                                label="⚠️ Low" 
                                size="small"
                                sx={{ 
                                  backgroundColor: '#ffebee',
                                  color: '#e74c3c',
                                  fontWeight: 600,
                                  fontSize: '0.7rem'
                                }} 
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: '#666' }}>
                          {new Date(product.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <IconButton 
                              size="small" 
                              onClick={() => handleOpenDialog(product)}
                              sx={{
                                backgroundColor: '#e3f2fd',
                                color: '#1976d2',
                                '&:hover': {
                                  backgroundColor: '#1976d2',
                                  color: '#fff',
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => handleDeleteProduct(product.id)}
                              sx={{
                                backgroundColor: '#ffebee',
                                color: '#f44336',
                                '&:hover': {
                                  backgroundColor: '#f44336',
                                  color: '#fff',
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>

          {/* Enhanced Pagination */}
          <Box sx={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: 'center',
            gap: 2, 
            mt: 3,
            p: 2,
            borderTop: '1px solid #e0e0e0',
            backgroundColor: '#f8f9fa'
          }}>
            <Button 
              disabled={currentPage === 0} 
              onClick={() => {
                const newPage = currentPage - 1;
                setCurrentPage(newPage);
                fetchProducts(newPage);
              }}
              variant="outlined"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                '&:disabled': {
                  backgroundColor: '#f5f5f5',
                  color: '#bdbdbd'
                },
                '&:not(:disabled)': {
                  borderColor: '#667eea',
                  color: '#667eea',
                  '&:hover': {
                    backgroundColor: '#667eea',
                    color: '#fff'
                  }
                }
              }}
            >
              ← Previous
            </Button>
            
            <Chip 
              label={`Page ${currentPage + 1} of ${totalPages}`}
              sx={{ 
                backgroundColor: '#667eea',
                color: '#fff',
                fontWeight: 600,
                px: 2,
                fontSize: '0.9rem'
              }}
            />
            
            <Button 
              disabled={currentPage + 1 >= totalPages} 
              onClick={() => {
                const newPage = currentPage + 1;
                setCurrentPage(newPage);
                fetchProducts(newPage);
              }}
              variant="outlined"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                '&:disabled': {
                  backgroundColor: '#f5f5f5',
                  color: '#bdbdbd'
                },
                '&:not(:disabled)': {
                  borderColor: '#667eea',
                  color: '#667eea',
                  '&:hover': {
                    backgroundColor: '#667eea',
                    color: '#fff'
                  }
                }
              }}
            >
              Next →
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
