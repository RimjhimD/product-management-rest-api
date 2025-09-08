
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {


      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export const productAPI = {
  getAllProducts: (page = 0, size = 10, sortBy = 'id', sortDir = 'asc', search = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir
    });
    
    if (search && search.trim()) {
      params.append('search', search.trim());
    }
    
    return api.get(`/products?${params}`);
  },

  getAllProductsPaginated: (page = 0, size = 10, sortBy = 'id', sortDir = 'asc', search = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir
    });
    
    if (search && search.trim()) {
      params.append('search', search.trim());
    }
    
    return api.get(`/products?${params}`);
  },

  getProductById: (id) => api.get(`/products/${id}`),

  createProduct: (product) => api.post('/products', product),

  updateProduct: (id, product) => api.put(`/products/${id}`, product),

  deleteProduct: (id) => api.delete(`/products/${id}`),

  searchProductsByName: (name, page = 0, size = 10, sortBy = 'id', sortDir = 'asc') => {
    return api.get(
      `/products/search?name=${encodeURIComponent(name)}&page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    );
  },


getProductsByStock: (quantity) => api.get(`/products/stock?quantity=${quantity}`),
getProductsByPriceRange: (minPrice, maxPrice) => api.get(`/products/price?min=${minPrice}&max=${maxPrice}`),
getProductsSortedByName: () => api.get('/products/sorted/name'),
getProductsSortedByPriceAsc: () => api.get('/products/sorted/price-asc'),
getProductsSortedByPriceDesc: () => api.get('/products/sorted/price-desc'),
getProductsSortedByLatest: () => api.get('/products/sorted/latest'),

};


export const authAPI = {
  login: (credentials) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: 1,
          username: credentials.username,
          email: `${credentials.username}@example.com`,
          role: 'admin',
        };
        const mockToken = 'mock-jwt-token-' + Date.now();
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        resolve({ data: { user: mockUser, token: mockToken } });
      }, 800);
    });
  },

  register: (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: Date.now(),
          username: userData.username,
          email: userData.email,
          role: 'user',
        };
        const mockToken = 'mock-jwt-token-' + Date.now();
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        resolve({ data: { user: mockUser, token: mockToken } });
      }, 1000);
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve();
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => !!localStorage.getItem('token'),
};

export default api;
