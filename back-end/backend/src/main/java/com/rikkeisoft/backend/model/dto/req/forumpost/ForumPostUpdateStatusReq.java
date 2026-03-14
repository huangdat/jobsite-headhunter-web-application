package com.rikkeisoft.backend.model.dto.req.forumpost;

import com.rikkeisoft.backend.enums.PostStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ForumPostUpdateStatusReq {
    @NotNull(message = "INVALID_POST_STATUS")
    PostStatus status;
}
