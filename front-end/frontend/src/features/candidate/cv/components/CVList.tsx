/**
 * CVList Component
 * Displays list of uploaded resume files with actions
 */

import React from "react";
import { useCandidateTranslation } from "@/shared/hooks";
import type { CVListProps } from "../types";
import { formatFileSize, formatUploadDate } from "../services";

export const CVList: React.FC<CVListProps> = ({
  files,
  isLoading = false,
  maxFiles,
  onView,
  onDownload,
  onDelete,
  onMakeActive,
}) => {
  const { t } = useCandidateTranslation();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm p-6 space-y-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 last:border-0"
          >
            <div className="w-12 h-12 bg-slate-300 dark:bg-slate-700 rounded-lg animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/3 animate-pulse" />
              <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-1/4 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return null;
  }

  return (
    <section className="bg-slate-50 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200/10 flex justify-between items-center">
        <h2 className="font-headline font-bold text-lg text-slate-900">
          {t("cv.management.success.activeResumes")}
        </h2>
        <span className="text-xs font-medium text-slate-600">
          {files.length} {t("cv.management.success.filesUsed")}
        </span>
      </div>

      {/* CV Files List */}
      <div className="p-4 space-y-3">
        {files.map((file) => (
          <div
            key={file.id}
            className="bg-slate-50est p-4 rounded-xl flex items-center justify-between group hover:shadow-md transition-all duration-300"
          >
            {/* File Info */}
            <div className="flex items-center gap-4 flex-1">
              {/* File Icon */}
              <div className="w-12 h-12 bg-white-container rounded-lg flex items-center justify-center text-emerald-600 flex-0">
                <span className="material-symbols-outlined text-2xl">
                  picture_as_pdf
                </span>
              </div>

              {/* File Details */}
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-sm wrap-break-word">
                  {file.filename}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-600">
                  <span>{formatFileSize(file.fileSize)}</span>
                  <span className="w-1 h-1 bg-outline-variant rounded-full" />
                  <span>
                    {t("cv.management.fileList.uploadedLabel")}{" "}
                    {formatUploadDate(file.uploadedAt)}
                  </span>
                  {file.isActive && (
                    <>
                      <span className="w-1 h-1 bg-primary rounded-full" />
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-emerald-600 rounded font-semibold">
                        <span className="material-symbols-outlined text-xs fill">
                          check_circle
                        </span>
                        Active
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 group-hover:visible invisible md:visible transition-all">
              {/* View Button */}
              {onView && (
                <button
                  onClick={() => onView(file.id)}
                  className="p-2 text-slate-600 hover:text-emerald-600 transition-colors rounded-lg hover:bg-white"
                  title={t("cv.management.fileList.actions.view")}
                  aria-label={t("cv.management.fileList.actions.view")}
                >
                  <span className="material-symbols-outlined text-lg">
                    visibility
                  </span>
                </button>
              )}

              {/* Download Button */}
              {onDownload && (
                <button
                  onClick={() => onDownload(file.id)}
                  className="p-2 text-slate-600 hover:text-emerald-600 transition-colors rounded-lg hover:bg-white"
                  title={t("cv.management.fileList.actions.download")}
                  aria-label={t("cv.management.fileList.actions.download")}
                >
                  <span className="material-symbols-outlined text-lg">
                    download
                  </span>
                </button>
              )}

              {/* Make Active Button (if not already active) */}
              {onMakeActive && !file.isActive && (
                <button
                  onClick={() => onMakeActive(file.id)}
                  className="p-2 text-slate-600 hover:text-emerald-600 transition-colors rounded-lg hover:bg-white"
                  title={t("cv.management.fileList.actions.makeActive")}
                  aria-label={t("cv.management.fileList.actions.makeActive")}
                >
                  <span className="material-symbols-outlined text-lg">
                    check_circle_outline
                  </span>
                </button>
              )}

              {/* Delete Button */}
              {onDelete && (
                <button
                  onClick={() => onDelete(file.id)}
                  className="p-2 text-slate-600 hover:text-red-700 transition-colors rounded-lg hover:bg-white"
                  title={t("cv.management.fileList.actions.delete")}
                  aria-label={t("cv.management.fileList.actions.delete")}
                >
                  <span className="material-symbols-outlined text-lg">
                    delete
                  </span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Max Files Reached Info */}
      {files.length >= maxFiles && (
        <div className="px-6 py-4 bg-yellow-50 dark:bg-yellow-500/10 border-t border-slate-200/10 flex items-start gap-3">
          <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 text-lg shrink-0 mt-0.5 fill">
            info
          </span>
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            {t("validation.maxFilesReached")}.{" "}
            {t("validation.deleteExistingToUpload")}
          </p>
        </div>
      )}
    </section>
  );
};

export default CVList;

