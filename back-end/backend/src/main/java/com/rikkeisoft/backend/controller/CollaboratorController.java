package com.rikkeisoft.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.model.dto.APIResponse;
import com.rikkeisoft.backend.model.dto.req.collaborator.CollaboratorUpdateCommissionReq;
import com.rikkeisoft.backend.model.dto.resp.collaborator.CollaboratorProfileResp;
import com.rikkeisoft.backend.service.CollaboratorProfileService;

import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/collaborators")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CollaboratorController {

        CollaboratorProfileService collaboratorProfileService;

        @PutMapping("/profile")
        public APIResponse<CollaboratorProfileResp> updateProfile(
                        @Valid @RequestBody CollaboratorUpdateCommissionReq request) {

                CollaboratorProfileResp response = collaboratorProfileService
                                .updateMyCommissionRate(request.getCommissionRate());

                return APIResponse.<CollaboratorProfileResp>builder()
                                .status(HttpStatus.OK) // Use HttpStatus, not ErrorCode
                                .message("Commission rate updated successfully")
                                .result(response) // Use "result", not "data"
                                .build();
        }
}
