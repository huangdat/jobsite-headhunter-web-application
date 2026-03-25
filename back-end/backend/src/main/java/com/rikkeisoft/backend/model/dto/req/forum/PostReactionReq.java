package com.rikkeisoft.backend.model.dto.req.forum;

import com.rikkeisoft.backend.enums.ReactionType;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

/**
 * Request DTO for toggling a LinkedIn-style reaction on a
 * {@link com.rikkeisoft.backend.model.entity.ForumPost}.
 *
 * <p>Reaction behaviour is toggle-based:
 * <ul>
 *   <li>If the authenticated user has <strong>no existing reaction</strong> on this post,
 *       a new reaction of the given type is created.</li>
 *   <li>If the user already has a reaction of the <strong>same type</strong>, it is
 *       <strong>removed</strong> (toggle off).</li>
 *   <li>If the user already has a reaction of a <strong>different type</strong>, it is
 *       <strong>replaced</strong> with the new type.</li>
 * </ul>
 *
 * <p>The authenticated user's identity is resolved from the Spring Security context
 * at the service layer; the client must not send a user ID.
 *
 * <p><strong>Note:</strong> There is NO "Share" functionality. Only the eight
 * {@link ReactionType} values are accepted.
 */
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostReactionReq {

    /**
     * The ID of the {@link com.rikkeisoft.backend.model.entity.ForumPost} to react to.
     * Must not be null.
     */
    @NotNull(message = "REACTION_POST_ID_REQUIRED")
    Long postId;

    /**
     * The type of reaction the user wishes to express.
     * Must be one of: {@code LIKE, HAHA, CLAP, FLOWER, LOVE, SAD, ANGRY, WOW}.
     * Must not be null.
     *
     * @see ReactionType
     */
    @NotNull(message = "REACTION_TYPE_REQUIRED")
    ReactionType reactionType;
}
