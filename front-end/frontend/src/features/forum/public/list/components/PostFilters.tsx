/**
 * PostFilters Component
 * FOR-10 AC3: Filter forum posts by category and keyword
 * AC3: Auto-filter, reset to page 1 when filters change
 */

import { Search, X } from "lucide-react";
import { usePostList } from "../hooks/usePostList";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const CATEGORIES = [
  { id: undefined, name: "forum.categories.all", label: "All" },
  { id: 1, name: "forum.categories.recruitment", label: "Recruitment" },
  { id: 2, name: "forum.categories.partnership", label: "Partnership" },
  { id: 3, name: "forum.categories.events", label: "Events" },
];

export function PostFilters() {
  const { t } = useTranslation();
  const { handleFilterChange } = usePostList();
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    undefined
  );
  const [keyword, setKeyword] = useState("");

  const handleSearchChange = (value: string) => {
    setKeyword(value);
    // AC3: Auto-filter, reset to page 1
    handleFilterChange(selectedCategory, value);
  };

  const handleCategoryChange = (catId?: number) => {
    setSelectedCategory(catId);
    // AC3: Auto-filter, reset to page 1
    handleFilterChange(catId, keyword);
  };

  const handleClearFilters = () => {
    setKeyword("");
    setSelectedCategory(undefined);
    handleFilterChange();
  };

  return (
    <div className="mb-8 p-6 bg-white rounded-lg border border-slate-200">
      {/* Category Tabs */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id !== undefined ? cat.id : "all"}
            onClick={() => handleCategoryChange(cat.id)}
            className={`
              px-4 py-2 rounded-full whitespace-nowrap font-medium transition
              ${
                selectedCategory === cat.id
                  ? "bg-brand-primary text-black font-bold"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }
            `}
          >
            {t(cat.name)}
          </button>
        ))}
      </div>

      {/* Search Box */}
      <div className="flex gap-3 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder={
              t("forum.list.searchPlaceholder") || "Tìm kiếm tin tức..."
            }
            value={keyword}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {keyword && (
            <button
              aria-label={t("forum.list.clearSearch") || "Xóa tìm kiếm"}
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {(keyword || selectedCategory !== undefined) && (
          <button
            onClick={handleClearFilters}
            aria-label={t("forum.list.clearFilters") || "Xóa lọc"}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            {t("forum.list.clearFilters") || "Xóa lọc"}
          </button>
        )}
      </div>
    </div>
  );
}
