 package com.rikkeisoft.backend.controller;

import com.rikkeisoft.backend.model.dto.APIResponse;
import com.rikkeisoft.backend.model.dto.req.forum.CommentCreateReq;
import com.rikkeisoft.backend.model.dto.req.forum.CommentUpdateReq;
import com.rikkeisoft.backend.model.dto.resp.forum.CommentTreeResp;
import com.rikkeisoft.backend.service.ForumCommentService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Locale;

/**
 * REST Controller for forum comment operations in the Forum &amp; News EPIC (EPIC 7).
 *
 * <p>Provides endpoints for adding root-level comments and nested replies, editing
 * comment content, deleting comments with dynamic permission-based logic, and
 * retrieving the complete nested comment tree for a specific post.
 *
 * <p>Write operations ({@code POST}, {@code PUT}, {@code DELETE}) require authentication.
 * The {@code GET} endpoint is publicly accessible. Security is enforced at the Spring
 * Security configuration level.
 *
 * <p>Base URL: {@code /api/v1/forum/comments}
 *
 * <p>All response messages are resolved through the injected {@link MessageSource} using
 * the request {@link Locale}, ensuring full i18n compliance.
 */
@RestController
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequestMapping("/api/forum/comments")
public class ForumCommentController {

    ForumCommentService forumCommentService;
    MessageSource messageSource;

    /**
     * Adds a new root-level comment or a nested reply to a specific post.
     *
     * <p>To submit a <strong>root-level comment</strong>, set {@code parentCommentId}
     * to {@code null} (or omit it) in the request body.
     * To submit a <strong>nested reply</strong>, set {@code parentCommentId} to the ID
     * of the comment being replied to.
     *
     * <p>The authenticated user is automatically set as the author. Returns {@code 404}
     * if the target post or parent comment is not found.
     *
     * <p>HTTP: {@code POST /api/forum/comments}
     *
     * @param req    the validated request body containing {@code postId},
     *               optional {@code parentCommentId}, and {@code content}.
     * @param locale the request locale for i18n message resolution.
     * @return a {@code 201 Created} {@link APIResponse} wrapping the new comment as a
     *         leaf {@link CommentTreeResp} node (empty replies list), with message from
     *         key {@code "forum.comment.added"}.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public APIResponse<CommentTreeResp> addComment(
            @Valid @RequestBody CommentCreateReq req,
            Locale locale) {
        CommentTreeResp result = forumCommentService.addComment(req);
        return APIResponse.<CommentTreeResp>builder()
                .status(HttpStatus.CREATED)
                .message(messageSource.getMessage("forum.comment.added", null, locale))
                .result(result)
                .build();
    }

    /**
     * Explicitly replies to a specific comment by its ID.
     *
     * <p>This endpoint is semantically equivalent to calling {@link #addComment} with a
     * non-null {@code parentCommentId}, but provides a more explicit and RESTful URL structure
     * for reply operations.
     *
     * <p>Validates that the parent comment exists, belongs to the specified post, and
     * has not been tombstoned.
     *
     * <p>HTTP: {@code POST /api/forum/comments/{parentId}/replies}
     *
     * @param parentId the surrogate primary key of the comment being replied to.
     * @param req      the validated request body with {@code postId} and {@code content}.
     * @param locale   the request locale for i18n message resolution.
     * @return a {@code 201 Created} {@link APIResponse} wrapping the new reply as a
     *         leaf {@link CommentTreeResp} node, with message from key
     *         {@code "forum.comment.reply.added"}.
     */
    @PostMapping("/{parentId}/replies")
    @ResponseStatus(HttpStatus.CREATED)
    public APIResponse<CommentTreeResp> replyToComment(
            @PathVariable Long parentId,
            @Valid @RequestBody CommentCreateReq req,
            Locale locale) {
        CommentTreeResp result = forumCommentService.replyToComment(parentId, req);
        return APIResponse.<CommentTreeResp>builder()
                .status(HttpStatus.CREATED)
                .message(messageSource.getMessage("forum.comment.reply.added", null, locale))
                .result(result)
                .build();
    }

