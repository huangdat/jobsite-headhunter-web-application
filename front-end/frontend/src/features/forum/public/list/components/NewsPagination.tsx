/**
 * NewsPagination Component
 * FOR-10: Pagination controls for news list
 */

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { forumApi } from "../../../services/forumApi";

export function NewsPagination() {
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const keyword = searchParams.get("keyword") || undefined;
  const category = searchParams.get("category")
    ? parseInt(searchParams.get("category")!)
    : undefined;
  const currentPage = parseInt(searchParams.get("page") || "0");

  useEffect(() => {
    // Fetch to get total pages (use current page from searchParams)
    forumApi
      .searchPosts(currentPage, 6, keyword, category)
      .then((data) => {
        setTotalPages(data.totalPages);
      })
      .catch(console.error);
  }, [searchParams, keyword, category, currentPage]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex justify-center gap-2">
      <button
        disabled={currentPage === 0}
        onClick={() => handlePageChange(currentPage - 1)}
        className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ← Previous
      </button>

      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 border rounded ${
            currentPage === i ? "bg-blue-600 text-white" : "hover:bg-gray-100"
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages - 1}
        onClick={() => handlePageChange(currentPage + 1)}
        className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next →
      </button>
    </div>
  );
}
