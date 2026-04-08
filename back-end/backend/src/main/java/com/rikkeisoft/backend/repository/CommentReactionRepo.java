package com.rikkeisoft.backend.repository;

import com.rikkeisoft.backend.enums.ReactionType;
import com.rikkeisoft.backend.model.entity.CommentReaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for {@link CommentReaction} entities.
 *
 * <p>Supports toggle-based reaction operations on forum comments, including finding
 * an existing reaction for a user-comment pair and computing per-type reaction counts
 * for the comment response DTO.
 */
@Repository
public interface CommentReactionRepo extends JpaRepository<CommentReaction, Long> {

    /**
     * Finds an existing reaction submitted by a specific account on a specific comment.
     *
     * <p>This is the primary lookup used by the toggle-reaction service to decide
     * whether to create, update, or delete the reaction.
     *
     * @param commentId the ID of the {@link com.rikkeisoft.backend.model.entity.ForumComment}
     *                  that was reacted to.
     * @param accountId the UUID string ID of the {@link com.rikkeisoft.backend.model.entity.Account}
     *                  that submitted the reaction.
     * @return an {@link Optional} containing the {@link CommentReaction} if one exists;
     *         empty if the user has not yet reacted to this comment.
     */
    Optional<CommentReaction> findByCommentIdAndAccountId(Long commentId, String accountId);

    /**
     * Counts the number of reactions for each reaction type on a given comment.
     *
     * <p>Returns a list of Object arrays where each element is
     * {@code [reactionType (ReactionType enum), count (Long)]}.
     *
     * @param commentId the ID of the comment whose reaction counts are being aggregated.
     * @return a list of {@code Object[]} pairs — index 0 is the
     *         {@link com.rikkeisoft.backend.enums.ReactionType}, index 1 is the count.
     */
    @Query("SELECT r.reactionType, COUNT(r) FROM CommentReaction r WHERE r.comment.id = :commentId GROUP BY r.reactionType")
    List<Object[]> countReactionsByReactionType(@Param("commentId") Long commentId, ReactionType reactionType);
}
