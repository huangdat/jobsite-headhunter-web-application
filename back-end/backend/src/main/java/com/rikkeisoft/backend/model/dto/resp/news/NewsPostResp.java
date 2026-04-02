package com.rikkeisoft.backend.model.dto.resp.news;

import com.rikkeisoft.backend.enums.PostStatus;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NewsPostResp {
    Long id;
    String title;
    String shortDescription;
    Long categoryId;
    String categoryName;
    String imageUrl;
    String content;
    PostStatus status;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
