/**
 * NewsFilters Component
 * FOR-10: Filter news by category, date, etc.
 */

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { forumApi } from "../../../services/forumApi";

interface Category {
  id: number;
  name: string;
}

export function NewsFilters() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await forumApi.getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
    updateSearchParams(value, selectedCategory, true);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCategory(value);
    updateSearchParams(keyword, value, true);
  };

  const updateSearchParams = (
    kw: string,
    cat: string,
    resetPage: boolean = false
  ) => {
    const params = new URLSearchParams();
    if (kw) params.set("keyword", kw);
    if (cat) params.set("category", cat);
    if (resetPage) params.set("page", "0");
    setSearchParams(params);
  };

  return (
    <div className="mb-6 flex gap-4 flex-wrap">
      <input
        type="text"
        placeholder={t("forum.placeholders.searchPosts") || "Search posts..."}
        value={keyword}
        onChange={handleSearch}
        className="flex-1 min-w-48 px-4 py-2 border rounded-lg"
      />
      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="px-4 py-2 border rounded-lg"
        title={t("forum.labels.selectCategory") || "Select a category"}
        aria-label={t("forum.labels.selectCategory") || "Select a category"}
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id.toString()}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}
