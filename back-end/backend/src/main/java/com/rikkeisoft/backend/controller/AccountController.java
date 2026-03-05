package com.rikkeisoft.backend.controller;

import com.rikkeisoft.backend.model.dto.APIResponse;
import com.rikkeisoft.backend.model.dto.req.account.AccountUpdateReq;
import com.rikkeisoft.backend.model.dto.req.account.AccountUpdateStatusReq;
import com.rikkeisoft.backend.model.dto.req.account.AccountChangePasswordreq;
import com.rikkeisoft.backend.model.dto.req.account.AccountCreateReq;
import com.rikkeisoft.backend.model.dto.req.account.*;
import com.rikkeisoft.backend.model.dto.resp.account.AccountResp;
import com.rikkeisoft.backend.service.AccountService;
import com.rikkeisoft.backend.model.dto.PagedResponse;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public APIResponse<PagedResponse<AccountResp>> listUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String sort
    ) {
        APIResponse<PagedResponse<AccountResp>> resp = new APIResponse<>();
        PagedResponse<AccountResp> result = accountService.searchAccounts(page, size, keyword, role, status, sort);
        resp.setResult(result);
        return resp;
    }

    @PutMapping("/changeMyPassword")
    public APIResponse<String> changePassword(@Valid @RequestBody AccountChangePasswordreq req) {
        APIResponse<String> resp = new APIResponse<>();
        resp.setResult(accountService.changePassword(req));

        return resp;
    }

    @PostMapping("/signup-headhunter")
    public APIResponse<AccountResp> signupHeadhunter(@ModelAttribute HeadhunterSignupReq req) {
        APIResponse<AccountResp> resp = new APIResponse<>();
        resp.setResult(accountService
        return resp;
    }


}
