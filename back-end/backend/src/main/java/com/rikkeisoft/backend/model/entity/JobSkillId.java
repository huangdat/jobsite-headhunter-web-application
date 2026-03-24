package com.rikkeisoft.backend.model.entity;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JobSkillId implements Serializable {
    Long jobId;
    Long skillId;
}
