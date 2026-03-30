package com.rikkeisoft.backend.model.dto.req.forum;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

/**
 * Request DTO for updating an existing {@link com.rikkeisoft.backend.model.entity.ForumCategory}.
 *
 * <p>Only the {@code name} (and optionally {@code description}) can be modified.
 * The {@code slug} field is <strong>read-only</strong> and is intentionally excluded
 * from this DTO — the service layer ignores any attempt to change the slug after creation.
 * This ensures that existing URLs based on the slug remain permanently valid.
 */
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ForumCategoryUpdateReq {

    /**
     * The new display name to assign to the category.
     * Must not be blank and must be between 2 and 150 characters.
     *
     * <p>Updating the name does <strong>not</strong> regenerate the slug.
     */
    @NotBlank(message = "CATEGORY_NAME_REQUIRED")
    @Size(min = 2, max = 150, message = "CATEGORY_NAME_SIZE")
    String name;

    /**
     * The updated description for the category.
     * May be {@code null} or empty if no description is desired. Maximum 500 characters.
     */
    @Size(max = 500, message = "CATEGORY_DESCRIPTION_SIZE_CONSTRAINT")
    String description;
}
