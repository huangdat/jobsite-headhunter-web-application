import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface SocialLoginButtonsProps {
  onGoogleClick?: () => void;
  onLinkedInClick?: () => void;
  className?: string;
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onGoogleClick,
  onLinkedInClick,
  className,
}) => {
  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-4">
        {/* Google */}
        <Button
          type="button"
          variant="outline"
          onClick={onGoogleClick}
          className="cursor-pointer flex items-center justify-center gap-2"
        >
          <FcGoogle size={20} />
          Google
        </Button>

        {/* LinkedIn */}
        <Button
          type="button"
          variant="outline"
          onClick={onLinkedInClick}
          className="cursor-pointer flex items-center justify-center gap-2"
        >
          <FaLinkedin className="text-linkedin" size={20} />
          LinkedIn
        </Button>
      </div>
    </div>
  );
};
