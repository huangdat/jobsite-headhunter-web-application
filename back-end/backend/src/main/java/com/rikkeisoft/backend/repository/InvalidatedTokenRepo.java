package com.rikkeisoft.backend.repository;

import com.rikkeisoft.backend.model.entity.InvalidatedToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;

@Repository
public interface InvalidatedTokenRepo extends JpaRepository<InvalidatedToken, String> {
    boolean existsById(String id);
    void deleteByExpiryTimeBefore(Instant instant);
}
