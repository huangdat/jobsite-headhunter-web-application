import React from "react";
import { MdOutlineHandshake } from "react-icons/md";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface LogoProps {
  size?: "sm" | "default" | "lg";
  className?: string;
  variant?: "default" | "minimal";
}

export const Logo: React.FC<LogoProps> = ({
  size = "default",
  className,
  variant = "default",
}) => {
  const sizes = {
    sm: {
      icon: "text-base",
      iconBg: "p-1 rounded-md",
      text: "text-lg",
    },
    default: {
      icon: "text-lg",
      iconBg: "p-1.5 rounded-lg",
      text: "text-xl",
    },
    lg: {
      icon: "text-2xl",
      iconBg: "p-2 rounded-xl",
      text: "text-3xl",
    },
  };

  const currentSize = sizes[size];

  return (
    <Link
      to="/home"
      className={cn("flex items-center gap-2 cursor-pointer", className)}
    >
      {variant === "default" && (
        <div className={cn("bg-brand-primary", currentSize.iconBg)}>
          <MdOutlineHandshake className={cn("text-black", currentSize.icon)} />
        </div>
      )}
      <span className={cn("font-bold tracking-tight", currentSize.text)}>
        Job
        <span className="text-brand-primary">Site</span>
      </span>
    </Link>
  );
};
