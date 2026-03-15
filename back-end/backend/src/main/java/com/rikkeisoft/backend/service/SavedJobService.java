package com.rikkeisoft.backend.service;

import com.rikkeisoft.backend.model.dto.resp.job.SavedJobResp;
import java.util.List;

public interface SavedJobService {
    void saveJob(Long jobId, String username);

    void removeSavedJob(Long jobId, String username);

    List<SavedJobResp> getSavedJobs(String username);
}
