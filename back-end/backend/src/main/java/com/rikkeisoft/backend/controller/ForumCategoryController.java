package com.rikkeisoft.backend.controller;

import com.rikkeisoft.backend.model.dto.APIResponse;
import com.rikkeisoft.backend.model.dto.req.forum.ForumCategoryCreateReq;
import com.rikkeisoft.backend.model.dto.req.forum.ForumCategoryUpdateReq;
import com.rikkeisoft.backend.model.dto.resp.forum.ForumCategoryResp;
import com.rikkeisoft.backend.service.ForumCategoryService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Locale;

/**
 * REST Controller for Forum Category management endpoints (EPIC 7 - Admin).
 *
 * <p>Exposes CRUD and utility operations for managing the hierarchical category structure
 * that organises news posts in the Headhunter Portal forums. All endpoints should be
 * secured to require at minimum the {@code ADMIN} role; security configuration is applied
 * in the Spring Security configuration class.
 *
 * <p>Base URL: {@code /api/forum/categories}
 *
 * <p>All response messages are resolved through the injected {@link MessageSource} using
 * the active request {@link Locale}, ensuring full i18n compliance with no hardcoded strings.
 */
@RestController
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequestMapping("/api/forum/categories")
public class ForumCategoryController {

    ForumCategoryService forumCategoryService;
    MessageSource messageSource;

    /**
     * Creates a new forum category with an automatically generated URL-safe slug.
     *
     * <p>The slug is derived from the {@code name} field using Vietnamese transliteration.
     * If the generated slug conflicts with an existing active category, a
     * {@code 409 Conflict} is returned.
     *
     * <p>HTTP: {@code POST /api/v1/forum/categories}
     *
     * @param req    the validated request body containing the category {@code name} and
     *               optional {@code description}.
     * @param locale the request locale used to resolve the success message from {@link MessageSource}.
     * @return an {@link APIResponse} wrapping the created {@link ForumCategoryResp},
     *         with HTTP status {@code 201 Created} and the message resolved from key
     *         {@code "forum.category.created"}.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public APIResponse<ForumCategoryResp> createCategory(
            @Valid @RequestBody ForumCategoryCreateReq req,
            Locale locale) {
        ForumCategoryResp result = forumCategoryService.createCategory(req);
        return APIResponse.<ForumCategoryResp>builder()
                .status(HttpStatus.CREATED)
                .message(messageSource.getMessage("forum.category.created", null, locale))
                .result(result)
                .build();
    }

    /**
     * Updates the {@code name} and {@code description} of an existing forum category.
     *
     * <p>The category's {@code slug} is read-only and will NOT be changed regardless of the
     * new name provided. Returns {@code 404 Not Found} if the category does not exist
     * or is soft-deleted.
     *
     * <p>HTTP: {@code PATCH /api/v1/forum/categories/{id}}
     *
     * @param id     the surrogate primary key of the category to update.
     * @param req    the validated request body with the new {@code name} and optional
     *               {@code description}.
     * @param locale the request locale for i18n message resolution.
     * @return an {@link APIResponse} wrapping the updated {@link ForumCategoryResp},
     *         with HTTP status {@code 200 OK} and the message resolved from key
     *         {@code "forum.category.updated"}.
     */
    @PatchMapping("/{id}")
    public APIResponse<ForumCategoryResp> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody ForumCategoryUpdateReq req,
            Locale locale) {
        ForumCategoryResp result = forumCategoryService.updateCategory(id, req);
        return APIResponse.<ForumCategoryResp>builder()
                .status(HttpStatus.OK)
                .message(messageSource.getMessage("forum.category.updated", null, locale))
                .result(result)
                .build();
    }

    /**
     * Soft-deletes a forum category by ID.
     *
     * <p>The category is not physically removed. After deletion, it is excluded from public
     * listings and cannot be assigned to new posts. Associated posts are preserved.
     * Returns {@code 404 Not Found} if the category does not exist or is already soft-deleted.
     *
     * <p>HTTP: {@code DELETE /api/v1/forum/categories/{id}}
     *
     * @param id     the surrogate primary key of the category to soft-delete.
     * @param locale the request locale for i18n message resolution.
     * @return a {@code 200 OK} {@link APIResponse} with no result body and the message
     *         resolved from key {@code "forum.category.deleted"}.
     */
    @DeleteMapping("/{id}")
    public APIResponse<Void> deleteCategory(
            @PathVariable Long id,
            Locale locale) {
        forumCategoryService.deleteCategory(id);
        return APIResponse.<Void>builder()
                .status(HttpStatus.OK)
                .message(messageSource.getMessage("forum.category.deleted", null, locale))
                .build();
    }

    /**
     * Toggles the active/inactive status of a forum category.
     *
     * <p>If the category is currently active ({@code active = true}), it is deactivated
     * (hidden from public view). If it is inactive ({@code active = false}), it is
     * reactivated. Returns {@code 404 Not Found} if the category does not exist or is
     * soft-deleted.
     *
     * <p>HTTP: {@code PATCH /api/v1/forum/categories/{id}/toggle-status}
     *
     * @param id     the surrogate primary key of the category whose status should be toggled.
     * @param locale the request locale for i18n message resolution.
     * @return an {@link APIResponse} wrapping the updated {@link ForumCategoryResp}
     *         (with the new {@code active} state), and the message resolved from key
     *         {@code "forum.category.status.toggled"}.
     */
    @PatchMapping("/{id}/toggle-status")
    public APIResponse<ForumCategoryResp> toggleStatus(
            @PathVariable Long id,
            Locale locale) {
        ForumCategoryResp result = forumCategoryService.toggleCategoryStatus(id);
        return APIResponse.<ForumCategoryResp>builder()
                .status(HttpStatus.OK)
                .message(messageSource.getMessage("forum.category.status.toggled", null, locale))
                .result(result)
                .build();
    }

    /**
     * Searches all non-deleted categories by an optional keyword, with pagination.
     *
     * <p>If no {@code keyword} is provided, all non-deleted categories are returned.
     * Results are paginated using {@code page} (zero-indexed) and {@code size} parameters.
     * Accessible to authenticated users; publicly accessible categories may also be filtered
     * by the client using the {@code active} field in the response.
     *
     * <p>HTTP: {@code GET /api/v1/forum/categories?keyword=&page=0&size=10}
     *
     * @param keyword the search term matched against category names; defaults to empty
     *                string (all categories) if not provided.
     * @param page    the zero-indexed page number to retrieve; defaults to {@code 0}.
     * @param size    the number of records per page; defaults to {@code 10}.
     * @param locale  the request locale for i18n message resolution.
     * @return an {@link APIResponse} wrapping a {@link Page} of {@link ForumCategoryResp} DTOs,
     *         with the message resolved from key {@code "forum.category.search.success"}.
     */
    @GetMapping
    public APIResponse<Page<ForumCategoryResp>> searchCategories(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Locale locale) {
        Page<ForumCategoryResp> result = forumCategoryService.searchCategories(keyword, page, size);
        return APIResponse.<Page<ForumCategoryResp>>builder()
                .status(HttpStatus.OK)
                .message(messageSource.getMessage("forum.category.search.success", null, locale))
                .result(result)
                .build();
    }
}
