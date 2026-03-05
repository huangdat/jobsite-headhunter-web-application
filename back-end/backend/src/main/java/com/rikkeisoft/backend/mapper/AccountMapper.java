package com.rikkeisoft.backend.mapper;

import com.rikkeisoft.backend.model.dto.resp.account.AccountResp;
import com.rikkeisoft.backend.model.entity.Account;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    AccountResp toAccountResp(Account account);
    Account toAccount(AccountResp accountResp);
}
