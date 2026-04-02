package com.rikkeisoft.backend.model.dto.req.news;

import com.rikkeisoft.backend.enums.PostStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
public class NewsPostCreateReq {
    @NotBlank(message = "NEWS_TITLE_REQUIRED")
    @Size(max = 200, message = "NEWS_TITLE_TOO_LONG")
    String title;

    String shortDescription;

    @NotNull(message = "NEWS_CATEGORY_REQUIRED")
    Long categoryId;

    String imageUrl;

    @NotBlank(message = "NEWS_CONTENT_REQUIRED")
    String content;

    PostStatus status;
}
