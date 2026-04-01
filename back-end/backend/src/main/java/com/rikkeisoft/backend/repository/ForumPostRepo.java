package com.rikkeisoft.backend.repository;

import com.rikkeisoft.backend.enums.PostStatus;
import com.rikkeisoft.backend.model.entity.ForumCategory;
import com.rikkeisoft.backend.model.entity.ForumPost;

import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.query.Param;

@Repository
public interface ForumPostRepo extends JpaRepository<ForumPost, Long>, JpaSpecificationExecutor<ForumPost> {
    boolean findForumPostByForumCategory(ForumCategory forumCategory);

    boolean existsByForumCategory(ForumCategory forumCategory);

    // List<ForumPost> findByAuthorId(String authorId);
    //
    // List<ForumPost> findByCategoryId(Long categoryId);
    //
    // List<ForumPost> findByJobId(Long jobId);
    //
    // List<ForumPost> findByStatus(PostStatus status);
    //
    // List<ForumPost> findByAuthorIdAndStatus(String authorId, PostStatus status);
    //
    // List<ForumPost> findByCategoryIdAndStatus(Long categoryId, PostStatus
    // status);
    //
    // List<ForumPost> findByJobIdAndStatus(Long jobId, PostStatus status);


    @Query("SELECT p FROM ForumPost p WHERE p.status = 'PUBLISHED' AND p.deletedAt IS NULL " +
           "AND p.job IS NOT NULL AND (p.job.featured = true OR p.job.highlightUntil > :now) " +
           "ORDER BY p.createdAt DESC")
    List<ForumPost> findFeaturedPosts(@Param("now") LocalDateTime now, Pageable pageable);

    
}