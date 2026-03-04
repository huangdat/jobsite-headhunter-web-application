package com.rikkeisoft.backend.service;

import com.rikkeisoft.backend.model.dto.req.account.AccountChangePasswordreq;
import com.rikkeisoft.backend.model.dto.req.account.AccountCreateReq;
import com.rikkeisoft.backend.model.dto.req.account.AccountUpdateReq;
import com.rikkeisoft.backend.model.dto.resp.AccountResp;

import java.util.List;

public interface AccountService {
    List<AccountResp> getAllAccounts();

    AccountResp getAccountById(String id);

    AccountResp getMyInfo();

    AccountResp createAccount(AccountCreateReq req);

    AccountResp updateMyAccount(AccountUpdateReq req);

    AccountResp updateStatus(String id, String status);

    String changePassword(AccountChangePasswordreq req);

    // Filter by status
    List<AccountResp> getPendingAccounts();

    List<AccountResp> getActiveAccounts();

    List<AccountResp> getSuspendedAccounts();

    List<AccountResp> getDeletedAccounts();

    // Filter by role
    List<AccountResp> getAdminAccounts();

    List<AccountResp> getHeadhunterAccounts();

    List<AccountResp> getCollaboratorAccounts();

    List<AccountResp> getCandidateAccounts();

}
