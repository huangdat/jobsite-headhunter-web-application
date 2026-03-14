package com.rikkeisoft.backend.repository;

import com.rikkeisoft.backend.enums.PostStatus;
import com.rikkeisoft.backend.model.entity.ForumPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForumPostRepo extends JpaRepository<ForumPost, Long> {

    List<ForumPost> findByAuthorId(String authorId);

    List<ForumPost> findByCategoryId(Long categoryId);

    List<ForumPost> findByJobId(Long jobId);

    List<ForumPost> findByStatus(PostStatus status);

    List<ForumPost> findByAuthorIdAndStatus(String authorId, PostStatus status);

    List<ForumPost> findByCategoryIdAndStatus(Long categoryId, PostStatus status);

    List<ForumPost> findByJobIdAndStatus(Long jobId, PostStatus status);
}