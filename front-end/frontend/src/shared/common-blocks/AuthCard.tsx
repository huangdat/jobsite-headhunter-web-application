import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  description?: string;
  className?: string;
  variant?: "default" | "minimal";
}

export const AuthCard: React.FC<AuthCardProps> = ({
  children,
  title,
  subtitle,
  description,
  className,
  variant = "default",
}) => {
  const { t } = useTranslation("auth");
  return (
    <div
      className={cn(
        "w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden",
        variant === "default" && "grid md:grid-cols-2",
        className
      )}
    >
      {/* Left Panel - Dark Marketing */}
      {variant === "default" && (
        <div className="bg-linear-to-br from-dark-panel-from to-dark-panel-to text-white p-10 flex flex-col justify-center">
          {title && (
            <h1 className="text-5xl font-bold leading-tight">{title}</h1>
          )}

          {description && <p className="text-gray-300 mt-6">{description}</p>}
        </div>
      )}

      {/* Right Panel - Form */}
      <div className="p-10">
        {subtitle && (
          <>
            <h2 className="text-3xl font-bold mb-2">{subtitle}</h2>
            <p className="text-gray-500 mb-8">
              {t("common.enterDetailsDescription")}
            </p>
          </>
        )}
        {children}
      </div>
    </div>
  );
};
