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
                Product.builder()
                        .name("Laptop")
                        .description("High-performance laptop with 16GB RAM and 512GB SSD")
                        .price(new BigDecimal("1299.99"))
                        .quantity(50)
                        .build(),
                Product.builder()
                        .name("Smartphone")
                        .description("Latest smartphone with advanced camera and 5G connectivity")
                        .price(new BigDecimal("799.99"))
                        .quantity(100)
                        .build(),
                Product.builder()
                        .name("Wireless Headphones")
                        .description("Premium wireless headphones with noise cancellation")
                        .price(new BigDecimal("299.99"))
                        .quantity(75)
                        .build(),
                Product.builder()
                        .name("Gaming Mouse")
                        .description("High-precision gaming mouse with RGB lighting")
                        .price(new BigDecimal("89.99"))
                        .quantity(200)
                        .build(),
                Product.builder()
                        .name("Mechanical Keyboard")
                        .description("Mechanical keyboard with Cherry MX switches")
                        .price(new BigDecimal("149.99"))
                        .quantity(120)
                        .build(),
                Product.builder()
                        .name("Monitor")
                        .description("27-inch 4K UHD monitor")
                        .price(new BigDecimal("399.99"))
                        .quantity(60)
                        .build(),
                Product.builder()
                        .name("External SSD")
                        .description("1TB portable SSD")
                        .price(new BigDecimal("179.99"))
                        .quantity(80)
                        .build(),
                Product.builder()
                        .name("Webcam")
                        .description("1080p HD webcam for video conferencing")
                        .price(new BigDecimal("69.99"))
                        .quantity(150)
                        .build(),
                Product.builder()
                        .name("Bluetooth Speaker")
                        .description("Portable Bluetooth speaker with deep bass")
                        .price(new BigDecimal("49.99"))
                        .quantity(90)
                        .build(),
                Product.builder()
                        .name("Smartwatch")
                        .description("Fitness smartwatch with heart rate monitor")
                        .price(new BigDecimal("199.99"))
                        .quantity(110)
                        .build(),
                Product.builder()
                        .name("Tablet")
                        .description("10-inch tablet with stylus support")
                        .price(new BigDecimal("329.99"))
                        .quantity(70)
                        .build(),
                Product.builder()
                        .name("Router")
                        .description("Wi-Fi 6 router with high-speed connectivity")
                        .price(new BigDecimal("129.99"))
                        .quantity(85)
                        .build(),
                Product.builder()
                        .name("Printer")
                        .description("Wireless color printer")
                        .price(new BigDecimal("149.99"))
                        .quantity(40)
                        .build(),
                Product.builder()
                        .name("Desk Lamp")
                        .description("LED desk lamp with adjustable brightness")
                        .price(new BigDecimal("39.99"))
                        .quantity(130)
                        .build(),
                Product.builder()
                        .name("External HDD")
                        .description("2TB external hard drive")
                        .price(new BigDecimal("89.99"))
                        .quantity(75)
                        .build(),
                Product.builder()
                        .name("Microphone")
                        .description("USB condenser microphone for streaming")
                        .price(new BigDecimal("99.99"))
                        .quantity(65)
                        .build(),
                Product.builder()
                        .name("Graphics Tablet")
                        .description("Drawing tablet with pressure-sensitive pen")
                        .price(new BigDecimal("249.99"))
                        .quantity(55)
                        .build(),
                Product.builder()
                        .name("Smart Home Hub")
                        .description("Voice-controlled smart home hub")
                        .price(new BigDecimal("129.99"))
                        .quantity(40)
                        .build(),
                Product.builder()
                        .name("VR Headset")
                        .description("Virtual reality headset for immersive gaming")
                        .price(new BigDecimal("399.99"))
                        .quantity(30)
                        .build(),
                Product.builder()
                        .name("Fitness Tracker")
                        .description("Waterproof fitness tracker with sleep monitoring")
                        .price(new BigDecimal("79.99"))
                        .quantity(100)
                        .build()
        );

        productRepository.saveAll(products);
        logger.info("Sample data initialization completed successfully.");
    }
}
