

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

