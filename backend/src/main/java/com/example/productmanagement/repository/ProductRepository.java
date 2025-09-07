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

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // For non-paginated search
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Product> searchByNameIgnoreCase(@Param("name") String name);

    // For paginated search
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    Page<Product> searchByNameIgnoreCase(@Param("name") String name, Pageable pageable);

    
    List<Product> findByQuantityGreaterThan(Integer quantity);

    List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

    boolean existsByNameIgnoreCase(String name);

    List<Product> findAllByOrderByNameAsc();

    List<Product> findAllByOrderByPriceAsc();

    List<Product> findAllByOrderByPriceDesc();

    List<Product> findAllByOrderByCreatedAtDesc();
}
