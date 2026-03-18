package com.rikkeisoft.backend.model.dto.req.cv;

import com.rikkeisoft.backend.model.entity.Account;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CandidateCvCreateReq {
    MultipartFile cvFile;
    Boolean isVisible = true;
}
