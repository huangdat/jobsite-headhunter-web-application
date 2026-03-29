package com.rikkeisoft.backend.controller.headhunter;

import com.rikkeisoft.backend.model.dto.APIResponse;
import com.rikkeisoft.backend.model.dto.resp.candidate.CandidateSuggestionResp;
import com.rikkeisoft.backend.service.CandidateSearchService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequestMapping("/api/v1/headhunter/candidates")
public class CandidateSearchController {
    CandidateSearchService candidateSearchService;

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('SCOPE_HEADHUNTER') or hasAuthority('SCOPE_ADMIN')")
    public APIResponse<List<CandidateSuggestionResp>> searchCandidates(@RequestParam("keyword") String keyword,
                                                                         @RequestParam(value = "limit", defaultValue = "10") int limit) {
        List<CandidateSuggestionResp> result = candidateSearchService.searchSuggestions(keyword, limit);
        APIResponse<List<CandidateSuggestionResp>> resp = new APIResponse<>();
        resp.setResult(result);
        return resp;
    }
}
