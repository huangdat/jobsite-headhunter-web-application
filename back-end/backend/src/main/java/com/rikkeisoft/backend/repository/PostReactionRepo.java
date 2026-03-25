package com.rikkeisoft.backend.repository;

import com.rikkeisoft.backend.enums.ReactionType;
import com.rikkeisoft.backend.model.entity.PostReaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Spring Data JPA repository for {@link PostReaction} entities.
 *
 * <p>Supports toggle-based reaction operations on news posts, including finding
 * an existing reaction for a user-post pair and computing per-type reaction counts
 * for the post detail response.
 */
@Repository
public interface PostReactionRepo extends JpaRepository<PostReaction, Long> {

    /**
     * Finds an existing reaction submitted by a specific account on a specific post.
     *
     * <p>This is the primary lookup used by the toggle reaction service to decide
     * whether to create, update, or delete a reaction.
     *
     * @param postId    the ID of the {@link com.rikkeisoft.backend.model.entity.ForumPost}
     *                  that was reacted to.
     * @param accountId the UUID string ID of the {@link com.rikkeisoft.backend.model.entity.Account}
     *                  that submitted the reaction.
     * @return an {@link Optional} containing the {@link PostReaction} if one exists;
     *         empty if the user has not reacted to this post yet.
     */
    Optional<PostReaction> findByPostIdAndAccountId(Long postId, String accountId);

    /**
     * Counts the number of reactions for each {@link ReactionType} on a given post.
     *
     * <p>Returns a list of Object arrays where each element is {@code [reactionType, count]},
     * used to build the reaction summary map in the post detail response DTO.
     *
     * @param postId the ID of the post whose reaction counts are being aggregated.
     * @return a list of {@code Object[]} pairs — index 0 is the {@link ReactionType},
     *         index 1 is the {@code Long} count.
     */
    @Query("SELECT pr.reactionType, COUNT(pr.id) FROM PostReaction pr WHERE pr.post.id = :postId GROUP BY pr.reactionType")
    List<Object[]> countReactionsByTypeForPost(@Param("postId") Long postId);
}
