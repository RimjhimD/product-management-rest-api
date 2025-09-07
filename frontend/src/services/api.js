
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
  getAllProducts: (page = 0, size = 10, sortBy = 'id', sortDir = 'asc') => {
  return api.get(`/api/products?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
},

getAllProductsPaginated: (page = 0, size = 10, sortBy = 'id', sortDir = 'asc') => {


  return api.get(`/api/products?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
},

getProductById: (id) => api.get(`/api/products/${id}`),

createProduct: (product) => api.post('/api/products', product),

updateProduct: (id, product) => api.put(`/api/products/${id}`, product),

deleteProduct: (id) => api.delete(`/api/products/${id}`),

searchProductsByName: (name, page = 0, size = 10, sortBy = 'id', sortDir = 'asc') => {
  return api.get(
    `/api/products/search?name=${encodeURIComponent(name)}&page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
  );
},


getProductsByStock: (quantity) => api.get(`/api/products/stock?quantity=${quantity}`),
getProductsByPriceRange: (minPrice, maxPrice) => api.get(`/api/products/price?min=${minPrice}&max=${maxPrice}`),
getProductsSortedByName: () => api.get('/api/products/sorted/name'),
getProductsSortedByPriceAsc: () => api.get('/api/products/sorted/price-asc'),
getProductsSortedByPriceDesc: () => api.get('/api/products/sorted/price-desc'),
getProductsSortedByLatest: () => api.get('/api/products/sorted/latest'),

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
