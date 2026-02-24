package com.rikkeisoft.backend.service;

import com.rikkeisoft.backend.model.dto.req.AccountCreateReq;
import com.rikkeisoft.backend.model.dto.req.AccountUpdateReq;
import com.rikkeisoft.backend.model.dto.resp.AccountResp;

import java.util.List;

public interface AccountService {
    List<AccountResp> getAllAccounts();
    AccountResp getAccountById(String id);
    AccountResp createAccount(AccountCreateReq req);
    AccountResp updateAccount(String id, AccountUpdateReq req);
    AccountResp lockAccount(String id);

}
