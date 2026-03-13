package com.rikkeisoft.backend.model.dto.resp.forumpost;

import com.rikkeisoft.backend.enums.PostStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ForumPostResp {
    Long id;
    String authorId;
    String authorUsername;
    Long jobId;
    String title;
    String content;
    PostStatus status;
    LocalDateTime createdAt;
}
