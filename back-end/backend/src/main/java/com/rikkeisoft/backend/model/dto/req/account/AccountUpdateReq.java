package com.rikkeisoft.backend.model.dto.req.account;

import com.rikkeisoft.backend.enums.Gender;
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
public class AccountUpdateReq {
    @Email(message = "EMAIL_INVALID")
    String email;
    // Full name must be between 2 and 50 characters, and can only contain letters and spaces
    @Pattern(regexp = "^[a-zA-Z ]+$", message = "FULL_NAME_INVALID")
    @Size(min = 2, max = 50, message = "FULL_NAME_INVALID")
    String fullName;
    @Pattern(regexp = "0[3-9]\\d{8,9}", message = "PHONE_INVALID") // Matches Vietnamese phone numbers. E.g., 0704716414
    String phone;
    MultipartFile avatar;
    @Pattern(regexp = "MALE|FEMALE|OTHER", message = "GENDER_INVALID")
    Gender gender;
}
