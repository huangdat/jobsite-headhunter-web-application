package com.rikkeisoft.backend.service;

import com.rikkeisoft.backend.model.dto.req.interview.InterviewCreateReq;
import com.rikkeisoft.backend.model.dto.resp.interview.InterviewResp;

/**
 * Service interface handling business logic for interviews.
 * Manages the creation and scheduling of interview sessions.
 */
public interface InterviewService {
    InterviewResp scheduleInterview(InterviewCreateReq request);
}
