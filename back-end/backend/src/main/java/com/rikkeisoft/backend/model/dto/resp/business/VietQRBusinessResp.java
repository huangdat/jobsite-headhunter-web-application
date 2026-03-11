package com.rikkeisoft.backend.model.dto.resp.business;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import lombok.experimental.FieldDefaults;

/**
 * Internal DTO for mapping the VietQR business lookup API response.
 * API: GET https://api.vietqr.io/v2/business/{taxCode}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonIgnoreProperties(ignoreUnknown = true)
public class VietQRBusinessResp {

    String code;

    String desc;

    BusinessData data;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class BusinessData {

        String id;

        String name;

        String internationalName;

        String shortName;

        String address;

        String status;
    }
}
