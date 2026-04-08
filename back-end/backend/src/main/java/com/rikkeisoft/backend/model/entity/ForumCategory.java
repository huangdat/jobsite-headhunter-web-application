package com.rikkeisoft.backend.model.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

/**
 * Persistent entity representing a Forum Category.
 *
 * <p>Each category groups related {@link ForumPost} articles together. A category
 * has a human-readable {@code name} and a URL-safe {@code slug} that is
 * <strong>automatically generated</strong> from the name at creation time and is
 * thereafter read-only — it cannot be changed via the update endpoint.
 *
 * <p>Categories support soft-deletion: when deleted, the {@code softDeleted} flag
 * is set to {@code true} instead of physically removing the row, preserving referential
 * integrity with existing posts. An inactive category (active = false) is hidden from
 * public listings but still accessible by administrators.
 */
@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "forum_category")
public class ForumCategory {

    /** Auto-generated surrogate primary key. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    /**
     * The display name of the category as entered by the administrator.
     * Example: "Kinh nghiệm phỏng vấn".
     */
    @Column(name = "name", nullable = false, length = 255)
    String name;

    /**
     * URL-safe slug derived from {@code name} at creation time.
     * Example: "kinh-nghiem-phong-van".
     * This field is immutable after creation; the update endpoint does NOT modify it.
     */
    @Column(name = "slug", nullable = false, unique = true, length = 255)
    String slug;

    /**
     * Optional human-readable description of the category's purpose.
     */
    @Column(name = "description", columnDefinition = "TEXT")
    String description;

    /**
     * Indicates whether this category is publicly visible.
     * Toggled by the category toggle-status endpoint.
     * Defaults to {@code true} upon creation.
     */
    @Builder.Default
    @Column(name = "active", nullable = false)
    boolean active = true;

    /**
     * Soft-delete flag. When {@code true}, the category is logically deleted
     * and excluded from all public queries. Physical deletion is not performed.
     */
    @Builder.Default
    @Column(name = "soft_deleted", nullable = false)
    boolean softDeleted = false;

    /** Timestamp of when this category was first created. */
    @Column(name = "created_at")
    LocalDateTime createdAt;

    /** Timestamp of the most recent update to this category. */
    @Column(name = "updated_at")
    LocalDateTime updatedAt;
}
