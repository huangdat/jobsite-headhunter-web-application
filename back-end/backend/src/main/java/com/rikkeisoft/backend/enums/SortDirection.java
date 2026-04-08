package com.rikkeisoft.backend.enums;

import com.rikkeisoft.backend.exception.AppException;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;

/**
 * Allowed sort directions for paginated search endpoints.
 * Wraps Spring's {@link Sort.Direction} so that invalid values produce a
 * domain {@link AppException} (400) instead of an unchecked
 * {@link IllegalArgumentException}.
 */
@Getter
@RequiredArgsConstructor
public enum SortDirection {

    ASC(Sort.Direction.ASC),
    DESC(Sort.Direction.DESC);

    /** The Spring Data sort direction delegate. */
    private final Sort.Direction springDirection;

    /**
     * Resolves a raw string (case-insensitive) to the matching enum constant.
     *
     * @param value the raw {@code direction} query-parameter value, e.g. {@code "asc"}, {@code "desc"}
     * @return the matching {@link SortDirection}
     * @throws AppException with {@link ErrorCode#INVALID_SORT_DIRECTION} (400) if the value is not supported
     */
    public static SortDirection fromString(String value) {
        for (SortDirection d : values()) {
            if (d.name().equalsIgnoreCase(value)) {
                return d;
            }
        }
        throw new AppException(ErrorCode.INVALID_SORT_DIRECTION);
    }
}
