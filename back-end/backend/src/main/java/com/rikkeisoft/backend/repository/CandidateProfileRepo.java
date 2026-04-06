package com.rikkeisoft.backend.repository;

import com.rikkeisoft.backend.model.entity.CandidateProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CandidateProfileRepo extends JpaRepository<CandidateProfile, Long> {
    Optional<CandidateProfile> findByAccount_Id(String accountId);

    List<CandidateProfile> findByAccount_IdIn(List<String> accountIds);
}
