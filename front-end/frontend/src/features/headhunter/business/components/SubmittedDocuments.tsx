/**
 * Submitted Documents Component
 * Display uploaded business documents in grid
 */

import React, { useState } from "react";
import { useBusinessTranslation } from "@/shared/hooks/useFeatureTranslation";
import {
  Download,
  Trash2,
  FileText,
  File,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { SubmittedDocument } from "../types/business.types";

export interface SubmittedDocumentsProps {
  documents: SubmittedDocument[];
  isLoading?: boolean;
  onDelete?: (documentId: string) => Promise<void>;
  onDownload?: (documentId: string) => void;
  className?: string;
}

const getDocumentIcon = (type: string) => {
  switch (type) {
    case "tax_certificate":
      return <FileText className="h-8 w-8 text-red-600" />;
    case "business_license":
      return <FileText className="h-8 w-8 text-blue-600" />;
    case "registration_certificate":
      return <FileText className="h-8 w-8 text-emerald-600" />;
    case "bank_statement":
      return <FileText className="h-8 w-8 text-purple-600" />;
    case "other":
    default:
      return <File className="h-8 w-8 text-slate-600" />;
  }
};

const getDocumentTypeLabel = (type: string): string => {
  const typeMap: Record<string, string> = {
    tax_certificate: "business.document.tax_certificate",
    business_license: "business.document.business_license",
    registration_certificate: "business.document.registration_certificate",
    bank_statement: "business.document.bank_statement",
    other: "business.document.other",
  };
  // eslint-disable-next-line security/detect-object-injection
  return typeMap[type] || type;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  // eslint-disable-next-line security/detect-object-injection
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Submitted Documents Component
 * Display documents in a grid with status, download, and delete actions
 */
export const SubmittedDocuments: React.FC<SubmittedDocumentsProps> = ({
  documents,
  isLoading = false,
  onDelete,
  onDownload,
  className = "",
}) => {
  const { t } = useBusinessTranslation();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!onDelete) return;

    setDeletingId(id);
    try {
      await onDelete(id);
      setConfirmDeleteId(null);
      setDeleteError(null);
    } catch (error) {
      console.error("Delete failed:", error);
      setDeleteError(t("business.document.delete_error"));
    } finally {
      setDeletingId(null);
    }
  };

  if (documents.length === 0) {
    return (
      <div
        className={`rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center ${className}`}
      >
        <FileText className="mx-auto h-12 w-12 text-slate-400" />
        <p className="mt-4 text-sm font-medium text-slate-900">
          {t("business.document.no_documents")}
        </p>
        <p className="mt-1 text-sm text-slate-600">
          {t("business.document.no_documents_desc")}
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Section Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {t("business.document.submitted")}
          </h3>
          <p className="text-sm text-slate-600">
            {t("business.document.submitted_desc")}
          </p>
        </div>
      </div>

      {/* Delete Error Alert */}
      {deleteError && (
        <div className="mb-4 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 flex-0 text-red-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900">{deleteError}</p>
          </div>
          <button
            onClick={() => setDeleteError(null)}
            className="text-red-600 hover:text-red-700"
          >
            Ã—
          </button>
        </div>
      )}

      {/* Documents Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="relative flex flex-col rounded-lg border border-slate-200 bg-white p-4 transition-shadow hover:shadow-lg"
          >
            {/* Document Icon */}
            <div className="mb-3 flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                {doc.documentType && getDocumentIcon(doc.documentType)}
              </div>
              {doc.verificationStatus === "verified" && (
                <div className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">
                  <CheckCircle2 className="h-3 w-3" />
                  {t("business.document.verified")}
                </div>
              )}
            </div>

            {/* Document Info */}
            <div className="flex-1">
              <p className="line-clamp-2 text-sm font-medium text-slate-900">
                {doc.filename}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                {t(getDocumentTypeLabel(doc.documentType))} â€¢{" "}
                {formatFileSize(doc.fileSize)}
              </p>

              {doc.uploadedAt && (
                <p className="mt-2 text-xs text-slate-500">
                  {t("business.document.uploaded")}:{" "}
                  {new Date(doc.uploadedAt).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2">
              {onDownload && (
                <button
                  onClick={() => onDownload(doc.id)}
                  disabled={isLoading || deletingId === doc.id}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  title={t("business.document.download")}
                >
                  <Download className="h-4 w-4" />
                  {t("business.document.download")}
                </button>
              )}

              {onDelete && (
                <div className="relative flex-1">
                  {confirmDeleteId === doc.id ? (
                    <div className="absolute inset-0 z-50 flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(doc.id)}
                        disabled={deletingId === doc.id}
                        className="flex-1 rounded-lg bg-red-600 px-2 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                      >
                        {deletingId === doc.id
                          ? t("business.document.deleting")
                          : t("business.document.confirm")}
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        disabled={deletingId === doc.id}
                        className="flex-1 rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                      >
                        {t("business.document.cancel")}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(doc.id)}
                      disabled={isLoading}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      title={t("business.document.delete")}
                    >
                      <Trash2 className="h-4 w-4" />
                      {t("business.document.delete")}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State Message */}
      {documents.length === 0 && !isLoading && (
        <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <FileText className="mx-auto h-12 w-12 text-slate-400" />
          <p className="mt-4 text-sm font-medium text-slate-900">
            {t("business.document.no_documents")}
          </p>
        </div>
      )}
    </div>
  );
};

export default SubmittedDocuments;
