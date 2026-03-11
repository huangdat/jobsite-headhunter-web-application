package com.rikkeisoft.backend.repository;

import com.rikkeisoft.backend.model.entity.JobSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobSkillRepo extends JpaRepository<JobSkill, Long> {

    List<JobSkill> findByJobId(Long jobId);

    List<JobSkill> findBySkillId(Long skillId);

    void deleteByJobId(Long jobId);

    boolean existsByJobIdAndSkillId(Long jobId, Long skillId);

}