package com.rikkeisoft.backend.repository;

import com.rikkeisoft.backend.model.entity.BusinessProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BusinessProfileRepo extends JpaRepository<BusinessProfile, Long> {

    boolean existsByCompanyName(String companyName);

    java.util.Optional<BusinessProfile> findByTaxCode(String taxCode);

}
