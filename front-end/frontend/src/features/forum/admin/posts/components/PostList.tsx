/**
 * PostList Component
 * FOR-06, FOR-08, FOR-09: Displays list of posts with search, filters, status change, and delete
 */

import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { getSemanticClass } from "@/lib/design-tokens";
import {
  usePostsQuery,
  useUpdatePostStatusMutation,
  useDeletePostMutation,
} from "../hooks/usePostManagement";
import { PostCreateForm } from "./PostCreateForm";
import { PostEditForm } from "./PostEditForm";
import { PostDeleteModal } from "./PostDeleteModal";
import { UI_CONSTANTS } from "@/lib/constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui-primitives/table";
import { Button } from "@/shared/ui-primitives/button";
import { Input } from "@/shared/ui-primitives/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui-primitives/select";
import {
  AlertCircle,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import type { ForumPost, PostFilterParams, PostStatus } from "../types";

// Helper function to format date
function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return dateString;
  }
}

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

function SkeletonRow() {
  return (
    <TableRow>
      {Array.from({ length: 7 }).map((_, i) => (
        <TableCell key={i}>
          <div className="h-4 bg-slate-200 rounded animate-pulse w-full" />
        </TableCell>
      ))}
    </TableRow>
  );
}

export function PostList() {
  const { t } = useTranslation();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filters, setFilters] = useState<PostFilterParams>({
    keyword: "",
    status: undefined,
    page: 1,
    size: 10,
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Debounce search
  const handleSearch = useCallback((keyword: string) => {
    setSearchKeyword(keyword);
    const timer = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        keyword: keyword,
        page: 1,
      }));
    }, UI_CONSTANTS.DEBOUNCE_DELAY);
    return () => clearTimeout(timer);
  }, []);

  // Queries and mutations
  const { data: response, isLoading } = usePostsQuery(filters);
  const statusMutation = useUpdatePostStatusMutation();
  const deleteMutation = useDeletePostMutation();

  const posts: ForumPost[] =
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

  // Status change handler
  const handleStatusChange = (postId: number, newStatus: PostStatus) => {
    statusMutation.mutate(
      { id: postId, data: { status: newStatus } },
      {
        onSuccess: () => {
          toast.success(t("forum.messages.updateSuccess") || "Status updated");
        },
        onError: (error) => {
          const message =
            getErrorMessage(error) ||
            t("forum.posts.messages.updateError") ||
            "Failed to update status";
          toast.error(message);
        },
      }
    );
  };

  // Delete handler
  const handleDelete = (postId: number) => {
    setDeletingId(postId);
    deleteMutation.mutate(postId, {
      onSuccess: () => {
        toast.success(
          t("forum.messages.deleteSuccess") || "Post deleted successfully"
        );
        setDeleteId(null);
        setDeletingId(null);
      },
      onError: (error: unknown) => {
        setDeletingId(null);
        const message =
          getErrorMessage(error) ||
          t("forum.posts.messages.deleteError") ||
          "Failed to delete post";
        toast.error(message);
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <Input
            placeholder={t("forum.actions.search") || "Search posts..."}
            value={searchKeyword}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Select
          value={filters.status || ""}
          onValueChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              status: value ? (value as PostStatus) : undefined,
              page: 1,
            }))
          }
        >
          <SelectTrigger className="w-full md:w-40">
            <SelectValue
              placeholder={t("forum.posts.fields.status") || "All Status"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Error state */}
      {isLoading === false && posts.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">
            {t("forum.messages.noData") || "No posts found"}
          </p>
        </div>
      )}

      {/* Table */}
      {posts.length > 0 && (
        <>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-semibold">Title</TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-right">
                    Created
                  </TableHead>
                  <TableHead className="font-semibold text-right">
                    Views
                  </TableHead>
                  <TableHead className="font-semibold text-right">
                    Comments
                  </TableHead>
                  <TableHead className="font-semibold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <SkeletonRow key={i} />
                    ))
                  : posts.map((post) => (
                      <TableRow key={post.id} className="hover:bg-slate-50">
                        <TableCell className="font-medium truncate max-w-xs">
                          {post.title}
                        </TableCell>
                        <TableCell className="text-slate-600 text-sm">
                          {post.categoryName || "-"}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={post.status}
                            onValueChange={(value) =>
                              handleStatusChange(post.id, value as PostStatus)
                            }
                            disabled={statusMutation.isPending}
                          >
                            <SelectTrigger className="w-fit border-0 p-0 h-auto">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DRAFT">Draft</SelectItem>
                              <SelectItem value="PUBLISHED">
                                Published
                              </SelectItem>
                              <SelectItem value="ARCHIVED">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right text-sm text-slate-600">
                          {formatDate(post.createdAt)}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {post.viewCount}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {post.commentCount}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingId(post.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteId(post.id)}
                              className={`h-8 w-8 p-0 ${getSemanticClass("danger", "text", true)} hover:${getSemanticClass("danger", "text", true)} ${getSemanticClass("danger", "bg", true).replace("bg-", "hover:bg-")}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              {t("common.pagination.showing") ||
                `Showing ${(meta.page - 1) * meta.size + 1} to ${Math.min(
                  meta.page * meta.size,
                  meta.totalElements
                )} of ${meta.totalElements}`}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleFirstPage}
                disabled={meta.page === 1}
              >
                <ChevronsLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={meta.page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <span className="text-sm font-medium">
                {meta.page} / {meta.totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={meta.page === meta.totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLastPage}
                disabled={meta.page === meta.totalPages}
              >
                <ChevronsRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Create Modal */}
      <PostCreateForm open={createOpen} onOpenChange={setCreateOpen} />

      {/* Edit Modal */}
      {editingId && (
        <PostEditForm
          postId={editingId}
          open={editingId !== null}
          onOpenChange={(open: boolean) => {
            if (!open) setEditingId(null);
          }}
        />
      )}

      {/* Delete Modal */}
      {deleteId && (
        <PostDeleteModal
          postId={deleteId}
          open={deleteId !== null}
          onOpenChange={(open) => {
            if (!open) setDeleteId(null);
          }}
          onConfirm={() => handleDelete(deleteId)}
          isDeleting={deletingId === deleteId}
        />
      )}
    </div>
  );
}

export default PostList;

