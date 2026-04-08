package com.rikkeisoft.backend.controller;

import com.rikkeisoft.backend.model.dto.APIResponse;
import com.rikkeisoft.backend.model.dto.req.forum.CommentReactionReq;
import com.rikkeisoft.backend.model.dto.resp.forum.ReactionResp;
import com.rikkeisoft.backend.service.CommentReactionService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Locale;

/**
 * REST Controller for managing LinkedIn-style reactions on
 * {@link com.rikkeisoft.backend.model.entity.ForumComment} entities.
 *
 * <p>Exposes a single toggle endpoint that handles creating, updating, and removing
 * a user's reaction on a comment atomically. Requires authentication.
 *
 * <p>Reacting to tombstoned (deleted) comments is explicitly rejected by the service
 * layer with an appropriate error response.
 *
 * <p>Base URL: {@code /api/v1/forum/comments/reactions}
 *
 * <p>All response messages are resolved through the injected {@link MessageSource},
 * ensuring full i18n compliance.
 */
@RestController
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequestMapping("/api/forum/comments/reactions")
public class CommentReactionController {

    CommentReactionService commentReactionService;
    MessageSource messageSource;

    /**
     * Toggles a LinkedIn-style reaction for the currently authenticated user on a
     * specific forum comment.
     *
     * <p>This single endpoint covers three scenarios:
     * <ul>
     *   <li><strong>No existing reaction</strong>: creates a new one → action CREATED.</li>
     *   <li><strong>Same type submitted again</strong>: removes it → action REMOVED.</li>
     *   <li><strong>Different type submitted</strong>: updates the type → action UPDATED.</li>
     * </ul>
     *
     * <p>The response includes the action taken, the currently active reaction type (or
     * {@code null} if removed), and the updated per-type reaction count map, allowing the
     * client to refresh the comment's reaction UI without re-fetching the entire comment tree.
     *
     * <p>Returns {@code 404 Not Found} if the comment does not exist.
     * Returns {@code 400 Bad Request} if the target comment is tombstoned.
     * Requires the user to be authenticated (any role).
     *
     * <p>HTTP: {@code POST /api/forum/comments/reactions/toggle}
     *
     * @param req    the validated request body containing {@code commentId} and
     *               {@code reactionType} (one of LIKE, HAHA, CLAP, FLOWER, LOVE, SAD, ANGRY, WOW).
     * @param locale the request locale for i18n message resolution.
     * @return a {@code 200 OK} {@link APIResponse} wrapping the {@link ReactionResp},
     *         with message from key {@code "forum.comment.reaction.toggled"}.
     */
    @PostMapping("/toggle")
    public APIResponse<ReactionResp> toggleCommentReaction(
            @Valid @RequestBody CommentReactionReq req,
            Locale locale) {
        ReactionResp result = commentReactionService.toggleCommentReaction(req);
        return APIResponse.<ReactionResp>builder()
                .status(HttpStatus.OK)
                .message(messageSource.getMessage("forum.comment.reaction.toggled", null, locale))
                .result(result)
                .build();
    }
}
