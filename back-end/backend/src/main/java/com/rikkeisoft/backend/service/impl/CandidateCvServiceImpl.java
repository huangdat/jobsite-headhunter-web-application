package com.rikkeisoft.backend.service.impl;

import com.rikkeisoft.backend.model.dto.PagedResponse;
import com.rikkeisoft.backend.model.dto.req.account.*;
import com.rikkeisoft.backend.model.dto.req.cv.CandidateCvCreateReq;
import com.rikkeisoft.backend.model.dto.resp.account.AccountResp;
import com.rikkeisoft.backend.model.dto.resp.cv.CandidateCvResp;
import com.rikkeisoft.backend.model.entity.CandidateCv;
import com.rikkeisoft.backend.repository.CandidateCvRepo;
import com.rikkeisoft.backend.service.CandidateCvService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@RequiredArgsConstructor // Generates a constructor with required arguments for final fields.
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
public class CandidateCvServiceImpl implements CandidateCvService {
    CandidateCvRepo candidateCvRepo;



}
