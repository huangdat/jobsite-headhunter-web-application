package com.rikkeisoft.backend.service.impl;

import com.rikkeisoft.backend.model.dto.resp.candidate.CandidateSuggestionResp;
import com.rikkeisoft.backend.model.entity.Account;
import com.rikkeisoft.backend.model.entity.AccountSkill;
import com.rikkeisoft.backend.model.entity.Skill;
import com.rikkeisoft.backend.repository.AccountRepo;
import com.rikkeisoft.backend.service.CandidateSearchService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class CandidateSearchServiceImpl implements CandidateSearchService {
    AccountRepo accountRepo;

    @Override
    public List<CandidateSuggestionResp> searchSuggestions(String keyword, int limit) {
        if (!StringUtils.hasText(keyword)) return List.of();
        int safeLimit = Math.min(Math.max(limit, 1), 10);

        String sanitized = sanitizeKeyword(keyword);
        if (!StringUtils.hasText(sanitized)) return List.of();

        String q = sanitized.toLowerCase(Locale.ROOT);
        String normQ = normalize(q);
        String like = "%" + q + "%";

        int fetchSize = Math.min(Math.max(safeLimit * 5, 50), 200);
        List<Account> raw = accountRepo.findAll((root, query, cb) -> {
            query.distinct(true);
            var predicates = cb.conjunction();
            predicates.getExpressions().add(cb.isMember("CANDIDATE", root.get("roles")));

            Predicate nameLike = cb.like(cb.lower(root.get("fullName")), like);
            Predicate emailLike = cb.like(cb.lower(root.get("email")), like);
            Predicate phoneLike = cb.like(cb.lower(root.get("phone")), like);

            Join<Account, AccountSkill> accountSkillJoin = root.join("accountSkills", JoinType.LEFT);
            Join<AccountSkill, Skill> skillJoin = accountSkillJoin.join("skill", JoinType.LEFT);
            Predicate skillLike = cb.like(cb.lower(skillJoin.get("name")), like);

            predicates.getExpressions().add(cb.or(nameLike, emailLike, phoneLike, skillLike));
            return predicates;
        }, PageRequest.of(0, fetchSize)).getContent();

        List<CandidateMatch> matches = new ArrayList<>();
        for (Account account : raw) {
            String name = safeText(account.getFullName());
            String email = safeText(account.getEmail());
            String phone = safeText(account.getPhone());
            List<String> skills = extractSkillNames(account);

            MatchQuality p0Quality = maxQuality(
                    matchQuality(name, normQ),
                    matchQuality(email, normQ),
                    matchPhone(phone, q)
            );
            MatchQuality p1Quality = matchSkills(skills, normQ);

            if (p0Quality == MatchQuality.NONE && p1Quality == MatchQuality.NONE) {
                continue;
            }

            matches.add(new CandidateMatch(
                    CandidateSuggestionResp.builder()
                            .id(account.getId())
                            .fullName(name)
                            .email(email)
                            .phone(phone)
                            .skills(skills)
                            .build(),
                    scoreQuality(p0Quality),
                    scoreQuality(p1Quality)
            ));
        }

        return matches.stream()
                .sorted(Comparator
                        .comparingInt(CandidateMatch::p0Score).reversed()
                        .thenComparingInt(CandidateMatch::p1Score).reversed()
                        .thenComparing(m -> safeText(m.suggestion().getFullName())))
                .limit(safeLimit)
                .map(CandidateMatch::suggestion)
                .collect(Collectors.toList());
    }

    private static String sanitizeKeyword(String keyword) {
        if (keyword == null) return "";
        String sanitized = keyword.replaceAll("<[^>]*>", "");
        sanitized = sanitized.replaceAll("[<>\"'`]", "");
        sanitized = sanitized.replaceAll("[\u0000-\u001F\u007F]", "");
        return sanitized.trim();
    }

    private static String normalize(String input) {
        if (input == null) return "";
        String n = Normalizer.normalize(input, Normalizer.Form.NFD);
        n = n.replaceAll("\\p{M}", "");
        n = n.replace('đ', 'd').replace('Đ', 'D');
        return n;
    }

    private static String safeText(String value) {
        return value == null ? "" : value;
    }

    private static List<String> extractSkillNames(Account account) {
        if (account == null || account.getAccountSkills() == null) return List.of();
        return account.getAccountSkills().stream()
                .map(AccountSkill::getSkill)
                .filter(Objects::nonNull)
                .map(Skill::getName)
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .distinct()
                .collect(Collectors.toList());
    }

    private static MatchQuality matchQuality(String value, String normQuery) {
        if (!StringUtils.hasText(value) || !StringUtils.hasText(normQuery)) return MatchQuality.NONE;
        String normalized = normalize(value.toLowerCase(Locale.ROOT));
        if (normalized.contains(normQuery)) return MatchQuality.CONTAINS;

        for (String token : normalized.split("[^a-z0-9]+")) {
            if (token.isEmpty()) continue;
            if (levenshteinDistance(token, normQuery) <= 1) {
                return MatchQuality.FUZZY;
            }
        }
        return MatchQuality.NONE;
    }

    private static MatchQuality matchPhone(String phone, String rawQuery) {
        if (!StringUtils.hasText(phone) || !StringUtils.hasText(rawQuery)) return MatchQuality.NONE;
        String phoneDigits = phone.replaceAll("\\D", "");
        String queryDigits = rawQuery.replaceAll("\\D", "");
        if (!StringUtils.hasText(queryDigits)) return MatchQuality.NONE;
        return phoneDigits.contains(queryDigits) ? MatchQuality.CONTAINS : MatchQuality.NONE;
    }

    private static MatchQuality matchSkills(List<String> skills, String normQuery) {
        if (skills == null || skills.isEmpty()) return MatchQuality.NONE;
        MatchQuality best = MatchQuality.NONE;
        for (String skill : skills) {
            MatchQuality q = matchQuality(skill, normQuery);
            best = maxQuality(best, q);
            if (best == MatchQuality.CONTAINS) return best;
        }
        return best;
    }

    private static MatchQuality maxQuality(MatchQuality... qualities) {
        MatchQuality best = MatchQuality.NONE;
        for (MatchQuality q : qualities) {
            if (q.ordinal() > best.ordinal()) best = q;
        }
        return best;
    }

    private static int scoreQuality(MatchQuality quality) {
        return switch (quality) {
            case CONTAINS -> 2;
            case FUZZY -> 1;
            default -> 0;
        };
    }

    private static int levenshteinDistance(String s, String t) {
        if (s == null) s = "";
        if (t == null) t = "";
        int m = s.length();
        int n = t.length();
        if (m == 0) return n;
        if (n == 0) return m;

        int[] prev = new int[n + 1];
        int[] cur = new int[n + 1];
        for (int j = 0; j <= n; j++) prev[j] = j;
        for (int i = 1; i <= m; i++) {
            cur[0] = i;
            for (int j = 1; j <= n; j++) {
                int cost = s.charAt(i - 1) == t.charAt(j - 1) ? 0 : 1;
                cur[j] = Math.min(Math.min(cur[j - 1] + 1, prev[j] + 1), prev[j - 1] + cost);
            }
            System.arraycopy(cur, 0, prev, 0, n + 1);
        }
        return prev[n];
    }

    private record CandidateMatch(CandidateSuggestionResp suggestion, int p0Score, int p1Score) {}

    private enum MatchQuality {
        NONE,
        FUZZY,
        CONTAINS
    }
}
