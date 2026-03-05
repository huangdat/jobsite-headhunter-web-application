import React, { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  error?: boolean;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, error, rightIcon, className = "", ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`w-full ${icon ? "pl-12" : "pl-4"} ${
            rightIcon ? "pr-12" : "pr-4"
          } py-3 bg-slate-50 dark:bg-slate-800
          border border-gray-300
          rounded-xl
          focus:outline-none focus:ring-1 focus:ring-gray-300
          transition-all
          placeholder:text-slate-400 ${
            error ? "ring-2 ring-red-500" : ""
          } ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {rightIcon}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
