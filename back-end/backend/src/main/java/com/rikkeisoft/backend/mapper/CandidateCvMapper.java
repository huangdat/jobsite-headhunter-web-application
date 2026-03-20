package com.rikkeisoft.backend.mapper;

import com.rikkeisoft.backend.model.dto.req.cv.CandidateCvUpdateReq;
import com.rikkeisoft.backend.model.dto.resp.cv.CandidateCvResp;
import com.rikkeisoft.backend.model.entity.Account;
import com.rikkeisoft.backend.model.entity.CandidateCv;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CandidateCvMapper {
    List<CandidateCvResp> toCandidateCvResps(List<CandidateCv> candidateCvs);

    CandidateCvResp toCandidateCvResp(CandidateCv candidateCv);

    CandidateCvResp.CandidateResp toCandidateResp(Account account);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateCandidateCvFromReq(CandidateCvUpdateReq req, @MappingTarget CandidateCv candidateCv);
}
