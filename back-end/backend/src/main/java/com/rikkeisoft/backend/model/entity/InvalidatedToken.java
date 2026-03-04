package com.rikkeisoft.backend.model.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Data
@Entity
@Table(name = "invalidated_token")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InvalidatedToken {
    @Id
    @Column(name = "token_id", nullable = false, length = 500)
    String id;

    @Column(name = "expiry_time", nullable = false)
    Instant expiryTime;

    @Column(name = "invalidated_at", nullable = false)
    Instant invalidatedAt;
}
