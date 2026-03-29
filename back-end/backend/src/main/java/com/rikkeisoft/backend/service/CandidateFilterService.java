package com.rikkeisoft.backend.service;

import com.rikkeisoft.backend.model.dto.req.candidate.CandidateFilterCriteria;
import com.rikkeisoft.backend.model.dto.resp.account.AccountResp;
import com.rikkeisoft.backend.model.dto.PagedResponse;

public interface CandidateFilterService {
    PagedResponse<AccountResp> filterCandidates(CandidateFilterCriteria criteria);
}
