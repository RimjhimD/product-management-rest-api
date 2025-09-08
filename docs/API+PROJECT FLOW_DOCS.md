# 📚 API & Project Flow Documentation

This comprehensive document describes the REST API endpoints for the Product Management system, project architecture, and detailed workflow including frontend-backend interactions.

---

## 🚀 API Endpoints Reference

### **1. Create Product**

**`POST /products`**

Creates a new product in the system with validation.

**Request Body:**
```json
{
  "name": "Gaming Laptop",
  "description": "High-performance gaming laptop with RTX graphics",
  "price": 1299.99,
  "quantity": 15
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "Gaming Laptop",
  "description": "High-performance gaming laptop with RTX graphics",
  "price": 1299.99,
  "quantity": 15,
  "createdAt": "2025-09-08T10:15:30",
  "updatedAt": "2025-09-08T10:15:30"
}
```

**Validation Rules:**
- ✅ Product name: 2-100 characters, required, unique
- ✅ Description: 2-500 characters, required
- ✅ Price: Must be > 0.01, up to 10 digits with 2 decimal places
- ✅ Quantity: Must be >= 0 (minimum quantity restriction removed)

**Error Responses:**
- `400 Bad Request` - Validation errors or duplicate name
- `500 Internal Server Error` - Server error

---

### **2. Get All Products (Enhanced with Search & Sort)**

**`GET /products`**

Retrieves paginated products with optional search and sorting capabilities.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 0 | Page number (0-based) |
| `size` | integer | 10 | Items per page |
| `sortBy` | string | "id" | Sort field: id, name, price, quantity, createdAt |
| `sortDir` | string | "asc" | Sort direction: asc, desc |
| `search` | string | - | Search term for name/description |

**Example Requests:**
```bash
# Basic pagination
GET /products?page=0&size=10

# Search with sorting
GET /products?search=laptop&sortBy=price&sortDir=desc

# Sort by creation date
GET /products?sortBy=createdAt&sortDir=desc&page=1&size=5
```

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "name": "Gaming Laptop",
      "description": "High-performance gaming laptop with RTX graphics",
      "price": 1299.99,
      "quantity": 15,
      "createdAt": "2025-09-08T10:15:30",
      "updatedAt": "2025-09-08T10:15:30"
    }
  ],
  "number": 0,
  "totalPages": 3,
  "totalElements": 25,
  "size": 10,
  "first": true,
  "last": false
}
```

---

### **3. Get Product by ID**

**`GET /products/{id}`**

Retrieves a specific product by its ID.

**Path Parameters:**
- `id` (Long) - Product ID

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Gaming Laptop",
  "description": "High-performance gaming laptop with RTX graphics",
  "price": 1299.99,
  "quantity": 15,
  "createdAt": "2025-09-08T10:15:30",
  "updatedAt": "2025-09-08T10:15:30"
}
```

**Error Responses:**
- `404 Not Found` - Product with given ID doesn't exist

---

### **4. Update Product**

**`PUT /products/{id}`**

Updates an existing product with validation.

**Path Parameters:**
- `id` (Long) - Product ID to update

**Request Body:**
```json
{
  "name": "Gaming Laptop Pro",
  "description": "Enhanced gaming laptop with RTX 4080",
  "price": 1599.99,
  "quantity": 8
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Gaming Laptop Pro",
  "description": "Enhanced gaming laptop with RTX 4080",
  "price": 1599.99,
  "quantity": 8,
  "createdAt": "2025-09-08T10:15:30",
  "updatedAt": "2025-09-08T14:22:15"
}
```

**Validation Notes:**
- ✅ Same validation rules as create
- ✅ Name uniqueness checked (excluding current product)
- ✅ No minimum quantity restriction (updated requirement)

**Error Responses:**
- `400 Bad Request` - Validation errors
- `404 Not Found` - Product doesn't exist

---

### **5. Delete Product**

**`DELETE /products/{id}`**

Permanently deletes a product from the system.

**Path Parameters:**
- `id` (Long) - Product ID to delete

