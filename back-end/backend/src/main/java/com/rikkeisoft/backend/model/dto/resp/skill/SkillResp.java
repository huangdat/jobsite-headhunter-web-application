package com.rikkeisoft.backend.model.dto.resp.skill;

import com.rikkeisoft.backend.enums.SkillCategory;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SkillResp {
    Long id;
    String name;
    SkillCategory category;
}
