package com.rikkeisoft.backend.repository;

import com.rikkeisoft.backend.enums.JobStatus;
import com.rikkeisoft.backend.model.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepo extends JpaRepository<Job, Long> {

    List<Job> findByHeadhunterId(String headhunterId);

    List<Job> findByStatus(JobStatus status);

    List<Job> findByLocation(String location);

    List<Job> findByStatusAndLocation(JobStatus status, String location);
}