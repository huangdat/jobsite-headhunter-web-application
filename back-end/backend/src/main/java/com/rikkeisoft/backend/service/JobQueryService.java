package com.rikkeisoft.backend.service;

import com.rikkeisoft.backend.model.dto.PagedResponse;
import com.rikkeisoft.backend.model.dto.req.job.JobSearchCriteria;
import com.rikkeisoft.backend.model.dto.resp.job.JobDetailResp;
import com.rikkeisoft.backend.model.dto.resp.job.JobResp;

import java.util.List;

public interface JobQueryService {
    JobDetailResp getJobDetail(Long jobId);

    PagedResponse<JobResp> searchJobs(JobSearchCriteria criteria);

    List<JobResp> getHighlightedJobs(int limit);
}
