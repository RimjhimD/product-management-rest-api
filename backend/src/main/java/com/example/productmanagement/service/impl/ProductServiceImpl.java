package com.example.productmanagement.service.impl;

import com.example.productmanagement.entity.Product;
import com.example.productmanagement.exception.DuplicateProductException;
import com.example.productmanagement.repository.ProductRepository;
import com.example.productmanagement.service.ProductService;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public Product createProduct(Product product) {
        // Trim the product name and update the product object
        String productName = product.getName() != null ? product.getName().trim() : "";
        if (productName.isEmpty()) {
            throw new IllegalArgumentException("Product name cannot be empty");
        }
        product.setName(productName);
        
        log.info("Creating new product: '{}' (length: {})", productName, productName.length());
        
        // Check if product with same name exists (case-insensitive)
        if (productRepository.existsByNameIgnoreCase(productName)) {
            log.warn("Product with name '{}' already exists", productName);
            throw new DuplicateProductException(
                "A product with the name '" + productName + "' already exists. Please use a different name.");
        }

        try {
            Product savedProduct = productRepository.save(product);
            log.info("Product created successfully - ID: {}, Name: '{}' (length: {})", 
                savedProduct.getId(), savedProduct.getName(), savedProduct.getName().length());
            return savedProduct;
        } catch (Exception e) {
            log.error("Error creating product: {}", e.getMessage(), e);
            throw new IllegalArgumentException("Failed to create product: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getAllProducts() {
        log.info("Retrieving all products");
        return productRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Product> getAllProducts(Pageable pageable) {
        log.info("Retrieving all products with pagination: page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        return productRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Product getProductById(Long id) {
        log.info("Retrieving product with ID: {}", id);
        return productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with ID: " + id));
    }

    @Override
    @Transactional
    public Product updateProduct(Long id, Product product) {
        log.info("Updating product with ID: {}", id);
        
        // Find existing product
        Product existingProduct = getProductById(id);
        
        // Check for duplicate name if name is being changed
        if (!existingProduct.getName().equalsIgnoreCase(product.getName()) && 
            productRepository.existsByNameIgnoreCase(product.getName())) {
            String errorMessage = String.format("Product with name '%s' already exists", product.getName());
            log.warn("Duplicate product name during update: {}", errorMessage);
            throw new DuplicateProductException(errorMessage);
        }
        
        // Validate quantity
        if (product.getQuantity() < 0) {
            throw new IllegalArgumentException("Product quantity cannot be negative");
        }
        
        // Update product fields
        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setQuantity(product.getQuantity());
        
        log.info("Updated product with ID: {}", id);
        return productRepository.save(existingProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new EntityNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
        log.info("Product deleted successfully with ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> searchByNameIgnoreCase(String name) {
        return productRepository.searchByNameIgnoreCase(name);
    }
    
    @Override
    public Page<Product> searchProductsByName(String name, int page, int size, String sortBy, String sortDir) {
        log.info("Searching products by name: {}, page: {}, size: {}, sortBy: {}, sortDir: {}", 
            name, page, size, sortBy, sortDir);
            
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        
        if (name == null || name.trim().isEmpty()) {
            return productRepository.findAll(pageable);
        }
        return productRepository.searchProductsPageable(name.toLowerCase(), pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getProductsByQuantityGreaterThan(Integer quantity) {
        log.info("Retrieving products with quantity greater than: {}", quantity);
        return productRepository.findByQuantityGreaterThan(quantity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        log.info("Retrieving products with price between {} and {}", minPrice, maxPrice);
        return productRepository.findByPriceBetween(minPrice, maxPrice);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByName(String name) {
        log.info("Checking if product exists by name: {}", name);
        return productRepository.existsByNameIgnoreCase(name);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getAllProductsOrderedByName() {
        log.info("Retrieving all products ordered by name");
        return productRepository.findAllByOrderByNameAsc();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getAllProductsOrderedByPriceAsc() {
        log.info("Retrieving all products ordered by price ascending");
        return productRepository.findAllByOrderByPriceAsc();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getAllProductsOrderedByPriceDesc() {
        log.info("Retrieving all products ordered by price descending");
        return productRepository.findAllByOrderByPriceDesc();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getAllProductsOrderedByCreatedDateDesc() {
        log.info("Retrieving all products ordered by created date descending");
        return productRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Product> searchProducts(String searchTerm, Pageable pageable) {
        log.info("Searching products with term: {} with pagination", searchTerm);
        return productRepository.searchProductsPageable(searchTerm, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean checkStockAvailability(Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + productId));
        return product.getQuantity() >= quantity;
    }
}
