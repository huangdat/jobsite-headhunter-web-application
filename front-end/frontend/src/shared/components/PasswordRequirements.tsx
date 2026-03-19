import React from "react";
import { useTranslation } from "react-i18next";

interface PasswordRequirement {
  met: boolean;
  label: string;
}

interface PasswordRequirementsProps {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
}

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  minLength,
  hasUpperCase,
  hasLowerCase,
  hasNumber,
}) => {
  const { t } = useTranslation();

  const requirements: PasswordRequirement[] = [
    { met: minLength, label: t("auth.pages.passwordRequirements.minLength") },
    {
      met: hasUpperCase,
      label: t("auth.pages.passwordRequirements.uppercase"),
    },
    {
      met: hasLowerCase,
      label: t("auth.pages.passwordRequirements.lowercase"),
    },
    { met: hasNumber, label: t("auth.pages.passwordRequirements.number") },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
        {t("auth.pages.passwordRequirements.title")}
      </h4>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {requirements.map((requirement, index) => (
          <li
            key={index}
            className="flex items-center gap-2 text-sm text-slate-500"
          >
            <span
              className={`material-symbols-outlined text-lg ${
                requirement.met ? "text-brand-primary" : "text-slate-300"
              }`}
            >
              {requirement.met ? "check_circle" : "radio_button_unchecked"}
            </span>
            {requirement.label}
          </li>
        ))}
      </ul>
    </div>
  );
};
