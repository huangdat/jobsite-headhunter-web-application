// Simple AlertDialog implementation based on Dialog
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "./dialog";
import { Button } from "./button";

const AlertDialog = Dialog;

const AlertDialogContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DialogContent>
>((props, ref) => <DialogContent ref={ref} {...props} />);
AlertDialogContent.displayName = "AlertDialogContent";

const AlertDialogHeader = DialogHeader;

const AlertDialogFooter = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <DialogFooter {...props} />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

const AlertDialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>((props, ref) => (
  // eslint-disable-next-line jsx-a11y/heading-has-content
  <h2 ref={ref} className="text-lg font-semibold" {...props} />
));
AlertDialogTitle.displayName = "AlertDialogTitle";

const AlertDialogDescription = ({
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className="text-sm text-slate-500" {...props} />
);
AlertDialogDescription.displayName = "AlertDialogDescription";

const AlertDialogAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>((props, ref) => <Button ref={ref} {...props} />);
AlertDialogAction.displayName = "AlertDialogAction";

const AlertDialogCancel = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>((props, ref) => <Button ref={ref} variant="outline" {...props} />);
AlertDialogCancel.displayName = "AlertDialogCancel";

export {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
