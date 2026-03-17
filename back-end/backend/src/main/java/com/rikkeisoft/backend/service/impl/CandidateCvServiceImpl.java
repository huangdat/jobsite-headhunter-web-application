package com.rikkeisoft.backend.service.impl;

import com.rikkeisoft.backend.model.entity.CandidateCv;
import com.rikkeisoft.backend.repository.CandidateCvRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor // Generates a constructor with required arguments for final fields.
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
public class CandidateCvServiceImpl {
    CandidateCvRepo candidateCvRepo;


}
