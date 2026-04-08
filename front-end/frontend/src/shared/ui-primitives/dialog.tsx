import * as React from "react";
import * as DialogRadix from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { Button } from "@/shared/ui-primitives/button";
import { XIcon } from "lucide-react";

function Dialog({ ...props }: React.ComponentProps<typeof DialogRadix.Root>) {
  return <DialogRadix.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogRadix.Trigger>) {
  return <DialogRadix.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogRadix.Portal>) {
  return <DialogRadix.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogRadix.Close>) {
  return <DialogRadix.Close data-slot="dialog-close" {...props} />;
}

// 1. ADDED forwardRef HERE
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogRadix.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogRadix.Overlay>
>(({ className, ...props }, ref) => {
  return (
    <DialogRadix.Overlay
      ref={ref}
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  );
});
DialogOverlay.displayName = DialogRadix.Overlay.displayName;

// 2. ADDED forwardRef HERE
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogRadix.Content>,
  React.ComponentPropsWithoutRef<typeof DialogRadix.Content> & {
    showCloseButton?: boolean;
  }
>(({ className, children, showCloseButton = true, ...props }, ref) => {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogRadix.Content
        ref={ref}
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-background p-4 text-sm ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogRadix.Close data-slot="dialog-close" asChild>
            <Button
              variant="ghost"
              className="absolute top-2 right-2"
              size="icon-sm"
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </Button>
          </DialogRadix.Close>
        )}
      </DialogRadix.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogRadix.Content.displayName;

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogRadix.Close asChild>
          <Button variant="outline">{t("dialogs.closeDialog")}</Button>
        </DialogRadix.Close>
      )}
    </div>
  );
}

// 3. ADDED forwardRef HERE to be safe
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogRadix.Title>,
  React.ComponentPropsWithoutRef<typeof DialogRadix.Title>
>(({ className, ...props }, ref) => {
  return (
    <DialogRadix.Title
      ref={ref}
      data-slot="dialog-title"
      className={cn("text-base leading-none font-medium", className)}
      {...props}
    />
  );
});
DialogTitle.displayName = DialogRadix.Title.displayName;

// 4. ADDED forwardRef HERE to be safe
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogRadix.Description>,
  React.ComponentPropsWithoutRef<typeof DialogRadix.Description>
>(({ className, ...props }, ref) => {
  return (
    <DialogRadix.Description
      ref={ref}
      data-slot="dialog-description"
      className={cn(
        "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  );
});
DialogDescription.displayName = DialogRadix.Description.displayName;

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};

