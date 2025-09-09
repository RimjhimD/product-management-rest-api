package com.example.productmanagement.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.lang.NonNull;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        String[] allowedOrigins = {
            "http://localhost:5173", 
            "http://localhost:5174", 
            "http://localhost:3000",
            "https://your-production-domain.com" // Add your production domain here
        };
        
        // Support environment variable for additional origins
        String additionalOrigins = System.getenv("ALLOWED_ORIGINS");
        if (additionalOrigins != null && !additionalOrigins.trim().isEmpty()) {
            String[] envOrigins = additionalOrigins.split(",");
            String[] combinedOrigins = new String[allowedOrigins.length + envOrigins.length];
            System.arraycopy(allowedOrigins, 0, combinedOrigins, 0, allowedOrigins.length);
            System.arraycopy(envOrigins, 0, combinedOrigins, allowedOrigins.length, envOrigins.length);
            allowedOrigins = combinedOrigins;
        }
        
        registry.addMapping("/**")
                .allowedOrigins(allowedOrigins)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("Authorization", "Content-Type", "Content-Disposition")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
