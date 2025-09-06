package com.example.productmanagement.controller;

import com.example.productmanagement.entity.Product;
import com.example.productmanagement.service.ProductService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    private final ProductService productService;

    // Constructor injection
    public ProductController(ProductService productService) {
        this.productService = productService;
    }


    /**
     * Create a new product
     * POST /products
     */
    @PostMapping
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        logger.info("POST /products - Creating product: {}", product.getName());
        try {
            Product createdProduct = productService.createProduct(product);
            logger.info("Product created successfully with ID: {}", createdProduct.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
        } catch (IllegalArgumentException e) {
            logger.error("Error creating product: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Unexpected error creating product", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get all products
     * GET /products
     */
    @GetMapping
    public ResponseEntity<Page<Product>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        logger.info("GET /products - Retrieving all products (page={}, size={}, sortBy={}, sortDir={})",
                page, size, sortBy, sortDir);

        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ?
                    Sort.by(sortBy).descending() :
                    Sort.by(sortBy).ascending();

            Pageable pageable = PageRequest.of(page, size, sort);
            Page<Product> productPage = productService.getAllProducts(pageable);

            logger.info("Retrieved {} products", productPage.getTotalElements());
            return ResponseEntity.ok(productPage); // ✅ now returns full Page object
        } catch (Exception e) {
            logger.error("Error retrieving products", e);
            return ResponseEntity.internalServerError().build();
        }
    }


    /**
     * Get all products with pagination
     * GET /products/paginated
     */
    @GetMapping("/paginated")
    public ResponseEntity<Page<Product>> getAllProductsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        logger.info("GET /products/paginated - Retrieving paginated products");

        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ?
                    Sort.by(sortBy).descending() :
                    Sort.by(sortBy).ascending();

            Pageable pageable = PageRequest.of(page, size, sort);
            Page<Product> productPage = productService.getAllProducts(pageable);

            return ResponseEntity.ok(productPage);
        } catch (Exception e) {
            logger.error("Error retrieving paginated products", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get product by ID
     * GET /products/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        logger.info("GET /products/{} - Retrieving product by ID", id);

        try {
            Product product = productService.getProductById(id);
            logger.info("Product found: {}", product.getName());
            return ResponseEntity.ok(product);
        } catch (RuntimeException e) {
            logger.error("Product not found with ID: {}", id);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error retrieving product with ID: {}", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Update product
     * PUT /products/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @Valid @RequestBody Product product) {
        logger.info("PUT /products/{} - Updating product", id);

        try {
            Product updatedProduct = productService.updateProduct(id, product);
            logger.info("Product updated successfully: {}", updatedProduct.getName());
            return ResponseEntity.ok(updatedProduct);
        } catch (IllegalArgumentException e) {
            logger.error("Error updating product: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            logger.error("Product not found with ID: {}", id);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Unexpected error updating product", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Delete product
     * DELETE /products/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        logger.info("DELETE /products/{} - Deleting product", id);

        try {
            productService.deleteProduct(id);
            logger.info("Product deleted successfully with ID: {}", id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            logger.error("Product not found with ID: {}", id);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error deleting product with ID: {}", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Search products by name
     * GET /products/search?name={name}
     */
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProductsByName(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        logger.info("GET /products/search - Searching products by name: {}", name);

        try {
            if (page == 0 && size == 10) {
                // Return simple list if no pagination requested
                List<Product> products = productService.searchProductsByName(name);
                return ResponseEntity.ok(products);
            } else {
                // Return paginated results
                Pageable pageable = PageRequest.of(page, size);
                Page<Product> productPage = productService.searchProductsByName(name, pageable);
                return ResponseEntity.ok(productPage.getContent());
            }
        } catch (Exception e) {
            logger.error("Error searching products by name: {}", name, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get products with quantity greater than specified value
     * GET /products/stock?quantity={quantity}
     */
    @GetMapping("/stock")
    public ResponseEntity<List<Product>> getProductsByStock(@RequestParam Integer quantity) {
        logger.info("GET /products/stock - Getting products with quantity > {}", quantity);

        try {
            List<Product> products = productService.getProductsByQuantityGreaterThan(quantity);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            logger.error("Error retrieving products by stock", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get products by price range
     * GET /products/price?min={minPrice}&max={maxPrice}
     */
    @GetMapping("/price")
    public ResponseEntity<List<Product>> getProductsByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice) {

        logger.info("GET /products/price - Getting products with price between {} and {}", minPrice, maxPrice);

        try {
            List<Product> products = productService.getProductsByPriceRange(minPrice, maxPrice);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            logger.error("Error retrieving products by price range", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get all products ordered by name
     * GET /products/sorted/name
     */
    @GetMapping("/sorted/name")
    public ResponseEntity<List<Product>> getProductsOrderedByName() {
        logger.info("GET /products/sorted/name - Getting products ordered by name");

        try {
            List<Product> products = productService.getAllProductsOrderedByName();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            logger.error("Error retrieving products ordered by name", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get all products ordered by price ascending
     * GET /products/sorted/price-asc
     */
    @GetMapping("/sorted/price-asc")
    public ResponseEntity<List<Product>> getProductsOrderedByPriceAsc() {
        logger.info("GET /products/sorted/price-asc - Getting products ordered by price ascending");

        try {
            List<Product> products = productService.getAllProductsOrderedByPriceAsc();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            logger.error("Error retrieving products ordered by price ascending", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get all products ordered by price descending
     * GET /products/sorted/price-desc
     */
    @GetMapping("/sorted/price-desc")
    public ResponseEntity<List<Product>> getProductsOrderedByPriceDesc() {
        logger.info("GET /products/sorted/price-desc - Getting products ordered by price descending");

        try {
            List<Product> products = productService.getAllProductsOrderedByPriceDesc();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            logger.error("Error retrieving products ordered by price descending", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get all products ordered by created date descending
     * GET /products/sorted/latest
     */
    @GetMapping("/sorted/latest")
    public ResponseEntity<List<Product>> getProductsOrderedByLatest() {
        logger.info("GET /products/sorted/latest - Getting products ordered by created date descending");

        try {
            List<Product> products = productService.getAllProductsOrderedByCreatedDateDesc();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            logger.error("Error retrieving products ordered by latest", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}