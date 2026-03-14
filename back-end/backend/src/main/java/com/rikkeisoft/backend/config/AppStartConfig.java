package com.rikkeisoft.backend.config;

import com.rikkeisoft.backend.enums.AccountStatus;
import com.rikkeisoft.backend.enums.AuthProvider;
import com.rikkeisoft.backend.enums.Gender;
import com.rikkeisoft.backend.enums.Role;
import com.rikkeisoft.backend.model.entity.Account;
import com.rikkeisoft.backend.model.entity.ForumPost;
import com.rikkeisoft.backend.repository.AccountRepo;
import com.rikkeisoft.backend.repository.ForumPostRepo;
import com.rikkeisoft.backend.repository.JobRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.HashSet;

@Slf4j
@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AppStartConfig {
    PasswordEncoder passwordEncoder;

    /**
     * This method is used to initialize the application when it starts.
     *
     * @return ApplicationRunner that runs on application startup.
     */
    @Bean
    @Order(1)
    // Optional in when there is only one runner
    ApplicationRunner appInitRunner(AccountRepo accountRepo) {
        return args -> {
            // Create an admin account if it has not existed
            if (accountRepo.findByUsername("admin").isEmpty()) {

                HashSet roles = new HashSet();
                roles.add("ADMIN");

                Account admin = Account.builder()
                        .username("admin")
                        .email("datnh.work@gmail.com")
                        .password(passwordEncoder.encode("admin123"))
                        .fullName("Admin")
                        .phone("0123456789")
                        .imageUrl("src/main/resources/static/img/admin-avatar.webp")
                        .gender(Gender.OTHER)
                        .roles(roles)
                        .authProvider(AuthProvider.LOCAL)
                        .providerId("")
                        .status(AccountStatus.ACTIVE)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();

                accountRepo.save(admin);

                System.out.println("Admin account created!");
            }
        };
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}