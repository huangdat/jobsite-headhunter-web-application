package com.rikkeisoft.backend.model.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class PagedResponse<T> {
    int page;
    int size;
    long totalElements;
    int totalPages;
    List<T> data;
}
