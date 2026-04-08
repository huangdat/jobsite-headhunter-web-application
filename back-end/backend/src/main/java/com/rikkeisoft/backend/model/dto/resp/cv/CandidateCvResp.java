package com.rikkeisoft.backend.model.dto.resp.cv;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CandidateCvResp {
    Long id;
    CandidateResp candidate;
    String cvUrl;
    Boolean isVisible = true;
    LocalDateTime createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class CandidateResp {
        String id;
        String username;
        String email;
        String fullName;
        String phone;
        String imageUrl;
    }
}
