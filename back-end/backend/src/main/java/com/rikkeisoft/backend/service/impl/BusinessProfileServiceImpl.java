package com.rikkeisoft.backend.service.impl;

import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.exception.AppException;
import com.rikkeisoft.backend.model.dto.resp.business.MSTLookupResp;
import com.rikkeisoft.backend.model.dto.resp.business.VietQRBusinessResp;
import com.rikkeisoft.backend.repository.BusinessProfileRepo;
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
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Slf4j
@RequiredArgsConstructor // Generates a constructor with required arguments for final fields.
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
public class BusinessProfileServiceImpl implements BusinessProfileService {
    BusinessProfileRepo businessProfileRepo;
    BusinessProfileMapper businessProfileMapper;
    AccountRepo accountRepo;
    AccountMapper accountMapper;

    @Override
    @PreAuthorize("hasAuthority('SCOPE_ADMIN') or hasAuthority('SCOPE_COLLABORATOR') or hasAuthority('SCOPE_HEADHUNTER')")
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

    @Override
    @PreAuthorize("hasAuthority('SCOPE_ADMIN') or hasAuthority('SCOPE_COLLABORATOR') or hasAuthority('SCOPE_HEADHUNTER')")
    public BusinessProfileResp getBusinessProfileById(Long businessProfileId) {
        BusinessProfile businessProfile = businessProfileRepo.findById(businessProfileId)
                .orElseThrow(() -> new AppException(ErrorCode.BUSINESS_PROFILE_NOT_FOUND));

        BusinessProfileResp businessProfileResp = businessProfileMapper.toBusinessProfileResp(businessProfile);

        List<AccountResp> accountResps = accountRepo.findByBusinessProfileId(businessProfileId).stream()
                .map(accountMapper::toAccountResp)
                .toList();
        businessProfileResp.setAccounts(accountResps);

        return businessProfileResp;
    }

    RestTemplate restTemplate;

    static final String VIETQR_BUSINESS_URL = "https://api.vietqr.io/v2/business/{taxCode}";
    static final String VIETQR_SUCCESS_CODE = "00";

    @Override
    public MSTLookupResp lookupMST(String taxCode) {
        // Check DB first — avoid unnecessary API call and prevent duplicate
        return businessProfileRepo.findByTaxCode(taxCode)
                .map(profile -> MSTLookupResp.builder()
                        .companyName(profile.getCompanyName())
                        .taxCode(profile.getTaxCode())
                        .headquarterAddress(profile.getAddressMain())
                        .build())
                .orElseGet(() -> lookupFromVietQR(taxCode));
    }

    private MSTLookupResp lookupFromVietQR(String taxCode) {
        VietQRBusinessResp response;
        try {
            response = restTemplate.getForObject(VIETQR_BUSINESS_URL, VietQRBusinessResp.class, taxCode);
        } catch (HttpClientErrorException.NotFound e) {
            throw new AppException(ErrorCode.MST_NOT_FOUND);
        } catch (RestClientException e) {
            log.error("Failed to call VietQR API for taxCode={}: {}", taxCode, e.getMessage());
            throw new AppException(ErrorCode.MST_LOOKUP_FAILED);
        }

        if (response == null || !VIETQR_SUCCESS_CODE.equals(response.getCode()) || response.getData() == null) {
            throw new AppException(ErrorCode.MST_NOT_FOUND);
        }

        VietQRBusinessResp.BusinessData data = response.getData();

        return MSTLookupResp.builder()
                .companyName(data.getName())
                .taxCode(data.getId())
                .headquarterAddress(data.getAddress())
                .build();
    }

}
