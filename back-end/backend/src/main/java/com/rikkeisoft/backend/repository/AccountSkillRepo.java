package com.rikkeisoft.backend.repository;

import com.rikkeisoft.backend.model.entity.AccountSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountSkillRepo extends JpaRepository<AccountSkill, com.rikkeisoft.backend.model.entity.AccountSkillId> {

    List<AccountSkill> findByAccount_Id(String accountId);

    List<AccountSkill> findBySkill_Id(Long skillId);

    void deleteByAccount_Id(String accountId);

    boolean existsByAccount_IdAndSkill_Id(String accountId, Long skillId);

}