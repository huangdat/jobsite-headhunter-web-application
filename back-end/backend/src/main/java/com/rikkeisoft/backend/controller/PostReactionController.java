package com.rikkeisoft.backend.controller;

import com.rikkeisoft.backend.model.dto.APIResponse;
import com.rikkeisoft.backend.model.dto.req.forum.PostReactionReq;
import com.rikkeisoft.backend.model.dto.resp.forum.ReactionResp;
import com.rikkeisoft.backend.service.PostReactionService;
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
 * {@link com.rikkeisoft.backend.model.entity.ForumPost} entities.
 *
 * <p>Exposes a single toggle endpoint that handles creating, updating, and removing
 * a user's reaction on a post in one atomic operation. Requires authentication.
 *
 * <p><strong>Note:</strong> There is NO "Share" functionality. Only the eight
 * reaction types defined in {@link com.rikkeisoft.backend.enums.ReactionType} are supported.
 *
 * <p>Base URL: {@code /api/forum/posts/reactions}
 *
 * <p>All response messages are resolved through the injected {@link MessageSource},
 * ensuring full i18n compliance with no hardcoded strings.
 */
@RestController
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequestMapping("/api/forum/posts/reactions")
public class PostReactionController {

    PostReactionService postReactionService;
    MessageSource messageSource;

    /**
     * Toggles a LinkedIn-style reaction for the currently authenticated user on a specific post.
     *
     * <p>This single endpoint covers three scenarios in one call:
     * <ul>
     *   <li><strong>No existing reaction</strong>: creates a new one → HTTP 200 + action CREATED.</li>
     *   <li><strong>Same type submitted again</strong>: removes existing → HTTP 200 + action REMOVED.</li>
     *   <li><strong>Different type submitted</strong>: updates existing → HTTP 200 + action UPDATED.</li>
     * </ul>
     *
     * <p>The response body includes the action taken, the currently active reaction type (or
     * {@code null} if removed), and the updated per-type reaction count map — enabling the
     * client to refresh the UI without a second API call.
     *
     * <p>Returns {@code 404 Not Found} if the target post does not exist or is soft-deleted.
     * Requires the user to be authenticated (any role).
     *
     * <p>HTTP: {@code POST /api/forum/posts/reactions/toggle}
     *
     * @param req    the validated request body containing {@code postId} and
     *               {@code reactionType} (one of LIKE, HAHA, CLAP, FLOWER, LOVE, SAD, ANGRY, WOW).
     * @param locale the request locale for i18n message resolution.
     * @return a {@code 200 OK} {@link APIResponse} wrapping the {@link ReactionResp},
     *         with the message resolved from key {@code "forum.post.reaction.toggled"}.
     */
    @PostMapping("/toggle")
    public APIResponse<ReactionResp> togglePostReaction(
            @Valid @RequestBody PostReactionReq req,
            Locale locale) {
        ReactionResp result = postReactionService.togglePostReaction(req);
        return APIResponse.<ReactionResp>builder()
                .status(HttpStatus.OK)
                .message(messageSource.getMessage("forum.post.reaction.toggled", null, locale))
                .result(result)
                .build();
    }
}
