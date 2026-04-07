/**
 * PostEditForm Component
 * FOR-07: Modal form for editing existing forum posts
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { getSemanticClass } from "@/lib/design-tokens";
import {
  usePostQuery,
  useUpdatePostMutation,
  useUploadPostImageMutation,
} from "../hooks/usePostManagement";
import { useCategoriesQuery } from "@/features/forum/admin/categories/hooks/useCategoryManagement";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Loader2, Upload, X } from "lucide-react";
import type { UpdatePostRequest, ForumCategory, PostStatus } from "../types";

interface PostEditFormProps {
  postId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 500;

export function PostEditForm({
  postId,
  open,
  onOpenChange,
}: PostEditFormProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    content: "",
    status: "DRAFT" as PostStatus,
  });

  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dataInitializedRef] = useState(() => ({ current: false }));

  // Queries
  const postQuery = usePostQuery(open ? postId : null);
  const updateMutation = useUpdatePostMutation();
  const uploadImageMutation = useUploadPostImageMutation();
  const categoriesQuery = useCategoriesQuery({
    keyword: "",
    page: 1,
    size: 100,
  });

  const categories: ForumCategory[] =
    categoriesQuery.data && "data" in categoriesQuery.data
      ? categoriesQuery.data.data
      : [];

  // Load post data when query succeeds
  useEffect(() => {
    if (postQuery.data && !dataInitializedRef.current) {
      setFormData({
        title: postQuery.data.title,
        description: postQuery.data.description || "",
        categoryId: postQuery.data.categoryId.toString(),
        content: postQuery.data.content,
        status: postQuery.data.status,
      });
      if (postQuery.data.featuredImage) {
        setImagePreview(postQuery.data.featuredImage);
      }
      dataInitializedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postQuery.data]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title =
        t("forum.posts.validations.titleRequired") || "Title is required";
    } else if (formData.title.length > MAX_TITLE_LENGTH) {
      newErrors.title =
        t("forum.posts.validations.titleMax200") ||
        "Title must not exceed 200 characters";
    }

    if (!formData.categoryId) {
      newErrors.categoryId =
        t("forum.posts.validations.categoryRequired") || "Category is required";
    }

    if (!formData.content.trim()) {
      newErrors.content =
        t("forum.posts.validations.contentRequired") ||
        "Post content is required";
    }

    if (featuredImage) {
      if (!ALLOWED_IMAGE_TYPES.includes(featuredImage.type)) {
        newErrors.featuredImage =
          t("forum.posts.validations.imageFormatInvalid") ||
          "Supported formats: JPG, PNG, GIF, WebP";
      } else if (featuredImage.size > MAX_IMAGE_SIZE) {
        newErrors.featuredImage =
          t("forum.posts.validations.imageSizeMax") ||
          "Image must not exceed 5MB";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        toast.error(
          t("forum.posts.validations.imageFormatInvalid") ||
            "Supported formats: JPG, PNG, GIF, WebP"
        );
        return;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        toast.error(
          t("forum.posts.validations.imageSizeMax") ||
            "Image must not exceed 5MB"
        );
        return;
      }

      setFeaturedImage(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.featuredImage;
        return newErrors;
      });
    },
    [t]
  );

  const handleRemoveImage = () => {
    setFeaturedImage(null);
    // Only clear preview if new image was selected, keep original
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      let imageUrl = imagePreview;

      // Upload image if newly selected
      if (featuredImage) {
        const uploadResult =
          await uploadImageMutation.mutateAsync(featuredImage);
        imageUrl = uploadResult;
      }

      const updateData: UpdatePostRequest = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        categoryId: parseInt(formData.categoryId),
        content: formData.content.trim(),
        featuredImage: imageUrl || undefined,
        status: formData.status,
      };

      updateMutation.mutate(
        { id: postId, data: updateData },
        {
          onSuccess: () => {
            toast.success(
              t("forum.messages.updateSuccess") || "Post updated successfully"
            );
            onOpenChange(false);
          },
          onError: (error: unknown) => {
            let message = "";
            if (error && typeof error === "object" && "response" in error) {
              const response = (error as Record<string, unknown>)
                .response as Record<string, unknown>;
              if ("data" in response && response.data) {
                const data = response.data as Record<string, unknown>;
                if ("message" in data && typeof data.message === "string") {
                  message = data.message;
                }
              }
            }
            toast.error(
              message ||
                t("forum.posts.messages.updateError") ||
                "Failed to update post"
            );
          },
        }
      );
    } catch {
      toast.error(
        t("forum.posts.imageErrors.uploadError") ||
          "An error occurred while uploading image"
      );
    }
  };

  const handleClose = () => {
    if (!updateMutation.isPending && !uploadImageMutation.isPending) {
      onOpenChange(false);
      setErrors({});
      setFeaturedImage(null);
    }
  };

  const isLoading =
    postQuery.isLoading ||
    updateMutation.isPending ||
    uploadImageMutation.isPending;

  if (postQuery.isLoading) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl flex items-center justify-center min-h-96">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {t("forum.posts.modals.editTitle") || "Edit Post"}
          </DialogTitle>
          <DialogDescription>
            {t("forum.posts.modals.editDescription") ||
              "Update the post information"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t("forum.posts.fields.title")} *
            </label>
            <Input
              placeholder={
                t("forum.posts.placeholders.postTitle") || "Post title"
              }
              value={formData.title}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, title: e.target.value }));
                if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
              }}
              maxLength={MAX_TITLE_LENGTH}
              disabled={isLoading}
            />
            <div className="flex justify-between mt-1">
              {errors.title && (
                <span
                  className={`text-sm ${getSemanticClass("danger", "text", true)} flex items-center gap-1`}
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.title}
                </span>
              )}
              <span className="text-xs text-slate-500 ml-auto">
                {formData.title.length}/{MAX_TITLE_LENGTH}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t("forum.posts.fields.description")}
            </label>
            <Textarea
              placeholder={
                t("forum.posts.placeholders.description") || "Brief summary..."
              }
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              maxLength={MAX_DESCRIPTION_LENGTH}
              rows={2}
              disabled={isLoading}
            />
            <span className="text-xs text-slate-500 mt-1 block text-right">
              {formData.description.length}/{MAX_DESCRIPTION_LENGTH}
            </span>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t("forum.posts.fields.category")} *
            </label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, categoryId: value }));
                if (errors.categoryId)
                  setErrors((prev) => ({ ...prev, categoryId: "" }));
              }}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    t("forum.posts.placeholders.selectCategory") ||
                    "Select a category..."
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <span
                className={`text-sm ${getSemanticClass("danger", "text", true)} flex items-center gap-1 mt-1`}
              >
                <AlertCircle className="w-4 h-4" />
                {errors.categoryId}
              </span>
            )}
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t("forum.posts.fields.image")}
            </label>

            {!featuredImage && imagePreview && (
              <div className="relative max-w-xs">
                <img
                  src={imagePreview}
                  alt={t("forum.posts.images.altCurrent") || "Current"}
                  className="w-full rounded-lg"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setImagePreview("")}
                  className={`absolute top-2 right-2 ${getSemanticClass("danger", "bg", true)} text-white rounded-full`}
                >
                  <X className="w-4 h-4" />
                </Button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full text-sm text-slate-600 hover:text-slate-900 mt-2 p-1"
                  disabled={isLoading}
                >
                  Change image
                </button>
              </div>
            )}

            {!imagePreview && !featuredImage && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer hover:border-slate-400 transition"
              >
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600">
                  Click to upload featured image
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  PNG, JPG, GIF, WebP (max. 5MB)
                </p>
              </div>
            )}

            {featuredImage && (
              <div className="relative max-w-xs">
                <img
                  src={URL.createObjectURL(featuredImage)}
                  alt={t("forum.posts.images.altNewPreview") || "New preview"}
                  className="w-full rounded-lg"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveImage}
                  className={`absolute top-2 right-2 ${getSemanticClass("danger", "bg", true)} text-white rounded-full`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleImageSelect}
              disabled={isLoading}
            />

            {errors.featuredImage && (
              <span
                className={`text-sm ${getSemanticClass("danger", "text", true)} flex items-center gap-1 mt-2`}
              >
                <AlertCircle className="w-4 h-4" />
                {errors.featuredImage}
              </span>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t("forum.posts.fields.content")} *
            </label>
            <Textarea
              placeholder={
                t("forum.posts.placeholders.content") || "Post content..."
              }
              value={formData.content}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, content: e.target.value }));
                if (errors.content)
                  setErrors((prev) => ({ ...prev, content: "" }));
              }}
              rows={5}
              disabled={isLoading}
            />
            {errors.content && (
              <span
                className={`text-sm ${getSemanticClass("danger", "text", true)} flex items-center gap-1 mt-1`}
              >
                <AlertCircle className="w-4 h-4" />
                {errors.content}
              </span>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t("forum.posts.fields.status")}
            </label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  status: value as PostStatus,
                }))
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              {t("forum.posts.actions.cancel") || "Cancel"}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className={getSemanticClass("success", "bg", true)}
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t("forum.posts.actions.save") || "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PostEditForm;
