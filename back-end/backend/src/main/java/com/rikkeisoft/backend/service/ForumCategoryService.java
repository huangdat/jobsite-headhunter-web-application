package com.rikkeisoft.backend.service;

import com.rikkeisoft.backend.model.dto.req.forum.ForumCategoryCreateReq;
import com.rikkeisoft.backend.model.dto.req.forum.ForumCategoryUpdateReq;
import com.rikkeisoft.backend.model.dto.resp.forum.ForumCategoryResp;
import org.springframework.data.domain.Page;

/**
 * Service interface defining all business operations for managing
 * {@link com.rikkeisoft.backend.model.entity.ForumCategory} entities
 * in the Forum &amp; News EPIC.
 *
 * <p>Implementations must adhere to the following architectural rules:
 * <ul>
 *   <li>Slug generation from the {@code name} must use a Vietnamese-aware transliteration
 *       algorithm (e.g., using the {@code text-utils} or {@code slugify} library).</li>
 *   <li>The slug is generated <em>only</em> at creation time and is read-only thereafter.</li>
 *   <li>All methods must resolve i18n messages through the injected {@code MessageSource},
 *       never using hardcoded strings.</li>
 * </ul>
 */
public interface ForumCategoryService {

    /**
     * Creates a new forum category with an automatically generated slug.
     *
     * <p>The slug is derived from the {@code name} field in the request using
     * Vietnamese character-to-ASCII transliteration followed by URL-safe slug formatting.
     * Example: {@code "Kinh nghiệm phỏng vấn" → "kinh-nghiem-phong-van"}.
     *
     * <p>Throws {@link com.rikkeisoft.backend.exception.AppException} with error code
     * {@code CATEGORY_SLUG_CONFLICT} if a non-deleted category with the same generated slug
     * already exists (i.e., the name collision case).
     *
     * @param req the request payload containing the {@code name} and optional {@code description}.
     * @return a {@link ForumCategoryResp} representing the newly persisted category,
     *         including its generated slug and auto-populated timestamps.
     */
    ForumCategoryResp createCategory(ForumCategoryCreateReq req);

    /**
     * Updates the {@code name} and {@code description} of an existing forum category.
     *
     * <p>The {@code slug} is intentionally NOT updated regardless of any change to the name.
     * This ensures that existing external links and SEO data pointing to the category's
     * URL remain permanently valid.
     *
     * <p>Throws {@link com.rikkeisoft.backend.exception.AppException} with error code
     * {@code CATEGORY_NOT_FOUND} if no non-deleted category with the given ID is found.
     *
     * @param categoryId the surrogate primary key of the category to update.
     * @param req        the update payload containing the new {@code name} and optional
     *                   {@code description}.
     * @return a {@link ForumCategoryResp} reflecting the updated state of the category.
     */
    ForumCategoryResp updateCategory(Long categoryId, ForumCategoryUpdateReq req);

    /**
     * Soft-deletes a forum category by setting its {@code softDeleted} flag to {@code true}.
     *
     * <p>Physical deletion is never performed. After soft-deletion, the category is excluded
     * from all public queries. Posts that were assigned to this category are NOT deleted;
     * they remain associated with the category in the database.
     *
     * <p>Throws {@link com.rikkeisoft.backend.exception.AppException} with error code
     * {@code CATEGORY_NOT_FOUND} if no non-deleted category with the given ID exists.
     *
     * @param categoryId the surrogate primary key of the category to soft-delete.
     */
    void deleteCategory(Long categoryId);

    /**
     * Toggles the {@code active} status of a forum category between {@code true} and
     * {@code false}.
     *
     * <p>An inactive category ({@code active = false}) is hidden from public listings
     * but is not deleted. An active category ({@code active = true}) is publicly visible.
     * This is used by administrators to temporarily hide a category without deleting it.
     *
     * <p>Throws {@link com.rikkeisoft.backend.exception.AppException} with error code
     * {@code CATEGORY_NOT_FOUND} if no non-deleted category with the given ID exists.
     *
     * @param categoryId the surrogate primary key of the category whose status should be toggled.
     * @return a {@link ForumCategoryResp} reflecting the updated {@code active} state.
     */
    ForumCategoryResp toggleCategoryStatus(Long categoryId);

    /**
     * Searches for non-deleted categories whose {@code name} contains the given keyword,
     * with pagination support.
     *
     * <p>If {@code keyword} is {@code null} or empty, all non-deleted categories are returned
     * in the paginated result. Results are ordered by {@code name} ascending by default.
     *
     * @param keyword  the search term to match against category names; may be {@code null} or
     *                 empty to retrieve all categories.
     * @param page     the zero-indexed page number to retrieve.
     * @param size     the number of records per page (e.g., 10, 20).
     * @return a {@link Page} of {@link ForumCategoryResp} DTOs matching the search criteria.
     */
    Page<ForumCategoryResp> searchCategories(String keyword, int page, int size);
}
