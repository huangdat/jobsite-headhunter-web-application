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

        @org.springframework.data.jpa.repository.Query("SELECT a FROM Application a WHERE a.job.id = :jobId "
            + "AND (:status IS NULL OR a.status = :status) "
            + "AND (:keyword IS NULL OR (LOWER(a.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) "
            + "OR LOWER(a.email) LIKE LOWER(CONCAT('%', :keyword, '%')) "
            + "OR LOWER(a.phone) LIKE LOWER(CONCAT('%', :keyword, '%'))))")
        Page<Application> searchByJobIdAndOptionalStatusAndKeyword(Long jobId, ApplicationStatus status, String keyword, Pageable pageable);

    // For Candidates to view their application history
    Page<Application> findAllByCandidate_Id(String accountId, Pageable pageable);

    // Anti-spam check: Verify if the user already applied to this job
    boolean existsByJobIdAndCandidateId(Long jobId, String accountId);

    List<Application> findByJobId(Long jobId);

    List<Application> findByCandidateId(String candidateId);

    List<Application> findByCollaboratorId(String collaboratorId);

    List<Application> findByStatus(ApplicationStatus status);

    Optional<Application> findByJobIdAndCandidateId(Long jobId, String candidateId);

    Page<Application> findByCandidate_IdAndStatus(String candidateId, ApplicationStatus status, Pageable pageable);

}