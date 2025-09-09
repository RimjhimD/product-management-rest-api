# 📚 API & Project Flow Documentation

Complete API reference and system architecture for the Product Management REST API system.

---

## 🚀 API Endpoints

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

**Validation:**
- Name: 2-100 characters, required, unique
- Description: 2-500 characters, required  
- Price: Must be > 0.01
- Quantity: Must be >= 0

---

### **2. Get All Products**

**`GET /products`**

Get paginated products with search and sorting.

**Parameters:**
| Parameter | Default | Description |
|-----------|---------|-------------|
| `page` | 0 | Page number |
| `size` | 10 | Items per page |
| `sortBy` | "id" | Sort field |
| `sortDir` | "asc" | Sort direction |
| `search` | - | Search term |

**Examples:**
```bash
GET /products?page=0&size=10
GET /products?search=laptop&sortBy=price&sortDir=desc
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

Get specific product details.

### **4. Update Product**
**`PUT /products/{id}`**

Update existing product with same validation rules.

### **5. Delete Product**
**`DELETE /products/{id}`**

Delete product permanently.

### **6. Check Stock**
**`GET /products/{id}/stock`**

Check product stock availability.

---

## 🔍 Search & Features

- **Server-side search** across product name and description
- **Real-time pagination** with sorting
- **Multi-field sorting** by id, name, price, quantity, date
- **Stock alerts** for low inventory (< 5 items)

---

## 🏗️ System Architecture

```
React Frontend ◄──► Spring Boot API ◄──► MySQL Database
```

**Frontend:**
- React 19.1.1 + Vite + Material-UI
- Mock authentication with protected routes
- Dashboard with product management
- Real-time search and pagination

**Backend:**
- Spring Boot 3.5.5 + Java 23
- REST API with full CRUD operations
- JPA/Hibernate for database access
- Global exception handling

**Database:**
- MySQL with product table
- Auto-generated timestamps
- Proper indexing for performance

---

## 🔄 Application Flow

### **Authentication**
1. User visits app → Redirected to login
2. Mock authentication → Access dashboard
3. Protected routes ensure security

### **Product Management**
1. **View:** Dashboard loads products with pagination
2. **Search:** Real-time server-side search
3. **Sort:** Multi-field sorting with direction control
4. **Create:** Form dialog with validation
5. **Update:** Pre-filled form with same validation
6. **Delete:** Confirmation dialog for safety

### **User Experience**
- Real-time notifications for all actions
- Loading states during API calls
- Error handling with meaningful messages
- Responsive design for all devices

---

## 🗄️ Database Schema

**Product Table:**
```sql
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🔧 Technical Stack

**Backend:**
- Spring Boot 3.5.5 + Java 23
- Spring Data JPA + Hibernate
- MySQL 8.0+ database
- Maven build tool
- Global exception handling

**Frontend:**
- React 19.1.1 + Vite
- Material-UI 7.3.2
- Axios for API calls
- React Router for navigation
- Mock authentication system

---

This documentation covers the complete API reference and system architecture for the Product Management System.
