import React from "react";
import { getSemanticClass } from "@/lib/design-tokens";
import { LabelText, Caption } from "./typography/Typography";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required,
  children,
}) => {
  return (
    <div className="mb-2">
      <LabelText required={required}>{label}</LabelText>

      {children}

      {error && (
        <div
          className={`flex items-center gap-1 ${getSemanticClass("danger", "text", true)}`}
        >
          <span className="material-symbols-outlined text-[calc(12px)]!">
            error
          </span>
          <Caption variant="error">{error}</Caption>
        </div>
      )}
    </div>
  );
};
