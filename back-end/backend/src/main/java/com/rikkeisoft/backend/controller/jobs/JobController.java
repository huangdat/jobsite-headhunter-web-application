package com.rikkeisoft.backend.controller.jobs;

import com.rikkeisoft.backend.model.dto.APIResponse;
import com.rikkeisoft.backend.enums.JobStatus;
import com.rikkeisoft.backend.enums.RankLevel;
import com.rikkeisoft.backend.enums.WorkingType;
import com.rikkeisoft.backend.model.dto.PagedResponse;
import com.rikkeisoft.backend.model.dto.req.job.JobReq;
import com.rikkeisoft.backend.model.dto.req.job.JobSearchCriteria;
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

    @GetMapping
    public APIResponse<PagedResponse<JobResp>> searchJobs(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) RankLevel rankLevel,
            @RequestParam(required = false) WorkingType workingType,
            @RequestParam(required = false) JobStatus status,
            @RequestParam(required = false) Double salaryMin,
            @RequestParam(required = false) Double salaryMax,
            @RequestParam(required = false) Double experienceMin,
            @RequestParam(required = false) Double experienceMax,
            @RequestParam(required = false) Boolean negotiable,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) Boolean visible,
            @RequestParam(required = false) String headhunterId,
            @RequestParam(required = false) List<Long> skillIds) {

        JobSearchCriteria criteria = JobSearchCriteria.builder()
                .page(page)
                .size(size)
                .keyword(keyword)
                .location(location)
                .rankLevel(rankLevel)
                .workingType(workingType)
                .status(status)
                .salaryMin(salaryMin)
                .salaryMax(salaryMax)
                .experienceMin(experienceMin)
                .experienceMax(experienceMax)
                .negotiable(negotiable)
                .featured(featured)
                .visible(visible)
                .headhunterId(headhunterId)
                .skillIds(skillIds)
                .build();

        PagedResponse<JobResp> result = jobQueryService.searchJobs(criteria);
        APIResponse<PagedResponse<JobResp>> response = new APIResponse<>();
        response.setResult(result);
        return response;
    }

    @GetMapping("/my")
    public APIResponse<PagedResponse<JobResp>> getMyJobs(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int size,
            @AuthenticationPrincipal Jwt jwt) {

        JobSearchCriteria criteria = JobSearchCriteria.builder()
                .page(page)
                .size(size)
                .headhunterId(jwt.getSubject())
                .build();

        PagedResponse<JobResp> result = jobQueryService.searchJobs(criteria);
        APIResponse<PagedResponse<JobResp>> response = new APIResponse<>();
        response.setResult(result);
        return response;
    }

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
        public APIResponse<JobResp> toggleJobStatusPut(
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

        @PatchMapping("/{id}/toggle-job-status")
        public APIResponse<JobResp> toggleJobStatusPatch(
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

        @PatchMapping("/{id}/toggle-active")
        public APIResponse<JobResp> toggleActive(
            @PathVariable("id") Long jobId,
            @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        JobResp result = jobManageService.toggleVisibility(jobId, username);

        return APIResponse.<JobResp>builder()
            .status(HttpStatus.OK)
            .message("Job visibility toggled successfully")
            .result(result)
            .build();
        }

    @GetMapping("/recommended")
    public APIResponse<RecommendationResp> getRecommendedJobs(@AuthenticationPrincipal Jwt jwt) {
        if (jwt == null || jwt.getSubject() == null) {
            throw new com.rikkeisoft.backend.exception.AppException(com.rikkeisoft.backend.enums.ErrorCode.UNAUTHORIZED);
        }
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
