package com.rikkeisoft.backend.mapper;

import com.rikkeisoft.backend.model.dto.req.AccountUpdateReq;
import com.rikkeisoft.backend.model.dto.resp.AccountResp;
import com.rikkeisoft.backend.model.entity.Account;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    AccountResp toAccountResp(Account account);
    Account toAccount(AccountResp accountResp);
}
