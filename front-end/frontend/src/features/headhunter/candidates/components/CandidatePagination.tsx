import React from "react";
import { useHeadhunterTranslation } from "@/shared/hooks";
import { getSemanticClass } from "@/lib/design-tokens";

interface CandidatePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (count: number) => void;
}

export const CandidatePagination: React.FC<CandidatePaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const { t } = useHeadhunterTranslation();

  const getPageNumbers = () => {
    const pages: Array<number | string> = [];
    const maxVisible = 5;
    const halfVisible = Math.floor(maxVisible / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push("...");
      }
    }

    for (let i = startPage; i <= endPage; i += 1) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm text-slate-500 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span>{t("filters.pagination.rowsPerPage")}</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange?.(parseInt(e.target.value))}
            className={`rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs outline-none focus:ring-1 ${getSemanticClass("success", "ring", true)}`}
            title={t("filters.pagination.rowsPerPage")}
            aria-label={t("filters.pagination.rowsPerPage")}
          >
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={48}>48</option>
          </select>
        </div>
        <p>
          {t("filters.pagination.info")
            ?.replace("{{start}}", String(startItem))
            .replace("{{end}}", String(endItem))
            .replace("{{total}}", String(totalItems))}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange?.(currentPage - 1)}
          disabled={currentPage === 1}
          className="size-8 rounded-lg border border-slate-200 bg-white text-slate-400 transition-colors hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={t("filters.pagination.prev")}
        >
          <span className="material-symbols-outlined text-sm">
            chevron_left
          </span>
        </button>

        {getPageNumbers().map((page, index) => (
          <React.Fragment key={`${page}-${index}`}>
            {page === "..." ? (
              <span className="px-1 text-slate-400">...</span>
            ) : (
              <button
                type="button"
                onClick={() => onPageChange?.(page as number)}
                className={`size-8 rounded-lg text-xs font-bold transition-colors ${
                  currentPage === page
                    ? `${getSemanticClass("success", "bg", true)} text-white`
                    : "text-slate-600 hover:bg-emerald-50"
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        <button
          type="button"
          onClick={() => onPageChange?.(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="size-8 rounded-lg border border-slate-200 bg-white text-slate-400 transition-colors hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={t("filters.pagination.next")}
        >
          <span className="material-symbols-outlined text-sm">
            chevron_right
          </span>
        </button>
      </div>
    </div>
  );
};
