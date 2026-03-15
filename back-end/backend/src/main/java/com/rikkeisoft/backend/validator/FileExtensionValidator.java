package com.rikkeisoft.backend.validator;

import com.rikkeisoft.backend.annotation.ValidFileExtension;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

/**
 * Validator implementation for {@link ValidFileExtension}.
 *
 * <p>Reads the permitted extensions from the annotation's {@code allowedExtensions}
 * attribute at initialisation time, so a single validator class serves every
 * usage site regardless of which extensions are declared.
 *
 * <p>Null or empty files pass validation (use {@code @NotNull} separately when needed).
 */
public class FileExtensionValidator implements ConstraintValidator<ValidFileExtension, MultipartFile> {

    private List<String> allowedExtensions;

    @Override
    public void initialize(ValidFileExtension annotation) {
        // Normalise to lowercase so comparisons are case-insensitive
        this.allowedExtensions = Arrays.stream(annotation.allowedExtensions())
                .map(String::toLowerCase)
                .toList();
    }

    @Override
    public boolean isValid(MultipartFile file, ConstraintValidatorContext context) {
        if (file == null || file.isEmpty()) {
            return true; // null/empty → valid; use @NotNull if the field is required
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !originalFilename.contains(".")) {
            return false; // no extension at all → reject
        }

        String extension = originalFilename
                .substring(originalFilename.lastIndexOf('.') + 1)
                .toLowerCase();

        return allowedExtensions.contains(extension);
    }
}
