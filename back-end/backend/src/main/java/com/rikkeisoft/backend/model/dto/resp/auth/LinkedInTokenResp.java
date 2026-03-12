package com.rikkeisoft.backend.model.dto.resp.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonIgnoreProperties(ignoreUnknown = true)
public class LinkedInTokenResp {
    @JsonProperty("access_token")
    String accessToken;

    @JsonProperty("expires_in")
    Integer expiresIn;

    @JsonProperty("scope")
    String scope;
}
