package com.rikkeisoft.backend.repository;

import com.rikkeisoft.backend.enums.SkillCategory;
import com.rikkeisoft.backend.model.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SkillRepo extends JpaRepository<Skill, Long> {

    Optional<Skill> findByName(String name);

    List<Skill> findByCategory(SkillCategory category);

    boolean existsByName(String name);

}