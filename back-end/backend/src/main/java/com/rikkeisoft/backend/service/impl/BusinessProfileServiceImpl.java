package com.rikkeisoft.backend.service.impl;

import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.exception.AppException;
import com.rikkeisoft.backend.model.dto.resp.business.MSTLookupResp;
import com.rikkeisoft.backend.model.dto.resp.business.VietQRBusinessResp;
import com.rikkeisoft.backend.repository.BusinessProfileRepo;
import com.rikkeisoft.backend.service.BusinessProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
public class BusinessProfileServiceImpl implements BusinessProfileService {

    RestTemplate restTemplate;
    BusinessProfileRepo businessProfileRepo;

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
