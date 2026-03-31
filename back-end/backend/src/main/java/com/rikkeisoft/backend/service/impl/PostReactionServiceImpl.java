// ===== PostReactionServiceImpl.java =====

package com.rikkeisoft.backend.service.impl;

import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.enums.ReactionType;
import com.rikkeisoft.backend.exception.AppException;
import com.rikkeisoft.backend.model.dto.req.forum.PostReactionReq;
import com.rikkeisoft.backend.model.dto.resp.forum.ReactionResp;
import com.rikkeisoft.backend.model.entity.Account;
import com.rikkeisoft.backend.model.entity.ForumPost;
import com.rikkeisoft.backend.model.entity.PostReaction;
import com.rikkeisoft.backend.repository.AccountRepo;
import com.rikkeisoft.backend.repository.ForumPostRepo;
import com.rikkeisoft.backend.repository.PostReactionRepo;
import com.rikkeisoft.backend.service.PostReactionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class PostReactionServiceImpl implements PostReactionService {

    ForumPostRepo forumPostRepo;
    PostReactionRepo postReactionRepo;
    AccountRepo accountRepo;

    @Override
    @Transactional
    public ReactionResp togglePostReaction(PostReactionReq req, String userId) {

        // Step 0: Fetch account first
        Account account = accountRepo.findByUsername(userId)
                .orElseThrow(() -> {
                    log.warn("Account not found with username: {}", userId);
                    return new AppException(ErrorCode.ACCOUNT_NOT_FOUND);
                });

        // Step 1: Validate post exists and status is VISIBLE
        ForumPost post = forumPostRepo.findById(req.getPostId())
                .orElseThrow(() -> {
                    log.warn("Post not found with id: {}", req.getPostId());
                    return new AppException(ErrorCode.POST_NOT_FOUND);
                });

        if (post.getStatus() == null ||
                !post.getStatus().name().equals("PUBLISHED")) {
            log.warn("Post is not visible. PostId: {}, Status: {}",
                    req.getPostId(), post.getStatus());
            throw new AppException(ErrorCode.POST_NOT_FOUND);
        }

        // Step 2: Validate reaction type
        ReactionType reactionType = req.getReactionType();
        if (reactionType == null) {
            log.warn("Invalid reaction type for user: {} on post: {}", userId, req.getPostId());
            throw new AppException(ErrorCode.REACTION_TYPE_INVALID);
        }

        // Step 3: Find existing reaction
        Optional<PostReaction> existingReaction = postReactionRepo.findByPostIdAndAccountId(req.getPostId(), account.getId());

        ReactionResp.Action action;

        if (existingReaction.isEmpty()) {
            // Step 4: CREATE new reaction
            action = createReaction(post, account, reactionType);
        } else {
            PostReaction existing = existingReaction.get();
            if (existing.getReactionType() == reactionType) {
                // Step 6: REMOVE reaction (same type)
                action = removeReaction(existing, userId, req.getPostId());
            } else {
                // Step 7: UPDATE reaction (different type)
                action = updateReaction(existing, reactionType, userId, req.getPostId());
            }
        }

        // Step 8: Calculate reaction counts
        Map<ReactionType, Long> countMap = getReactionCounts(req.getPostId());

        // Step 9: Build response
        ReactionType activeType = action == ReactionResp.Action.REMOVED ? null : reactionType;

        ReactionResp response = ReactionResp.builder()
                .action(action)
                .activeReactionType(activeType)
                .updatedReactionCounts(countMap)
                .processedAt(LocalDateTime.now())
                .build();

        log.info("Reaction toggle completed. UserId: {}, PostId: {}, Action: {}, Type: {}",
                userId, req.getPostId(), action, reactionType);

        return response;
    }

    private ReactionResp.Action createReaction(ForumPost post, Account account, ReactionType reactionType) {
        PostReaction newReaction = PostReaction.builder()
                .post(post)
                .account(account)
                .reactionType(reactionType)
                .reactedAt(LocalDateTime.now())
                .build();

        postReactionRepo.save(newReaction);
        log.info("New reaction created. AccountId: {}, PostId: {}, Type: {}",
                account.getId(), post.getId(), reactionType);

        return ReactionResp.Action.CREATED;
    }

    private ReactionResp.Action removeReaction(PostReaction existing, String userId, Long postId) {
        postReactionRepo.delete(existing);
        log.info("Reaction removed. UserId: {}, PostId: {}, Type: {}",
                userId, postId, existing.getReactionType());

        return ReactionResp.Action.REMOVED;
    }

    private ReactionResp.Action updateReaction(PostReaction existing, ReactionType newType,
            String userId, Long postId) {
        ReactionType oldType = existing.getReactionType();
        existing.setReactionType(newType);
        existing.setReactedAt(LocalDateTime.now());

        postReactionRepo.save(existing);
        log.info("Reaction updated. UserId: {}, PostId: {}, OldType: {}, NewType: {}",
                userId, postId, oldType, newType);

        return ReactionResp.Action.UPDATED;
    }

    private Map<ReactionType, Long> getReactionCounts(Long postId) {
        List<Object[]> rawCounts = postReactionRepo.countReactionsByTypeForPost(postId);

        Map<ReactionType, Long> countMap = new HashMap<>();
        for (Object[] row : rawCounts) {
            ReactionType type = (ReactionType) row[0];
            Long count = (Long) row[1];
            if (count != null && count > 0) {
                countMap.put(type, count);
            }
        }

        return countMap;
    }

}