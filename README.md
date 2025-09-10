
# 🚀 Product Management System

This is a partially developed full-stack Product Management System built with Spring Boot REST API and a React frontend.
The implementation covers the basic objectives of the task, including authentication flow (mocked), product CRUD operations, and partial enhancements such as search, sorting, and pagination.

![Java](https://img.shields.io/badge/Java-23-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.5-green)
![React](https://img.shields.io/badge/React-19.1.1-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
![Material-UI](https://img.shields.io/badge/Material--UI-7.3.2-purple)

---

## ✨ Features

- 🔐 **Simple Authentication** - Login/registration with mock authentication
- 📦 **Product CRUD** - Create, read, update, delete products
- 🔍 **Search & Filter** - Search products by name and description
- 📊 **Sorting** - Sort by name, price, quantity, date
- 📄 **Pagination** - Navigate through product pages
- 📈 **Dashboard Stats** - Total products, low stock alerts
- 🎨 **Material-UI Design** - Clean, responsive interface
- ⚠️ **Error Handling** - Comprehensive validation and error messages

---

## 🛠️ Tech Stack

| Component | Technology | Version |
|-----------|------------|---------|
| **Frontend** | React + Vite | 19.1.1 |
| **UI Library** | Material-UI | 7.3.2 |
| **Backend** | Spring Boot | 3.5.5 |
| **Database** | MySQL | 8.0+ |
| **Java** | OpenJDK | 23 |
| **Build Tool** | Maven | 3.9+ |

---

## 📁 Project Structure

```
product-management-rest-api/
├── backend/                   # Spring Boot REST API
│   ├── src/main/java/com/example/productmanagement/
│   │   ├── controller/        # REST Controllers
│   │   ├── service/          # Business Logic
│   │   ├── repository/       # Data Access Layer
│   │   ├── entity/           # JPA Entities
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── exception/        # Error Handling
│   │   └── config/           # Configuration
│   └── pom.xml              # Maven Dependencies
└── frontend/                 # React Application
    ├── src/
    │   ├── components/       # UI Components
    │   ├── pages/           # Login, Dashboard
    │   ├── services/        # API Calls
    │   └── context/         # Authentication
    └── package.json         # Dependencies
```

---

## 🚀 Quick Start

### Prerequisites
- Java 23+
- Node.js 18+
- MySQL 8.0+ (XAMPP recommended)

### Database Setup
1. Install and start XAMPP
2. Start MySQL service on port 3306
3. Create database: `product_db`

### Backend Setup
```bash
cd backend
./mvnw spring-boot:run
```
Backend runs on: `http://localhost:8080`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

### Usage
1. Open `http://localhost:5173`
2. Login with any username/password
3. Manage products in the dashboard

---

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Get all products (with pagination, search, sort) |
| GET | `/products/{id}` | Get product by ID |
| POST | `/products` | Create new product |
| PUT | `/products/{id}` | Update product |
| DELETE | `/products/{id}` | Delete product |
| GET | `/products/{id}/stock` | Check stock availability |

---

## 🗄️ Database Schema

**Product Table:**
- `id` (Long) - Primary key
- `name` (String) - Product name
- `description` (String) - Product description  
- `price` (BigDecimal) - Product price
- `quantity` (Integer) - Stock quantity
- `created_at` (Timestamp) - Creation date
- `updated_at` (Timestamp) - Last update

---

## 📄 License

This project is licensed under the terms described in the [LICENSE](LICENSE) file.



---

<div align="center">

**⭐ Star this repository if you found it helpful!**

</div>














