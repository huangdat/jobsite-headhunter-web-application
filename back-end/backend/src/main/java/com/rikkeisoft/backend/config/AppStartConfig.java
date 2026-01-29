package com.rikkeisoft.backend.config;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

@Slf4j
@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AppStartConfig {
    /**
     * This method is used to initialize the application when it starts.
     * @return ApplicationRunner that runs on application startup.
     */
    @Bean
    @Order(1) // Optional in when there is only one runner
    ApplicationRunner appInitRunner() {
        return args -> {
            // Initialization logic can be added here
        };
    }
}