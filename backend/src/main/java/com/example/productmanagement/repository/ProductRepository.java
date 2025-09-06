package com.example.productmanagement.repository;

import com.example.productmanagement.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    /**
     * Find products by name containing the given string (case-insensitive)
     */
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Product> findByNameContainingIgnoreCase(@Param("name") String name);

    /**
     * Find products by name containing the given string with pagination (case-insensitive)
     */
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    Page<Product> findByNameContainingIgnoreCase(@Param("name") String name, Pageable pageable);

    /**
     * Find products with quantity greater than the specified value
     */
    List<Product> findByQuantityGreaterThan(Integer quantity);

    /**
     * Find products with price between min and max values
     */
    List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

    /**
     * Check if a product exists by name (case-insensitive)
     */
    boolean existsByNameIgnoreCase(String name);

    /**
     * Find all products ordered by name
     */
    List<Product> findAllByOrderByNameAsc();

    /**
     * Find all products ordered by price ascending
     */
    List<Product> findAllByOrderByPriceAsc();

    /**
     * Find all products ordered by price descending
     */
    List<Product> findAllByOrderByPriceDesc();

    /**
     * Find all products ordered by created date descending
     */
    List<Product> findAllByOrderByCreatedAtDesc();
}