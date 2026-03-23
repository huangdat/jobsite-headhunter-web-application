package com.rikkeisoft.backend.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Getter;
import java.io.Serializable;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class AccountSkillId implements Serializable {
    @Column(name = "account_id")
    @Getter @Setter
    private String accountId;

    @Column(name = "skill_id")
    @Getter @Setter
    private Long skillId;
}
