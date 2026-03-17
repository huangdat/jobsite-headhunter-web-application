package com.rikkeisoft.backend.service;

import com.rikkeisoft.backend.model.dto.resp.job.JobDetailResp;
import com.rikkeisoft.backend.model.dto.PagedResponse;
import com.rikkeisoft.backend.model.dto.resp.job.JobResp;
import java.util.List;

public interface JobQueryService {
    JobDetailResp getJobDetail(Long jobId);

    PagedResponse<JobResp> searchJobs(
            int page,
            int size,
            String keyword,
            String location,
            Double salaryMin,
            Double salaryMax,
            String workingType,
            String status,
            String industryName,
            String rankLevel,
            boolean mine,
            String authorId,
            String currentUsername);

    List<JobResp> getBestJobs(int size);
}
