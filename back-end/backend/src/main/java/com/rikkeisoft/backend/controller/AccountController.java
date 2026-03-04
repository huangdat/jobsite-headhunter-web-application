package com.rikkeisoft.backend.controller;

import com.rikkeisoft.backend.model.dto.APIResponse;
import com.rikkeisoft.backend.model.dto.req.account.AccountUpdateReq;
import com.rikkeisoft.backend.model.dto.req.account.AccountUpdateStatusReq;
import com.rikkeisoft.backend.model.dto.req.account.AccountChangePasswordreq;
import com.rikkeisoft.backend.model.dto.req.account.AccountCreateReq;
import com.rikkeisoft.backend.model.dto.req.account.ResetPasswordReq;
import com.rikkeisoft.backend.model.dto.resp.AccountResp;
import com.rikkeisoft.backend.service.AccountService;

import io.swagger.v3.oas.models.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequestMapping("/api/account")
public class AccountController {
    AccountService accountService;

    @GetMapping
    public APIResponse<List<AccountResp>> getAccount() {
        APIResponse<List<AccountResp>> resp = new APIResponse<>();
        resp.setResult(accountService.getAllAccounts());
        return resp;
    }

    @GetMapping("/{accountId}")
    public APIResponse<AccountResp> getAccountById(@PathVariable String accountId) {
        APIResponse<AccountResp> resp = new APIResponse<>();
        resp.setResult(accountService.getAccountById(accountId));
        return resp;
    }

    @GetMapping("/myInfo")
    public APIResponse<AccountResp> getMyInfo() {
        APIResponse<AccountResp> resp = new APIResponse<>();
        resp.setResult(accountService.getMyInfo());
        return resp;
    }

    @PutMapping("/myInfo")
    public APIResponse<AccountResp> updateAccount(@ModelAttribute AccountUpdateReq req) {
        APIResponse<AccountResp> resp = new APIResponse<>();
        resp.setResult(accountService.updateMyAccount(req));
        return resp;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public APIResponse<AccountResp> createAccount(@ModelAttribute AccountCreateReq req) {
        APIResponse<AccountResp> resp = new APIResponse<>();
        resp.setResult(accountService.createAccount(req));
        return resp;
    }

    @PutMapping("/status/{accountId}")
    public APIResponse<AccountResp> updateStatus(@PathVariable String accountId,
            @RequestBody AccountUpdateStatusReq req) {
        APIResponse<AccountResp> resp = new APIResponse<>();
        resp.setResult(accountService.updateStatus(accountId, req.getStatus().toString()));
        return resp;
    }

    @PostMapping("/reset-password")
    public APIResponse<AccountResp> resetPassword(@RequestBody ResetPasswordReq req) {
        APIResponse<AccountResp> resp = new APIResponse<>();
        resp.setResult(accountService.resetPassword(req));
        return resp;
    }

    @PutMapping("/changeMyPassword")
    public APIResponse<String> changePassword(@Valid @RequestBody AccountChangePasswordreq req) {
        APIResponse<String> resp = new APIResponse<>();
        resp.setResult(accountService.changePassword(req));

        return resp;
    }

}
