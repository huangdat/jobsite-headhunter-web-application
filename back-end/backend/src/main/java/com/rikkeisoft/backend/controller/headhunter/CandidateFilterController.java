package com.rikkeisoft.backend.controller.headhunter;

import com.rikkeisoft.backend.model.dto.APIResponse;
import com.rikkeisoft.backend.model.dto.PagedResponse;
import com.rikkeisoft.backend.model.dto.req.candidate.CandidateFilterCriteria;
import com.rikkeisoft.backend.model.dto.resp.account.AccountResp;
import com.rikkeisoft.backend.service.CandidateFilterService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequestMapping("/api/v1/headhunter/candidates")
public class CandidateFilterController {
    CandidateFilterService candidateFilterService;

    @GetMapping
        @PreAuthorize("hasAuthority('SCOPE_HEADHUNTER') or hasAuthority('SCOPE_ADMIN')")
    public APIResponse<PagedResponse<AccountResp>> filterCandidates(
            CandidateFilterCriteria criteria
    ) {
        PagedResponse<AccountResp> result = candidateFilterService.filterCandidates(criteria);
        APIResponse<PagedResponse<AccountResp>> resp = new APIResponse<>();
        resp.setResult(result);
        return resp;
    }
}
