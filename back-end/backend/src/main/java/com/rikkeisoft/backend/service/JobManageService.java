package com.rikkeisoft.backend.service;

import com.rikkeisoft.backend.model.dto.req.job.JobPostReq;
import com.rikkeisoft.backend.model.dto.resp.job.JobPostResp;

/**
 * JobManageService
 * Responsible for managing the lifecycle of job postings (Write/Modify operations).
 * Handles business logic for creating new jobs, updating information, toggling recruitment status (open/close), and soft-deleting jobs.
 *
 * Associated Features: JOB-01, JOB-03, JOB-04, JOB-05.
 */
public interface JobManageService {
    JobPostResp createJobPost(JobPostReq jobPostReq);
}
