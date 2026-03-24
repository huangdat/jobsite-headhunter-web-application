package com.rikkeisoft.backend.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class APIResponse<T> {
    HttpStatus status = HttpStatus.OK; // Default status is 200 OK
    String message;
    T result;
}
