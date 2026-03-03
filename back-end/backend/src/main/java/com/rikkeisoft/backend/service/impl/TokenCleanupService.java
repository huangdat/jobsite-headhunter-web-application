package com.rikkeisoft.backend.service.impl;

import com.rikkeisoft.backend.repository.InvalidatedTokenRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TokenCleanupService {
    InvalidatedTokenRepo invalidatedTokenRepo;

    /**
     * Clean up expired tokens from blacklist every day at 2 AM
     */
    @Scheduled(cron = "0 0 2 * * ?")
    @Transactional
    public void cleanupExpiredTokens() {
        try {
            log.info("Starting cleanup of expired invalidated tokens...");
            long beforeCount = invalidatedTokenRepo.count();
            
            invalidatedTokenRepo.deleteByExpiryTimeBefore(Instant.now());
            
            long afterCount = invalidatedTokenRepo.count();
            long deletedCount = beforeCount - afterCount;
            
            log.info("Cleanup completed. Deleted {} expired tokens. Remaining: {}", 
                    deletedCount, afterCount);
        } catch (Exception e) {
            log.error("Error during token cleanup: {}", e.getMessage(), e);
        }
    }
}
