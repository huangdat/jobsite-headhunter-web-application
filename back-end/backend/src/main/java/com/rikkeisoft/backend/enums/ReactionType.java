package com.rikkeisoft.backend.enums;

/**
 * Represents the set of LinkedIn-style emotional reactions that a user may apply
 * to a {@code NewsPost} or a {@code ForumComment}.
 *
 * <p>Each reaction type corresponds to a distinct emotional expression:
 * <ul>
 *   <li>{@code LIKE}   – Standard thumbs-up approval.</li>
 *   <li>{@code HAHA}   – Finding the content funny or amusing.</li>
 *   <li>{@code CLAP}   – Applauding effort or achievement.</li>
 *   <li>{@code FLOWER} – Sending appreciation or congratulations.</li>
 *   <li>{@code LOVE}   – Expressing deep appreciation or affection.</li>
 *   <li>{@code SAD}    – Expressing sympathy or sorrow.</li>
 *   <li>{@code ANGRY}  – Expressing displeasure or disagreement.</li>
 *   <li>{@code WOW}    – Expressing surprise or admiration.</li>
 * </ul>
 *
 * <p>Reactions are toggle-based: submitting the same type a second time removes
 * the existing reaction. Submitting a different type replaces the existing one.
 *
 * <p><strong>Note:</strong> There is no "Share" functionality in this system.
 */
public enum ReactionType {

    /** Standard thumbs-up approval reaction. */
    LIKE,

    /** Amusing / funny reaction. */
    HAHA,

    /** Applause reaction for effort or achievement. */
    CLAP,

    /** Flower / appreciation reaction. */
    FLOWER,

    /** Heart / deep affection reaction. */
    LOVE,

    /** Sympathy / sorrow reaction. */
    SAD,

    /** Displeasure / disagreement reaction. */
    ANGRY,

    /** Surprise / admiration reaction. */
    WOW
}
