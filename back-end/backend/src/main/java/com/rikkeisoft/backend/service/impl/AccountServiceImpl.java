package com.rikkeisoft.backend.service.impl;

import com.rikkeisoft.backend.enums.AccountStatus;
import com.rikkeisoft.backend.enums.AuthProvider;
import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.exception.AppException;
import com.rikkeisoft.backend.mapper.AccountMapper;
import com.rikkeisoft.backend.model.dto.req.account.AccountChangePasswordreq;
import com.rikkeisoft.backend.model.dto.req.account.AccountCreateReq;
import com.rikkeisoft.backend.model.dto.req.account.AccountUpdateReq;
import com.rikkeisoft.backend.model.dto.resp.AccountResp;
import com.rikkeisoft.backend.model.entity.Account;
import com.rikkeisoft.backend.repository.AccountRepo;
import com.rikkeisoft.backend.service.AccountService;
import com.rikkeisoft.backend.service.UploadService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class AccountServiceImpl implements AccountService {
    AccountRepo accountRepo;
    AccountMapper accountMapper;
    UploadService uploadService;
    PasswordEncoder passwordEncoder;

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
    @PreAuthorize("hasAuthority('SCOPE_ADMIN') or hasAuthority('SCOPE_HEADHUNTER') or hasAuthority('SCOPE_COLLABORATOR')")
    public AccountResp getAccountById(String id) {
        // find account by id
        Account account = accountRepo.findById(id).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        // map to resp
        return accountMapper.toAccountResp(account);
    }

    /**
     * Get the information of the currently authenticated user
     * 
     * @return AccountResp
     */
    @Override
    public AccountResp getMyInfo() {
        // Get the username of the currently authenticated user
        var context = SecurityContextHolder.getContext();
        String contextName = context.getAuthentication().getName();
        // Fetch a user by username from the repository
        Account account = accountRepo.findByUsername(contextName)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        return accountMapper.toAccountResp(account);
    }

    @Override
    public AccountResp createAccount(AccountCreateReq req) {
        // Check if username already exists
        if (accountRepo.existsByUsername(req.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        // Check if email already exists
        if (req.getEmail() != null && accountRepo.existsByEmail(req.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }

        // Check password match
        if (!req.getPassword().equals(req.getRePassword())) {
            throw new AppException(ErrorCode.PASSWORD_NOT_MATCH);
        }

        // Upload avatar if provided
        String imageUrl = null;
        if (req.getAvatar() != null && !req.getAvatar().isEmpty()) {
            imageUrl = uploadService.uploadFile(req.getAvatar());
        }

        Account account = Account.builder()
                .username(req.getUsername())
                .password(passwordEncoder.encode(req.getPassword()))
                .email(req.getEmail())
                .fullName(req.getFullName())
                .phone(req.getPhone())
                .imageUrl(imageUrl)
                .authProvider(AuthProvider.LOCAL)
                .status(AccountStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        accountRepo.save(account);
        return accountMapper.toAccountResp(account);
    }

    @Override
    public AccountResp updateMyAccount(AccountUpdateReq req) {
        // get current account
        var context = SecurityContextHolder.getContext();
        String contextName = context.getAuthentication().getName();

        // find account contextName
        Account account = accountRepo.findByUsername(contextName)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        // Upload avatar if provided
        if (req.getAvatar() != null && !req.getAvatar().isEmpty()) {
            String imageUrl = uploadService.uploadFile(req.getAvatar());
            account.setImageUrl(imageUrl);
        }
        account.setFullName(req.getFullName());
        account.setPhone(req.getPhone());
        account.setGender(req.getGender());
        account.setUpdatedAt(LocalDateTime.now());

        accountRepo.save(account);
        return accountMapper.toAccountResp(account);
    }

    /**
     * Update the status of an account PENDING, ACTIVE, SUSPENDED, DELETED
     * 
     * @param id
     * @param status
     * @return AccountResp
     */
    @Override
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public AccountResp updateStatus(String id, String status) {
        Account account = accountRepo.findById(id).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        try {
            AccountStatus newStatus = AccountStatus.valueOf(status.toUpperCase());
            account.setStatus(newStatus);
            account.setUpdatedAt(LocalDateTime.now());
            accountRepo.save(account);
            return accountMapper.toAccountResp(account);
        } catch (Exception e) {
            throw new AppException(ErrorCode.INVALID_ACCOUNT_STATUS);
        }
    }

    @Override
    public String changePassword(AccountChangePasswordreq req) {
        // get current account
        var context = SecurityContextHolder.getContext();
        String contextName = context.getAuthentication().getName();

        // 1. Find account by username
        Account account = accountRepo.findByUsername(contextName)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        // 2. Verify old password matches
        if (!passwordEncoder.matches(req.getOldPassword(), account.getPassword())) {
            throw new AppException(ErrorCode.INVALID_PASSWORD);
        }

        // 3. Check if newPassword and confirmPassword match
        if (!req.getNewPassword().equals(req.getReNewPassword())) {
            throw new AppException(ErrorCode.PASSWORD_NOT_MATCH);
        }

        // 4. Check if new password is different from old password
        if (passwordEncoder.matches(req.getNewPassword(), account.getPassword())) {
            throw new AppException(ErrorCode.PASSWORD_SAME_AS_OLD);
        }

        String encodedNewPassword = passwordEncoder.encode(req.getNewPassword());
        // 6. Update account(change password)
        account.setPassword(encodedNewPassword);
        account.setUpdatedAt(LocalDateTime.now());

        accountRepo.save(account);

        accountMapper.toAccountResp(account);

        return "Change password successfully";

    }

    // Filter by status
    @Override
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public List<AccountResp> getPendingAccounts() {
        List<Account> accounts = accountRepo.findByStatus(AccountStatus.PENDING);
        List<AccountResp> accountResps = new ArrayList<>();
        for (Account account : accounts) {
            accountResps.add(accountMapper.toAccountResp(account));
        }
        return accountResps;
    }

    @Override
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public List<AccountResp> getActiveAccounts() {
        List<Account> accounts = accountRepo.findByStatus(AccountStatus.ACTIVE);
        List<AccountResp> accountResps = new ArrayList<>();
        for (Account account : accounts) {
            accountResps.add(accountMapper.toAccountResp(account));
        }
        return accountResps;
    }

    @Override
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public List<AccountResp> getSuspendedAccounts() {
        List<Account> accounts = accountRepo.findByStatus(AccountStatus.SUSPENDED);
        List<AccountResp> accountResps = new ArrayList<>();
        for (Account account : accounts) {
            accountResps.add(accountMapper.toAccountResp(account));
        }
        return accountResps;
    }

    @Override
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public List<AccountResp> getDeletedAccounts() {
        List<Account> accounts = accountRepo.findByStatus(AccountStatus.DELETED);
        List<AccountResp> accountResps = new ArrayList<>();
        for (Account account : accounts) {
            accountResps.add(accountMapper.toAccountResp(account));
        }
        return accountResps;
    }

    // Filter by role
    @Override
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public List<AccountResp> getAdminAccounts() {
        List<Account> accounts = accountRepo.findByRolesContaining("ADMIN");
        List<AccountResp> accountResps = new ArrayList<>();
        for (Account account : accounts) {
            accountResps.add(accountMapper.toAccountResp(account));
        }
        return accountResps;
    }

    @Override
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public List<AccountResp> getHeadhunterAccounts() {
        List<Account> accounts = accountRepo.findByRolesContaining("HEADHUNTER");
        List<AccountResp> accountResps = new ArrayList<>();
        for (Account account : accounts) {
            accountResps.add(accountMapper.toAccountResp(account));
        }
        return accountResps;
    }

    @Override
    @PreAuthorize("hasAuthority('SCOPE_ADMIN') or hasAuthority('SCOPE_HEADHUNTER')")
    public List<AccountResp> getCollaboratorAccounts() {
        List<Account> accounts = accountRepo.findByRolesContaining("COLLABORATOR");
        List<AccountResp> accountResps = new ArrayList<>();
        for (Account account : accounts) {
            accountResps.add(accountMapper.toAccountResp(account));
        }
        return accountResps;
    }

    @Override
    @PreAuthorize("hasAuthority('SCOPE_ADMIN') or hasAuthority('SCOPE_HEADHUNTER') or hasAuthority('SCOPE_COLLABORATOR')")
    public List<AccountResp> getCandidateAccounts() {
        List<Account> accounts = accountRepo.findByRolesContaining("CANDIDATE");
        List<AccountResp> accountResps = new ArrayList<>();
        for (Account account : accounts) {
            accountResps.add(accountMapper.toAccountResp(account));
        }
        return accountResps;
    }

}
