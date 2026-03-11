import React from "react";

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
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {children}

      {error && (
        <div className="flex items-center gap-1 text-red-500">
          <span className="material-symbols-outlined !text-[12px]">error</span>
          <p className="text-xs font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};
