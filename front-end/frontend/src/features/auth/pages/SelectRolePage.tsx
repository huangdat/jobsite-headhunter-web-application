import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/shared/components";
import { useAuthTranslation } from "@/shared/hooks";
import type { RegistrationUserRole } from "@/features/auth/types";

import { MdPersonSearch, MdGroups, MdWorkHistory } from "react-icons/md";
import { HiOutlineArrowRight } from "react-icons/hi";

interface RoleOption {
  value: RegistrationUserRole;
  icon: React.ReactNode;
  titleKey: string;
  descKey: string;
}

export function SelectRolePage() {
  const { t } = useAuthTranslation();
  const [selectedRole, setSelectedRole] = useState<RegistrationUserRole | null>(
    null
  );
  const navigate = useNavigate();

  const roleOptions: RoleOption[] = [
    {
      value: "candidate",
      icon: <MdPersonSearch />,
      titleKey: "pages.selectRole.roles.candidate",
      descKey: "pages.selectRole.roles.candidateDesc",
    },
    {
      value: "collaborator",
      icon: <MdGroups />,
      titleKey: "pages.selectRole.roles.collaborator",
      descKey: "pages.selectRole.roles.collaboratorDesc",
    },
    {
      value: "headhunter",
      icon: <MdWorkHistory />,
      titleKey: "pages.selectRole.roles.headhunter",
      descKey: "pages.selectRole.roles.headhunterDesc",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole) {
      navigate(`/register/${selectedRole}`);
    }
  };

  return (
    <AuthLayout ctaButton={{ to: "/login", label: t("auth.buttons.signIn") }}>
      <div className="w-full max-w-5xl min-h-[calc(600px)] bg-white rounded-3xl shadow-xl grid md:grid-cols-2 overflow-hidden">
        {/* LEFT PANEL */}
        <div className="bg-linear-to-br from-dark-panel-from to-dark-panel-to text-white p-10 flex flex-col justify-center">
          <h1 className="text-5xl font-bold leading-tight">
            {t("pages.selectRole.title")} <br />
            <span className="text-lime-400">
              {t("pages.selectRole.titleHighlight")}
            </span>
          </h1>

          <p className="text-gray-300 mt-6">{t("pages.selectRole.subtitle")}</p>
        </div>

        {/* RIGHT PANEL */}
        <div className="p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-2">
            {t("pages.selectRole.pageTitle")}
          </h2>

          <p className="text-gray-500 mb-8">
            {t("pages.selectRole.pageSubtitle")}
          </p>

          <form
            onSubmit={handleSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter" && selectedRole) {
                e.preventDefault();
                (e.currentTarget as HTMLFormElement).requestSubmit();
              }
            }}
            className="space-y-4"
          >
            {roleOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-4 p-5 border rounded-xl cursor-pointer transition-all
        ${
          selectedRole === option.value
            ? "border-brand-primary bg-brand-primary/10"
            : "border-slate-200 hover:border-slate-400"
        }`}
              >
                <input
                  type="radio"
                  name="role"
                  className="sr-only"
                  value={option.value}
                  checked={selectedRole === option.value}
                  onChange={() => setSelectedRole(option.value)}
                />

                <div className="text-2xl text-slate-700">{option.icon}</div>

                <div>
                  <h3 className="font-semibold text-lg">
                    {t(option.titleKey)}
                  </h3>
                  <p className="text-sm text-slate-500">{t(option.descKey)}</p>
                </div>
              </label>
            ))}

            <Button
              variant="primary"
              size="xl"
              type="submit"
              disabled={!selectedRole}
              className={`w-full flex justify-center gap-2 mt-6 
      ${selectedRole ? "cursor-pointer" : "opacity-60"}`}
            >
              {t("pages.selectRole.continue")}
              <HiOutlineArrowRight />
            </Button>

            <p className="text-center text-sm text-slate-500 mt-4">
              {t("pages.selectRole.alreadyHaveAccount")}{" "}
              <Link to="/login" className="text-lime-500 font-medium">
                {t("auth.buttons.signIn")}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
