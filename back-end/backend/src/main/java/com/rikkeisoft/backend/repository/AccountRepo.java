package com.rikkeisoft.backend.repository;

import com.rikkeisoft.backend.model.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepo extends JpaRepository<Account, String>, JpaSpecificationExecutor<Account> {
    Optional<Account> findByUsername(String username);

    Optional<Account> findByEmail(String email);

    Optional<Account> findByProviderId(String providerId);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    List<Account> findByRolesContaining(String role);

    

}
