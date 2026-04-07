/**
 * CategoryList Component
 * FOR-01 to FOR-05: Displays list, search, edit, toggle, delete categories
 */

import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { getSemanticClass } from "@/lib/design-tokens";
import {
  useCategoriesQuery,
  useUpdateCategoryMutation,
  useToggleCategoryMutation,
  useDeleteCategoryMutation,
} from "../hooks/useCategoryManagement";
import { CategoryCreateForm } from "./CategoryCreateForm";
import { CategoryDeleteModal } from "./CategoryDeleteModal";
import { UI_CONSTANTS } from "@/lib/constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from "lucide-react";
import type { ForumCategory, CategoryFilterParams } from "../types";

// Helper function to safely extract error message
function getErrorMessage(error: unknown): string {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    (error as Record<string, unknown>).response &&
    typeof (error as Record<string, unknown>).response === "object"
  ) {
    const response = (error as Record<string, unknown>).response as Record<
      string,
      unknown
    >;
    if ("data" in response && response.data) {
      const data = response.data as Record<string, unknown>;
      if ("message" in data && typeof data.message === "string") {
        return data.message;
      }
    }
  }
  return "";
}

function getErrorStatus(error: unknown): number | null {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    (error as Record<string, unknown>).response &&
    typeof (error as Record<string, unknown>).response === "object"
  ) {
    const response = (error as Record<string, unknown>).response as Record<
      string,
      unknown
    >;
    if ("status" in response && typeof response.status === "number") {
      return response.status;
    }
  }
  return null;
}

function SkeletonRow() {
  return (
    <TableRow>
      {Array.from({ length: 6 }).map((_, i) => (
        <TableCell key={i}>
          <div className="h-4 bg-slate-200 rounded animate-pulse w-full" />
        </TableCell>
      ))}
    </TableRow>
  );
}

