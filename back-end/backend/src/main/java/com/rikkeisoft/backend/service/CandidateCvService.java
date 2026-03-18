package com.rikkeisoft.backend.service;

import com.rikkeisoft.backend.model.dto.PagedResponse;
import com.rikkeisoft.backend.model.dto.req.account.*;
import com.rikkeisoft.backend.model.dto.req.cv.CandidateCvCreateReq;
import com.rikkeisoft.backend.model.dto.req.cv.CandidateCvUpdateReq;
import com.rikkeisoft.backend.model.dto.resp.account.AccountResp;
import com.rikkeisoft.backend.model.dto.resp.cv.CandidateCvResp;
import com.rikkeisoft.backend.model.entity.CandidateCv;

import java.util.List;

public interface CandidateCvService {
    List<CandidateCvResp> getAllCandidateCvs();
    CandidateCvResp getCvById(String id);
    CandidateCvResp getCvByCandidateId(String candidateId);
    CandidateCvResp getMyCv();
    CandidateCvResp createCandidateCv(CandidateCvCreateReq req);
    CandidateCvResp updateMyAccount(CandidateCvUpdateReq req);
    CandidateCvResp updateStatus(String id, String status);

    AccountResp createAccountCollaborator(CollaboratorSignupReq req);

    AccountResp createAccountCandidate(CandidateSignupReq req);

    boolean checkEmailUsernameExist(String email, String username);
}
