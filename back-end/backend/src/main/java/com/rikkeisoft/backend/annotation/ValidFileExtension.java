package com.rikkeisoft.backend.annotation;

import com.rikkeisoft.backend.validator.FileExtensionValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

/**
 * Validates that a {@link org.springframework.web.multipart.MultipartFile}
 * has a filename extension contained in {@link #allowedExtensions}.
 *
 * <p>The {@code message} attribute accepts either:
 * <ul>
 *   <li>An {@code ErrorCode} enum name (e.g. {@code "FILE_EXTENSION_INVALID"}) — resolved
 *       by {@code GlobalExceptionHandler} into a localised message; or
 *   <li>A plain human-readable string (e.g.
 *       {@code "Invalid file extension, please only upload .jpg .jpeg .png"}) —
 *       returned as-is when the key does not match any {@code ErrorCode}.
 * </ul>
 *
 * <p>Usage examples:
 * <pre>
 *   // Images — custom human-readable message
 *   {@literal @}ValidFileExtension(
 *       allowedExtensions = {"png", "jpg", "jpeg"},
 *       message = "Invalid file extension, please only upload .jpg .jpeg .png"
 *   )
 *   MultipartFile profilePicture;
 *
 *   // CV / resumé — default generic message via ErrorCode key
 *   {@literal @}ValidFileExtension(allowedExtensions = {"pdf", "doc", "docx"})
 *   MultipartFile resume;
 * </pre>
 *
 * <p>A {@code null} or empty file is considered valid — combine with
 * {@code @NotNull} if the field is mandatory.
 */
@Documented
@Constraint(validatedBy = FileExtensionValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidFileExtension {

    /** ErrorCode key resolved by GlobalExceptionHandler into a human-readable message. */
    String message() default "FILE_EXTENSION_INVALID";

    /** Case-insensitive list of permitted file extensions (without leading dot). */
    String[] allowedExtensions() default {};

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
