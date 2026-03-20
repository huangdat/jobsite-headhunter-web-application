package com.rikkeisoft.backend.controller;

import com.rikkeisoft.backend.enums.SkillCategory;
import com.rikkeisoft.backend.model.dto.APIResponse;
import com.rikkeisoft.backend.model.dto.resp.skill.SkillResp;
import com.rikkeisoft.backend.model.entity.Skill;
import com.rikkeisoft.backend.repository.SkillRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequestMapping("/api/skills")
public class SkillController {
    SkillRepo skillRepo;

    @GetMapping
    public APIResponse<List<SkillResp>> getSkills(@RequestParam(required = false) SkillCategory category) {
        List<Skill> skills;
        if (category != null) {
            skills = skillRepo.findByCategory(category);
        } else {
            skills = skillRepo.findAll(Sort.by(Sort.Direction.ASC, "name"));
        }

        List<SkillResp> result = skills.stream()
                .map(skill -> SkillResp.builder()
                        .id(skill.getId())
                        .name(skill.getName())
                        .category(skill.getCategory())
                        .build())
                .collect(Collectors.toList());

        APIResponse<List<SkillResp>> response = new APIResponse<>();
        response.setStatus(HttpStatus.OK);
        response.setResult(result);
        response.setMessage("Skills fetched successfully");
        return response;
    }
}
