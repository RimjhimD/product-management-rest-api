import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getPaginatedProducts = (page = 0, size = 10) =>
  axios.get(`/products/paginated?page=${page}&size=${size}`);


// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Product API
export const productAPI = {
  // Get all products
  getAllProducts: (page = 0, size = 10, sortBy = 'id', sortDir = 'asc') => {
    return api.get(`/products?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
  },

  // Get all products with pagination
  getAllProductsPaginated: (page = 0, size = 10, sortBy = 'id', sortDir = 'asc') => {
    return api.get(`/products/paginated?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
  },

  // Get product by ID
  getProductById: (id) => {
    return api.get(`/products/${id}`);
  },

  // Create product
  createProduct: (product) => {
    return api.post('/products', product);
  },

  // Update product
  updateProduct: (id, product) => {
    return api.put(`/products/${id}`, product);
  },

  // Delete product
  deleteProduct: (id) => {
    return api.delete(`/products/${id}`);
  },

  // Search products by name
  searchProductsByName: (name, page = 0, size = 10) => {
    return api.get(`/products/search?name=${encodeURIComponent(name)}&page=${page}&size=${size}`);
  },

  // Get products by stock
  getProductsByStock: (quantity) => {
    return api.get(`/products/stock?quantity=${quantity}`);
  },

  // Get products by price range
  getProductsByPriceRange: (minPrice, maxPrice) => {
    return api.get(`/products/price?min=${minPrice}&max=${maxPrice}`);
  },

  // Get products sorted by name
  getProductsSortedByName: () => {
    return api.get('/products/sorted/name');
  },

  // Get products sorted by price ascending
  getProductsSortedByPriceAsc: () => {
    return api.get('/products/sorted/price-asc');
  },

  // Get products sorted by price descending
  getProductsSortedByPriceDesc: () => {
    return api.get('/products/sorted/price-desc');
  },

  // Get products sorted by latest
  getProductsSortedByLatest: () => {
    return api.get('/products/sorted/latest');
  },
};

// Auth API (mock implementation for demo)
export const authAPI = {
  // Login
  login: (credentials) => {
    // Mock login - in real app, this would call your auth endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: 1,
          username: credentials.username,
          email: `${credentials.username}@example.com`,
          role: 'admin'
        };
        const mockToken = 'mock-jwt-token-' + Date.now();

        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));

        resolve({ data: { user: mockUser, token: mockToken } });
      }, 1000);
    });
  },

  // Register
  register: (userData) => {
    // Mock registration - in real app, this would call your auth endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: Date.now(),
          username: userData.username,
          email: userData.email,
          role: 'user'
        };
        const mockToken = 'mock-jwt-token-' + Date.now();

        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));

        resolve({ data: { user: mockUser, token: mockToken } });
      }, 1000);
    });
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve();
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default api;