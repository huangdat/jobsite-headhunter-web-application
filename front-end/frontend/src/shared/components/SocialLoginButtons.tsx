import React from "react";
import { useTranslation } from "react-i18next";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface SocialLoginButtonsProps {
  onGoogleClick?: () => void;
  onLinkedInClick?: () => void;
  googleDisabled?: boolean;
  linkedInDisabled?: boolean;
  loadingProvider?: "google" | "linkedin" | null;
  className?: string;
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onGoogleClick,
  onLinkedInClick,
  googleDisabled = false,
  linkedInDisabled = false,
  loadingProvider = null,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-4">
        {/* Google */}
        <Button
          type="button"
          variant="outline"
          onClick={onGoogleClick}
          disabled={googleDisabled || loadingProvider !== null}
          className="cursor-pointer flex items-center justify-center gap-2"
        >
          <FcGoogle size={20} />
          {loadingProvider === "google" ? t("auth.buttons.connecting") : t("auth.pages.social.google")}
        </Button>

        {/* LinkedIn */}
        <Button
          type="button"
          variant="outline"
          onClick={onLinkedInClick}
          disabled={linkedInDisabled || loadingProvider !== null}
          className="cursor-pointer flex items-center justify-center gap-2"
        >
          <FaLinkedin className="text-linkedin" size={20} />
          {loadingProvider === "linkedin" ? t("auth.buttons.connecting") : t("auth.pages.social.linkedin")}
        </Button>
      </div>
    </div>
  );
};
