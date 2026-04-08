package com.rikkeisoft.backend.service;

import com.rikkeisoft.backend.model.dto.req.forum.CommentCreateReq;
import com.rikkeisoft.backend.model.dto.req.forum.CommentUpdateReq;
import com.rikkeisoft.backend.model.dto.resp.forum.CommentTreeResp;

import java.util.List;

/**
 * Service interface defining all business operations for managing
 * {@link com.rikkeisoft.backend.model.entity.ForumComment} entities
 * in the Forum &amp; News EPIC.
 *
 * <p>Comments support unlimited nesting depth through a self-referential parent-child
 * relationship. The tree is built in-memory by the service layer from a flat database
 * result set using an O(n) HashMap-based algorithm.
 *
 * <p>The deletion strategy follows a dynamic rule:
 * <ul>
 *   <li>Leaf node (no replies): <strong>hard deleted</strong> from the database.</li>
 *   <li>Internal node (has replies): <strong>tombstoned</strong> — content replaced with
 *       a localized "Comment deleted" string and the {@code deleted} flag set to {@code true}.</li>
 * </ul>
 */
public interface ForumCommentService {

    /**
     * Adds a new comment to a news post, either as a root-level comment or as a
     * nested reply to an existing comment.
     *
     * <p>The author is resolved from the Spring Security context — the client must not
     * send an author ID. Validates that the target post exists and is not soft-deleted.
     * If {@code parentCommentId} is provided, validates that the parent comment exists,
     * belongs to the same post, and is not tombstoned.
     *
     * <p>Throws {@code POST_NOT_FOUND} if the post does not exist.
     * Throws {@code COMMENT_NOT_FOUND} if the parent comment ID is invalid.
     *
     * @param req the create payload containing {@code postId}, optional {@code parentCommentId},
     *            and {@code content}.
     * @return a {@link CommentTreeResp} representing the newly created comment as a leaf node
     *         with an empty {@code replies} list.
     */
    CommentTreeResp addComment(CommentCreateReq req);

    /**
     * Replies to an existing comment. Semantically equivalent to calling
     * {@link #addComment(CommentCreateReq)} with a non-null {@code parentCommentId},
     * but provided as a dedicated method to make the API intent explicit.
     *
     * <p>Validates that the parent comment exists, belongs to the specified post,
     * and has not been tombstoned. The author is resolved from the security context.
     *
     * <p>Throws {@code COMMENT_NOT_FOUND} if the parent comment does not exist or
     * belongs to a different post.
     *
     * @param parentCommentId the surrogate primary key of the comment being replied to.
     * @param req             the reply payload containing {@code postId} and {@code content}.
     * @return a {@link CommentTreeResp} representing the new reply as a leaf node.
     */
    CommentTreeResp replyToComment(Long parentCommentId, CommentCreateReq req);

    /**
     * Updates the text content of an existing, non-tombstoned comment.
     *
     * <p>Only the original author of the comment may edit it. Attempting to edit a
     * tombstoned comment throws {@code COMMENT_DELETED}. Attempting to edit another
     * user's comment throws {@code FORBIDDEN}.
     *
     * <p>Throws {@code COMMENT_NOT_FOUND} if the comment does not exist.
     *
     * @param commentId the surrogate primary key of the comment to update.
     * @param req       the update payload containing the new {@code content}.
     * @return a {@link CommentTreeResp} reflecting the updated comment content.
     *         The {@code replies} list is populated for context.
     */
    CommentTreeResp updateComment(Long commentId, CommentUpdateReq req);

    /**
     * Deletes a comment using dynamic permission-aware logic:
     *
     * <p>Permission validation order (any one of the following is sufficient):
     * <ol>
     *   <li>The requesting user is an {@code ADMIN}.</li>
     *   <li>The requesting user is the author of the news post that contains the comment.</li>
     *   <li>The requesting user is the original author of the comment itself.</li>
     * </ol>
     *
     * <p>Deletion mode is determined by whether the comment has existing replies:
     * <ul>
     *   <li><strong>Leaf node</strong> (no replies): the database row is permanently removed.</li>
     *   <li><strong>Internal node</strong> (has one or more replies): the {@code content} field
     *       is replaced with a localized tombstone message and the {@code deleted} flag is set to
     *       {@code true}. The row is preserved to maintain tree structure.</li>
     * </ul>
     *
     * <p>Throws {@code COMMENT_NOT_FOUND} if the comment does not exist.
     * Throws {@code FORBIDDEN} if the requesting user does not meet any permission criteria.
     *
     * @param commentId the surrogate primary key of the comment to delete.
     */
    void deleteComment(Long commentId);

    /**
     * Retrieves the complete comment tree for a given news post as a hierarchical list.
     *
     * <p>All comments (including tombstoned ones) are fetched from the database in a
     * single query ordered by {@code createdAt}. They are then assembled in-memory into
     * a tree using a HashMap indexed by comment ID. Root-level comments ({@code parentCommentId = null})
     * form the top-level list; replies are recursively nested into their parents' {@code replies} lists.
     *
     * <p>Tombstoned comments are included in the tree with their original content replaced
     * by a localized placeholder and {@code deleted = true}, so that ongoing reply threads
     * remain coherent.
     *
     * <p>Throws {@code POST_NOT_FOUND} if the post does not exist or is soft-deleted.
     *
     * @param postId           the surrogate primary key of the post whose comments are to be fetched.
     * @param currentAccountId the UUID string ID of the requesting account, used to populate
     *                         {@code currentUserReaction} in each {@link CommentTreeResp} node;
     *                         may be {@code null} for unauthenticated requests.
     * @return a list of root-level {@link CommentTreeResp} nodes, each with their
     *         fully populated {@code replies} trees.
     */
    List<CommentTreeResp> getCommentTree(Long postId, String currentAccountId);
}