export function CategoryList() {
  const { t } = useTranslation();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filters, setFilters] = useState<CategoryFilterParams>({
    keyword: "",
    page: 1,
    size: 10, // Match backend default size
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState({ name: "" });
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [toggling, setToggling] = useState<number | null>(null);

  // Debounce search
  const handleSearch = useCallback((keyword: string) => {
    setSearchKeyword(keyword);
    const timer = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        keyword: keyword,
        page: 1, // Reset to page 1 on search
      }));
    }, UI_CONSTANTS.DEBOUNCE_DELAY);
    return () => clearTimeout(timer);
  }, []);

  // Queries and mutations
  const { data: response, isLoading } = useCategoriesQuery(filters);
  const updateMutation = useUpdateCategoryMutation();
  const toggleMutation = useToggleCategoryMutation();
  const deleteMutation = useDeleteCategoryMutation();

  const categories: ForumCategory[] =
    response && "data" in response ? response.data : [];
  const meta =
    response && "page" in response
      ? {
          page: response.page,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
        }
      : { page: 1, size: 10, totalElements: 0, totalPages: 1 };

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleFirstPage = () => handlePageChange(1);
  const handlePreviousPage = () => handlePageChange(Math.max(1, meta.page - 1));
  const handleNextPage = () =>
    handlePageChange(Math.min(meta.totalPages, meta.page + 1));
  const handleLastPage = () => handlePageChange(meta.totalPages);

  // Edit handlers
  const handleEditOpen = (category: ForumCategory) => {
    setEditingId(category.id);
    setEditValues({ name: category.name });
  };

  const handleEditSave = async () => {
    if (!editingId || !editValues.name.trim()) {
      toast.error(
        t("forum.messages.categoryNameRequired") || "Category name is required"
      );
      return;
    }

    updateMutation.mutate(
      { id: editingId, data: { name: editValues.name } },
      {
        onSuccess: () => {
          toast.success(
            t("forum.messages.updateSuccess") || "Updated successfully"
          );
          setEditingId(null);
        },
        onError: (error: unknown) => {
          const message =
            getErrorMessage(error) ||
            t("forum.messages.updateFailed") ||
            "Failed to update";
          toast.error(message);
          if (getErrorStatus(error) === 404) {
            // Category was deleted, reload list
            location.reload();
          }
        },
      }
    );
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditValues({ name: "" });
  };

  // Toggle status handler
  const handleToggle = async (id: number) => {
    setToggling(id);
    toggleMutation.mutate(id, {
      onSuccess: (updated) => {
        const category = updated as ForumCategory;
        const message =
          category.status === "ACTIVE"
            ? t("forum.messages.activateSuccess") || "Activated successfully"
            : t("forum.messages.deactivateSuccess") ||
              "Deactivated successfully";
        toast.success(message);
        setToggling(null);
      },
      onError: (error: unknown) => {
        setToggling(null);
        if (getErrorStatus(error) === 404) {
          toast.error(
            t("forum.messages.categoryNotFound") || "Category not found"
          );
          location.reload();
        } else {
          toast.error(
            getErrorMessage(error) ||
              t("forum.messages.toggleFailed") ||
              "Failed to update status"
          );
        }
      },
    });
  };

  // Delete handler
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        toast.success(
          t("forum.messages.deleteSuccess") || "Deleted successfully"
        );
        setDeleteId(null);
        // Handle auto-pagination
        if (categories.length === 1 && meta.page > 1) {
          handlePageChange(meta.page - 1);
        }
      },
      onError: (error: unknown) => {
        toast.error(
          getErrorMessage(error) ||
            t("forum.messages.deleteFailed") ||
            "Failed to delete"
        );
      },
    });
  };

  const isEmptySearch =
    filters.keyword && categories.length === 0 && !isLoading;
  const isEmpty = !isLoading && categories.length === 0 && !filters.keyword;

  return (
    <div className="space-y-6">
      {/* Header with search and create button */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder={
              t("forum.search.placeholder") || "Search categories..."
            }
            value={searchKeyword}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className={getSemanticClass("success", "bg", true)}
        >
          + {t("forum.actions.createNew") || "Create New"}
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>{t("forum.table.name") || "Category Name"}</TableHead>
              <TableHead>{t("forum.table.slug") || "Slug"}</TableHead>
              <TableHead className="text-right">
                {t("forum.table.postsCount") || "Posts"}
              </TableHead>
              <TableHead>{t("forum.table.status") || "Status"}</TableHead>
              <TableHead>{t("forum.table.createdDate") || "Created"}</TableHead>
              <TableHead className="text-right">
                {t("forum.table.actions") || "Actions"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

            {!isLoading && isEmpty && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle className="text-slate-400" size={32} />
                    <p className="text-slate-600">
                      {t("forum.messages.noCategories") || "No categories yet"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!isLoading && isEmptySearch && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle className="text-slate-400" size={32} />
                    <p className="text-slate-600">
                      {t("forum.messages.noResults") || "No categories found"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              categories.map((category: ForumCategory) => (
                <TableRow
                  key={category.id}
                  className={
                    editingId === category.id
                      ? "bg-slate-50"
                      : "hover:bg-slate-50"
                  }
                >
                  {editingId === category.id ? (
                    <>
                      <TableCell>
                        <input
                          type="text"
                          value={editValues.name}
                          onChange={(e) =>
                            setEditValues({ name: e.target.value })
                          }
                          className="w-full px-2 py-1 border rounded"
                          placeholder={
                            t("forum.fields.categoryNamePlaceholder") ||
                            "Category name"
                          }
                          autoFocus
                        />
                      </TableCell>
                      <TableCell>
                        <span className="text-slate-500">{category.slug}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        {category.postsCount}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            category.status === "ACTIVE"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            category.status === "ACTIVE"
                              ? getSemanticClass("success", "bg", true)
                              : "bg-slate-400"
                          }
                        >
                          {category.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(category.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleEditSave}
                            disabled={updateMutation.isPending}
                          >
                            {updateMutation.isPending ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              "Save"
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleEditCancel}
                          >
                            Cancel
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{category.slug}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {category.postsCount}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            category.status === "ACTIVE"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            category.status === "ACTIVE"
                              ? getSemanticClass("success", "bg", true)
                              : "bg-slate-400"
                          }
                        >
                          {category.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(category.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditOpen(category)}
                          >
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggle(category.id)}
                            disabled={toggling === category.id}
                          >
                            {toggling === category.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : category.status === "ACTIVE" ? (
                              <Eye size={16} />
                            ) : (
                              <EyeOff size={16} />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className={`${getSemanticClass("danger", "text", true)} hover:${getSemanticClass("danger", "text", true)} ${getSemanticClass("danger", "bg", true).replace("bg-", "hover:bg-")}`}
                            onClick={() => setDeleteId(category.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && !isLoading && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            {`Showing ${(meta.page - 1) * meta.size + 1}-${Math.min(meta.page * meta.size, meta.totalElements)} of ${meta.totalElements}`}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleFirstPage}
              disabled={meta.page === 1}
            >
              <ChevronsLeft size={16} />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handlePreviousPage}
              disabled={meta.page === 1}
            >
              <ChevronLeft size={16} />
            </Button>

            {/* Page numbers */}
            {Array.from({ length: meta.totalPages }).map((_, i) => {
              const pageNum = i + 1;
              if (
                pageNum === 1 ||
                pageNum === meta.totalPages ||
                (pageNum >= meta.page - 1 && pageNum <= meta.page + 1)
              ) {
                return (
                  <Button
                    key={pageNum}
                    size="sm"
                    variant={pageNum === meta.page ? "default" : "outline"}
                    onClick={() => handlePageChange(pageNum)}
                    className={
                      pageNum === meta.page
                        ? `${getSemanticClass("success", "bg", true)} hover:${getSemanticClass("success", "bg", true).split(" ")[0]}-700`
                        : ""
                    }
                  >
                    {pageNum}
                  </Button>
                );
              }
              if (pageNum === meta.page - 2 || pageNum === meta.page + 2) {
                return (
                  <span key={pageNum} className="px-2">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <Button
              size="sm"
              variant="outline"
              onClick={handleNextPage}
              disabled={meta.page === meta.totalPages}
            >
              <ChevronRight size={16} />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleLastPage}
              disabled={meta.page === meta.totalPages}
            >
              <ChevronsRight size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <CategoryCreateForm open={createOpen} onOpenChange={setCreateOpen} />

      {/* Delete Modal */}
      {deleteId && (
        <CategoryDeleteModal
          categoryId={deleteId}
          categoryName={
            categories.find((c: ForumCategory) => c.id === deleteId)?.name || ""
          }
          isLoading={deleteMutation.isPending}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
