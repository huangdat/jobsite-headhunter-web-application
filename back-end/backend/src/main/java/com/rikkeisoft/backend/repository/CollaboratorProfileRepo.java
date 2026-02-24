package com.rikkeisoft.backend.repository;

import com.rikkeisoft.backend.model.entity.CollaboratorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CollaboratorProfileRepo extends JpaRepository<CollaboratorProfile, Long> {

    Optional<CollaboratorProfile> findByAccountId(String accountId);

    List<CollaboratorProfile> findByManagedByHeadhunterId(String headhunterId);
}