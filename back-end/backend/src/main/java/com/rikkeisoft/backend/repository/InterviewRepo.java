package com.rikkeisoft.backend.repository;

import com.rikkeisoft.backend.model.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Interview entity.
 * Handles database operations related to interview scheduling and retrieval.
 */
@Repository
public interface InterviewRepo extends JpaRepository<Interview, Long> {
    List<Interview> findByApplicationId(Long applicationId);
}
