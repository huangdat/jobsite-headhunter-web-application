package com.rikkeisoft.backend.service.impl;

import com.rikkeisoft.backend.model.dto.PagedResponse;
import com.rikkeisoft.backend.model.dto.req.candidate.CandidateFilterCriteria;
import com.rikkeisoft.backend.model.dto.resp.account.AccountResp;
import com.rikkeisoft.backend.model.entity.Account;
import com.rikkeisoft.backend.repository.AccountRepo;
import com.rikkeisoft.backend.service.CandidateFilterService;
import com.rikkeisoft.backend.mapper.AccountMapper;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.CollectionUtils;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class CandidateFilterServiceImpl implements CandidateFilterService {
    AccountRepo accountRepo;
    AccountMapper accountMapper;

    @Override
    public PagedResponse<AccountResp> filterCandidates(CandidateFilterCriteria criteria) {
        int page = Math.max(1, criteria.getPage());
        int size = Math.min(Math.max(1, criteria.getSize()), 100);

        Specification<Account> spec = (root, query, cb) -> {
            // Only candidates
            var predicates = cb.conjunction();
            // roles contains 'CANDIDATE'
            predicates.getExpressions().add(cb.isMember("CANDIDATE", root.get("roles")));

            // NOTE: Account entity currently stores basic profile fields (fullName, email, phone, createdAt).
            // Advanced filters (experience, locations, industries) require joining CV or profile tables.
            // For now, only support registration date range when provided.
            if (criteria.getRegisteredFrom() != null) {
                predicates.getExpressions().add(cb.greaterThanOrEqualTo(root.get("createdAt"), criteria.getRegisteredFrom().atStartOfDay()));
            }
            if (criteria.getRegisteredTo() != null) {
                predicates.getExpressions().add(cb.lessThanOrEqualTo(root.get("createdAt"), criteria.getRegisteredTo().atTime(23,59,59)));
            }

            return predicates;
        };

        Pageable pageable = PageRequest.of(page - 1, size);
        var pageRes = accountRepo.findAll(spec, pageable);
        List<AccountResp> data = pageRes.getContent().stream().map(accountMapper::toAccountResp).collect(Collectors.toList());

        return PagedResponse.<AccountResp>builder()
                .page(page)
                .size(size)
                .totalElements(pageRes.getTotalElements())
                .totalPages(pageRes.getTotalPages())
                .data(data)
                .build();
    }
}
