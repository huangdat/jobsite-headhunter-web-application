/**
 * Reusable Confirmation Dialog
 * Used for delete, lock, unlock, and other confirmation actions
 */

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";
import { getSemanticClass } from "@/lib/design-tokens";

export type ConfirmationVariant = "danger" | "warning" | "info" | "success";

export interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmationVariant;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
  children?: React.ReactNode;
}

const variantConfig = {
  danger: {
    icon: XCircle,
    iconColor: getSemanticClass("danger", "text", true),
    buttonVariant: "destructive" as const,
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-amber-600",
    buttonVariant: "default" as const,
  },
  info: {
    icon: Info,
    iconColor: getSemanticClass("info", "icon", true),
    buttonVariant: "default" as const,
  },
  success: {
    icon: CheckCircle,
    iconColor: "text-emerald-600",
    buttonVariant: "default" as const,
  },
};

/**
 * Generic confirmation dialog component
 *
 * @example
 * ```tsx
 * <ConfirmationDialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Delete User"
 *   description="Are you sure you want to delete this user? This action cannot be undone."
 *   variant="danger"
 *   confirmText="Delete"
 *   onConfirm={handleDelete}
 *   isLoading={isDeleting}
 * />
 * ```
 */
export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "info",
  onConfirm,
  isLoading = false,
  children,
}: ConfirmationDialogProps) {
  // eslint-disable-next-line security/detect-object-injection
  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = async () => {
    try {
      await onConfirm();
      onOpenChange(false);
    } catch {
      // Error handled by error handler
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="shrink-0">
              <Icon className={`h-6 w-6 ${config.iconColor}`} />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-left">{title}</DialogTitle>
              {description && (
                <DialogDescription className="text-left mt-2">
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        {children && <div className="py-4">{children}</div>}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={config.buttonVariant}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
