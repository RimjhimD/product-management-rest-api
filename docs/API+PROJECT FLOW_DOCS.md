# API & Project Flow Documentation

This document describes the REST API endpoints for the Product Management system **and** the project workflow, including frontend-backend interaction and dashboard logic.

---

## **1. Create Product**

**POST** `/products`

**Request Body:**

```json
{
  "name": "Laptop",
  "description": "High performance laptop",
  "price": 1200.50,
  "quantity": 5
}
Response (201 Created):

json

{
  "id": 1,
  "name": "Laptop",
  "description": "High performance laptop",
  "price": 1200.50,
  "quantity": 5,
  "createdAt": "2025-09-07T10:15:30",
  "updatedAt": "2025-09-07T10:15:30"
 } 
```

Notes:

Quantity must be >= 5; otherwise, backend throws an error.

Duplicate product names are not allowed.

2. Get All Products (Paginated)
GET /products?page={page}&size={size}

Query Parameters:

page (integer, optional) – Page number, starts from 0.

size (integer, optional) – Number of products per page.

Response (200 OK):

```json

{
  "content": [
    {
      "id": 1,
      "name": "Laptop",
      "description": "High performance laptop",
      "price": 1200.50,
      "quantity": 5,
      "createdAt": "2025-09-07T10:15:30",
      "updatedAt": "2025-09-07T10:15:30"
    }
  ],
  "number": 0,
  "totalPages": 2,
  "totalElements": 15,
  "size": 10
}
```

Notes:

Used for pagination in the frontend dashboard.

Also used to calculate low-stock and recently added product statistics.

3. Get Product by ID
GET /products/{id}

Response (200 OK):

```json

{
  "id": 1,
  "name": "Laptop",
  "description": "High performance laptop",
  "price": 1200.50,
  "quantity": 5,
  "createdAt": "2025-09-07T10:15:30",
  "updatedAt": "2025-09-07T10:15:30"
}

```
Errors:

404 Not Found if product with given ID does not exist.

4. Update Product
PUT /products/{id}

Request Body:

```json

{
  "name": "Laptop Pro",
  "description": "Upgraded laptop",
  "price": 1500.00,
  "quantity": 10
}
Response (200 OK):

json

{
  "id": 1,
  "name": "Laptop Pro",
  "description": "Upgraded laptop",
  "price": 1500.00,
  "quantity": 10,
  "createdAt": "2025-09-07T10:15:30",
  "updatedAt": "2025-09-08T14:20:00"
}

```
Notes:

Backend checks for duplicate names.

Quantity < 5 triggers an error.

5. Delete Product
DELETE /products/{id}

Response:

204 No Content on successful deletion.

Errors:

404 Not Found if product does not exist.


6. Search Products (Frontend Filtering)
Currently, the dashboard filters products by name on the frontend.

Enter search term → filters products array → shows matching results.

Partial matches are allowed (case-insensitive).


7. Summary/Stats (Frontend Logic)
Total Products: Total number of products (totalElements).

Low Stock: Products with quantity < 5.

Recently Added: Products created within the last 7 days.


8. Pagination (Frontend Logic)
Pagination buttons call GET /products with the correct page number.

Previous button disabled if currentPage === 0.

Next button disabled if currentPage + 1 >= totalPages.


9. Project Flow / Frontend-Backend Interaction
Frontend (React + MUI Dashboard)



flowchart TD
    A[Frontend (React + MUI Dashboard)] --> B[Fetch Products<br/>(GET /products?page=x&size=y)]
    B --> C[Display in Table]
    B --> D[Update Summary Cards<br/>(Total, Low Stock, Recently Added)]
    
    A --> E[Search Products<br/>(Frontend Filter)]
    E --> F[Filters 'products' array by name]

    A --> G[Add / Edit Product]
    G --> H[Opens Dialog]
    G --> I[Submits POST /products or PUT /products/{id}]
    I --> J[On success: refresh table & summary cards]

    A --> K[Delete Product]
    K --> L[Sends DELETE /products/{id}]
    L --> M[On success: refresh table & stats]

    N[Backend (Spring Boot REST API)] --> O[CRUD operations]
    N --> P[Pagination support]
    N --> Q[Data validation (quantity >= 5, unique name)]
    N --> R[Returns JSON responses]

Notes:

Frontend handles UI, dialogs, search, and summary cards.

Backend handles all data persistence, validation, and pagination.
