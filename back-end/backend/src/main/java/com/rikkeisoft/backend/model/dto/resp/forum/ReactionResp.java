package com.rikkeisoft.backend.model.dto.resp.forum;

import com.rikkeisoft.backend.enums.ReactionType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Response DTO encapsulating the result of a reaction toggle operation on a post or comment.
 *
 * <p>Returned by both {@code POST /api/news/posts/reactions/toggle} and
 * {@code POST /api/forum/comments/reactions/toggle} after successfully processing
 * a toggle reaction request.
 *
 * <p>The {@code action} field informs the client what happened so it can update
 * the UI accordingly without needing to refetch the full post or comment tree.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReactionResp {

    /**
     * Enum describing the outcome of the toggle reaction operation.
     */
    public enum Action {
        /** A new reaction was created for this user. */
        CREATED,
        /** The user's existing reaction was removed (toggled off). */
        REMOVED,
        /** The user's existing reaction type was changed to a new type. */
        UPDATED
    }

    /**
     * The outcome of the toggle operation: {@code CREATED}, {@code REMOVED}, or {@code UPDATED}.
     */
    Action action;

    /**
     * The reaction type that is now active for the user after this operation.
     * {@code null} if the reaction was removed ({@code action = REMOVED}).
     */
    ReactionType activeReactionType;

    /**
     * The updated total count for each reaction type on the target resource
     * (post or comment). Only types with at least one reaction are included.
     * Used to update reaction counters in the UI without a full page refresh.
     * Example: {@code {LIKE=12, LOVE=3, CLAP=7}}.
     */
    Map<ReactionType, Long> updatedReactionCounts;

    /** The timestamp at which the reaction was processed. */
    LocalDateTime processedAt;
}
