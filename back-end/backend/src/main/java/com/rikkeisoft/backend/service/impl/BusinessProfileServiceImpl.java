package com.rikkeisoft.backend.service.impl;

import com.azure.core.annotation.Post;
import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.exception.AppException;
import com.rikkeisoft.backend.model.dto.req.business.BusinessProfileUpdateReq;
import com.rikkeisoft.backend.model.dto.resp.business.MSTLookupResp;
import com.rikkeisoft.backend.model.dto.resp.business.VietQRBusinessResp;
import com.rikkeisoft.backend.repository.*;
import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.exception.AppException;
import com.rikkeisoft.backend.mapper.AccountMapper;
import com.rikkeisoft.backend.mapper.BusinessProfileMapper;
import com.rikkeisoft.backend.model.dto.resp.account.AccountResp;
import com.rikkeisoft.backend.model.dto.resp.business.BusinessProfileResp;
import com.rikkeisoft.backend.model.entity.BusinessProfile;
import com.rikkeisoft.backend.repository.BusinessProfileRepo;
import com.rikkeisoft.backend.service.BusinessProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
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
    ForumPostRepo forumPostRepo;
    ApplicationRepo applicationRepo;

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

    /**
     * List top 10 best business profiles based on the number of forum posts
     */
    @Override
    public List<BusinessProfileResp> getTop10BestBusinessProfiles() {
        List<BusinessProfile> topBusinessProfiles = businessProfileRepo.findTopByHeadhunterPostCount(PageRequest.of(0, 10));

        return topBusinessProfiles.stream()
                .map(profile -> {
                    BusinessProfileResp resp = businessProfileMapper.toBusinessProfileResp(profile);
                    List<AccountResp> accountResps = accountRepo.findByBusinessProfileId(profile.getId()).stream()
                            .map(accountMapper::toAccountResp)
                            .toList();
                    resp.setAccounts(accountResps);
                    return resp;
                })
                .toList();
    }

    /**
     * Only ADMIN and HEADHUNTER (who owns the business profile) can update the business profile
     * @param businessProfileId
     * @param req
     * @return
     */
    @Override
    @PreAuthorize("hasAuthority('SCOPE_ADMIN') or hasAuthority('SCOPE_HEADHUNTER')")
    public BusinessProfileResp updateBusinessProfile(Long businessProfileId, BusinessProfileUpdateReq req) {
        BusinessProfile businessProfile = businessProfileRepo.findById(businessProfileId)
                .orElseThrow(() -> new AppException(ErrorCode.BUSINESS_PROFILE_NOT_FOUND));

        // Get current username from JWT authentication
        String currentUsername = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        var currentAccount = accountRepo.findByUsername(currentUsername)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        boolean isAdmin = currentAccount.getRoles() != null
                && currentAccount.getRoles().stream().anyMatch(role -> "ADMIN".equals(role));

        boolean isOwnerHeadhunter = currentAccount.getRoles() != null
                && currentAccount.getRoles().stream().anyMatch(role -> "HEADHUNTER".equals(role))
                && currentAccount.getBusinessProfile().getId().equals(businessProfileId);

        // Only ADMIN or owner HEADHUNTER can update
        if (!isAdmin && !isOwnerHeadhunter) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // Use lookupMST to validate tax code if it's being updated
        if (req.getTaxCode() != null) {
            MSTLookupResp mstInfo = lookupMST(req.getTaxCode().trim());
            businessProfile.setCompanyName(mstInfo.getCompanyName());
            businessProfile.setAddressMain(mstInfo.getHeadquarterAddress());
        }

        // Update fields (partial update)
        if (req.getTaxCode() != null) {
            businessProfile.setTaxCode(req.getTaxCode().trim());
        }
        if (req.getWebsiteUrl() != null) {
            businessProfile.setWebsiteUrl(req.getWebsiteUrl().trim());
        }
        if (req.getCompanyScale() != null) {
            businessProfile.setCompanyScale(req.getCompanyScale().trim());
        }
        if (req.getNoteByAdmin() != null) {
            businessProfile.setNoteByAdmin(req.getNoteByAdmin().trim());
        }

        BusinessProfile saved = businessProfileRepo.save(businessProfile);

        BusinessProfileResp resp = businessProfileMapper.toBusinessProfileResp(saved);
        List<AccountResp> accountResps = accountRepo.findByBusinessProfileId(saved.getId()).stream()
                .map(accountMapper::toAccountResp)
                .toList();
        resp.setAccounts(accountResps);

        return resp;
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
