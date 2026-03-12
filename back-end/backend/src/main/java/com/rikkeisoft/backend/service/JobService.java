package com.rikkeisoft.backend.service;

import com.rikkeisoft.backend.model.dto.req.job.JobToggleStatusReq;
import com.rikkeisoft.backend.model.dto.resp.job.JobResp;

public interface JobService {
    JobResp toggleJobStatus(Long jobId, JobToggleStatusReq req, String currentUsername);
}
