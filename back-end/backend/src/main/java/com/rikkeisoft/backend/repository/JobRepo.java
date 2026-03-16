package com.rikkeisoft.backend.repository;

import com.rikkeisoft.backend.model.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepo extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {

//
//    List<Job> findByHeadhunterId(String headhunterId);
//
//    List<Job> findByStatus(JobStatus status);
//
//    List<Job> findByCity(String city);
//
//    List<Job> findByStatusAndCity(JobStatus status, String city);

}