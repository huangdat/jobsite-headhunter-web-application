package com.rikkeisoft.backend.model.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "account_skill")
public class AccountSkill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    Account account;
    @ManyToOne
    @JoinColumn(name = "skill_id", nullable = false)
    Skill skill;
}