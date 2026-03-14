package com.rikkeisoft.backend.model.entity;

import com.rikkeisoft.backend.enums.AccountStatus;
import com.rikkeisoft.backend.enums.AuthProvider;
import com.rikkeisoft.backend.enums.Gender;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "account")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(nullable = false, unique = true, length = 100)
    String username;

    @Column(unique = true)
    String email;

    String password;

    @ManyToOne
    @JoinColumn(name = "business_profile_id")
    BusinessProfile businessProfile;

    String fullName;

    String phone;

    @Column(columnDefinition = "TEXT")
    String imageUrl;

    @Enumerated(EnumType.STRING)
    Gender gender;

    @Enumerated(EnumType.STRING)
    AuthProvider authProvider;

    String providerId;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    AccountStatus status = AccountStatus.ACTIVE;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "account_role", joinColumns = @JoinColumn(name = "account_id")
    )
    @Column(name = "role")
    @Builder.Default
    Set<String> roles = new HashSet<>();

    @OneToMany(mappedBy = "account")
    @Builder.Default
    Set<AccountSkill> accountSkills = new HashSet<>();

}
