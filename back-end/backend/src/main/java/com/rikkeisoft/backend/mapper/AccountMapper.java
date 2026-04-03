package com.rikkeisoft.backend.mapper;

import com.rikkeisoft.backend.model.dto.resp.account.AccountResp;
import com.rikkeisoft.backend.model.entity.Account;
import com.rikkeisoft.backend.model.entity.CandidateProfile;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    AccountResp toAccountResp(Account account);

    default AccountResp toAccountResp(Account account, CandidateProfile candidateProfile) {
        AccountResp accountResp = toAccountResp(account);
        if (candidateProfile != null) {
            accountResp.setCurrentTitle(candidateProfile.getCurrentTitle());
            accountResp.setYearsOfExperience(candidateProfile.getYearsOfExperience());
            accountResp.setExpectedSalaryMin(candidateProfile.getExpectedSalaryMin());
            accountResp.setExpectedSalaryMax(candidateProfile.getExpectedSalaryMax());
            accountResp.setBio(candidateProfile.getBio());
            accountResp.setCity(candidateProfile.getCity());
            accountResp.setOpenForWork(candidateProfile.getOpenForWork());
        }
        return accountResp;
    }

    Account toAccount(AccountResp accountResp);
}
