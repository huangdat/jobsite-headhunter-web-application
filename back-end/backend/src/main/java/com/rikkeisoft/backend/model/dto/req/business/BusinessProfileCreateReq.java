package com.rikkeisoft.backend.model.dto.req.business;

import com.rikkeisoft.backend.enums.Gender;
import com.rikkeisoft.backend.enums.VerificationStatus;
import com.rikkeisoft.backend.model.entity.Account;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BusinessProfileCreateReq {
    Account account;
    String companyName;
    String taxCode;
    String websiteUrl;
    String addressMain;
    String companyScale;
    String noteByAdmin;
}
