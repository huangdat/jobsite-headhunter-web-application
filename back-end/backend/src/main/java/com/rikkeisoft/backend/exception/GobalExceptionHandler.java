package com.rikkeisoft.backend.exception;

import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.model.dto.APIResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Slf4j
@ControllerAdvice
public class GobalExceptionHandler {

    /**
     * Handles custom application exceptions.
     * @param e
     * @return ResponseEntity with APIResponse containing error code and message
     */
    @ExceptionHandler(value = AppException.class)
    ResponseEntity<APIResponse> handlingAppException(AppException e) {
        ErrorCode errorCode = e.getErrorCode();
        APIResponse response = new APIResponse();
        response.setStatus(errorCode.getHttpStatus());
        response.setMessage(errorCode.getMessage());
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(value = RuntimeException.class)
    ResponseEntity<APIResponse> handlingRuntimeException(RuntimeException e) {
        log.error("Unhandled RuntimeException: ", e);
        APIResponse response = new APIResponse();
        response.setStatus(ErrorCode.INTERNAL_SERVER_ERROR.getHttpStatus());
        response.setMessage(ErrorCode.INTERNAL_SERVER_ERROR.getMessage());
        return ResponseEntity.badRequest().body(response);
    }

    /**
     * Handles authorization denied exceptions.
     * @param ex
     * @return ResponseEntity with APIResponse containing error code and message
     */
    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<APIResponse<?>> handlingAuthorizationDeniedException(AuthorizationDeniedException ex) {
        APIResponse<?> resp = new APIResponse<>();
        resp.setStatus(HttpStatus.FORBIDDEN);
        resp.setMessage("Access Denied");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(resp);
    }

    /**
     * Handles HTTP message not readable exceptions, typically occurring when the request body is invalid or cannot be parsed.
     * @param ex
     * @return
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<APIResponse<?>> handlingHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
        APIResponse<?> resp = new APIResponse<>();
        resp.setStatus(HttpStatus.BAD_REQUEST);
        resp.setMessage("Invalid request body: " + ex.getMostSpecificCause().getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    /**
     * Handles validation exceptions.
     * @param e
     * @return ResponseEntity with APIResponse containing error code and message
     */
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<APIResponse> handlingValidation(MethodArgumentNotValidException e) {

        String enumKey = e.getFieldError() != null ? e.getFieldError().getDefaultMessage() : "INVALID_KEY";
        log.warn("Validation error: {}", enumKey);

        ErrorCode errorCode = ErrorCode.INVALID_KEY;
        try {
            errorCode = ErrorCode.valueOf(enumKey);
        } catch (IllegalArgumentException ignored) {
        }

        APIResponse response = new APIResponse();
        response.setStatus(errorCode.getHttpStatus());
        response.setMessage(errorCode.getMessage());
        return ResponseEntity.badRequest().body(response);
    }


    /**
     * Handles HTTP request method not supported exceptions.
     * @param e
     * @return ResponseEntity with APIResponse containing error code and message
     */
    @ExceptionHandler(value = HttpRequestMethodNotSupportedException.class)
    ResponseEntity<APIResponse> handlingHttpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException e) {
        APIResponse response = new APIResponse();
        response.setStatus(ErrorCode.METHOD_NOT_ALLOWED.getHttpStatus());
        response.setMessage(ErrorCode.METHOD_NOT_ALLOWED.getMessage());
        return ResponseEntity.status(405).body(response);
    }
}
