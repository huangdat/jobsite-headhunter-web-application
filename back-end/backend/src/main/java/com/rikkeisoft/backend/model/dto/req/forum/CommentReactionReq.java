package com.rikkeisoft.backend.model.dto.req.forum;

import com.rikkeisoft.backend.enums.ReactionType;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

/**
 * Request DTO for toggling a LinkedIn-style reaction on a
 * {@link com.rikkeisoft.backend.model.entity.ForumComment}.
 *
 * <p>Reaction behaviour mirrors the post reaction toggle logic:
 * <ul>
 *   <li>No existing reaction → creates a new reaction of the given type.</li>
 *   <li>Same type as existing → deletes the existing reaction (toggle off).</li>
 *   <li>Different type from existing → updates the existing reaction's type.</li>
 * </ul>
 *
 * <p>The authenticated user's identity is resolved from the Spring Security context;
 * the client must not send a user ID directly.
 *
 * <p>The same eight {@link ReactionType} values available for post reactions are
 * also available for comment reactions.
 */
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentReactionReq {

    /**
     * The ID of the {@link com.rikkeisoft.backend.model.entity.ForumComment} to react to.
     * Must not be null.
     */
    @NotNull(message = "REACTION_COMMENT_ID_REQUIRED")
    Long commentId;

    /**
     * The type of reaction the user wishes to express on the comment.
     * Must be one of: {@code LIKE, HAHA, CLAP, FLOWER, LOVE, SAD, ANGRY, WOW}.
     * Must not be null.
     *
     * @see ReactionType
     */
    @NotNull(message = "REACTION_TYPE_REQUIRED")
    ReactionType reactionType;
}
