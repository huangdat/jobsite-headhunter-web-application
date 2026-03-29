package com.rikkeisoft.backend.model.dto.req.candidate;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
public class CandidateFilterCriteria {
    private List<String> status;
    private List<String> locations;
    private List<String> industries;
    private String degree;
    private Integer expMin;
    private Integer expMax;
    private LocalDate registeredFrom;
    private LocalDate registeredTo;
    private Integer page = 1;
    private Integer size = 12;
}
