package com.rikkeisoft.backend.service;

import com.rikkeisoft.backend.model.dto.req.forum.CommentReactionReq;
import com.rikkeisoft.backend.model.dto.resp.forum.ReactionResp;

/**
 * Service interface for managing LinkedIn-style reactions on
 * {@link com.rikkeisoft.backend.model.entity.ForumComment} entities.
 *
 * <p>The toggle logic mirrors {@link PostReactionService}: a single endpoint handles
 * creating, updating, and removing a user's reaction on a comment.
 *
 * <p>Reaction counts for each comment are embedded in the {@link com.rikkeisoft.backend.model.dto.resp.forum.CommentTreeResp}
 * nodes returned by the comment tree endpoint.
 */
public interface CommentReactionService {

    /**
     * Toggles a LinkedIn-style reaction for the currently authenticated user on
     * a specific forum comment.
     *
     * <p>The toggle logic is as follows:
     * <ol>
     *   <li>Look up any existing {@link com.rikkeisoft.backend.model.entity.CommentReaction}
     *       for the (comment, user) pair.</li>
     *   <li>If <em>no existing reaction</em>: create a new one with the given type →
     *       return {@link ReactionResp.Action#CREATED}.</li>
     *   <li>If existing reaction is the <em>same type</em>: delete it →
     *       return {@link ReactionResp.Action#REMOVED}.</li>
     *   <li>If existing reaction is a <em>different type</em>: update its type →
     *       return {@link ReactionResp.Action#UPDATED}.</li>
     * </ol>
     *
     * <p>The response contains an updated reaction count map so the client can
     * refresh the comment reaction UI without a full comment tree refetch.
     *
     * <p>Throws {@link com.rikkeisoft.backend.exception.AppException} with error code
     * {@code COMMENT_NOT_FOUND} if the target comment does not exist.
     * Throws {@code COMMENT_DELETED} if the target comment is tombstoned — reactions
     * on deleted comment stubs are not permitted.
     *
     * @param req the reaction request containing {@code commentId} and {@code reactionType}.
     * @return a {@link ReactionResp} with the toggle action, the active reaction type
     *         (or {@code null} if removed), and the updated per-type reaction counts.
     */
    ReactionResp toggleCommentReaction(CommentReactionReq req);
}
