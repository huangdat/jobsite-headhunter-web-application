package com.rikkeisoft.backend.service.impl;

import com.rikkeisoft.backend.enums.AccountStatus;
import com.rikkeisoft.backend.enums.SkillCategory;
import com.rikkeisoft.backend.exception.AppException;
import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.mapper.AccountMapper;
import com.rikkeisoft.backend.model.dto.PagedResponse;
import com.rikkeisoft.backend.model.dto.req.candidate.CandidateFilterCriteria;
import com.rikkeisoft.backend.model.dto.resp.account.AccountResp;
import com.rikkeisoft.backend.model.entity.Account;
import com.rikkeisoft.backend.model.entity.CandidateProfile;
import com.rikkeisoft.backend.repository.AccountRepo;
import com.rikkeisoft.backend.service.CandidateFilterService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayDeque;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class CandidateFilterServiceImpl implements CandidateFilterService {
    AccountRepo accountRepo;
    AccountMapper accountMapper;

    private static final int RATE_LIMIT_PER_MIN = 30;
    private static final long RATE_LIMIT_WINDOW_MS = 60_000L;
    private static final Map<String, ArrayDeque<Long>> RATE_LIMIT_BUCKETS = new ConcurrentHashMap<>();

    @Override
    public PagedResponse<AccountResp> filterCandidates(CandidateFilterCriteria criteria) {
        enforceRateLimit();
        int page = Math.max(1, criteria.getPage());
        int size = Math.min(Math.max(1, criteria.getSize()), 100);

        Specification<Account> spec = (root, query, cb) -> {
            query.distinct(true);
            // Only candidates
            var predicates = cb.conjunction();
            // roles contains 'CANDIDATE'
            predicates.getExpressions().add(cb.isMember("CANDIDATE", root.get("roles")));

            if (!CollectionUtils.isEmpty(criteria.getStatus())) {
                List<AccountStatus> statuses = criteria.getStatus().stream()
                        .map(this::parseStatus)
                        .filter(s -> s != null)
                        .collect(Collectors.toList());
                if (!statuses.isEmpty()) {
                    predicates.getExpressions().add(root.get("status").in(statuses));
                }
            }

            if (!CollectionUtils.isEmpty(criteria.getIndustries())) {
                Set<SkillCategory> categories = parseSkillCategories(criteria.getIndustries());
                if (categories.isEmpty()) {
                    predicates.getExpressions().add(cb.disjunction());
                } else {
                    var skillJoin = root.join("accountSkills").join("skill");
                    predicates.getExpressions().add(skillJoin.get("category").in(categories));
                }
            }

            if (criteria.getExpMin() != null || criteria.getExpMax() != null || !CollectionUtils.isEmpty(criteria.getLocations())) {
                var sub = query.subquery(String.class);
                var profileRoot = sub.from(CandidateProfile.class);
                sub.select(profileRoot.get("account").get("id"));
                var subPredicates = cb.conjunction();

                if (!CollectionUtils.isEmpty(criteria.getLocations())) {
                    subPredicates.getExpressions().add(profileRoot.get("city").in(criteria.getLocations()));
                }
                if (criteria.getExpMin() != null) {
                    subPredicates.getExpressions().add(cb.greaterThanOrEqualTo(profileRoot.get("yearsOfExperience"), criteria.getExpMin().floatValue()));
                }
                if (criteria.getExpMax() != null) {
                    subPredicates.getExpressions().add(cb.lessThanOrEqualTo(profileRoot.get("yearsOfExperience"), criteria.getExpMax().floatValue()));
                }
                sub.where(subPredicates);
                predicates.getExpressions().add(root.get("id").in(sub));
            }

            // Degree is not stored in current schema; ignore until a field exists.
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

    private void enforceRateLimit() {
        String key = resolveRateLimitKey();
        ArrayDeque<Long> bucket = RATE_LIMIT_BUCKETS.computeIfAbsent(key, k -> new ArrayDeque<>());
        long now = System.currentTimeMillis();
        synchronized (bucket) {
            while (!bucket.isEmpty() && now - bucket.peekFirst() > RATE_LIMIT_WINDOW_MS) {
                bucket.pollFirst();
            }
            if (bucket.size() >= RATE_LIMIT_PER_MIN) {
                throw new AppException(ErrorCode.TOO_MANY_REQUESTS);
            }
            bucket.addLast(now);
        }
    }

    private String resolveRateLimitKey() {
        var context = SecurityContextHolder.getContext();
        if (context == null || context.getAuthentication() == null) return "anonymous";
        String name = context.getAuthentication().getName();
        return (name == null || name.isBlank()) ? "anonymous" : name;
    }

    private AccountStatus parseStatus(String value) {
        if (value == null) return null;
        try {
            return AccountStatus.valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            return null;
        }
    }

    private Set<SkillCategory> parseSkillCategories(List<String> values) {
        if (CollectionUtils.isEmpty(values)) return Set.of();
        Set<SkillCategory> categories = new HashSet<>();
        for (String raw : values) {
            if (raw == null) continue;
            String v = raw.trim();
            if (v.isEmpty()) continue;
            SkillCategory cat = matchSkillCategory(v);
            if (cat != null) categories.add(cat);
        }
        return categories;
    }

    private SkillCategory matchSkillCategory(String value) {
        String normalized = normalizeCategory(value);
        for (SkillCategory cat : SkillCategory.values()) {
            if (cat.name().equalsIgnoreCase(normalized)) return cat;
            String display = normalizeCategory(cat.getDisplayName());
            if (display.equalsIgnoreCase(normalized)) return cat;
        }
        return null;
    }

    private String normalizeCategory(String value) {
        return value.trim().toUpperCase(Locale.ROOT).replace(' ', '_');
    }
}
