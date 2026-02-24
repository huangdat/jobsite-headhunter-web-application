package com.rikkeisoft.backend.repository;

import com.rikkeisoft.backend.enums.CommissionStatus;
import com.rikkeisoft.backend.model.entity.Commission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommissionRepo extends JpaRepository<Commission, Long> {

    Optional<Commission> findByApplicationId(Long applicationId);

    List<Commission> findByCollaboratorId(String collaboratorId);

    List<Commission> findByStatus(CommissionStatus status);
}