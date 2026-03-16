package com.rikkeisoft.backend.controller;

import com.azure.core.annotation.Get;
import com.azure.core.annotation.Put;
import com.rikkeisoft.backend.model.dto.APIResponse;
import com.rikkeisoft.backend.model.dto.req.business.BusinessProfileUpdateReq;
import com.rikkeisoft.backend.model.dto.resp.business.BusinessProfileResp;
import com.rikkeisoft.backend.service.BusinessProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

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

    @PutMapping("/{businessProfileId}")
    public APIResponse<BusinessProfileResp> updateBusinessProfile(@PathVariable Long businessProfileId, @RequestBody BusinessProfileUpdateReq req) {
        APIResponse<BusinessProfileResp> resp = new APIResponse<>();
        resp.setResult(businessProfileService.updateBusinessProfile(businessProfileId, req));
        return resp;
    }
}
