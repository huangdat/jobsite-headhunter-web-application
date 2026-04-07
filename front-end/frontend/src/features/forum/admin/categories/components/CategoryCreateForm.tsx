/**
 * CategoryCreateForm Component
 * FOR-02: Modal form for creating new categories with auto-slug generation
 */

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useCreateCategoryMutation } from "../hooks/useCategoryManagement";
import { getSemanticClass } from "@/lib/design-tokens";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Loader2 } from "lucide-react";
import type { CreateCategoryRequest } from "../types";

interface CategoryCreateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Slug generation algorithm:
 * - Lowercase
 * - Remove diacritics (Vietnamese)
 * - Remove special characters
 * - Replace spaces with hyphens
 * - Remove leading/trailing hyphens
 */
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Space to hyphen
    .replace(/-+/g, "-") // Multiple hyphens to single
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
};

export function CategoryCreateForm({
  open,
  onOpenChange,
}: CategoryCreateFormProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
  }>({});

  const createMutation = useCreateCategoryMutation();

  // Derive slug from name using useMemo (no setState in effect)
  const slug = useMemo(() => {
    if (name.trim()) {
      return generateSlug(name);
    }
    return "";
  }, [name]);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name =
        t("forum.validation.nameRequired") || "Category name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const data: CreateCategoryRequest = {
      name: name.trim(),
    };

    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success(
          t("forum.messages.createSuccess") || "Category created successfully"
        );
        setName("");
        onOpenChange(false);
      },
      onError: (error: unknown) => {
        let message = "";
        if (
          error &&
          typeof error === "object" &&
          "response" in error &&
          error.response &&
          typeof error.response === "object" &&
          "data" in error.response &&
          error.response.data &&
          typeof error.response.data === "object" &&
          "message" in error.response.data &&
          typeof error.response.data.message === "string"
        ) {
          message = error.response.data.message;
        }

        if (message?.includes("CATEGORY_NAME_REQUIRED")) {
          setErrors((prev) => ({
            ...prev,
            name:
              t("forum.validation.nameRequired") || "Category name is required",
          }));
        } else {
          toast.error(
            message ||
              t("forum.messages.createFailed") ||
              "Failed to create category"
          );
        }
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t("forum.actions.createNew") || "Create New Category"}
          </DialogTitle>
          <DialogDescription>
            {t("forum.messages.addNewCategory") ||
              "Add a new discussion area to the platform."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name field */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t("forum.fields.categoryName") || "Category Name"}
            </label>
            <Input
              placeholder={
                t("forum.placeholders.categoryName") || "e.g. Technical Support"
              }
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              disabled={createMutation.isPending}
            />
            {errors.name && (
              <div
                className={`flex gap-2 ${getSemanticClass("danger", "text", true)} text-sm`}
              >
                <AlertCircle size={14} />
                {errors.name}
              </div>
            )}
          </div>

          {/* Slug preview field (read-only) */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t("forum.fields.slug") || "Slug"}
            </label>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">/</span>
              <Input
                placeholder="technical-support"
                value={slug}
                readOnly
                disabled
                className="bg-slate-100 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-slate-500">
              {t("forum.help.slugAutoGenerate") ||
                "Auto-generates from category name"}
            </p>
          </div>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">
              {t("forum.actions.cancel") || "Cancel"}
            </Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={createMutation.isPending}
            className={getSemanticClass("success", "bg", true)}
          >
            {createMutation.isPending ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                {t("forum.actions.creating") || "Creating..."}
              </>
            ) : (
              t("forum.actions.createCategory") || "Create Category"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
