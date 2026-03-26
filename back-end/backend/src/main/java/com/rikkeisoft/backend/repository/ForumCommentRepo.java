package com.rikkeisoft.backend.repository;

import com.rikkeisoft.backend.model.entity.ForumComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for {@link ForumComment} entities.
 *
 * <p>Provides data-access operations required to build and manage threaded comment
 * trees on news posts, including tree traversal, reply existence checks, and
 * count queries needed for the dynamic delete-vs-tombstone decision.
 */
@Repository
public interface ForumCommentRepo extends JpaRepository<ForumComment, Long> {

    /**
     * Retrieves all non-tombstoned <em>and</em> tombstoned comments for a specific post.
     *
     * <p>Both active ({@code deleted = false}) and tombstoned ({@code deleted = true})
     * comments are included so that the tree structure is preserved for display. The
     * service layer handles the rendering of tombstoned comments as "This comment has been deleted."
     *
     * <p>Used by {@code GET /api/v1/forum/posts/{postId}/comments} to build the full
     * comment tree.
     *
     * @param postId the ID of the {@link com.rikkeisoft.backend.model.entity.NewsPost}
     *               whose comments are being fetched.
     * @return an ordered list of all {@link ForumComment} entities for the post.
     */
    List<ForumComment> findAllByPostIdOrderByCreatedAtAsc(@Param("postId") Long postId);

    /**
     * Counts the number of direct child replies for a given comment.
     *
     * <p>This is used by the delete logic to determine whether a comment is a leaf node
     * (no replies → hard delete) or an internal node (has replies → tombstone).
     *
     * @param parentCommentId the ID of the parent comment to count direct children for.
     * @return the number of direct child {@link ForumComment} entities.
     */
    long countByParentCommentId(Long parentCommentId);

    /**
     * Retrieves all direct replies to a given parent comment, ordered by creation time.
     *
     * <p>Used internally when cascading a delete operation to check descendant state.
     *
     * @param parentCommentId the ID of the parent comment.
     * @return a list of direct child {@link ForumComment} entities.
     */
    List<ForumComment> findByParentCommentIdOrderByCreatedAtAsc(Long parentCommentId);
}