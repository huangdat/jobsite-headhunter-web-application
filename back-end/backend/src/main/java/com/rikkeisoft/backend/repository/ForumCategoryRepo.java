package com.rikkeisoft.backend.repository;

import com.rikkeisoft.backend.model.entity.ForumCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA repository for {@link ForumCategory} entities.
 *
 * <p>Provides data-access operations for forum / news categories, including
 * keyword-based paginated search, slug-based lookup, and active-category retrieval.
 * All query methods automatically exclude soft-deleted records where noted.
 */
@Repository
public interface ForumCategoryRepo extends JpaRepository<ForumCategory, Long> {

    /**
     * Searches for non-deleted categories whose {@code name} or {@code slug} contains
     * the given keyword (case-insensitive), with pagination and sorting support.
     *
     * <p>Used by the admin category search endpoint ({@code GET /api/forum/categories/search}).
     *
     * @param keyword   the search term to match against the category name or slug;
     *                  may be an empty string to return all non-deleted categories.
     * @param pageable  pagination and sorting parameters (page index, page size, sort field).
     * @return a {@link Page} of {@link ForumCategory} entities matching the criteria.
     */
    @Query(value = """
            SELECT * FROM forum_category
            WHERE soft_deleted = false
            AND (
              :keyword IS NULL OR :keyword = ''
              OR REGEXP_LIKE(name, CONCAT('(^|[^a-zA-Z])', :keyword, '($|[^a-zA-Z])'), 'i')
              OR REGEXP_LIKE(slug, CONCAT('(^|[^a-zA-Z])', :keyword, '($|[^a-zA-Z])'), 'i')
            )
            """, countQuery = """
            SELECT COUNT(*) FROM forum_category
            WHERE soft_deleted = false
            AND (
              :keyword IS NULL OR :keyword = ''
              OR REGEXP_LIKE(name, CONCAT('(^|[^a-zA-Z])', :keyword, '($|[^a-zA-Z])'), 'i')
              OR REGEXP_LIKE(slug, CONCAT('(^|[^a-zA-Z])', :keyword, '($|[^a-zA-Z])'), 'i')
            )
            """, nativeQuery = true)
    /*
     * Why countQuery? When using nativeQuery = true with Page<>, Spring Data needs
     * a separate COUNT(*) query to calculate totalElements and totalPages. Without
     * it, Spring tries to auto-derive it and often fails or generates wrong SQL.
     */
    Page<ForumCategory> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    /**
     * Finds a non-deleted category by its unique URL slug.
     *
     * <p>Used internally at creation time to ensure slug uniqueness, and by the
     * public API to resolve category-based URLs.
     *
     * @param slug the exact URL-safe slug to look up (e.g., "kinh-nghiem-phong-van").
     * @return an {@link Optional} containing the matching category, or empty if not found
     *         or if the category is soft-deleted.
     */
    Optional<ForumCategory> findBySlugAndSoftDeletedFalse(String slug);

    /**
     * Checks whether a non-deleted category with the given slug already exists.
     *
     * <p>Used during category creation to enforce slug uniqueness before persisting.
     *
     * @param slug the URL-safe slug to check for existence.
     * @return {@code true} if a non-deleted category with this slug exists; {@code false} otherwise.
     */
    boolean existsBySlugAndSoftDeletedFalse(String slug);
}
