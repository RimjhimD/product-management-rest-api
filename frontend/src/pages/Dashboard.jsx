import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Button, TextField, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Alert,
  CircularProgress, Grid, Card, CardContent, Chip, InputAdornment
} from '@mui/material';

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import LowPriorityIcon from "@mui/icons-material/LowPriority";

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
  const [pageSize, setPageSize] = useState(10);

  const [totalProducts, setTotalProducts] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [recentAddedCount, setRecentAddedCount] = useState(0);

  const [quantityWarning, setQuantityWarning] = useState(false); // New

  useEffect(() => { fetchProducts(0); }, [pageSize]);

  const fetchProducts = async (page = 0) => {
    try {
      setLoading(true);
      const response = await productAPI.getAllProductsPaginated(page, pageSize);
      const fetchedProducts = response.data.content || [];
      setProducts(fetchedProducts);
      setCurrentPage(response.data.number || 0);
      setTotalPages(response.data.totalPages || 1);

      // Summary stats
      setTotalProducts(response.data.totalElements || fetchedProducts.length);
      setLowStockCount(fetchedProducts.filter(p => p.quantity < 5).length);
      const recent = fetchedProducts.filter(p => {
        const created = new Date(p.createdAt);
        const today = new Date();
        return (today - created) / (1000 * 60 * 60 * 24) <= 7;
      });
      setRecentAddedCount(recent.length);
    } catch (error) { setError('Failed to fetch products'); }
    finally { setLoading(false); }
  };

const handleSearch = () => {
  const term = searchTerm.trim().toLowerCase();
  if (!term) return fetchProducts(0);

  const results = products.filter(p => p.name.toLowerCase().includes(term));
  setProducts(results);
  setError(results.length === 0 ? `No products found for "${term}"` : '');
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
      fetchProducts(currentPage);

      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(editingProduct ? 'Failed to update product' : 'Failed to create product');
      console.error(error);
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      setLoading(true);
      await productAPI.deleteProduct(id);
      fetchProducts(currentPage);
    } catch (error) { setError('Failed to delete product'); }
    finally { setLoading(false); }
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
        <Grid item xs={12} sm={3}>
          <Card sx={{ backgroundColor: '#1976d2', color: '#fff', boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Inventory2Icon fontSize="large" />
                <Typography variant="h6">Total Products</Typography>
              </Box>
              <Typography variant="h4" sx={{ mt: 1 }}>{totalProducts}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card sx={{ backgroundColor: '#fbc02d', color: '#fff', boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LowPriorityIcon fontSize="large" />
                <Typography variant="h6">Low Stock</Typography>
              </Box>
              <Typography variant="h4" sx={{ mt: 1 }}>{lowStockCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card sx={{ backgroundColor: '#388e3c', color: '#fff', boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <NewReleasesIcon fontSize="large" />
                <Typography variant="h6">Recently Added</Typography>
              </Box>
              <Typography variant="h4" sx={{ mt: 1 }}>{recentAddedCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search & Actions */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch}><SearchIcon /></IconButton>
                </InputAdornment>
              )
            }}
            sx={{ backgroundColor: '#fff', borderRadius: 2, boxShadow: 1 }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()} fullWidth>
              Add Product
            </Button>
            <IconButton onClick={() => fetchProducts(currentPage)} disabled={loading}><RefreshIcon /></IconButton>
          </Box>
        </Grid>
      </Grid>

      {/* Alerts */}
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Products Table */}
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Products ({products.length})</Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead sx={{ backgroundColor: '#1976d2' }}>
                  <TableRow>
                    {['ID','Name','Description','Price','Quantity','Created','Actions'].map((head,i)=>(
                      <TableCell key={i} sx={{ color:'#fff' }}>{head}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map(product => (
                    <TableRow key={product.id} sx={{
                      '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                      '&:hover': { backgroundColor: '#e3f2fd', cursor: 'pointer' }
                    }}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.description.length>50 ? `${product.description.substring(0,50)}...` : product.description}</TableCell>
                      <TableCell align="right">${product.price}</TableCell>
                      <TableCell align="right">
                        {product.quantity}
                        {product.quantity < 5 && (
                          <Chip label="Low Stock" color="error" size="small" sx={{ ml: 1 }} />
                        )}
                      </TableCell>
                      <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={() => handleOpenDialog(product)}><EditIcon /></IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDelete(product.id)}><DeleteIcon /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Pagination */}
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
            <Button disabled={currentPage === 0} onClick={() => fetchProducts(currentPage - 1)}>Previous</Button>
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>Page {currentPage + 1} of {totalPages}</Typography>
            <Button disabled={currentPage + 1 >= totalPages} onClick={() => fetchProducts(currentPage + 1)}>Next</Button>
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
