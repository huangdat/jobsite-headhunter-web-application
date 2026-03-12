package com.rikkeisoft.backend.model.dto.resp.auth;

import lombok.*;
import lombok.experimental.FieldDefaults;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonIgnoreProperties(ignoreUnknown = true)
public class LinkedInUserInfoResp {
    String sub;
    String email;
    String name;
    String picture;
}
