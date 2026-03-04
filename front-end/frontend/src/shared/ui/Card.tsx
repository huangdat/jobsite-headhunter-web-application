import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  onClick,
}) => {
  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
