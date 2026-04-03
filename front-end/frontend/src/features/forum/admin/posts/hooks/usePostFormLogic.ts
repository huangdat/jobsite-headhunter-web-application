/**
 * usePostFormLogic Hook
 * Shared logic for both create and edit post forms
 */

import { useState, useCallback } from "react";

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_TITLE_LENGTH = 200;
export const MAX_DESCRIPTION_LENGTH = 500;

export interface PostFormData {
  title: string;
  description: string;
  categoryId: string;
  content: string;
  status: "DRAFT" | "PUBLISHED";
}

export interface PostFormErrors {
  title?: string;
  description?: string;
  categoryId?: string;
  content?: string;
  featuredImage?: string;
}

export interface UsePostFormLogicOptions {
  initialData?: Partial<PostFormData>;
  initialImage?: string;
  t: (key: string) => string;
}

export function usePostFormLogic({
  initialData,
  initialImage = "",
  t,
}: UsePostFormLogicOptions) {
  const [formData, setFormData] = useState<PostFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    categoryId: initialData?.categoryId || "",
    content: initialData?.content || "",
    status: initialData?.status || "DRAFT",
  });

  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialImage);
  const [errors, setErrors] = useState<PostFormErrors>({});

  const validateForm = useCallback((): boolean => {
    const newErrors: PostFormErrors = {};

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
  }, [formData, featuredImage, t]);

  const handleImageChange = useCallback(
    (file: File | null, preview: string) => {
      setFeaturedImage(file);
      setImagePreview(preview);
      // Clear image errors when new image is selected
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.featuredImage;
        return newErrors;
      });
    },
    []
  );

  const handleImageRemove = useCallback(() => {
    setFeaturedImage(null);
    setImagePreview("");
  }, []);

  const updateField = useCallback(
    <K extends keyof PostFormData>(field: K, value: PostFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error for this field
      if (errors[field as keyof PostFormErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  const resetForm = useCallback(() => {
    setFormData({
      title: "",
      description: "",
      categoryId: "",
      content: "",
      status: "DRAFT",
    });
    setFeaturedImage(null);
    setImagePreview("");
    setErrors({});
  }, []);

  return {
    formData,
    setFormData,
    featuredImage,
    imagePreview,
    errors,
    setErrors,
    validateForm,
    handleImageChange,
    handleImageRemove,
    updateField,
    resetForm,
  };
}
