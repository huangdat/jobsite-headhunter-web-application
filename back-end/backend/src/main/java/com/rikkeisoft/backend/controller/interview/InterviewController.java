package com.rikkeisoft.backend.controller.interview;

import com.rikkeisoft.backend.model.dto.req.interview.InterviewCreateReq;
import com.rikkeisoft.backend.model.dto.resp.interview.InterviewResp;
import com.rikkeisoft.backend.service.InterviewService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller managing interview endpoints.
 * Allows headhunters to schedule and manage interviews for candidates.
 */
@RestController
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequestMapping("/api/interviews")
public class InterviewController {

    InterviewService interviewService;

    // API: Invite for interview (create new schedule)
    @PostMapping
    public ResponseEntity<InterviewResp> scheduleInterview(@Valid @RequestBody InterviewCreateReq request) {
        InterviewResp response = interviewService.scheduleInterview(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
