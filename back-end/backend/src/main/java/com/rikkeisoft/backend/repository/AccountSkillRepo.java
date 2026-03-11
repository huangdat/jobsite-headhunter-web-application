package com.rikkeisoft.backend.repository;

import com.rikkeisoft.backend.model.entity.AccountSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountSkillRepo extends JpaRepository<AccountSkill, Long> {

    List<AccountSkill> findByAccountId(String accountId);

    List<AccountSkill> findBySkillId(Long skillId);

    void deleteByAccountId(String accountId);

    boolean existsByAccountIdAndSkillId(String accountId, Long skillId);

}