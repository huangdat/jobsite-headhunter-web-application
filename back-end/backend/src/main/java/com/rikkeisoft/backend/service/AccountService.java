package com.rikkeisoft.backend.service;

import com.rikkeisoft.backend.model.dto.req.account.*;
import com.rikkeisoft.backend.model.dto.req.collaborator.CollaboratorProfileCreateReq;
import com.rikkeisoft.backend.model.dto.resp.account.AccountResp;
import com.rikkeisoft.backend.model.dto.resp.account.AccountResp;

import java.util.List;
import com.rikkeisoft.backend.model.dto.PagedResponse;

public interface AccountService {
    List<AccountResp> getAllAccounts();
    AccountResp getAccountById(String id);
    AccountResp getMyInfo();
    AccountResp createAccount(AccountCreateReq req);
    AccountResp updateMyAccount(AccountUpdateReq req);
    AccountResp updateStatus(String id, String status);

    String changePassword(AccountChangePasswordreq req);

    PagedResponse<AccountResp> searchAccounts(int page, int size, String keyword, String role, String status, String sort);

    AccountResp createAccountHeadhunter(HeadhunterSignupReq req);

    AccountResp createAccountCollaborator(CollaboratorSignupReq req);

    AccountResp createAccountCandidate(CandidateSignupReq req);

    boolean checkEmailUsernameExist(String email, String username);
}
