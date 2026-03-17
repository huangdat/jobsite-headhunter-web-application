package com.rikkeisoft.backend.repository;

import com.rikkeisoft.backend.model.entity.CandidateCv;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateCvRepo extends JpaRepository<CandidateCv, Long> {
}
