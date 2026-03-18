package com.rikkeisoft.backend.model.dto.resp.cv;

import com.rikkeisoft.backend.model.entity.Account;
import jakarta.persistence.*;
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
    Account candidate;
    String cvUrl;
    Boolean isVisible = true;
    LocalDateTime createdAt;
}
