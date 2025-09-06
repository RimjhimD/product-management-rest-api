package com.example.productmanagement.service;

import com.example.productmanagement.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {

    /**
     * Create a new product
     */
    Product createProduct(Product product);

    /**
     * Get all products
     */
    List<Product> getAllProducts();

    /**
     * Get all products with pagination
     */
    Page<Product> getAllProducts(Pageable pageable);

    /**
     * Get product by ID
     */
    Product getProductById(Long id);

    /**
     * Update an existing product
     */
    Product updateProduct(Long id, Product product);

    /**
     * Delete a product by ID
     */
    void deleteProduct(Long id);

    /**
     * Search products by name
     */
    List<Product> searchProductsByName(String name);

    /**
     * Search products by name with pagination
     */
    Page<Product> searchProductsByName(String name, Pageable pageable);

    /**
     * Get products with quantity greater than specified value
     */
    List<Product> getProductsByQuantityGreaterThan(Integer quantity);

    /**
     * Get products with price between min and max values
     */
    List<Product> getProductsByPriceRange(java.math.BigDecimal minPrice, java.math.BigDecimal maxPrice);

    /**
     * Check if product exists by name
     */
    boolean existsByName(String name);

    /**
     * Get all products ordered by name
     */
    List<Product> getAllProductsOrderedByName();

    /**
     * Get all products ordered by price ascending
     */
    List<Product> getAllProductsOrderedByPriceAsc();

    /**
     * Get all products ordered by price descending
     */
    List<Product> getAllProductsOrderedByPriceDesc();

    /**
     * Get all products ordered by created date descending
     */
    List<Product> getAllProductsOrderedByCreatedDateDesc();
}