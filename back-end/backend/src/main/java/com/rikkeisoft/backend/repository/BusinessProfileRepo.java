package com.rikkeisoft.backend.repository;

import com.rikkeisoft.backend.model.entity.BusinessProfile;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BusinessProfileRepo extends JpaRepository<BusinessProfile, Long> {

    boolean existsByCompanyName(String companyName);

    Optional<BusinessProfile> findByTaxCode(String taxCode);

    @Query("""
            select bp
            from BusinessProfile bp
            left join Account a on a.businessProfile = bp
            left join a.roles r
            left join ForumPost fp on fp.author = a
            where r = 'HEADHUNTER'
            group by bp
            order by count(fp.id) desc
            """)
    List<BusinessProfile> findTopByHeadhunterPostCount(Pageable pageable);

}
