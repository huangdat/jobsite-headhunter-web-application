package com.rikkeisoft.backend.service;

import com.rikkeisoft.backend.model.dto.req.job.JobReq;
import com.rikkeisoft.backend.model.dto.req.job.JobToggleStatusReq;
import com.rikkeisoft.backend.model.dto.resp.job.JobDetailResp;
import com.rikkeisoft.backend.model.dto.resp.job.JobResp;
import com.rikkeisoft.backend.model.dto.resp.job.RecommendationResp;

/**
 * JobManageService
 * Handles job-related business logic, including:
 * - Write/modify operations for job lifecycle
 * - Recommendation and fallback read operations (JOB-08)
 *
 * Associated Features: JOB-01, JOB-03, JOB-04, JOB-05, JOB-08.
 */
public interface JobManageService {
    JobDetailResp createJobPost(JobReq jobReq);

    JobResp toggleJobStatus(Long jobId, JobToggleStatusReq req, String currentUsername);

    JobResp toggleVisibility(Long jobId, String currentUsername);

    RecommendationResp getRecommendedJobs(String username);

    RecommendationResp getRandomLatestJobs();

    JobDetailResp updateJobPost(Long jobId, JobReq jobReq);
}
