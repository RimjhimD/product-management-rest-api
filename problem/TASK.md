Implement REST APIs for Product Management
Inbox

Lofistack official <lofistackofficial01@gmail.com>
Sep 3, 2025, 11:38 PM (2 days ago)
to robiul110256, me, admin, zahid.chowdhury023

Dear Candidate,

Please find below the detailed objective, requirements, implementation guidelines, and deliverables for the backend and frontend module development:

Objective
1. Create a frontend module which contains login registration flow with React.

2. Create a backend module using Spring Boot to manage products in a database. Implement CRUD REST APIs for the Product table.

Requirements for Backend

API Endpoints

Create Product

Method: POST

URL: /products

Request Body: JSON containing name, description, price, quantity

Response: Created product details with id

Get All Products

Method: GET

URL: /products

Response: List of all products

Get Product by ID

Method: GET

URL: /products/{id}

Path Variable: id of the product

Response: Product details

Update Product

Method: PUT

URL: /products/{id}

Path Variable: id of the product

Request Body: JSON containing fields to update (name, description, price, quantity)

Response: Updated product details

Delete Product

Method: DELETE

URL: /products/{id}

Path Variable: id of the product

Response: Success message

Implementation Guidelines

Use Spring Boot with Spring Data JPA.

Create:

Entity class for Product

Repository interface extending JpaRepository

Service interface & ServiceImpl

Controller class for REST endpoints

Validate request bodies using @Valid and proper annotations (@NotNull, @Size, etc.)

Return meaningful HTTP status codes:

201 Created for POST

200 OK for GET/PUT

204 No Content for DELETE

404 Not Found if product doesn’t exist

Handle exceptions globally using @ControllerAdvice

Log API requests and responses

Deliverables

Product entity class

ProductRepository interface

ProductService interface & implementation

ProductController class

Example JSON requests and responses for each endpoint

Proper validations and exception handling

Optional Enhancements (Bonus)


Implement pagination and sorting for GET /products

Add search endpoint: /products/search?name={name}

Add stock availability check before updating quantity

Implement pagination and sorting for GET /products

Add search endpoint: /products/search?name={name}

Database table:Product
| Column Name | Type       | Description                  |
|------------|-----------|------------------------------|
| id         | Long      | Primary key, auto-increment  |
| name       | String    | Product name                 |
| description| String    | Product description          |
| price      | BigDecimal| Product price                |
| quantity   | Integer   | Available stock quantity     |
| created_at | Timestamp | Creation timestamp           |
| updated_at | Timestamp | Last update timestamp        |






Add stock availability check before updating quantity

