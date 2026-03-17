package com.rikkeisoft.backend.service;

import com.rikkeisoft.backend.model.dto.PagedResponse;
import com.rikkeisoft.backend.model.dto.req.account.*;
import com.rikkeisoft.backend.model.dto.req.cv.CandidateCvCreateReq;
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
    AccountResp updateMyAccount(AccountUpdateReq req);
    AccountResp updateStatus(String id, String status);

    String changePassword(AccountChangePasswordreq req);

    PagedResponse<AccountResp> searchAccounts(int page, int size, String keyword, String role, String status, String sort);

    AccountResp createAccountHeadhunter(HeadhunterSignupReq req);

    AccountResp createAccountCollaborator(CollaboratorSignupReq req);

    AccountResp createAccountCandidate(CandidateSignupReq req);

    boolean checkEmailUsernameExist(String email, String username);
}
