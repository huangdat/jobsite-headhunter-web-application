package com.rikkeisoft.backend.repository;

import com.rikkeisoft.backend.enums.OtpTokenType;
import com.rikkeisoft.backend.model.entity.OtpToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OtpTokenRepo extends JpaRepository<OtpToken, Long> {
    Optional<OtpToken> findTopByEmailAndUsedFalseOrderByCreatedAtDesc(String email);
    Optional<OtpToken> findTopByAccountIdAndUsedFalseOrderByCreatedAtDesc(String accountId);
    List<OtpToken> findAllByEmailAndTokenTypeOrderByCreatedAtDesc(String email, OtpTokenType tokenType);
}