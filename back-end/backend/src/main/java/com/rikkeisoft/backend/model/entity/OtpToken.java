package com.rikkeisoft.backend.model.entity;

import com.rikkeisoft.backend.enums.OtpTokenType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Data
@Entity
@Table(name = "otp_token")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OtpToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false, length = 255)
    String email;

    @Column(name = "account_id", length = 36)
    String accountId;

    @Column(nullable = false, length = 6)
    String code;

    @Column(nullable = false)
    Instant createdAt;

    @Column(nullable = false)
    Instant expiresAt;

    @Column(nullable = false)
    boolean used = false;

    @Enumerated(EnumType.STRING)
    OtpTokenType tokenType;
}

