package com.rikkeisoft.backend.controller.jobs;

import com.rikkeisoft.backend.model.dto.APIResponse;
import com.rikkeisoft.backend.model.dto.req.job.JobPostReq;
import com.rikkeisoft.backend.model.dto.resp.job.JobPostResp;
import com.rikkeisoft.backend.service.JobManageService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequestMapping("/api/jobs")
public class JobController {
    JobManageService jobManageService;

    @PostMapping
    public APIResponse<JobPostResp> postJob(@ModelAttribute @Valid JobPostReq jobPostReq) {
        JobPostResp result = jobManageService.createJobPost(jobPostReq);

        APIResponse<JobPostResp> response = new APIResponse<>();
        response.setStatus(HttpStatus.CREATED);
        response.setMessage("Job created successfully");
        response.setResult(result);

        return response;
    }
}
