package com.rikkeisoft.backend.service;

import com.rikkeisoft.backend.model.dto.resp.job.JobDetailResp;

public interface JobQueryService {
    JobDetailResp getJobDetail(Long jobId);
}
