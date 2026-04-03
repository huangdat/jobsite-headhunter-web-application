package com.rikkeisoft.backend.service.impl;

import com.rikkeisoft.backend.enums.ApplicationStatus;
import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.enums.InterviewStatus;
import com.rikkeisoft.backend.exception.AppException;
import com.rikkeisoft.backend.model.dto.req.interview.InterviewCreateReq;
import com.rikkeisoft.backend.model.dto.resp.interview.InterviewResp;
import com.rikkeisoft.backend.model.entity.Application;
import com.rikkeisoft.backend.model.entity.Interview;
import com.rikkeisoft.backend.mapper.InterviewMapper;
import com.rikkeisoft.backend.repository.ApplicationRepo;
import com.rikkeisoft.backend.repository.InterviewRepo;
import com.rikkeisoft.backend.service.InterviewService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)

/**
 * Service implement handling business logic for interviews.
 * Manages the creation and scheduling of interview sessions.
 */
public class InterviewServiceImpl implements InterviewService {
    InterviewRepo interviewRepo;
    ApplicationRepo applicationRepo;
    InterviewMapper interviewMapper;

    @Override
    @Transactional
    public InterviewResp scheduleInterview(InterviewCreateReq req) {
        Application application = applicationRepo.findById(req.getApplicationId())
                .orElseThrow(() -> new AppException(ErrorCode.APPLICATION_NOT_FOUND));

        Interview interview = interviewMapper.toEntity(req);
        interview.setApplication(application);
        interview.setInterviewCode(generateInterviewCode(application.getId()));
        interview.setStatus(InterviewStatus.SCHEDULED);

        Interview savedInterview = interviewRepo.save(interview);

        if (application.getStatus() != ApplicationStatus.INTERVIEW) {
            application.setStatus(ApplicationStatus.INTERVIEW);
            applicationRepo.save(application);
        }

        return interviewMapper.toResponse(savedInterview);
    }

    @Override
    @Transactional(readOnly = true)
    public InterviewResp getInterviewById(Long id) {
        Interview interview = interviewRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.INTERVIEW_NOT_FOUND));
        return interviewMapper.toResponse(interview);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InterviewResp> getInterviewsByApplicationId(Long applicationId) {
        return interviewRepo.findByApplicationId(applicationId).stream()
                .map(interviewMapper::toResponse)
                .toList();
    }

    private String generateInterviewCode(Long applicationId) {
        String suffix = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return "INT-" + applicationId + "-" + suffix;
    }
}
