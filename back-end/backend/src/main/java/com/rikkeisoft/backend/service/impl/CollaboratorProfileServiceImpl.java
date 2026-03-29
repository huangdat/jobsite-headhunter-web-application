package com.rikkeisoft.backend.service.impl;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.azure.core.exception.ResourceNotFoundException;
import com.rikkeisoft.backend.constant.SecurityConstants;
import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.exception.AppException;
import com.rikkeisoft.backend.mapper.CollaboratorProfileMapper;
import com.rikkeisoft.backend.model.dto.resp.collaborator.CollaboratorProfileResp;
import com.rikkeisoft.backend.model.entity.Account;
import com.rikkeisoft.backend.model.entity.CollaboratorProfile;
import com.rikkeisoft.backend.repository.AccountRepo;
import com.rikkeisoft.backend.repository.CollaboratorProfileRepo;
import com.rikkeisoft.backend.service.CollaboratorProfileService;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
@Slf4j
@Service
@AllArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class CollaboratorProfileServiceImpl implements CollaboratorProfileService {

    CollaboratorProfileRepo collaboratorProfileRepo;
    CollaboratorProfileMapper collaboratorProfileMapper;
    AccountRepo accountRepo;


    @Override
    public CollaboratorProfileResp updateCommissionRate(String accountId, Double commissionRate) {
        CollaboratorProfile collaboratorProfile = collaboratorProfileRepo.findByAccount_Id(accountId)
                .orElseThrow(() -> new AppException(
                        ErrorCode.ACCOUNT_NOT_FOUND));

        collaboratorProfile.setCommissionRate(commissionRate);
        CollaboratorProfile updated = collaboratorProfileRepo.save(collaboratorProfile);

        return collaboratorProfileMapper.toResponse(updated);
    }

    @Override
    @PreAuthorize(SecurityConstants.COLLABORATOR)
    public CollaboratorProfileResp updateMyCommissionRate(double commissionRate) {
        // TODO Auto-generated method stub
        var context = SecurityContextHolder.getContext();
        String currentUsername = context.getAuthentication().getName();
        Account account = accountRepo.findByUsername(currentUsername)
                .orElseThrow(() -> new AppException(
                        ErrorCode.ACCOUNT_NOT_FOUND));

        // Update commission rate
        return updateCommissionRate(account.getId(), commissionRate);
    }

}
