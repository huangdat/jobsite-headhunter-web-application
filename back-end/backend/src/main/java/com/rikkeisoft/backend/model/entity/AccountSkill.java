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
    @EmbeddedId
    AccountSkillId id;

    @ManyToOne
    @MapsId("accountId")
    @JoinColumn(name = "account_id", nullable = false)
    Account account;

    @ManyToOne
    @MapsId("skillId")
    @JoinColumn(name = "skill_id", nullable = false)
    Skill skill;
}