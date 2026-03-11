package com.rikkeisoft.backend.controller;

import com.azure.core.annotation.Get;
import com.rikkeisoft.backend.model.dto.APIResponse;
import com.rikkeisoft.backend.model.dto.resp.business.BusinessProfileResp;
import com.rikkeisoft.backend.service.BusinessProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
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
}
