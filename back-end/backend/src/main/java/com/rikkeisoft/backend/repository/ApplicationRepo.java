package com.rikkeisoft.backend.repository;

import com.rikkeisoft.backend.enums.ApplicationStatus;
import com.rikkeisoft.backend.model.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface ApplicationRepo extends JpaRepository<Application, Long> {

    List<Application> findByJobId(Long jobId);

    List<Application> findByCandidateId(String candidateId);

    List<Application> findByCollaboratorId(String collaboratorId);

    List<Application> findByStatus(ApplicationStatus status);

    Optional<Application> findByJobIdAndCandidateId(Long jobId, String candidateId);
}