package com.rikkeisoft.backend.service.impl;


import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.exception.AppException;
import com.rikkeisoft.backend.mapper.AccountMapper;
import com.rikkeisoft.backend.model.dto.req.AccountCreateReq;
import com.rikkeisoft.backend.model.dto.req.AccountUpdateReq;
import com.rikkeisoft.backend.model.dto.resp.AccountResp;
import com.rikkeisoft.backend.model.entity.Account;
import com.rikkeisoft.backend.repository.AccountRepo;
import com.rikkeisoft.backend.service.AccountService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class AccountServiceImpl implements AccountService {
    AccountRepo accountRepo;
    AccountMapper accountMapper;

    @Override
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public List<AccountResp> getAllAccounts() {
        if (accountRepo.count() == 0) {
            throw new AppException(ErrorCode.NO_ACCOUNTS_STORED);
        }

        // find all accounts
        List<Account> accounts = accountRepo.findAll();

        // map to resp
        List<AccountResp> accountResps = new ArrayList<>();
        for (Account account : accounts) {
            accountResps.add(accountMapper.toAccountResp(account));
        }
        return accountResps;
    }


    @Override
    public AccountResp getAccountById(String id) {
        return null;
    }

    @Override
    public AccountResp createAccount(AccountCreateReq req) {
        return null;
    }

    @Override
    public AccountResp updateAccount(String id, AccountUpdateReq req) {
        return null;
    }

    @Override
    public AccountResp lockAccount(String id) {
        return null;
    }
}
