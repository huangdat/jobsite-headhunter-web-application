package com.rikkeisoft.backend.service;

import com.rikkeisoft.backend.enums.PostStatus;
import com.rikkeisoft.backend.model.dto.PagedResponse;
import com.rikkeisoft.backend.model.dto.req.forum.PostReactionReq;
import com.rikkeisoft.backend.model.dto.req.forumpost.ForumPostDetailResp;
import com.rikkeisoft.backend.model.dto.resp.forum.ReactionResp;
import com.rikkeisoft.backend.model.dto.resp.forumpost.ForumPostResp;

import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ForumPostService {
    ForumPostResp updateStatus(Long postId, PostStatus status);


    void deletePost(Long postId);

    ForumPostDetailResp getPostDetail(Long postId);

    PagedResponse<ForumPostResp> searchPosts(String keyword, Long categoryId, Pageable pageable);

    List<ForumPostResp> getFeaturedPosts(int limit);
}
