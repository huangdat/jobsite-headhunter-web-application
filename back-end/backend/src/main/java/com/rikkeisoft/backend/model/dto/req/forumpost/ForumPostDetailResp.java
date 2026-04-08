package com.rikkeisoft.backend.model.dto.req.forumpost;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.rikkeisoft.backend.enums.PostStatus;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ForumPostDetailResp {
    Long id;
    String title;
    String content;
    AuthorDto authorInfo;
    LocalDateTime createdAt;
    Long viewCount;
    Long commentCount;
    PostStatus status;
    JobBasicDto job;
}
