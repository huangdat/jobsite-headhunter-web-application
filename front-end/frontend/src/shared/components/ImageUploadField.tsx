/**
 * ImageUploadField Component
 * Reusable image upload with preview, validation, and remove functionality
 *
 * @example
 * ```tsx
 * <ImageUploadField
 *   value={imageFile}
 *   preview={imagePreview}
 *   onChange={(file, preview) => {
 *     setImageFile(file);
 *     setImagePreview(preview);
 *   }}
 *   onRemove={() => {
 *     setImageFile(null);
 *     setImagePreview("");
 *   }}
 *   error={errors.image}
 *   label="Featured Image"
 * />
 * ```
 */

import { useRef, useCallback } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];
const DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5MB

export interface ImageUploadFieldProps {
  /** Current file value */
  value?: File | null;

  /** Preview URL (can be from File or existing uploaded image) */
  preview?: string;

  /** Callback when image is selected */
  onChange?: (file: File | null, previewUrl: string) => void;

  /** Callback when image is removed */
  onRemove?: () => void;

  /** Label for the field */
  label?: string;

  /** Error message */
  error?: string;

  /** Allowed MIME types (default: jpeg, png, gif, webp) */
  allowedTypes?: string[];

  /** Maximum file size in bytes (default: 5MB) */
  maxSize?: number;

  /** Whether field is disabled */
  disabled?: boolean;

  /** Whether field is required */
  required?: boolean;

  /** Helper text */
  helperText?: string;

  /** Custom error messages */
  errorMessages?: {
    invalidFormat?: string;
    tooLarge?: string;
  };
}

export function ImageUploadField({
  preview,
  onChange,
  onRemove,
  label = "Image",
  error,
  allowedTypes = ALLOWED_IMAGE_TYPES,
  maxSize = DEFAULT_MAX_SIZE,
  disabled = false,
  required = false,
  helperText,
  errorMessages = {},
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        toast.error(
          errorMessages.invalidFormat ||
            `Supported formats: ${allowedTypes.map((t) => t.split("/")[1].toUpperCase()).join(", ")}`
        );
        return;
      }

      // Validate file size
      if (file.size > maxSize) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
        toast.error(
          errorMessages.tooLarge || `Image must not exceed ${maxSizeMB}MB`
        );
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);

      onChange?.(file, previewUrl);
    },
    [allowedTypes, maxSize, onChange, errorMessages]
  );

  const handleRemove = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onRemove?.();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Upload Area */}
      <div className="space-y-3">
        {/* Preview or Upload Button */}
        {preview ? (
          <div className="relative inline-block">
            <img
              src={preview}
              alt={label || "Image preview"}
              className="max-w-full max-h-64 rounded-lg border border-gray-200 object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              disabled={disabled}
              className="absolute top-2 right-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div
            onClick={!disabled ? handleClick : undefined}
            className={`
              border-2 border-dashed rounded-lg p-8
              flex flex-col items-center justify-center gap-2
              transition-colors cursor-pointer
              ${
                disabled
                  ? "bg-gray-50 border-gray-200 cursor-not-allowed"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              }
              ${error ? "border-red-300" : ""}
            `}
          >
            <Upload className="h-10 w-10 text-gray-400" />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                Click to upload {label.toLowerCase()}
              </p>
              {helperText && (
                <p className="text-xs text-gray-500 mt-1">{helperText}</p>
              )}
            </div>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={allowedTypes.join(",")}
          onChange={handleSelect}
          disabled={disabled}
          className="hidden"
          aria-label={label}
        />
      </div>

      {/* Error Message */}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