    /**
     * Updates the text content of an existing comment.
     *
     * <p>Only the original author of the comment may perform this operation.
     * Tombstoned (deleted) comments cannot be edited.
     * Returns {@code 403 Forbidden} if the requester is not the author.
     * Returns {@code 404 Not Found} if the comment does not exist.
     * Returns {@code 400 Bad Request} if the comment is tombstoned.
     *
     * <p>HTTP: {@code PUT /api/forum/comments/{id}}
     *
     * @param id     the surrogate primary key of the comment to update.
     * @param req    the validated request body with the new {@code content}.
     * @param locale the request locale for i18n message resolution.
     * @return a {@code 200 OK} {@link APIResponse} wrapping the updated
     *         {@link CommentTreeResp} with the new content, and message from key
     *         {@code "forum.comment.updated"}.
     */
    @PutMapping("/{id}")
    public APIResponse<CommentTreeResp> updateComment(
            @PathVariable Long id,
            @Valid @RequestBody CommentUpdateReq req,
            Locale locale) {
        CommentTreeResp result = forumCommentService.updateComment(id, req);
        return APIResponse.<CommentTreeResp>builder()
                .status(HttpStatus.OK)
                .message(messageSource.getMessage("forum.comment.updated", null, locale))
                .result(result)
                .build();
    }

    /**
     * Deletes a comment using dynamic permission-aware logic.
     *
     * <p>Permission check: the requester must be an {@code ADMIN}, the author of the
     * post containing the comment, or the original author of the comment itself.
     *
     * <p>Deletion strategy:
     * <ul>
     *   <li>If the comment is a <strong>leaf node</strong> (no replies): hard delete.</li>
     *   <li>If the comment has <strong>child replies</strong>: tombstone — content is
     *       replaced with a localized "Comment deleted" string.</li>
     * </ul>
     *
     * <p>HTTP: {@code DELETE /api/forum/comments/{id}}
     *
     * @param id     the surrogate primary key of the comment to delete.
     * @param locale the request locale for i18n message resolution.
     * @return a {@code 200 OK} {@link APIResponse} with no result body and message from
     *         key {@code "forum.comment.deleted"}.
     */
    @DeleteMapping("/{id}")
    public APIResponse<Void> deleteComment(
            @PathVariable Long id,
            Locale locale) {
        forumCommentService.deleteComment(id);
        return APIResponse.<Void>builder()
                .status(HttpStatus.OK)
                .message(messageSource.getMessage("forum.comment.deleted", null, locale))
                .build();
    }

    /**
     * Retrieves the complete nested comment tree for a specific news post.
     *
     * <p>Returns an ordered list of root-level {@link CommentTreeResp} nodes, where each node
     * recursively contains its replies in the {@code replies} field. Tombstoned comments
     * are included in the tree (with their content replaced by a placeholder) to preserve
     * thread structure.
     *
     * <p>If the caller is authenticated, the {@code currentUserReaction} field in each
     * comment node is populated from the caller's account ID.
     *
     * <p>HTTP: {@code GET /api/forum/comments/post/{postId}}
     *
     * @param postId         the surrogate primary key of the post whose comments are to be
     *                       fetched.
     * @param authentication the Spring Security authentication context; used to extract the
     *                       account ID for populating {@code currentUserReaction}; may be
     *                       {@code null} for anonymous requests.
     * @param locale         the request locale for i18n message resolution.
     * @return a {@code 200 OK} {@link APIResponse} wrapping the root-level comment tree as a
     *         {@link List} of {@link CommentTreeResp}, with message from key
     *         {@code "forum.comment.tree.success"}.
     */
    @GetMapping("/post/{postId}")
    public APIResponse<List<CommentTreeResp>> getCommentTree(
            @PathVariable Long postId,
            Authentication authentication,
            Locale locale) {
        String currentAccountId = (authentication != null) ? authentication.getName() : null;
        List<CommentTreeResp> result = forumCommentService.getCommentTree(postId, currentAccountId);
        return APIResponse.<List<CommentTreeResp>>builder()
                .status(HttpStatus.OK)
                .message(messageSource.getMessage("forum.comment.tree.success", null, locale))
                .result(result)
                .build();
    }
}
