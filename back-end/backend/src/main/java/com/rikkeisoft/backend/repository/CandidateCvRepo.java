package com.rikkeisoft.backend.repository;

import com.rikkeisoft.backend.model.entity.Account;
import com.rikkeisoft.backend.model.entity.CandidateCv;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CandidateCvRepo extends JpaRepository<CandidateCv, Long> {
    Optional<CandidateCv> findByCandidate_Id(String candidateId);

}
