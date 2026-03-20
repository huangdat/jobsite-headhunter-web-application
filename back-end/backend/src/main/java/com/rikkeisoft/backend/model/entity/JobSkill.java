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
@Table(name = "job_skill")
@IdClass(JobSkillId.class)
public class JobSkill {
    @Id
    @Column(name = "job_id")
    Long jobId;

    @Id
    @Column(name = "skill_id")
    Long skillId;

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false, insertable = false, updatable = false)
    Job job;

    @ManyToOne
    @JoinColumn(name = "skill_id", nullable = false, insertable = false, updatable = false)
    Skill skill;
}