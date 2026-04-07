/**
 * CVUploadZone Component
 * Drag & drop file upload zone with file validation
 */

import React, { useState, useCallback } from "react";
import { useCandidateTranslation } from "@/shared/hooks";
import { Button } from "@/components/ui/button";
import { validateCVFile } from "../services/cvApi";
import type { CVUploadZoneProps } from "../types";
import { CVErrorBanner } from "./CVErrorBanner";
import { getSemanticClass } from "@/lib/design-tokens";

export const CVUploadZone: React.FC<CVUploadZoneProps> = ({
  isLoading = false,
  onUpload,
  onDragOver,
  onDragLeave,
  supportedFormats = ["pdf", "doc", "docx", "rtf"],
  maxFileSize = 5 * 1024 * 1024,
  error = null,
  isDragging: isDraggingProp = false,
}) => {
  const { t } = useCandidateTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); //new
  const [localError, setLocalError] = useState<string | null>(null);

  const getFormattedSize = (bytes: number) => {
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    // eslint-disable-next-line security/detect-object-injection
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const validateFile = useCallback(
    (file: File): boolean => {
      const result = validateCVFile(
        file,
        maxFileSize,
        supportedFormats as string[]
      );
      if (!result.valid) {
        setLocalError(result.error ?? "");
        setSelectedFile(file);
        return false;
      }
      return true;
    },
    [maxFileSize, supportedFormats]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      onDragOver?.();
    },
    [onDragOver]
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      onDragLeave?.();
    },
    [onDragLeave]
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        const file = files[0]; // Only take first file
        if (validateFile(file)) {
          setLocalError(null);
          setSelectedFile(null);
          await onUpload([file]);
        }
      }
    },
    [onUpload, validateFile]
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        const file = files[0];
        if (validateFile(file)) {
          setLocalError(null);
          setSelectedFile(null);
          await onUpload([file]);
        }
      }
    },
    [onUpload, validateFile]
  );

  const handleBrowseClick = useCallback(() => {
    const input = document.getElementById("cv-file-input") as HTMLInputElement;
    input?.click();
  }, []);

  const displayError = error || localError;
  const dragging = isDraggingProp || isDragging;

  return (
    <div className="space-y-4">
      {/* Error Banner */}
      {displayError && (
        <CVErrorBanner
          error={displayError}
          onDismiss={() => setLocalError(null)}
          onRetry={() => setLocalError(null)}
        />
      )}

      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ${
          dragging
            ? `border-emerald-300 ${getSemanticClass("success", "bg", true)} shadow-lg`
            : displayError
              ? `${getSemanticClass("danger", "border", true)} ${getSemanticClass("danger", "bg", true)}`
              : "border-slate-200 bg-slate-50"
        }`}
      >
        {isLoading ? (
          // Loading State
          <div className="space-y-4">
            <div className="w-16 h-16 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto animate-pulse" />
            <p className="text-slate-900 font-semibold">
              {t("messages.uploading")}
            </p>
            <div className="w-full h-2 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto max-w-xs animate-pulse" />
          </div>
        ) : selectedFile && displayError ? (
          // Error State with Selected File
          <div className="space-y-4">
            <div className="flex justify-center">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center ${getSemanticClass("danger", "bg", true)}`}
              >
                <span className="material-symbols-outlined text-white text-3xl fill">
                  error
                </span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {t("cv.management.error.banner")}
            </h3>
            <p className="text-sm text-slate-600">
              {t("cv.management.error.fileFormatInvalid")}
            </p>
            {/* File Preview with Error */}
            <div
              className={`rounded-lg p-4 mx-auto max-w-sm mt-4 border ${getSemanticClass("danger", "bg", true)} ${getSemanticClass("danger", "border", true)}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`material-symbols-outlined text-2xl fill ${getSemanticClass("danger", "text", true)}`}
                >
                  description
                </span>
                <div className="text-left flex-1">
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedFile.name}
                  </p>
                  <p
                    className={`text-xs font-semibold ${getSemanticClass("danger", "text", true)}`}
                  >
                    {getFormattedSize(selectedFile.size)} • {displayError}
                    {selectedFile.size} •{" "}
                    {displayError === "validation.fileTooLarge"
                      ? t("validation.fileTooLargeShort")
                      : t("validation.invalidFileFormatShort")}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedFile(null)}
                  className={getSemanticClass("danger", "text", true)}
                  title={t("cv.management.validation.clear")}
                  aria-label={t("cv.management.validation.clear")}
                >
                  <span className="material-symbols-outlined text-lg">
                    close
                  </span>
                </Button>
              </div>
            </div>{" "}
            {/* Retry Button */}
            <Button
              onClick={handleBrowseClick}
              className="inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined mr-2">refresh</span>
              {t("cv.management.error.tryAnother")}
            </Button>
          </div>
        ) : (
          // Upload Ready State
          <div className="space-y-4">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center">
                <span
                  className={`material-symbols-outlined text-3xl fill ${getSemanticClass("success", "icon", true)}`}
                >
                  upload_file
                </span>
              </div>
            </div>

            {/* Headline */}
            <h3 className="text-lg font-bold text-slate-900">
              {t("cv.management.empty.headline")}
            </h3>

            {/* Description */}
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              {t("tips.uploadPlaceholder")}
            </p>

            {/* Actions */}
            <div className="flex flex-col items-center gap-3 pt-2">
              <Button
                onClick={handleBrowseClick}
                className="inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined mr-2">
                  folder_open
                </span>
                {t("cv.management.success.browseFiles")}
              </Button>

              {/* Hidden File Input */}
              <input
                id="cv-file-input"
                type="file"
                accept={supportedFormats.map((f) => `.${f}`).join(",")}
                onChange={handleFileSelect}
                className="hidden"
                aria-label={t("cv.management.upload.selectFile")}
              />

              <p className="text-xs text-slate-600">
                {supportedFormats.map((f) => f.toUpperCase()).join(", ")}{" "}
                {t("upload.maxFileSizeLabel")} {getFormattedSize(maxFileSize)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVUploadZone;
