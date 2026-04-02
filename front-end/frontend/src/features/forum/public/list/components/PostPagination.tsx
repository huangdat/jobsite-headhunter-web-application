/**
 * PostPagination Component
 * FOR-10 AC6/AC7: Smart pagination with ellipsis
 * AC6: Show page numbers with "..." for ranges
 * AC7: Disable "prev" on page 1, "next" on last page
 */

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePostList } from "../hooks/usePostList";
import { t } from "i18next";

export function PostPagination() {
  const {
    page,
    totalPages,
    goToPage,
    prevPage,
    nextPage,
    canGoPrev,
    canGoNext,
  } = usePostList();

  if (totalPages <= 1) return null;

  // AC6: Smart pagination with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // Show all pages if <= 7
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Show ellipsis if gap
      if (page > 3) pages.push("...");

      // Show pages around current (±2)
      for (
        let i = Math.max(2, page - 2);
        i <= Math.min(totalPages - 1, page + 2);
        i++
      ) {
        if (!pages.includes(i)) pages.push(i);
      }

      // Show ellipsis if gap
      if (page < totalPages - 2) pages.push("...");

      // Always show last page
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-12 mb-8">
      {/* AC7: Previous button disabled on page 1 */}
      <button
        aria-label={t("list.prevPage")}
        onClick={prevPage}
        disabled={!canGoPrev}
        className={`
          p-2 rounded-lg transition
          ${
            canGoPrev
              ? "hover:bg-slate-100 cursor-pointer"
              : "opacity-50 cursor-not-allowed text-slate-300"
          }
        `}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Page numbers with ellipsis */}
      {pageNumbers.map((pageNum, idx) => (
        <div key={idx}>
          {pageNum === "..." ? (
            <span className="px-3 py-2 text-slate-600">...</span>
          ) : (
            <button
              onClick={() => goToPage(pageNum as number)}
              className={`
                px-3 py-2 rounded-lg transition
                ${
                  page === pageNum
                    ? "bg-emerald-600 text-white font-medium"
                    : "hover:bg-slate-100 text-slate-700"
                }
              `}
            >
              {pageNum}
            </button>
          )}
        </div>
      ))}

      {/* AC7: Next button disabled on last page */}
      <button
        aria-label={t("list.nextPage")}
        onClick={nextPage}
        disabled={!canGoNext}
        className={`
          p-2 rounded-lg transition
          ${
            canGoNext
              ? "hover:bg-slate-100 cursor-pointer"
              : "opacity-50 cursor-not-allowed text-slate-300"
          }
        `}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
