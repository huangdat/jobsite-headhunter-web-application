package com.rikkeisoft.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {
    @Value("#{'${cors.allowed-origins:*}'.split(',')}")
    private List<String> allowedOrigins;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();

        // If you want exact origins, use setAllowedOrigins(…) instead of patterns
        cfg.setAllowedOriginPatterns(allowedOrigins); // supports wildcards like https://*.example.com

        cfg.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        cfg.setAllowedHeaders(Arrays.asList(
                "Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin"
        ));
        cfg.setExposedHeaders(Arrays.asList(
                "Authorization", "Link", "X-Total-Count"
        ));

        // You’re using Bearer JWT (Authorization header), so credentials usually aren’t needed.
        // If you later use cookies, set this to true and switch to setAllowedOrigins with explicit origins.
        cfg.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }
}
