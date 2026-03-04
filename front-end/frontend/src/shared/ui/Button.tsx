import React from "react";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "social";
  icon?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  icon,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "font-bold rounded-2xl flex items-center justify-center gap-2 transition-all";

  const variants = {
    primary:
      "w-full py-4 text-black shadow-lg shadow-green-500/25 bg-gradient-to-r from-[#00C853] to-[#39FF14] hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed",
    secondary:
      "w-full py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white hover:opacity-90",
    outline:
      "py-3 px-6 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800",
    social:
      "flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && (
        <span className="material-symbols-outlined text-xl">{icon}</span>
      )}
      {children}
    </button>
  );
};