**Response:**
- `204 No Content` - Successful deletion
- `404 Not Found` - Product doesn't exist

---

## 🔍 Enhanced Search System

### **Server-Side Search Implementation**

The search functionality has been upgraded to server-side processing for better performance and scalability.

**Search Features:**
- 🔎 **Multi-field Search**: Searches across product name and description
- 🚀 **Real-time Results**: Instant search as you type
- 📄 **Paginated Results**: Search results are properly paginated
- 🔄 **Combined with Sorting**: Search + sort + pagination work together

**Search Query:**
```sql
SELECT p FROM Product p WHERE 
LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR 
LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))
```

---

## 🏗️ Project Architecture & Flow

### **System Architecture**

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐    JPA/Hibernate    ┌─────────────────┐
│   React Frontend │ ◄──────────────► │ Spring Boot API │ ◄──────────────────► │   MySQL Database │
│                 │                 │                 │                     │                 │
│ • Material-UI   │                 │ • REST Controllers│                     │ • Product Table │
│ • Axios Client  │                 │ • Service Layer │                     │ • Indexes       │
│ • State Mgmt    │                 │ • Data Validation│                     │ • Constraints   │
│ • Routing       │                 │ • Exception Hdlr│                     │                 │
└─────────────────┘                 └─────────────────┘                     └─────────────────┘
```

### **Frontend Architecture (React + Vite)**

```
src/
├── 📁 components/
│   ├── ProtectedRoute.jsx     # Route protection
│   └── [Reusable Components]
├── 📁 pages/
│   ├── Login.jsx             # Authentication
│   ├── Register.jsx          # User registration
│   └── Dashboard.jsx         # Main product management
├── 📁 services/
│   └── api.js               # API communication layer
├── 📁 context/
│   └── AuthContext.jsx      # Authentication state
└── App.jsx                  # Main application component
```

### **Backend Architecture (Spring Boot)**

```
src/main/java/com/example/productmanagement/
├── 📁 controller/
│   └── ProductController.java    # REST endpoints
├── 📁 service/
│   ├── ProductService.java      # Business logic interface
│   └── impl/
│       └── ProductServiceImpl.java # Business logic implementation
├── 📁 repository/
│   └── ProductRepository.java   # Data access layer
├── 📁 entity/
│   └── Product.java            # JPA entity
└── 📁 dto/
    ├── Request/
    │   └── ProductRequest.java  # Request DTOs
    └── Response/
        └── ProductResponse.java # Response DTOs
```

---

## 🔄 Complete Application Flow

### **1. User Authentication Flow**
```
User → Login Page → AuthContext → Protected Routes → Dashboard
  ↓
Mock Authentication (Demo) → Store Token → Access Granted
```

### **2. Product Management Flow**

#### **📋 View Products**
```
Dashboard Load → fetchProducts() → GET /products → Display Table + Stats
     ↓
Update Summary Cards (Total, Low Stock, Recent)
```

#### **🔍 Search Products**
```
User Types → handleSearchChange() → Update searchTerm → 
fetchProducts() → GET /products?search=term → Server-side Search → Results
```

#### **📊 Sort Products**
```
User Selects Sort → handleSortChange() → Update sortBy/sortDir → 
fetchProducts() → GET /products?sortBy=field&sortDir=asc → Sorted Results
```

#### **➕ Add Product**
```
Click "Add Product" → Open Dialog → Fill Form → handleSubmit() → 
POST /products → Success → Close Dialog → Refresh Data → Show Notification
```

#### **✏️ Edit Product**
```
Click Edit Icon → Open Dialog (Pre-filled) → Modify Form → handleSubmit() → 
PUT /products/{id} → Success → Close Dialog → Refresh Data → Show Notification
```

#### **🗑️ Delete Product**
```
Click Delete Icon → Confirmation Dialog → Confirm → handleDeleteProduct() → 
DELETE /products/{id} → Success → Refresh Data → Show Notification
```

### **3. Real-time Dashboard Updates**

```
Any CRUD Operation → Success Response → 
├── fetchProducts() - Refresh table data
├── Update Summary Statistics
├── Show Success/Error Notification
└── Maintain Current Page/Sort/Search State
```

---

## 📊 Dashboard Features & Logic

### **Summary Cards Logic**
```javascript
// Total Products
totalProducts = response.data.totalElements

