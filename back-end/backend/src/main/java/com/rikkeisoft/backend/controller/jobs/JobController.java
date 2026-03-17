package com.rikkeisoft.backend.controller.jobs;

import com.rikkeisoft.backend.model.dto.APIResponse;
import com.rikkeisoft.backend.model.dto.req.job.JobReq;
import com.rikkeisoft.backend.model.dto.req.job.JobToggleStatusReq;
import com.rikkeisoft.backend.model.dto.resp.job.JobDetailResp;
import com.rikkeisoft.backend.model.dto.resp.job.JobResp;
import com.rikkeisoft.backend.model.dto.resp.job.RecommendationResp;
import com.rikkeisoft.backend.model.dto.resp.job.SavedJobResp;
import com.rikkeisoft.backend.service.JobManageService;
import com.rikkeisoft.backend.service.JobQueryService;
import com.rikkeisoft.backend.service.SavedJobService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequestMapping("/api/jobs")
public class JobController {
    JobManageService jobManageService;
    JobQueryService jobQueryService;
    SavedJobService savedJobService;

    @GetMapping("/{id}")
    public APIResponse<JobDetailResp> getJobDetail(@PathVariable("id") Long jobId) {
        JobDetailResp result = jobQueryService.getJobDetail(jobId);
        APIResponse<JobDetailResp> response = new APIResponse<>();
        response.setResult(result);
        return response;
    }

    @PatchMapping("/{id}")
    public APIResponse<JobDetailResp> updateJobDetail(@PathVariable("id") Long jobId, @ModelAttribute JobReq jobReq){
        JobDetailResp result = jobManageService.updateJobPost(jobId, jobReq);

        APIResponse<JobDetailResp> response = new APIResponse<>();
        response.setStatus(HttpStatus.OK);
        response.setMessage("Job updated successfully");
        response.setResult(result);

        return response;
    }

    @PostMapping
    public APIResponse<JobDetailResp> postJob(@ModelAttribute @Valid JobReq jobReq) {
        JobDetailResp result = jobManageService.createJobPost(jobReq);

        APIResponse<JobDetailResp> response = new APIResponse<>();
        response.setStatus(HttpStatus.CREATED);
        response.setMessage("Job created successfully");
        response.setResult(result);

        return response;
    }

    @PostMapping("/{id}/save")
    public APIResponse<String> saveJob(
            @PathVariable("id") Long jobId,
            @AuthenticationPrincipal Jwt jwt) {
        savedJobService.saveJob(jobId, jwt.getSubject());
        APIResponse<String> response = new APIResponse<>();
        response.setMessage("Job saved successfully");
        return response;
    }

    @DeleteMapping("/{id}/save")
    public APIResponse<String> removeSavedJob(
            @PathVariable("id") Long jobId,
            @AuthenticationPrincipal Jwt jwt) {
        savedJobService.removeSavedJob(jobId, jwt.getSubject());
        APIResponse<String> response = new APIResponse<>();
        response.setMessage("Job removed from saved list");
        return response;
    }

    @GetMapping("/saved")
    public APIResponse<List<SavedJobResp>> getSavedJobs(
            @AuthenticationPrincipal Jwt jwt) {
        APIResponse<List<SavedJobResp>> response = new APIResponse<>();
        response.setResult(savedJobService.getSavedJobs(jwt.getSubject()));
        return response;
    }

    @PutMapping("/{id}/toggle-job-status")
    public APIResponse<JobResp> toggleJobStatus(
            @PathVariable("id") Long jobId,
            @RequestBody @Valid JobToggleStatusReq req,
            @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        JobResp result = jobManageService.toggleJobStatus(jobId, req, username);

        return APIResponse.<JobResp>builder()
                .status(HttpStatus.OK)
                .message("Job status updated successfully")
                .result(result)
                .build();
    }

    @GetMapping("/recommended")
    public APIResponse<RecommendationResp> getRecommendedJobs(@AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        RecommendationResp result = jobManageService.getRecommendedJobs(username);

        return APIResponse.<RecommendationResp>builder()
                .status(HttpStatus.OK)
                .message(result.getMessage())
                .result(result)
                .build();
    }

    @GetMapping("/random-latest")
    public APIResponse<RecommendationResp> getRandomLatestJobs() {
        RecommendationResp result = jobManageService.getRandomLatestJobs();

        return APIResponse.<RecommendationResp>builder()
                .status(HttpStatus.OK)
                .message(result.getMessage())
                .result(result)
                .build();
    }
}
