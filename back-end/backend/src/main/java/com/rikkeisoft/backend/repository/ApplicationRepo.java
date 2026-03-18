package com.rikkeisoft.backend.repository;

import com.rikkeisoft.backend.enums.ApplicationStatus;
import com.rikkeisoft.backend.model.entity.Application;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Application entity.
 * Handles database operations for job applications including pagination and
 * duplicate checks.
 */
@Repository
public interface ApplicationRepo extends JpaRepository<Application, Long> {
    // For Headhunters to view their job pipeline
    Page<Application> findAllByJobId(Long jobId, Pageable pageable);

    // For Candidates to view their application history
    Page<Application> findAllByCandidateId(String accountId, Pageable pageable);

    // Anti-spam check: Verify if the user already applied to this job
    boolean existsByJobIdAndCandidateId(Long jobId, String accountId);

    List<Application> findByJobId(Long jobId);

    List<Application> findByCandidateId(String candidateId);

    List<Application> findByCollaboratorId(String collaboratorId);

    List<Application> findByStatus(ApplicationStatus status);

    Optional<Application> findByJobIdAndCandidateId(Long jobId, String candidateId);

}