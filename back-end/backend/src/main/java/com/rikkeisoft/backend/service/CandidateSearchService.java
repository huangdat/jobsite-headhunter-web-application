package com.rikkeisoft.backend.service;

import com.rikkeisoft.backend.model.dto.resp.candidate.CandidateSuggestionResp;

import java.util.List;

public interface CandidateSearchService {
    List<CandidateSuggestionResp> searchSuggestions(String keyword, int limit);
}