// Low Stock Alert (< 5 quantity)
lowStockCount = products.filter(p => p.quantity < 5).length

// Recently Added (last 7 days)
recentAddedCount = products.filter(p => {
  const daysDiff = (new Date() - new Date(p.createdAt)) / (1000 * 60 * 60 * 24)
  return daysDiff <= 7
}).length
```

### **Search & Sort Integration**
```javascript
// Combined search, sort, and pagination
const fetchProducts = useCallback(async (page = currentPage) => {
  const response = await productAPI.getAllProductsPaginated(
    page, pageSize, sortBy, sortDirection, searchTerm
  )
  // Update state with results
}, [currentPage, pageSize, sortBy, sortDirection, searchTerm])
```

### **State Management**
```javascript
// Core state variables
const [products, setProducts] = useState([])           // Current page products
const [currentPage, setCurrentPage] = useState(0)     // Current page number
const [totalPages, setTotalPages] = useState(0)       // Total available pages
const [totalElements, setTotalElements] = useState(0) // Total products count
const [searchTerm, setSearchTerm] = useState('')      // Search query
const [sortBy, setSortBy] = useState('id')            // Sort field
const [sortDirection, setSortDirection] = useState('asc') // Sort direction
```

---

## 🎨 UI/UX Enhancements

### **Modern Design Features**
- 🌈 **Gradient Cards**: Beautiful visual hierarchy with hover animations
- 🔍 **Enhanced Search**: Dedicated search section with professional styling
- 📊 **Smart Controls**: Intuitive sort controls with visual feedback
- 🎯 **Action Buttons**: Grouped buttons with hover effects and tooltips
- 📱 **Responsive Design**: Seamless experience across all devices

### **User Feedback System**
- 🔔 **Snackbar Notifications**: Success/error messages with auto-dismiss
- ✅ **Confirmation Dialogs**: Safe delete operations with user confirmation
- ⚡ **Loading States**: Visual feedback during API operations
- 🎭 **Hover Effects**: Interactive elements with smooth transitions

---

## 🔧 Technical Implementation Details

### **Backend Optimizations**
- 📈 **Database Indexing**: Optimized queries for search and sort operations
- 🛡️ **Input Validation**: Comprehensive validation with meaningful error messages
- 📝 **Logging**: Detailed logging for monitoring and debugging
- 🔒 **Exception Handling**: Global error handling with proper HTTP status codes

### **Frontend Optimizations**
- ⚡ **useCallback Hooks**: Optimized re-renders and API calls
- 🔄 **Debounced Search**: Efficient search with reduced API calls
- 📱 **Responsive Grid**: Adaptive layout for different screen sizes
- 🎨 **Material-UI Theming**: Consistent design system throughout

---

## 📋 Data Flow Summary

```
┌─────────────────┐
│   User Action   │
└─────────┬───────┘
          │
┌─────────▼───────┐
│  Frontend Event │ (onClick, onChange, onSubmit)
└─────────┬───────┘
          │
┌─────────▼───────┐
│   API Service   │ (axios HTTP request)
└─────────┬───────┘
          │
┌─────────▼───────┐
│   Controller    │ (@RestController)
└─────────┬───────┘
          │
┌─────────▼───────┐
│    Service      │ (Business Logic)
└─────────┬───────┘
          │
┌─────────▼───────┐
│   Repository    │ (JPA/Hibernate)
└─────────┬───────┘
          │
┌─────────▼───────┐
│   Database      │ (MySQL)
└─────────┬───────┘
          │
┌─────────▼───────┐
│   Response      │ (JSON back to frontend)
└─────────┬───────┘
          │
┌─────────▼───────┐
│   UI Update     │ (State update + re-render)
└─────────────────┘
```

This documentation provides a complete reference for understanding and working with the Product Management System's API and architecture.
