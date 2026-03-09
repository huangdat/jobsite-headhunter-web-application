package com.rikkeisoft.backend.service.impl;

import com.rikkeisoft.backend.enums.AccountStatus;
import com.rikkeisoft.backend.enums.AuthProvider;
import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.exception.AppException;
import com.rikkeisoft.backend.mapper.AccountMapper;
import com.rikkeisoft.backend.model.dto.req.account.*;
import com.rikkeisoft.backend.model.dto.resp.account.AccountResp;
import com.rikkeisoft.backend.model.entity.Account;
import com.rikkeisoft.backend.model.entity.BusinessProfile;
import com.rikkeisoft.backend.model.entity.CollaboratorProfile;
import com.rikkeisoft.backend.repository.AccountRepo;
import com.rikkeisoft.backend.repository.BusinessProfileRepo;
import com.rikkeisoft.backend.repository.CandidateProfileRepo;
import com.rikkeisoft.backend.repository.CollaboratorProfileRepo;
import com.rikkeisoft.backend.service.AccountService;
import com.rikkeisoft.backend.service.BusinessProfileService;
import com.rikkeisoft.backend.service.UploadService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.web.util.HtmlUtils;
import com.rikkeisoft.backend.model.dto.PagedResponse;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class AccountServiceImpl implements AccountService {
    AccountRepo accountRepo;
    AccountMapper accountMapper;
    UploadService uploadService;
    PasswordEncoder passwordEncoder;
    BusinessProfileService businessProfileService;
    BusinessProfileRepo businessProfileRepo;
    CollaboratorProfileRepo collaboratorProfileRepo;
    CandidateProfileRepo candidateProfileRepo;

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
                .gender(req.getGender())
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

    @Override
    public PagedResponse<AccountResp> searchAccounts(int page, int size, String keyword, String role, String status, String sort) {
        // sanitize input to avoid XSS
        String safeKeyword = keyword == null ? null : HtmlUtils.htmlEscape(keyword).trim();
        // build sort
        Sort sortObj = Sort.by(Sort.Direction.DESC, "createdAt");
        if (sort != null && !sort.isEmpty()) {
            String[] parts = sort.split(",");
            String field = parts[0];
            Sort.Direction dir = Sort.Direction.DESC;
            if (parts.length > 1) {
                try {
                    dir = Sort.Direction.fromString(parts[1]);
                } catch (Exception ignored) {
                }
            }
            sortObj = Sort.by(dir, field);
        }

        int pageIndex = Math.max(1, page) - 1; // convert to 0-based
        Pageable pageable = PageRequest.of(pageIndex, size, sortObj);

        Specification<Account> spec = (root, query, cb) -> {
            query.distinct(true);
            List<Predicate> predicates = new ArrayList<>();

            if (safeKeyword != null && !safeKeyword.isEmpty()) {
                String like = "%" + safeKeyword.toLowerCase() + "%";
                Expression<String> fullNameExp = cb.lower(root.get("fullName"));
                Expression<String> emailExp = cb.lower(root.get("email"));
                predicates.add(cb.or(cb.like(fullNameExp, like), cb.like(emailExp, like)));
            }

            if (role != null && !role.isEmpty()) {
                // roles is an ElementCollection
                Join<Account, String> rolesJoin = root.join("roles");
                predicates.add(cb.equal(cb.lower(rolesJoin), role.toLowerCase()));
            }

            if (status != null && !status.isEmpty()) {
                try {
                    predicates.add(cb.equal(root.get("status"), com.rikkeisoft.backend.enums.AccountStatus.valueOf(status.toUpperCase())));
                } catch (Exception ignored) {
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Account> result = accountRepo.findAll(spec, pageable);

        List<AccountResp> data = result.stream().map(accountMapper::toAccountResp).collect(Collectors.toList());

        PagedResponse<AccountResp> resp = new PagedResponse<>();
        resp.setPage(pageIndex + 1);
        resp.setSize(size);
        resp.setTotalElements(result.getTotalElements());
        resp.setTotalPages(result.getTotalPages());
        resp.setData(data);

        return resp;
    }

    @Override
    @Transactional
    public AccountResp createAccountHeadhunter(HeadhunterSignupReq req) {
        // Create accountCreateReq object to reuse createAccount logic (except for businessProfile and role)
        AccountCreateReq accountCreateReq = AccountCreateReq.builder()
                .username(req.getUsername())
                .password(req.getPassword())
                .rePassword(req.getRePassword())
                .email(req.getEmail())
                .fullName(req.getFullName())
                .phone(req.getPhone())
                .avatar(req.getAvatar())
                .gender(req.getGender())
                .build();

        // createAccount saves and returns the account (still without businessProfile / role)
        AccountResp accountResp = createAccount(accountCreateReq);

        // fetch the saved entity to mutate it
        Account account = accountRepo.findById(accountResp.getId())
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        // assign HEADHUNTER role — initialize a fresh set to avoid lazy-load / null issues
        Set<String> roles = new HashSet<>();
        roles.add("HEADHUNTER");
        account.setRoles(roles);

        // resolve BusinessProfile
        BusinessProfile businessProfile;
        if (req.getBusinessProfileId() == null) {
            // No existing profile provided — create a new one
            // Check for duplicate company name
            if (businessProfileRepo.existsByCompanyName(req.getCompanyName())) {
                // Roll back the account we just created to keep data consistent
                accountRepo.delete(account);
                throw new AppException(ErrorCode.COMPANY_NAME_EXISTED);
            }
            businessProfile = BusinessProfile.builder()
                    .companyName(req.getCompanyName())
                    .taxCode(req.getTaxCode())
                    .websiteUrl(req.getWebsiteUrl())
                    .addressMain(req.getAddressMain())
                    .companyScale(req.getCompanyScale())
                    .build();
            businessProfileRepo.save(businessProfile);
        } else {
            // Existing profile — verify it exists
            businessProfile = businessProfileRepo.findById(req.getBusinessProfileId())
                    .orElseThrow(() -> {
                        accountRepo.delete(account);
                        return new AppException(ErrorCode.BUSINESS_PROFILE_NOT_FOUND);
                    });
        }

        // Link the profile and persist
        account.setBusinessProfile(businessProfile);
        accountRepo.save(account);

        return accountMapper.toAccountResp(account);
    }

    /**
     * Create a collaborator account (signup). The collaborator will be linked to the headhunter's business profile, and has COLLABORATOR role.
     * @param req
     * @return
     */
    @Override
    @Transactional
    public AccountResp createAccountCollaborator(CollaboratorSignupReq req) {
        // Create accountCreateReq object to reuse createAccount logic (except for businessProfile and role)
        AccountCreateReq accountCreateReq = AccountCreateReq.builder()
                .username(req.getUsername())
                .password(req.getPassword())
                .rePassword(req.getRePassword())
                .email(req.getEmail())
                .fullName(req.getFullName())
                .phone(req.getPhone())
                .avatar(req.getAvatar())
                .gender(req.getGender())
                .build();

        // createAccount saves and returns the account (still without businessProfile / role)
        AccountResp accountResp = createAccount(accountCreateReq);

        // fetch the saved entity to mutate it
        Account account = accountRepo.findById(accountResp.getId())
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        // assign HEADHUNTER role — initialize a fresh set to avoid lazy-load / null issues
        Set<String> roles = new HashSet<>();
        roles.add("COLLABORATOR");
        account.setRoles(roles);

        // Link to collaborator profile (which will be linked to headhunter's business profile later when collaborator chooses their headhunter)
        CollaboratorProfile collaboratorProfile = CollaboratorProfile.builder()
                .commissionRate(req.getCommissionRate())
                .account(account)
                .managedByHeadhunter(null) // can be set later by collaborator's choice
                .build();
        collaboratorProfileRepo.save(collaboratorProfile);
        accountRepo.save(account);

        return accountMapper.toAccountResp(account);
    }

    @Override
    @Transactional
    public AccountResp createAccountCandidate(CandidateSignupReq req) {
        // Build AccountCreateReq to reuse createAccount logic
        AccountCreateReq accountCreateReq = AccountCreateReq.builder()
                .username(req.getUsername())
                .password(req.getPassword())
                .rePassword(req.getRePassword())
                .email(req.getEmail())
                .fullName(req.getFullName())
                .phone(req.getPhone())
                .avatar(req.getAvatar())
                .gender(req.getGender())
                .build();

        // createAccount saves and returns the account (still without candidateProfile / role)
        AccountResp accountResp = createAccount(accountCreateReq);

        // Fetch the saved entity to mutate it
        Account account = accountRepo.findById(accountResp.getId())
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        // Assign CANDIDATE role
        Set<String> roles = new HashSet<>();
        roles.add("CANDIDATE");
        account.setRoles(roles);

        // Create and link the CandidateProfile
        com.rikkeisoft.backend.model.entity.CandidateProfile candidateProfile =
                com.rikkeisoft.backend.model.entity.CandidateProfile.builder()
                        .account(account)
                        .currentTitle(req.getCurrentTitle())
                        .yearsOfExperience(req.getYearsOfExperience())
                        .expectedSalaryMin(req.getExpectedSalaryMin())
                        .expectedSalaryMax(req.getExpectedSalaryMax())
                        .bio(req.getBio())
                        .city(req.getCity())
                        .openForWork(req.getOpenForWork() != null ? req.getOpenForWork() : false)
                        .createdAt(LocalDateTime.now())
                        .build();
        candidateProfileRepo.save(candidateProfile);
        accountRepo.save(account);

        return accountMapper.toAccountResp(account);
    }

}
