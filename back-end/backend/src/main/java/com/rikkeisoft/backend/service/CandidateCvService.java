package com.rikkeisoft.backend.service;

import com.rikkeisoft.backend.model.dto.req.cv.CandidateCvUpdateReq;
import com.rikkeisoft.backend.model.dto.resp.cv.CandidateCvResp;


import java.util.List;

public interface CandidateCvService {
    List<CandidateCvResp> getAllCandidateCvs();
    CandidateCvResp getCvById(String id);
    CandidateCvResp getCvByCandidateId(String candidateId);
    CandidateCvResp getMyCv();
    CandidateCvResp updateMyCv(CandidateCvUpdateReq req);
    CandidateCvResp updateMyCvVisibility(boolean visibility);
}
