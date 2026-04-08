package com.rikkeisoft.backend.controller;

import com.azure.core.annotation.Get;
import com.rikkeisoft.backend.model.dto.APIResponse;
import com.rikkeisoft.backend.model.dto.resp.business.BusinessProfileResp;
import com.rikkeisoft.backend.model.dto.resp.job.JobDetailResp;
import com.rikkeisoft.backend.model.dto.resp.job.JobResp;
import com.rikkeisoft.backend.service.BusinessProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequestMapping("/api/business-profile")
public class BusinessProfileController {
    BusinessProfileService businessProfileService;

    @GetMapping
    public APIResponse<List<BusinessProfileResp>> getAllBusinessProfiles() {
        APIResponse<List<BusinessProfileResp>> resp = new APIResponse<>();
        resp.setResult(businessProfileService.getAllBusinessProfiles());
        return resp;
    }

    @GetMapping("/{businessProfileId}")
    public APIResponse<BusinessProfileResp> getBusinessProfileById(@PathVariable Long businessProfileId) {
        APIResponse<BusinessProfileResp> resp = new APIResponse<>();
        resp.setResult(businessProfileService.getBusinessProfileById(businessProfileId));
        return resp;
    }

    @GetMapping("/10-best")
    public APIResponse<List<BusinessProfileResp>> getTop10BestBusinessProfiles() {
        APIResponse<List<BusinessProfileResp>> resp = new APIResponse<>();
        resp.setResult(businessProfileService.getTop10BestBusinessProfiles());
        return resp;
    }

    @GetMapping("/{businessProfileId}/jobs")
    public APIResponse<List<JobDetailResp>> getJobsByBusinessProfileId(@PathVariable Long businessProfileId) {
        APIResponse<List<JobDetailResp>> resp = new APIResponse<>();
        resp.setResult(businessProfileService.getJobsByBusinessProfileId(businessProfileId));
        return resp;
    }
}
