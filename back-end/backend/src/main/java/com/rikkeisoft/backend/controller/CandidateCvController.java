package com.rikkeisoft.backend.controller;

import com.azure.core.annotation.Put;
import com.rikkeisoft.backend.model.dto.APIResponse;
import com.rikkeisoft.backend.model.dto.req.cv.CandidateCvUpdateReq;
import com.rikkeisoft.backend.model.dto.resp.cv.CandidateCvResp;
import com.rikkeisoft.backend.service.CandidateCvService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/myCv")
    public APIResponse<CandidateCvResp> getMyCv() {
        CandidateCvResp candidateCv = candidateCvService.getMyCv();
        APIResponse<CandidateCvResp> resp = new APIResponse<>();
        resp.setResult(candidateCv);
        return resp;
    }

    @GetMapping("/{id}")
    public APIResponse<CandidateCvResp> getCvById(Long id) {
        CandidateCvResp candidateCv = candidateCvService.getCvById(id);
        APIResponse<CandidateCvResp> resp = new APIResponse<>();
        resp.setResult(candidateCv);
        return resp;
    }

    @GetMapping("/candidateId/{candidateId}")
    public APIResponse<CandidateCvResp> getCvByCandidateId(@PathVariable String candidateId) {
        CandidateCvResp candidateCv = candidateCvService.getCvByCandidateId(candidateId);
        APIResponse<CandidateCvResp> resp = new APIResponse<>();
        resp.setResult(candidateCv);
        return resp;
    }

    @PutMapping("/MyCvVisibility")
    public APIResponse<CandidateCvResp> updateMyCvVisibility(@RequestParam boolean visibility) {
        CandidateCvResp candidateCv = candidateCvService.updateMyCvVisibility(visibility);
        APIResponse<CandidateCvResp> resp = new APIResponse<>();
        resp.setResult(candidateCv);
        return resp;
    }

    @PutMapping({"/MyCv", ""})
    public APIResponse<CandidateCvResp> updateMyCv(@ModelAttribute CandidateCvUpdateReq req) {
        CandidateCvResp candidateCv = candidateCvService.updateMyCv(req);
        APIResponse<CandidateCvResp> resp = new APIResponse<>();
        resp.setResult(candidateCv);
        return resp;
    }



}
