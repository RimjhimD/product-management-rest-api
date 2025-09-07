package com.example.productmanagement.service.impl;

import com.example.productmanagement.entity.Product;
import com.example.productmanagement.repository.ProductRepository;
import com.example.productmanagement.service.ProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductServiceImpl.class);

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public Product createProduct(Product product) {
        logger.info("Creating new product: {}", product.getName());

        if (productRepository.existsByNameIgnoreCase(product.getName())) {
            throw new IllegalArgumentException("Product with name '" + product.getName() + "' already exists");
        }

        Product savedProduct = productRepository.save(product);
        logger.info("Product created successfully with ID: {}", savedProduct.getId());
        return savedProduct;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getAllProducts() {
        logger.info("Retrieving all products");
        return productRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Product> getAllProducts(Pageable pageable) {
        logger.info("Retrieving all products with pagination: page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        return productRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Product getProductById(Long id) {
        logger.info("Retrieving product with ID: {}", id);
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
    }

    @Override
    public Product updateProduct(Long id, Product product) {
        logger.info("Updating product with ID: {}", id);

        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));

        if (!existingProduct.getName().equalsIgnoreCase(product.getName()) &&
                productRepository.existsByNameIgnoreCase(product.getName())) {
            throw new IllegalArgumentException("Product with name '" + product.getName() + "' already exists");
        }

        if (product.getQuantity() < 0) {
            throw new IllegalArgumentException("Quantity cannot be negative");
        }

        if (product.getQuantity() < 5) {
            throw new IllegalArgumentException("Stock too low. Minimum allowed quantity is 5");
        }

        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setQuantity(product.getQuantity());

        Product updatedProduct = productRepository.save(existingProduct);
        logger.info("Product updated successfully with ID: {}", updatedProduct.getId());
        return updatedProduct;
    }

    @Override
    public void deleteProduct(Long id) {
        logger.info("Deleting product with ID: {}", id);

        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with ID: " + id);
        }

        productRepository.deleteById(id);
        logger.info("Product deleted successfully with ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Product> searchProductsByName(String name, int page, int size, String sortBy, String sortDir) {
        logger.info("Searching products by name: {} with pagination, page={}, size={}", name, page, size);

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return productRepository.findByNameContainingIgnoreCase(name, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getProductsByQuantityGreaterThan(Integer quantity) {
        logger.info("Retrieving products with quantity greater than: {}", quantity);
        return productRepository.findByQuantityGreaterThan(quantity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        logger.info("Retrieving products with price between {} and {}", minPrice, maxPrice);
        return productRepository.findByPriceBetween(minPrice, maxPrice);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByName(String name) {
        logger.info("Checking if product exists by name: {}", name);
        return productRepository.existsByNameIgnoreCase(name);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getAllProductsOrderedByName() {
        logger.info("Retrieving all products ordered by name");
        return productRepository.findAllByOrderByNameAsc();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getAllProductsOrderedByPriceAsc() {
        logger.info("Retrieving all products ordered by price ascending");
        return productRepository.findAllByOrderByPriceAsc();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getAllProductsOrderedByPriceDesc() {
        logger.info("Retrieving all products ordered by price descending");
        return productRepository.findAllByOrderByPriceDesc();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getAllProductsOrderedByCreatedDateDesc() {
        logger.info("Retrieving all products ordered by created date descending");
        return productRepository.findAllByOrderByCreatedAtDesc();
    }
}
