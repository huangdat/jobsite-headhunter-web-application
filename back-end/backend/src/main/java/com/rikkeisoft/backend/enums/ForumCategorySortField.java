package com.rikkeisoft.backend.enums;

import com.rikkeisoft.backend.exception.AppException;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Allowed sort fields for the forum-category search endpoint.
 * The {@code fieldName} value maps directly to the JPA entity property name,
 * so Spring Data can use it to build a
 * {@link org.springframework.data.domain.Sort}.
 */
@Getter
@RequiredArgsConstructor
public enum ForumCategorySortField {

    NAME("name"),
    CREATED_AT("createdAt"),
    UPDATED_AT("updatedAt");

    /**
     * The JPA entity field name passed to
     * {@link org.springframework.data.domain.Sort#by}.
     */
    private final String fieldName;

    /**
     * Resolves a raw string (case-insensitive) to the matching enum constant.
     *
     * @param value the raw sortBy query-parameter value, e.g. {@code "name"},
     *              {@code "createdAt"}
     * @return the matching {@link ForumCategorySortField}
     * @throws AppException with {@link ErrorCode#INVALID_SORT_FIELD} (400) if the
     *                      value is not supported
     */
    public static ForumCategorySortField fromString(String value) {
        for (ForumCategorySortField f : values()) {
            if (f.name().equalsIgnoreCase(value) || f.fieldName.equalsIgnoreCase(value)) {
                return f;
            }
        }
        throw new AppException(ErrorCode.INVALID_SORT_FIELD);
    }
}
