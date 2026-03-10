package com.rikkeisoft.backend.service.impl;

import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.exception.AppException;
import com.rikkeisoft.backend.mapper.AccountMapper;
import com.rikkeisoft.backend.mapper.BusinessProfileMapper;
import com.rikkeisoft.backend.model.dto.resp.account.AccountResp;
import com.rikkeisoft.backend.model.dto.resp.business.BusinessProfileResp;
import com.rikkeisoft.backend.model.entity.BusinessProfile;
import com.rikkeisoft.backend.repository.AccountRepo;
import com.rikkeisoft.backend.repository.BusinessProfileRepo;
import com.rikkeisoft.backend.service.BusinessProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor // Generates a constructor with required arguments for final fields.
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
public class BusinessProfileServiceImpl implements BusinessProfileService {
    BusinessProfileRepo businessProfileRepo;
    BusinessProfileMapper businessProfileMapper;
    AccountRepo accountRepo;
    AccountMapper accountMapper;

    @Override
    @PreAuthorize("hasAuthority('SCOPE_ADMIN') or hasAuthority('SCOPE_COLLABORATOR')")
    public List<BusinessProfileResp> getAllBusinessProfiles() {
        if (businessProfileRepo.count() == 0) {
            throw new AppException(ErrorCode.NO_BUSINESS_PROFILES_STORED);
        }

        List<BusinessProfile> businessProfiles = businessProfileRepo.findAll();

        // map to resp using BusinessProfileMapper
        List<BusinessProfileResp> businessProfileResps = businessProfiles.stream()
                .map(businessProfileMapper::toBusinessProfileResp)
                .toList();

        // Assign accounts list to each business profile resp, mapping each account to AccountResp using AccountMapper
        businessProfileResps.forEach(businessProfileResp -> {
            List<AccountResp> accountResps = accountRepo.findByBusinessProfileId(businessProfileResp.getId()).stream()
                    .map(accountMapper::toAccountResp)
                    .toList();
            businessProfileResp.setAccounts(accountResps);
        });

        return businessProfileResps;
    }
}
