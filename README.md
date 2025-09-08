
# 🚀 Product Management System

A modern, full-stack Product Management System built with **Spring Boot REST API** and **React frontend**. Features a beautiful Material-UI dashboard with authentication, CRUD operations, advanced search, sorting, and real-time notifications.

![Java](https://img.shields.io/badge/Java-23-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.5-green)
![React](https://img.shields.io/badge/React-19.1.1-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
![Material-UI](https://img.shields.io/badge/Material--UI-5.0-purple)

---

## ✨ Features

### 🎯 **Core Functionality**
- 🔐 **Authentication System** - Login and registration with protected routes
- 📦 **Product Management** - Full CRUD operations with validation
- 🔍 **Advanced Search** - Server-side search across product names and descriptions
- 📊 **Smart Sorting** - Multi-field sorting with direction control
- 📄 **Pagination** - Efficient data loading with page navigation
- 📈 **Dashboard Analytics** - Real-time statistics and inventory insights

### 🎨 **Modern UI/UX**
- 🌈 **Beautiful Design** - Modern gradient cards and animations
- 📱 **Responsive Layout** - Works perfectly on all devices
- 🔔 **Real-time Notifications** - Success/error feedback with snackbars
- ⚡ **Smooth Interactions** - Hover effects and micro-animations
- 🎭 **Professional Styling** - Consistent Material-UI design system

### 🛡️ **Robust Backend**
- ✅ **Data Validation** - Comprehensive input validation and error handling
- 🗄️ **Database Integration** - MySQL with JPA and Hibernate
- 📝 **Comprehensive Logging** - SLF4J + Logback for monitoring
- 🔒 **Exception Handling** - Global error handling with meaningful responses

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend** | React + Vite | 19.1.1 |
| **UI Library** | Material-UI (MUI) | 7.3.2 |
| **HTTP Client** | Axios | 1.11.0 |
| **Routing** | React Router | 7.8.2 |
| **Backend** | Spring Boot | 3.5.5 |
| **Database** | MySQL | 8.0+ |
| **ORM** | Spring Data JPA | 3.5.5 |
| **Build Tool** | Maven | 3.9+ |
| **Java Version** | OpenJDK | 23 |

---

## 📁 Project Structure

```
product-management-rest-api/
├── 📂 backend/                 # Spring Boot REST API
│   ├── 📂 src/main/java/
│   │   └── 📂 com/example/productmanagement/
│   │       ├── 📂 controller/  # REST Controllers
│   │       ├── 📂 service/     # Business Logic
│   │       ├── 📂 repository/  # Data Access Layer
│   │       ├── 📂 entity/      # JPA Entities
│   │       └── 📂 dto/         # Data Transfer Objects
│   └── 📄 pom.xml             # Maven Dependencies
├── 📂 frontend/               # React + Vite Application
│   ├── 📂 src/
│   │   ├── 📂 components/     # Reusable Components
│   │   ├── 📂 pages/          # Page Components
│   │   ├── 📂 services/       # API Services
│   │   └── 📂 context/        # React Context
│   └── 📄 package.json       # NPM Dependencies
├── 📂 docs/                   # Comprehensive Documentation
└── 📂 problem/                # Original Requirements
```

---

## 🚀 Quick Start Guide

### 📋 Prerequisites

Before you begin, ensure you have the following installed:

- ☕ **Java 23** or higher
- 📦 **Node.js 18+** and npm
- 🗄️ **MySQL 8.0+** (via XAMPP recommended)
- 🔧 **Maven 3.9+** (or use included wrapper)

### 🗄️ Database Setup (XAMPP)

1. **Download and Install XAMPP**
   ```bash
   # Download from: https://www.apachefriends.org/
   # Install and start XAMPP Control Panel
   ```

2. **Start Required Services**
   - Open XAMPP Control Panel
   - Start **Apache** and **MySQL** services
   - Ensure MySQL is running on port **3306**

3. **Create Database**
   ```sql
   # Access phpMyAdmin: http://localhost/phpmyadmin
   # Create new database: product_db
   CREATE DATABASE product_db;
   ```

4. **Configure Database Connection**
   ```properties
   # backend/src/main/resources/application.properties
   spring.datasource.url=jdbc:mysql://localhost:3306/product_management
   spring.datasource.username=root
   spring.datasource.password=
   spring.jpa.hibernate.ddl-auto=update
   ```

### 🔧 Backend Setup (Spring Boot)

1. **Navigate to Backend Directory**
   ```bash
   cd backend
   ```

2. **Install Dependencies & Run**
   ```bash
   # Using Maven Wrapper (Recommended)
   ./mvnw clean install
   ./mvnw spring-boot:run
   
   # Or using system Maven
   mvn clean install
   mvn spring-boot:run
   ```

3. **Verify Backend**
   - Backend will start on: `http://localhost:8080`
   - Test endpoint: `http://localhost:8080/products`
   - Check logs for successful database connection

### 🎨 Frontend Setup (React + Vite)

1. **Navigate to Frontend Directory**
   ```bash
   cd frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access Application**
   - Frontend will start on: `http://localhost:5173`
   - Login with any credentials (mock authentication)
   - Explore the beautiful dashboard!

---

## 🎯 Usage Guide

### 🔐 Authentication
1. Navigate to `http://localhost:5173`
2. Click "Register" to create an account or "Login" with existing credentials
3. Use any username/password (mock authentication for demo)

### 📦 Product Management
1. **View Products**: Browse paginated product list with search and sort
2. **Add Product**: Click "Add Product" button, fill form, and submit
3. **Edit Product**: Click edit icon on any product row
4. **Delete Product**: Click delete icon with confirmation dialog
5. **Search Products**: Use search bar to find products by name or description
6. **Sort Products**: Use dropdown and direction toggle for custom sorting

### 📊 Dashboard Features
- **Summary Cards**: View total products, low stock alerts, and recent additions
- **Advanced Search**: Real-time server-side search across all products
- **Smart Sorting**: Sort by ID, Name, Price, Quantity, or Date Created
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| 📖 [API Documentation](docs/API+PROJECT%20FLOW_DOCS.md) | Complete API reference with examples |
| 📋 [Project Planning](docs/PLANNING.md) | Development roadmap and architecture |
| 📝 [Project Updates](docs/PROJECT-UPDATE.md) | Development progress and changelog |
| 🎓 [Learning Notes](docs/LEARNING.md) | Technologies and concepts learned |

---

## 🔧 Configuration

### Backend Configuration
```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/product_management
spring.datasource.username=root
spring.datasource.password=

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Server Configuration
server.port=8080
```

### Frontend Configuration
```javascript
// API Base URL
const API_BASE_URL = 'http://localhost:8080';

// Development Server
dev: {
  port: 5173,
  host: true
}
```

---

## 🚨 Troubleshooting

### Common Issues

1. **MySQL Connection Failed**
   - Ensure XAMPP MySQL service is running
   - Check database name and credentials
   - Verify port 3306 is not blocked

2. **Backend Port Conflict**
   - Change port in `application.properties`: `server.port=8081`
   - Update frontend API URL accordingly

3. **Frontend Build Issues**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Update Node.js to latest LTS version

4. **CORS Issues**
   - Backend includes `@CrossOrigin(origins = "*")` for development
   - For production, configure specific origins

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the terms of the [LICENSE](LICENSE) file included in this repository.

---

## 🎉 Acknowledgments

- **Spring Boot** for the robust backend framework
- **React** and **Vite** for the modern frontend experience
- **Material-UI** for the beautiful component library
- **MySQL** for reliable data persistence

---

<div align="center">

**⭐ Star this repository if you found it helpful!**



</div>














