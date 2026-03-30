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

    @Override
    @Transactional
    public ForumPostResp updateStatus(Long postId, PostStatus newStatus) {
        ForumPost post = findPostById(postId);
        Account currentAccount = getCurrentAccount();

        validatePermission(currentAccount, post);

        if (post.getStatus() == newStatus) {
            return forumPostMapper.toForumPostResp(post);
        }

        post.setStatus(newStatus);
        forumPostRepo.save(post);
        return forumPostMapper.toForumPostResp(post);
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
