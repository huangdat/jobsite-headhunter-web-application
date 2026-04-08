package com.rikkeisoft.backend.model.dto.resp.candidate;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CandidateSuggestionResp {
    private String id;
    private String fullName;
    private String email;
    private String phone;
    private List<String> skills;
}
