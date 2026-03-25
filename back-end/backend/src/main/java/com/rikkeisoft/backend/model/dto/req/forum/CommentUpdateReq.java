package com.rikkeisoft.backend.model.dto.req.forum;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

/**
 * Request DTO for editing the content of an existing
 * {@link com.rikkeisoft.backend.model.entity.ForumComment}.
 *
 * <p>Only the {@code content} field can be updated. The comment's author, post,
 * parent, and timestamps are immutable. The service layer validates that the
 * currently authenticated user is the original author of the comment before
 * applying the update.
 *
 * <p>A deleted (tombstoned) comment cannot be edited.
 */
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentUpdateReq {

    /**
     * The new textual content to replace the existing comment body.
     * Must not be blank and must be between 1 and 2000 characters.
     */
    @NotBlank(message = "COMMENT_CONTENT_REQUIRED")
    @Size(min = 1, max = 2000, message = "COMMENT_CONTENT_SIZE")
    String content;
}
