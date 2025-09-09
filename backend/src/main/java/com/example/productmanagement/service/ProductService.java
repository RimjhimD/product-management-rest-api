package com.example.productmanagement.service;

import com.example.productmanagement.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {


    Product createProduct(Product product);


    List<Product> getAllProducts();


    Page<Product> getAllProducts(Pageable pageable);


    Product getProductById(Long id);


    Product updateProduct(Long id, Product product);

    void deleteProduct(Long id);


    List<Product> searchProductsByName(String name);


    Page<Product> searchProductsByName(String name, int page, int size, String sortBy, String sortDir);

    
    Page<Product> searchProducts(String searchTerm, Pageable pageable);



    List<Product> getProductsByQuantityGreaterThan(Integer quantity);


    List<Product> getProductsByPriceRange(java.math.BigDecimal minPrice, java.math.BigDecimal maxPrice);


    boolean existsByName(String name);


    List<Product> getAllProductsOrderedByName();


    List<Product> getAllProductsOrderedByPriceAsc();


    List<Product> getAllProductsOrderedByPriceDesc();


    List<Product> getAllProductsOrderedByCreatedDateDesc();
}
