package com.rikkeisoft.backend.service.impl;

import com.rikkeisoft.backend.model.dto.req.interview.InterviewCreateReq;
import com.rikkeisoft.backend.model.dto.resp.interview.InterviewResp;
import com.rikkeisoft.backend.service.InterviewService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)

/**
 * Service implement handling business logic for interviews.
 * Manages the creation and scheduling of interview sessions.
 */
public class InterviewServiceImpl implements InterviewService {
    @Override
    public InterviewResp scheduleInterview(InterviewCreateReq req) {
        return null;
    }
}
