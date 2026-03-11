package com.rikkeisoft.backend.service;

import com.rikkeisoft.backend.model.dto.resp.collaborator.CollaboratorProfileResp;

public interface CollaboratorProfileService {
    CollaboratorProfileResp updateCommissionRate(String accountId, Double commissionRate);
    CollaboratorProfileResp updateMyCommissionRate(double commissionRate);
}
