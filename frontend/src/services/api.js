import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',  // Direct backend URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // <-- important for CORS with credentials
});

// Request interceptor for Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error - Full Response:', error.response || error);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    const errorMessage = error.response?.data?.message || error.message || 'Unexpected error';
    return Promise.reject(new Error(errorMessage));
  }
);

export const productAPI = {
  getAllProducts: (page = 0, size = 10, sortBy = 'id', sortDir = 'asc', search = '') => {
    const params = { page, size, sortBy, sortDir };
    if (search?.trim()) params.search = search.trim();
    return api.get('/products', { params });
  },

  getProductById: (id) => api.get(`/products/${id}`),

  createProduct: async (product) => {
    try {
      console.log('Creating product with data:', product);
      
      // Format the product data to match backend expectations
      const formattedProduct = {
        ...product,
        price: product.price.toString(), // Ensure price is a string
        quantity: parseInt(product.quantity, 10)
      };
      
      // Log the exact data being sent to the server
      console.log('Sending to server:', JSON.stringify(formattedProduct, null, 2));
      
      console.log('Formatted product data:', formattedProduct);
      
      const response = await api.post('/products', formattedProduct, { 
        validateStatus: function (status) {
          return status < 500; // Reject only if status is greater than or equal to 500
        }
      });
      
      if (response.status >= 400) {
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          data: response.data,
          headers: response.headers
        });
        throw new Error(response.data?.message || 'Failed to create product');
      }
      
      console.log('Product created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', {
        error,
        response: error.response,
        message: error.message,
        validationErrors: error.response?.data?.errors
      });
      
      // Handle validation errors
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.message || 'Validation failed. Please check your input.';
        throw new Error(errorMessage);
      }
      
      throw new Error(error.response?.data?.message || 'Failed to create product. Please try again.');
    }
  },

  updateProduct: async (id, product) => {
    try {
      console.log(`Updating product ${id} with data:`, product);
      
      // Format the product data to match backend expectations
      const formattedProduct = {
        ...product,
        price: product.price.toString(), // Ensure price is a string
        quantity: parseInt(product.quantity, 10)
      };
      
      // Log the exact data being sent to the server
      console.log('Sending update to server:', JSON.stringify(formattedProduct, null, 2));
      
      console.log('Formatted update data:', formattedProduct);
      
      const response = await api.put(`/products/${id}`, formattedProduct, { 
        validateStatus: function (status) {
          return status < 500; // Reject only if status is greater than or equal to 500
        }
      });
      
      if (response.status >= 400) {
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          data: response.data,
          headers: response.headers
        });
        throw new Error(response.data?.message || 'Failed to update product');
      }
      
      console.log('Product updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', {
        error,
        response: error.response,
        message: error.message,
        validationErrors: error.response?.data?.errors
      });
      
      // Handle validation errors
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.message || 'Validation failed. Please check your input.';
        throw new Error(errorMessage);
      }
      
      throw new Error(error.response?.data?.message || 'Failed to update product. Please try again.');
    }
  },

  deleteProduct: (id) => api.delete(`/products/${id}`),

  searchProductsByName: (name, page = 0, size = 10, sortBy = 'id', sortDir = 'asc') => {
    const params = { name, page, size, sortBy, sortDir };
    return api.get('/products/search', { params });
  },

  checkStock: (id, quantity) => api.get(`/products/${id}/stock`, { params: { quantity } }),
};

export const authAPI = {
  login: (credentials) => {
    // Mock authentication - accept any credentials
    const mockUser = { 
      id: 1, 
      username: credentials.username,
      email: credentials.username + '@example.com'
    };
    const mockToken = 'mock-jwt-token-' + Date.now();
    
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    return Promise.resolve({
      data: {
        user: mockUser,
        token: mockToken
      }
    });
  },
  register: (userData) => {
    // Mock registration - accept any user data
    const mockUser = { 
      id: 1, 
      username: userData.username,
      email: userData.email || userData.username + '@example.com'
    };
    const mockToken = 'mock-jwt-token-' + Date.now();
    
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    return Promise.resolve({
      data: {
        user: mockUser,
        token: mockToken
      }
    });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve();
  },
  getCurrentUser: () => JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthenticated: () => !!localStorage.getItem('token'),
};

export default api;
