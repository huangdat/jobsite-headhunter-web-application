package com.rikkeisoft.backend.service;

import com.rikkeisoft.backend.model.dto.req.account.AccountChangePasswordreq;
import com.rikkeisoft.backend.model.dto.req.account.AccountCreateReq;
import com.rikkeisoft.backend.model.dto.req.account.AccountUpdateReq;
import com.rikkeisoft.backend.model.dto.resp.AccountResp;

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

}
