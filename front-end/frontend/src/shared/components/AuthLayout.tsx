import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";
import { useCommonTranslation, usePagesTranslation } from "@/shared/hooks";

interface NavLink {
  to: string;
  label: string;
}

interface CtaButton {
  to: string;
  label: string;
}

interface AuthLayoutProps {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  navLinks?: NavLink[];
  ctaButton?: CtaButton;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  className,
  showHeader = true,
  showFooter = true,
  navLinks = [],
  ctaButton: ctaButtonProp,
}) => {
  const { t: tPages } = usePagesTranslation();
  const { t: tCommon } = useCommonTranslation();
  const ctaButton = ctaButtonProp || {
    to: "/select-role",
    label: tPages("signup"),
  };
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {showHeader && (
        <header className="max-w-7xl mx-auto w-full px-6 py-4 flex items-center justify-between">
          <Logo />

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium transition-colors hover:text-brand-primary"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to={ctaButton.to}
              className="bg-slate-900 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-slate-800 transition"
            >
              {ctaButton.label}
            </Link>
          </nav>
        </header>
      )}

      <main
        className={cn(
          "flex-1 flex items-center justify-center px-6",
          className
        )}
      >
        {children}
      </main>

      {showFooter && (
        <footer className="mt-12 text-center pb-8">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} {tCommon("appName")}.{" "}
            {tCommon("allRightsReserved")}
          </p>
        </footer>
      )}
    </div>
  );
};
