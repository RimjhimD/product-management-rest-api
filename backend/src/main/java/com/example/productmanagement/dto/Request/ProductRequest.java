package com.example.productmanagement.dto.Request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {

    @NotBlank(message = "Product name is required")
    @Size(min = 2, max = 100, message = "Product name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Product description is required")
    @Size(min = 2, max = 500, message = "Product description must be between 2 and 500 characters")
    private String description;

    @NotBlank(message = "Product price is required")
    @Pattern(regexp = "^\\d+\\.?\\d{0,2}$", message = "Invalid price format. Use up to 2 decimal places")
    private String price;
    
    @NotNull(message = "Product quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;

    // Get price as BigDecimal for internal use
    public BigDecimal getPriceAsBigDecimal() {
        try {
            return new BigDecimal(price);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid price format: " + price);
        }
    }
}