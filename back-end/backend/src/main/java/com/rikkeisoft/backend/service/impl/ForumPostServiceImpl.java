package com.rikkeisoft.backend.service.impl;

import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.enums.PostStatus;
import com.rikkeisoft.backend.enums.ReactionType;
import com.rikkeisoft.backend.enums.Role;
import com.rikkeisoft.backend.exception.AppException;
import com.rikkeisoft.backend.mapper.ForumPostMapper;
import com.rikkeisoft.backend.model.dto.req.forum.PostReactionReq;
import com.rikkeisoft.backend.model.dto.resp.forum.ReactionResp;
import com.rikkeisoft.backend.model.dto.resp.forumpost.ForumPostResp;
import com.rikkeisoft.backend.model.entity.Account;
import com.rikkeisoft.backend.model.entity.ForumPost;
import com.rikkeisoft.backend.model.entity.PostReaction;
import com.rikkeisoft.backend.repository.AccountRepo;
import com.rikkeisoft.backend.repository.ForumPostRepo;
import com.rikkeisoft.backend.repository.PostReactionRepo;
import com.rikkeisoft.backend.service.ForumPostService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Map;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class ForumPostServiceImpl implements ForumPostService {

    ForumPostRepo forumPostRepo;
    AccountRepo accountRepo;
    ForumPostMapper forumPostMapper;
    PostReactionRepo postReactionRepo;

    /**
     * Valid status transitions:
     * - ADMIN: can set any status freely
     * - HEADHUNTER (own post only): DRAFT → PUBLISHED, PUBLISHED → ARCHIVED
     * (HEADHUNTER cannot revert PUBLISHED → DRAFT or ARCHIVED → *)
     */
    private static final Map<PostStatus, Set<PostStatus>> HEADHUNTER_ALLOWED_TRANSITIONS = Map.of(
            PostStatus.DRAFT, Set.of(PostStatus.PUBLISHED),
            PostStatus.PUBLISHED, Set.of(PostStatus.ARCHIVED),
            PostStatus.ARCHIVED, Set.of());

    @Override
    @Transactional
    public ForumPostResp updateStatus(Long postId, PostStatus newStatus) {
        ForumPost post = findPostById(postId);
        Account currentAccount = getCurrentAccount();

        Set<String> roles = currentAccount.getRoles();
        boolean isAdmin = roles.contains(Role.ADMIN.name());
        boolean isHeadhunter = roles.contains(Role.HEADHUNTER.name());
        boolean isPostOwner = post.getAuthor().getId().equals(currentAccount.getId());
        if (!isAdmin && (!isHeadhunter || !isPostOwner)) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }
        if (post.getStatus() == newStatus) {
            return forumPostMapper.toForumPostResp(post);
        }
        if (!isAdmin) {
            Set<PostStatus> allowed = HEADHUNTER_ALLOWED_TRANSITIONS.getOrDefault(post.getStatus(), Set.of());
            if (!allowed.contains(newStatus)) {
                throw new AppException(ErrorCode.INVALID_POST_STATUS);
            }
        }

        post.setStatus(newStatus);
        forumPostRepo.save(post);
        return forumPostMapper.toForumPostResp(post);
    }

    @Override
    @Transactional
    public void deletePost(Long postId) {
        ForumPost post = findPostById(postId);
        Account currentAccount = getCurrentAccount();
        if (!currentAccount.getRoles().contains(Role.ADMIN.name())) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }
        if (post.getDeletedAt() != null) {
            throw new AppException(ErrorCode.POST_ALREADY_DELETED);
        }
        post.setDeletedAt(java.time.LocalDateTime.now());
        forumPostRepo.save(post);
    }

    private ForumPost findPostById(Long postId) {
        return forumPostRepo.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.FORUM_POST_NOT_FOUND));
    }

    private Account getCurrentAccount() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return accountRepo.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));
    }

    private void validatePermission(Account account, ForumPost post) {
        Set<String> roles = account.getRoles();
        boolean isAdmin = roles.contains(Role.ADMIN.name());
        boolean isHeadhunter = roles.contains(Role.HEADHUNTER.name());

        if (!isAdmin && !isHeadhunter) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        if (isHeadhunter && !isAdmin && !post.getAuthor().getId().equals(account.getId())) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }
    }



}
