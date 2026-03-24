package com.rikkeisoft.backend.service;

import com.rikkeisoft.backend.model.dto.req.forum.PostReactionReq;
import com.rikkeisoft.backend.model.dto.resp.forum.ReactionResp;

/**
 * Service interface for managing LinkedIn-style reactions on
 * {@link com.rikkeisoft.backend.model.entity.ForumPost} entities.
 *
 * <p>The reaction toggle operation is the only operation in this service. Reaction
 * counts are embedded in the forum post detail response DTO.
 *
 * <p><strong>Note:</strong> There is NO "Share" functionality in this system.
 */
public interface PostReactionService {

    /**
     * Toggles a LinkedIn-style reaction for the currently authenticated user on
     * a specific forum post.
     *
     * <p>The toggle logic is as follows:
     * <ol>
     *   <li>Look up any existing {@link com.rikkeisoft.backend.model.entity.PostReaction}
     *       for the (post, user) pair.</li>
     *   <li>If <em>no existing reaction</em>: create a new one with the given type →
     *       return {@link ReactionResp.Action#CREATED}.</li>
     *   <li>If existing reaction is the <em>same type</em>: delete it →
     *       return {@link ReactionResp.Action#REMOVED}.</li>
     *   <li>If existing reaction is a <em>different type</em>: update it →
     *       return {@link ReactionResp.Action#UPDATED}.</li>
     * </ol>
     *
     * <p>The response includes an updated reaction count map so the UI can refresh
     * counters without an additional API call.
     *
     * <p>Throws {@link com.rikkeisoft.backend.exception.AppException} with error code
     * {@code POST_NOT_FOUND} if the target post does not exist or is soft-deleted.
     *
     * @param req the reaction request containing {@code postId} and {@code reactionType}.
     * @return a {@link ReactionResp} describing the {@code action} taken
     *         ({@code CREATED}, {@code REMOVED}, or {@code UPDATED}), the currently active
     *         reaction type (or {@code null} if removed), and the updated aggregate reaction counts.
     */
    ReactionResp togglePostReaction(PostReactionReq req);
}
