package com.rikkeisoft.backend.controller;

import com.rikkeisoft.backend.model.dto.APIResponse;
import com.rikkeisoft.backend.model.dto.resp.cv.CandidateCvResp;
import com.rikkeisoft.backend.service.CandidateCvService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cv")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CandidateCvController {
    CandidateCvService candidateCvService;

    @GetMapping
    public APIResponse<List<CandidateCvResp>> getAllCandidateCvs() {
        List<CandidateCvResp> candidateCvs = candidateCvService.getAllCandidateCvs();
        APIResponse<List<CandidateCvResp>> resp = new APIResponse<>();
        resp.setResult(candidateCvs);
        return resp;
    }
}
