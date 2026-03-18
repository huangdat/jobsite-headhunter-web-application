package com.rikkeisoft.backend.service.impl;

import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.exception.AppException;
import com.rikkeisoft.backend.mapper.CandidateCvMapper;
import com.rikkeisoft.backend.model.dto.PagedResponse;
import com.rikkeisoft.backend.model.dto.req.account.*;
import com.rikkeisoft.backend.model.dto.req.cv.CandidateCvUpdateReq;
import com.rikkeisoft.backend.model.dto.resp.account.AccountResp;
import com.rikkeisoft.backend.model.dto.resp.cv.CandidateCvResp;
import com.rikkeisoft.backend.model.entity.CandidateCv;
import com.rikkeisoft.backend.repository.AccountRepo;
import com.rikkeisoft.backend.repository.CandidateCvRepo;
import com.rikkeisoft.backend.service.CandidateCvService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@RequiredArgsConstructor // Generates a constructor with required arguments for final fields.
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
public class CandidateCvServiceImpl implements CandidateCvService {
    CandidateCvRepo candidateCvRepo;
    AccountRepo accountRepo;
    CandidateCvMapper candidateCvMapper;

    /**
     * This method retrieves all candidate CVs from the database
     * @return
     */
    @Override
    @PreAuthorize("hasAuthority('SCOPE_COLLABORATOR') or hasAuthority('SCOPE_ADMIN') or hasAuthority('SCOPE_HEADHUNTER')")
    public List<CandidateCvResp> getAllCandidateCvs() {
        // chek if there are any candidate CVs stored in the repository
        if (candidateCvRepo.count() == 0) {
            throw new AppException(ErrorCode.NO_CVS_STORED);
        }
        // fetch all candidate CVs from the repository
        List<CandidateCv> candidateCvs = candidateCvRepo.findAll();
        return candidateCvMapper.toCandidateCvResps(candidateCvs);
    }

    @Override
    public CandidateCvResp getCvById(String id) {
        return null;
    }

    @Override
    public CandidateCvResp getCvByCandidateId(String candidateId) {
        return null;
    }

    @Override
    public CandidateCvResp getMyCv() {
        // Get the username of the currently authenticated user
        var context = SecurityContextHolder.getContext();
        String contextName = context.getAuthentication().getName();
        // Find the account associated with the username
        var account = accountRepo.findByUsername(contextName)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));
        // Find the candidate CV associated with the account
        var candidateCv = candidateCvRepo.findByCandidate_Id(account.getId())
                .orElseThrow(() -> new AppException(ErrorCode.CV_NOT_FOUND));

        // Use centralized mapper to avoid exposing/serializing entity graph directly
        return candidateCvMapper.toCandidateCvResp(candidateCv);
    }


    @Override
    public CandidateCvResp updateMyCv(CandidateCvUpdateReq req) {
        return null;
    }

    @Override
    public CandidateCvResp updateMyCvVisibility(boolean visibility) {
        return null;
    }
}
