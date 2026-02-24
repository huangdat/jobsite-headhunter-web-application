package com.rikkeisoft.backend.repository;

import com.rikkeisoft.backend.enums.ForumComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForumCommentRepo extends JpaRepository<ForumComment, Long> {

    List<ForumComment> findByPostId(Long postId);

    List<ForumComment> findByParentCommentId(Long parentId);
}