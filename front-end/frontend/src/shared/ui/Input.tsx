import React, { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: string;
  error?: boolean;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, error, rightIcon, className = "", ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={`w-full ${icon ? "pl-12" : "pl-4"} ${
            rightIcon ? "pr-12" : "pr-4"
          } py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-[#39FF14] transition-all placeholder:text-slate-400 ${
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
