package com.rikkeisoft.backend.repository;

import com.rikkeisoft.backend.model.entity.BusinessProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BusinessProfileRepo extends JpaRepository<BusinessProfile, Long> {

    Optional<BusinessProfile> findByAccountId(String accountId);
}
