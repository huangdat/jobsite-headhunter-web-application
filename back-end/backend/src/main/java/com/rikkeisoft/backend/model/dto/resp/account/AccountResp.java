package com.rikkeisoft.backend.model.dto.resp.account;

import com.rikkeisoft.backend.enums.AccountStatus;
import com.rikkeisoft.backend.enums.AuthProvider;
import com.rikkeisoft.backend.enums.Gender;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AccountResp {
    String id;
    String username;
    String email;
    String fullName;
    String phone;
    String imageUrl;
    Gender gender;
    String currentTitle;
    Float yearsOfExperience;
    Double expectedSalaryMin;
    Double expectedSalaryMax;
    String bio;
    String city;
    Boolean openForWork;
    AuthProvider authProvider;
    AccountStatus status;
    Set<String> roles;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;

}
