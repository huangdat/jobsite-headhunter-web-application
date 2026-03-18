package com.rikkeisoft.backend.mapper;

import com.rikkeisoft.backend.model.dto.resp.cv.CandidateCvResp;
import com.rikkeisoft.backend.model.entity.CandidateCv;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CandidateCvMapper {
    List<CandidateCvResp> toCandidateCvResps(List<CandidateCv> candidateCvs);

    CandidateCvResp toCandidateCvResp(CandidateCv candidateCv);
}
