package com.example.productmanagement.controller;

import com.example.productmanagement.dto.Request.ProductRequest;
import com.example.productmanagement.dto.Response.ProductResponse;
import com.example.productmanagement.entity.Product;
import com.example.productmanagement.service.ProductService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/products")
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Create a new product
    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        logger.info("Received request to create product: {}", request.getName());
        try {
            // Convert request to entity, which will handle the price conversion
            Product product = convertToEntity(request);
            Product createdProduct = productService.createProduct(product);
            ProductResponse response = convertToResponse(createdProduct);
            logger.info("Successfully created product with ID: {}", createdProduct.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            logger.error("Validation error in createProduct: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    // Get all products with pagination + sorting + search
    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search) {

        try {
            Sort sort = sortDir.equalsIgnoreCase("desc")
                    ? Sort.by(sortBy).descending()
                    : Sort.by(sortBy).ascending();

            Pageable pageable = PageRequest.of(page, size, sort);
            Page<Product> productPage;

            if (search != null && !search.trim().isEmpty()) {
                productPage = productService.searchProducts(search.trim(), pageable);
            } else {
                productPage = productService.getAllProducts(pageable);
            }

            // Convert Page<Product> to Page<ProductResponse>
            Page<ProductResponse> responsePage = productPage.map(this::convertToResponse);
            return ResponseEntity.ok(responsePage);
        } catch (Exception e) {
            logger.error("Error retrieving products", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get product by ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        ProductResponse response = convertToResponse(product);
        return ResponseEntity.ok(response);
    }

    // Update product
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        logger.info("Received request to update product with ID: {}", id);
        Product product = convertToEntity(request);
        product.setId(id);
        Product updatedProduct = productService.updateProduct(id, product);
        ProductResponse response = convertToResponse(updatedProduct);
        logger.info("Successfully updated product with ID: {}", id);
        return ResponseEntity.ok(response);
    }

    // Delete product
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }


    // Check stock availability
    @GetMapping("/{id}/stock")
    public ResponseEntity<Boolean> checkStockAvailability(
            @PathVariable Long id,
            @RequestParam Integer quantity) {
        boolean available = productService.checkStockAvailability(id, quantity);
        return ResponseEntity.ok(available);
    }

    // Helper methods for DTO conversion
    private Product convertToEntity(ProductRequest request) {
        return Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPriceAsBigDecimal())
                .quantity(request.getQuantity())
                .build();
    }

    private ProductResponse convertToResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .quantity(product.getQuantity())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}
