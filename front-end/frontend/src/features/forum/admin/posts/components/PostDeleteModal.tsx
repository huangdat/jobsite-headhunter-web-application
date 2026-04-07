/**
 * PostDeleteModal Component
 * FOR-09: Modal for confirming post deletion
 */

import { useTranslation } from "react-i18next";
import { getSemanticClass } from "@/lib/design-tokens";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface PostDeleteModalProps {
  postId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function PostDeleteModal({
  open,
  onOpenChange,
  onConfirm,
  isDeleting = false,
}: PostDeleteModalProps) {
  const { t } = useTranslation();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("forum.posts.modals.deleteTitle") || "Delete Post"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("forum.posts.modals.deleteMessage") ||
              "Both the post and all associated comments will be deleted. This action cannot be undone."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            {t("forum.posts.actions.cancel") || "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isDeleting}
            className={getSemanticClass("danger", "bg", true)}
          >
            {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {t("forum.posts.actions.delete") || "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default PostDeleteModal;
