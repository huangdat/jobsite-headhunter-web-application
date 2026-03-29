package com.rikkeisoft.backend.service.impl;

import com.rikkeisoft.backend.model.dto.resp.candidate.CandidateSuggestionResp;
import com.rikkeisoft.backend.model.entity.Account;
import com.rikkeisoft.backend.repository.AccountRepo;
import com.rikkeisoft.backend.service.CandidateSearchService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class CandidateSearchServiceImpl implements CandidateSearchService {
    AccountRepo accountRepo;

    @Override
    public List<CandidateSuggestionResp> searchSuggestions(String keyword, int limit) {
        if (!StringUtils.hasText(keyword)) return List.of();
        // Basic sanitization to remove HTML tags and dangerous characters
        String sanitized = keyword.replaceAll("<[^>]*>", "").trim();
        String q = sanitized.toLowerCase(Locale.ROOT);

        // First pass: fetch candidates where name/email/phone contains keyword (case-insensitive)
        List<Account> raw = accountRepo.findAll((root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("fullName")), "%" + q + "%"),
                cb.like(cb.lower(root.get("email")), "%" + q + "%"),
                cb.like(cb.lower(root.get("phone")), "%" + q + "%")
        ), PageRequest.of(0, Math.max(limit * 5, 50))).getContent();

        // Normalize and fuzzy filter (Levenshtein <=1) and ranking
        String normQ = normalize(q);

        List<CandidateSuggestionResp> matches = new ArrayList<>();
        for (Account a : raw) {
            String name = a.getFullName() == null ? "" : a.getFullName();
            String email = a.getEmail() == null ? "" : a.getEmail();
            String phone = a.getPhone() == null ? "" : a.getPhone();

            String normName = normalize(name.toLowerCase(Locale.ROOT));
            String normEmail = normalize(email.toLowerCase(Locale.ROOT));

            boolean contains = normName.contains(normQ) || normEmail.contains(normQ) || phone.contains(q);
            boolean fuzzy = levenshteinDistance(normName, normQ) <= 1 || levenshteinDistance(normEmail, normQ) <=1;

            if (contains || fuzzy) {
                matches.add(CandidateSuggestionResp.builder()
                        .id(a.getId())
                        .fullName(name)
                        .email(email)
                        .phone(phone)
                        .build());
            }
        }

        // Sort: exact contains in name/email/phone first, then by name
        List<CandidateSuggestionResp> sorted = matches.stream()
                .sorted(Comparator.comparing((CandidateSuggestionResp c) -> {
                    String n = normalize((c.getFullName() == null ? "" : c.getFullName()).toLowerCase(Locale.ROOT));
                    String e = normalize((c.getEmail() == null ? "" : c.getEmail()).toLowerCase(Locale.ROOT));
                    if (n.contains(normQ) || e.contains(normQ) || (c.getPhone() != null && c.getPhone().contains(q))) return 0;
                    return 1;
                }).thenComparing(c -> c.getFullName() == null ? "" : c.getFullName()))
                .limit(limit)
                .collect(Collectors.toList());

        return sorted;
    }

    private static String normalize(String input) {
        if (input == null) return "";
        String n = Normalizer.normalize(input, Normalizer.Form.NFD);
        n = n.replaceAll("\\p{M}", "");
        return n;
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
}
