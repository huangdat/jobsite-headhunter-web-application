package com.rikkeisoft.backend.repository;

import com.rikkeisoft.backend.model.entity.SavedJob;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SavedJobRepo extends JpaRepository<SavedJob, Long> {
    boolean existsByJobIdAndCandidateId(Long jobId, String candidateId);

    Optional<SavedJob> findByJobIdAndCandidateId(Long jobId, String candidateId);

    List<SavedJob> findByCandidateIdOrderByCreatedAtDesc(String candidateId);

    void deleteByJobIdAndCandidateId(Long jobId, String candidateId);
}
