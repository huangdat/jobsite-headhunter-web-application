package com.rikkeisoft.backend.repository;

import com.rikkeisoft.backend.model.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface JobRepo extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {

    //
    // List<Job> findByHeadhunterId(String headhunterId);
    //
    // List<Job> findByStatus(JobStatus status);
    //
    // List<Job> findByCity(String city);
    //
    // List<Job> findByStatusAndCity(JobStatus status, String city);

    @Query("""
            SELECT j
            FROM Job j
            WHERE j.status = :status
              AND (j.deadline IS NULL OR j.deadline >= :today)
            ORDER BY j.createdAt DESC
            """)
    List<Job> findOpenJobsForRecommendation(@Param("status") JobStatus status, @Param("today") LocalDate today);

    @Query("""
            SELECT j
            FROM Job j
            WHERE j.status = :status
              AND (j.deadline IS NULL OR j.deadline >= :today)
            ORDER BY j.createdAt DESC
            """)
    List<Job> findLatestOpenJobs(@Param("status") JobStatus status, @Param("today") LocalDate today, Pageable pageable);
}