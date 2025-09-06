---

## 🔹 `docs/API_DOCS.md`
```markdown

# API Documentation

## Create Product
**POST** `/products`

**Request:**
```json
{
  "name": "Laptop",
  "description": "High performance laptop",
  "price": 1200.50,
  "quantity": 5
}
Response:

json

{
  "id": 1,
  "name": "Laptop",
  "description": "High performance laptop",
  "price": 1200.50,
  "quantity": 5,
  "created_at": "2025-09-05T10:15:30",
  "updated_at": "2025-09-05T10:15:30"
}
Get All Products
GET /products

Response:

json

[
  {
    "id": 1,
    "name": "Laptop",
    "description": "High performance laptop",
    "price": 1200.50,
    "quantity": 5
  }
]
Get Product by ID
GET /products/{id}

Update Product
PUT /products/{id}

Delete Product
DELETE /products/{id}


---

## 🔹 `problem/TASK.md`
```markdown
# Problem Statement

Objective:
1. Create a frontend module which contains login/registration flow with React.
2. Create a backend module using Spring Boot to manage products in a database. Implement CRUD REST APIs.

---

## Backend Requirements
- Create, Read, Update, Delete (CRUD) APIs for `Product`
- Use Spring Boot + JPA
- Entity: Product
- Repository, Service, Controller layers
- Validations with `@Valid`
- Exception handling with `@ControllerAdvice`
- Logging with SLF4J/Logback

---

## Deliverables
- Product entity class
- Repository interface
- Service interface + implementation
- Controller class
- Example JSON requests & responses
- Proper validations + exception handling
