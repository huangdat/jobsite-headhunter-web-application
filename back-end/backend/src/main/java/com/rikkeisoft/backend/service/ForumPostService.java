package com.rikkeisoft.backend.service;

import com.rikkeisoft.backend.enums.PostStatus;
import com.rikkeisoft.backend.model.dto.resp.forumpost.ForumPostResp;

public interface ForumPostService {
    ForumPostResp updateStatus(Long postId, PostStatus status);
}
