
package com.example.productmanagement.config;

import com.example.productmanagement.entity.Product;
import com.example.productmanagement.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    private final ProductRepository productRepository;

    // Constructor injection
    public DataInitializer(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        logger.info("Initializing sample data...");

        // Check if data already exists
        if (productRepository.count() > 0) {
            logger.info("Data already exists, skipping initialization");
            return;
        }

        // Create sample products
        Product product1 = new Product("Laptop", "High-performance laptop with 16GB RAM and 512GB SSD", new BigDecimal("1299.99"), 50);
        Product product2 = new Product("Smartphone", "Latest smartphone with advanced camera and 5G connectivity", new BigDecimal("799.99"), 100);
        Product product3 = new Product("Wireless Headphones", "Premium wireless headphones with noise cancellation", new BigDecimal("299.99"), 75);
        Product product4 = new Product("Gaming Mouse", "High-precision gaming mouse with RGB lighting", new BigDecimal("89.99"), 200);
        Product product5 = new Product("Mechanical Keyboard", "Mechanical keyboard with Cherry MX switches", new BigDecimal("149.99"), 120);

        // Additional 15 products
        Product product6 = new Product("Monitor", "27-inch 4K UHD monitor", new BigDecimal("399.99"), 60);
        Product product7 = new Product("External SSD", "1TB portable SSD", new BigDecimal("179.99"), 80);
        Product product8 = new Product("Webcam", "1080p HD webcam for video conferencing", new BigDecimal("69.99"), 150);
        Product product9 = new Product("Bluetooth Speaker", "Portable Bluetooth speaker with deep bass", new BigDecimal("49.99"), 90);
        Product product10 = new Product("Smartwatch", "Fitness smartwatch with heart rate monitor", new BigDecimal("199.99"), 110);
        Product product11 = new Product("Tablet", "10-inch tablet with stylus support", new BigDecimal("329.99"), 70);
        Product product12 = new Product("Router", "Wi-Fi 6 router with high-speed connectivity", new BigDecimal("129.99"), 85);
        Product product13 = new Product("Printer", "Wireless color printer", new BigDecimal("149.99"), 40);
        Product product14 = new Product("Desk Lamp", "LED desk lamp with adjustable brightness", new BigDecimal("39.99"), 130);
        Product product15 = new Product("External HDD", "2TB external hard drive", new BigDecimal("89.99"), 75);
        Product product16 = new Product("Microphone", "USB condenser microphone for streaming", new BigDecimal("99.99"), 65);
        Product product17 = new Product("Graphics Tablet", "Drawing tablet with pressure-sensitive pen", new BigDecimal("249.99"), 55);
        Product product18 = new Product("Smart Home Hub", "Voice-controlled smart home hub", new BigDecimal("129.99"), 40);
        Product product19 = new Product("VR Headset", "Virtual reality headset for immersive gaming", new BigDecimal("399.99"), 30);
        Product product20 = new Product("Fitness Tracker", "Waterproof fitness tracker with sleep monitoring", new BigDecimal("79.99"), 100);

        // Save all products to the repository
        productRepository.save(product1);
        productRepository.save(product2);
        productRepository.save(product3);
        productRepository.save(product4);
        productRepository.save(product5);
        productRepository.save(product6);
        productRepository.save(product7);
        productRepository.save(product8);
        productRepository.save(product9);
        productRepository.save(product10);
        productRepository.save(product11);
        productRepository.save(product12);
        productRepository.save(product13);
        productRepository.save(product14);
        productRepository.save(product15);
        productRepository.save(product16);
        productRepository.save(product17);
        productRepository.save(product18);
        productRepository.save(product19);
        productRepository.save(product20);

        logger.info("Sample data initialization completed successfully.");
    }
}
