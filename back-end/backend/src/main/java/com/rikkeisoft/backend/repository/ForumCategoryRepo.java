package com.rikkeisoft.backend.repository;

import com.rikkeisoft.backend.model.entity.ForumCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ForumCategoryRepo extends JpaRepository<ForumCategory, Long> {
}