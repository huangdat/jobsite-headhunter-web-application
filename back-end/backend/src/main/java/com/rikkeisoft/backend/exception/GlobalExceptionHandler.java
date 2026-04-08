package com.rikkeisoft.backend.exception;

import com.rikkeisoft.backend.component.Translator;
import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.model.dto.APIResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    private final Translator translator;

    public GlobalExceptionHandler(Translator translator) {
        this.translator = translator;
    }

    /**
     * Handles custom application exceptions.
     *
     * @param e the AppException
     * @return ResponseEntity with APIResponse containing error status and translated message
     */
    @ExceptionHandler(value = AppException.class)
    ResponseEntity<APIResponse<?>> handlingAppException(AppException e) {
        ErrorCode errorCode = e.getErrorCode();
        return ResponseEntity
                .status(errorCode.getHttpStatus())
                .body(buildAPIResponse(errorCode));
    }

    @ExceptionHandler(value = RuntimeException.class)
    ResponseEntity<APIResponse<?>> handlingRuntimeException(RuntimeException e) {
        log.error("Unhandled RuntimeException: ", e);
        ErrorCode errorCode = ErrorCode.INTERNAL_SERVER_ERROR;
        return ResponseEntity
                .status(errorCode.getHttpStatus())
                .body(buildAPIResponse(errorCode));
    }

    @ExceptionHandler(value = Exception.class)
    ResponseEntity<APIResponse<?>> handlingException(Exception e) {
        log.error("Unhandled Exception: ", e);
        ErrorCode errorCode = ErrorCode.INTERNAL_SERVER_ERROR;
        return ResponseEntity
                .status(errorCode.getHttpStatus())
                .body(buildAPIResponse(errorCode));
    }

    /**
     * Handles authorization denied exceptions.
     *
     * @param ex the AuthorizationDeniedException
     * @return ResponseEntity with APIResponse containing error code and message
     */
    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<APIResponse<?>> handlingAuthorizationDeniedException(AuthorizationDeniedException ex) {
        ErrorCode errorCode = ErrorCode.UNAUTHORIZED;
        return ResponseEntity
                .status(errorCode.getHttpStatus())
                .body(buildAPIResponse(ErrorCode.UNAUTHORIZED));
    }

    /**
     * Handles HTTP message not readable exceptions, typically occurring when the request body is invalid or cannot be parsed.
     *
     * @param ex the HttpMessageNotReadableException
     * @return ResponseEntity with APIResponse containing bad request status and specific cause
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<APIResponse<?>> handlingHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
        ErrorCode errorCode = ErrorCode.BAD_REQUEST;
        // Using "Bad Request" localized message + specific cause
        String baseMessage = translator.toLocale("error.bad_request" + ": " + ex.getMostSpecificCause().getMessage());
        return ResponseEntity
                .status(errorCode.getHttpStatus())
                .body(
                        APIResponse.builder()
                                .status(errorCode.getHttpStatus())
                                .message(baseMessage)
                                .build()
                );
    }

    /**
     * Handles validation exceptions.
     *
     * @param e the MethodArgumentNotValidException
     * @return ResponseEntity with APIResponse containing error code and message
     */
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<APIResponse<?>> handlingValidation(MethodArgumentNotValidException e) {
        String enumKey = e.getFieldError() != null ? e.getFieldError().getDefaultMessage() : "INVALID_KEY";

        ErrorCode errorCode = ErrorCode.INVALID_KEY;
        try {
            errorCode = ErrorCode.valueOf(enumKey);
        } catch (IllegalArgumentException ex) {
            log.warn("Validation error: {}", enumKey);
        }

        return ResponseEntity
                .status(errorCode.getHttpStatus())
                .body(buildAPIResponse(errorCode));
    }

    /**
     * Handles HTTP request method not supported exceptions.
     *
     * @param e the HttpRequestMethodNotSupportedException
     * @return ResponseEntity with APIResponse containing error code and message
     */
    @ExceptionHandler(value = HttpRequestMethodNotSupportedException.class)
    ResponseEntity<APIResponse<?>> handlingHttpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException e) {
        ErrorCode errorCode = ErrorCode.METHOD_NOT_ALLOWED;
        return ResponseEntity
                .status(errorCode.getHttpStatus())
                .body(buildAPIResponse(errorCode));
    }

    /**
     * Handles the translation of the ErrorCode key and encapsulates the data into the APIResponse object.
     *
     * @param errorCode the ErrorCode to use
     * @return a populated APIResponse
     */
    private APIResponse<?> buildAPIResponse(ErrorCode errorCode) {
        return APIResponse.builder()
                .status(errorCode.getHttpStatus())
                .message(translator.toLocale(errorCode.getMessageKey()))
                .build();
    }
}
