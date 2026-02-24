package com.rikkeisoft.backend.exception;

import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.model.dto.APIResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GobalExceptionHandler {
    @ExceptionHandler(value = RuntimeException.class)
    ResponseEntity<APIResponse> handlingRuntimeException(RuntimeException e) {
        APIResponse response = new APIResponse();

        response.setStatus(ErrorCode.INTERNAL_SERVER_ERROR.getHttpStatus());
        response.setMessage(ErrorCode.INTERNAL_SERVER_ERROR.getMessage());

        return ResponseEntity.badRequest().body(response);
    }

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

    /**
     * Handles validation exceptions.
     * @param e
     * @return ResponseEntity with APIResponse containing error code and message
     */
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<APIResponse> handlingValidation(MethodArgumentNotValidException e) {

        String enumKey = e.getFieldError().getDefaultMessage();
        System.out.println(enumKey); // Debugging purpose

        ErrorCode errorCode = ErrorCode.INVALID_KEY;

        try {
            errorCode = ErrorCode.valueOf(enumKey);
        }
        catch (IllegalArgumentException illegalArgumentException) {
            System.out.println("Invalid enum key: " + enumKey);
            // If the enum key is not valid, we can either log it or handle it differently
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
