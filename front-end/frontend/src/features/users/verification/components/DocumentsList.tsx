/**
 * DocumentsList
 * PROF-05: Business Verification Admin Module
 *
 * Displays list of verification documents in a responsive grid
 * - Document icons by category
 * - File name and size
 * - Status badge
 * - Verified by info
 * - Download/view actions
 */

import React from "react";
import type { LucideIcon } from "lucide-react";
import {
  FileText,
  FileImage,
  FileCode,
  Download,
  Lock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { Button } from "@/components/ui/button";
import type { Document } from "../types";

interface DocumentsListProps {
  documents: Document[];
  onDownload?: (document: Document) => void;
  className?: string;
}

const getIconForCategory = (category: string): LucideIcon => {
  switch (category.toLowerCase()) {
    case "image":
    case "photo":
      return FileImage;
    case "code":
    case "technical":
      return FileCode;
    default:
      return FileText;
  }
};

const getStatusIcon = (
  status: string
): { icon: LucideIcon; color: string; bgColor: string } => {
  switch (status) {
    case "VERIFIED":
    case "LOCKED":
      return {
        icon: CheckCircle,
        color: getSemanticClass("success", "text", true),
        bgColor: getSemanticClass("success", "bg", true),
      };
    case "PENDING":
      return {
        icon: AlertCircle,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
      };
    default:
      return {
        icon: Lock,
        color: "text-slate-600",
        bgColor: "bg-slate-50",
      };
  }
};

export const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
  onDownload,
  className = "",
}) => {
  const { t } = useAppTranslation();

  if (documents.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <FileText className="mx-auto text-slate-300 mb-3" size={40} />
        <p className="text-slate-500">
          {t("verification.documents.noDocuments")}
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {documents.map((doc) => {
        const CategoryIcon = getIconForCategory(doc.category);
        const {
          icon: StatusIcon,
          color: statusColor,
          bgColor,
        } = getStatusIcon(doc.status);

        return (
          <div
            key={doc.id}
            className="rounded-lg border border-slate-200 bg-white p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Left: Icon & Details */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="bg-slate-100 rounded-lg p-2 shrink-0">
                  <CategoryIcon className="text-slate-600" size={20} />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-900 dark:text-slate-50 truncate">
                    {doc.fileName}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {doc.fileSize} • {doc.mimeType}
                  </p>

                  {/* Verified Info */}
                  {doc.verifiedBy && (
                    <p className="text-xs text-slate-600 mt-2">
                      {t("verification.documents.verifiedBy")}: {doc.verifiedBy}
                    </p>
                  )}

                  {/* Notes */}
                  {doc.notes && (
                    <p className="text-xs text-slate-600 mt-2 italic">
                      "{doc.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Status & Actions */}
              <div className="flex items-start gap-2 shrink-0">
                {/* Status Badge */}
                <div className={`rounded-full p-2 ${bgColor}`}>
                  <StatusIcon className={`${statusColor}`} size={18} />
                </div>

                {/* Download Button */}
                {onDownload && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDownload(doc)}
                    className="gap-1"
                  >
                    <Download size={16} />
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
