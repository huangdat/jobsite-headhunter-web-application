package com.rikkeisoft.backend.model.dto.resp.forum;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

/**
 * Response DTO representing a single {@link com.rikkeisoft.backend.model.entity.ForumCategory}.
 *
 * <p>Returned by all category endpoints (create, update, search, toggle status).
 * Exposes the auto-generated slug and active/soft-delete state so the client can
 * determine whether the category is currently public-facing.
 *
 * <p>Entities are never returned directly in API responses; this DTO is mapped from
 * the {@link com.rikkeisoft.backend.model.entity.ForumCategory} entity by the service layer.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ForumCategoryResp {

    /** The surrogate primary key of the category. */
    Long id;

    /**
     * The human-readable display name of the category.
     * Example: "Kinh nghiệm phỏng vấn".
     */
    String name;

    /**
     * The auto-generated, immutable URL-safe slug derived from the name.
     * Example: "kinh-nghiem-phong-van".
     */
    String slug;

    /** Optional description of the category's purpose. */
    String description;

    /**
     * Whether this category is publicly visible ({@code true}) or hidden ({@code false}).
     * Toggled by the admin toggle-status endpoint.
     */
    boolean active;

    /** Whether this category has been soft-deleted and is no longer usable. */
    boolean softDeleted;

    /** Timestamp of category creation. */
    LocalDateTime createdAt;

    /** Timestamp of the most recent modification. */
    LocalDateTime updatedAt;
}
