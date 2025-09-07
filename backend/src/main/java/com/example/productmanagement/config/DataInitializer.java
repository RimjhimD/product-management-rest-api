package com.example.productmanagement.config;

import com.example.productmanagement.entity.Product;
import com.example.productmanagement.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    private final ProductRepository productRepository;


    public DataInitializer(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        logger.info("Initializing sample data...");

        if (productRepository.count() > 0) {
            logger.info("Data already exists, skipping initialization");
            return;
        }

        List<Product> products = List.of(
                new Product("Laptop", "High-performance laptop with 16GB RAM and 512GB SSD", new BigDecimal("1299.99"), 50),
                new Product("Smartphone", "Latest smartphone with advanced camera and 5G connectivity", new BigDecimal("799.99"), 100),
                new Product("Wireless Headphones", "Premium wireless headphones with noise cancellation", new BigDecimal("299.99"), 75),
                new Product("Gaming Mouse", "High-precision gaming mouse with RGB lighting", new BigDecimal("89.99"), 200),
                new Product("Mechanical Keyboard", "Mechanical keyboard with Cherry MX switches", new BigDecimal("149.99"), 120),
                new Product("Monitor", "27-inch 4K UHD monitor", new BigDecimal("399.99"), 60),
                new Product("External SSD", "1TB portable SSD", new BigDecimal("179.99"), 80),
                new Product("Webcam", "1080p HD webcam for video conferencing", new BigDecimal("69.99"), 150),
                new Product("Bluetooth Speaker", "Portable Bluetooth speaker with deep bass", new BigDecimal("49.99"), 90),
                new Product("Smartwatch", "Fitness smartwatch with heart rate monitor", new BigDecimal("199.99"), 110),
                new Product("Tablet", "10-inch tablet with stylus support", new BigDecimal("329.99"), 70),
                new Product("Router", "Wi-Fi 6 router with high-speed connectivity", new BigDecimal("129.99"), 85),
                new Product("Printer", "Wireless color printer", new BigDecimal("149.99"), 40),
                new Product("Desk Lamp", "LED desk lamp with adjustable brightness", new BigDecimal("39.99"), 130),
                new Product("External HDD", "2TB external hard drive", new BigDecimal("89.99"), 75),
                new Product("Microphone", "USB condenser microphone for streaming", new BigDecimal("99.99"), 65),
                new Product("Graphics Tablet", "Drawing tablet with pressure-sensitive pen", new BigDecimal("249.99"), 55),
                new Product("Smart Home Hub", "Voice-controlled smart home hub", new BigDecimal("129.99"), 40),
                new Product("VR Headset", "Virtual reality headset for immersive gaming", new BigDecimal("399.99"), 30),
                new Product("Fitness Tracker", "Waterproof fitness tracker with sleep monitoring", new BigDecimal("79.99"), 100)
        );

        productRepository.saveAll(products);
        logger.info("Sample data initialization completed successfully.");
    }
}
