/**
 * CategoryDeleteModal Component
 * FOR-05: Confirmation modal for deleting categories (soft delete)
 */

import { useTranslation } from "react-i18next";
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
import { AlertTriangle, Loader2 } from "lucide-react";

interface CategoryDeleteModalProps {
  categoryId: number;
  categoryName: string;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CategoryDeleteModal({
  categoryId,
  categoryName,
  isLoading,
  onConfirm,
  onCancel,
}: CategoryDeleteModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={!!categoryId} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex gap-3 items-start">
            <AlertTriangle className="text-red-600 mt-1 shrink-0" size={24} />
            <div>
              <DialogTitle>
                {t("forum.actions.deleteCategory") || "Delete Category"}
              </DialogTitle>
              <DialogDescription>
                {t("forum.messages.deleteConfirm") ||
                  "Are you sure you want to delete this category?"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
          <strong>{categoryName}</strong>
          <p className="mt-1">
            {t("forum.messages.deleteWarning") ||
              "This action cannot be undone. This category will be soft-deleted."}
          </p>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isLoading}>
              {t("forum.actions.cancel") || "Cancel"}
            </Button>
          </DialogClose>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                {t("forum.actions.deleting") || "Deleting..."}
              </>
            ) : (
              t("forum.actions.deleteConfirm") || "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
