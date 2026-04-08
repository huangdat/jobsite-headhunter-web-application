import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/shared/ui-primitives/button";
import { AuthLayout } from "@/shared/common-blocks";
import { useAuthTranslation } from "@/shared/hooks";
import type { RegistrationUserRole } from "@/features/auth/types";
import {
  Display,
  SectionTitle,
  SubsectionTitle,
  BodyText,
  SmallText,
} from "@/shared/common-blocks/typography/Typography";

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
    <AuthLayout ctaButton={{ to: "/login", label: t("buttons.signIn") }}>
      <div className="w-full max-w-5xl min-h-[calc(600px)] bg-white dark:bg-slate-900 rounded-3xl shadow-xl grid md:grid-cols-2 overflow-hidden">
        {/* LEFT PANEL */}
        <div className="bg-linear-to-br from-dark-panel-from to-dark-panel-to text-white p-10 flex flex-col justify-center">
          <Display size="md">
            {t("pages.selectRole.title")} <br />
            <span className="text-brand-primary">
              {t("pages.selectRole.titleHighlight")}
            </span>
          </Display>

          <BodyText className="text-slate-300 mt-6">
            {t("pages.selectRole.subtitle")}
          </BodyText>
        </div>

        {/* RIGHT PANEL */}
        <div className="p-10 flex flex-col justify-center">
          <SectionTitle className="mb-2">
            {t("pages.selectRole.pageTitle")}
          </SectionTitle>

          <BodyText variant="muted" className="mb-8">
            {t("pages.selectRole.pageSubtitle")}
          </BodyText>

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
            : "border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500"
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

                <div className="text-2xl text-slate-700 dark:text-slate-300">
                  {option.icon}
                </div>

                <div>
                  <SubsectionTitle>{t(option.titleKey)}</SubsectionTitle>
                  <SmallText variant="muted">{t(option.descKey)}</SmallText>
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

            <p className="text-center mt-4">
              <SmallText variant="muted">
                {t("pages.selectRole.alreadyHaveAccount")}{" "}
                <Link
                  to="/login"
                  className="text-brand-primary font-medium hover:underline"
                >
                  {t("buttons.signIn")}
                </Link>
              </SmallText>
            </p>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}


