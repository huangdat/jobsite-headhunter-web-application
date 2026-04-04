import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "@/components/ui/input";
import { FormField } from "@/shared/components";
import {
  Display,
  SmallText,
  MetaText,
} from "@/shared/components/typography/Typography";
import type { ChangePasswordFormData } from "@/features/auth/types";
import { changePassword } from "@/features/auth/services/authApi";
import { useAuthTranslation, useAppTranslation } from "@/shared/hooks";
import { useAppForm } from "@/shared/hooks/useAppForm";
import { toast } from "sonner";
import { extractApiErrorMessage } from "@/features/auth/utils/apiError";

export function ChangePasswordPage() {
  const { t } = useAuthTranslation();
  const { t: tApp } = useAppTranslation();
  const navigate = useNavigate();

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const schema = yup.object().shape({
    currentPassword: yup
      .string()
      .required(t("validation.currentPasswordRequired")),
    newPassword: yup
      .string()
      .required(t("validation.newPasswordRequired"))
      .min(8, t("validation.passwordBetween8and16"))
      .max(16, t("validation.passwordBetween8and16"))
      .matches(/[A-Z]/, t("validation.passwordUppercase"))
      .matches(/[a-z]/, t("validation.passwordLowercase"))
      .matches(/\d/, t("validation.passwordNumber"))
      .matches(/^[a-zA-Z0-9_]+$/, t("validation.passwordSpecialChars")),
    confirmPassword: yup
      .string()
      .required(t("validation.confirmPasswordRequired"))
      .oneOf([yup.ref("newPassword")], t("validation.passwordsDoNotMatch")),
  });

  const form = useAppForm<ChangePasswordFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = form;

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    // eslint-disable-next-line security/detect-object-injection
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      // Check if new password is same as current
      if (data.newPassword === data.currentPassword) {
        setError("newPassword", {
          type: "custom",
          message: t("validation.newPasswordMustBeDifferent"),
        });
        return;
      }

      await changePassword(data);

      // Success notification
      toast.success(t("messages.passwordChangedSuccess"));

      // Clear form
      handleCancel();
    } catch (error: unknown) {
      const errorMessage = extractApiErrorMessage(
        error,
        t("messages.failedToChangePassword")
      );

      if (
        error instanceof Error &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null
      ) {
        const response = error.response as {
          status?: number;
          data?: { message?: string };
        };
        const responseMessage = response.data?.message || errorMessage;

        // Check if it's current password error
        if (
          response.status === 401 ||
          responseMessage
            .toLowerCase()
            .includes(t("validation.currentPasswordKey")) ||
          responseMessage
            .toLowerCase()
            .includes(t("validation.incorrectPasswordKey"))
        ) {
          setError("currentPassword", {
            type: "custom",
            message: responseMessage,
          });
        }
      }

      // Error notification
      toast.error(t("messages.failedToChangePassword"));
    }
  };

  const handleCancel = () => {
    reset();
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="w-80 bg-slate-900 dark:bg-slate-950 text-white flex flex-col border-r border-white/10 shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-slate-900">
            <span className="material-symbols-outlined font-bold">
              account_tree
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            {tApp("common.appName")}
          </h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-left w-full"
          >
            <span className="material-symbols-outlined text-brand-primary">
              dashboard
            </span>
            <span className="font-medium">{tApp("navigation.dashboard")}</span>
          </button>
          <button
            onClick={() => navigate("/jobs")}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer text-left w-full"
          >
            <span className="material-symbols-outlined text-brand-primary">
              work
            </span>
            <span className="font-medium">{tApp("navigation.jobs")}</span>
          </button>
          <button
            onClick={() => navigate("/referrals")}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer text-left w-full"
          >
            <span className="material-symbols-outlined text-brand-primary">
              group_add
            </span>
            <span className="font-medium">{tApp("navigation.referrals")}</span>
          </button>

          <div className="pt-4 pb-2 px-4 uppercase tracking-wider">
            <MetaText>{tApp("common.section.account")}</MetaText>
          </div>
          <button
            onClick={() => navigate("/settings")}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-primary/10 text-brand-primary transition-colors border border-brand-primary/20 cursor-pointer text-left w-full"
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="font-medium">{tApp("navigation.settings")}</span>
          </button>
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-full bg-brand-primary/20 border border-brand-primary/30 bg-cover bg-center"></div>
            <div className="grow overflow-hidden">
              <SmallText weight="bold" className="text-white truncate">
                {tApp("common.currentUserName")}
              </SmallText>
              <SmallText variant="muted" className="text-white/50 truncate">
                {tApp("common.exampleEmail")}
              </SmallText>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-white dark:bg-slate-900 overflow-y-auto">
        {/* Header */}
        <header className="h-16 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-8 bg-white dark:bg-slate-900 sticky top-0 z-10">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
            <span>{tApp("navigation.settings")}</span>
            <span className="material-symbols-outlined text-xs">
              chevron_right
            </span>
            <span className="text-slate-900 dark:text-white font-medium">
              {t("pages.changePassword.securitySectionLabel")}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
              <span className="material-symbols-outlined">help_outline</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 w-full py-12 px-12">
          <div className="w-full">
            <div className="mb-10">
              <Display className="mb-2">
                {t("pages.changePassword.title")}
              </Display>
              <SmallText variant="muted" className="max-w-3xl">
                {t("pages.changePassword.subtitle")}
              </SmallText>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Form */}
              <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-8">
                <FormField
                  label={t("pages.changePassword.currentPasswordLabel")}
                  error={errors.currentPassword?.message}
                >
                  <Input
                    type={showPasswords.current ? "text" : "password"}
                    placeholder={t("placeholders.currentPassword")}
                    {...register("currentPassword")}
                    error={!!errors.currentPassword}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="material-symbols-outlined text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        {showPasswords.current
                          ? "visibility"
                          : "visibility_off"}
                      </button>
                    }
                  />
                </FormField>

                <FormField
                  label={t("pages.changePassword.newPasswordLabel")}
                  error={errors.newPassword?.message}
                >
                  <Input
                    type={showPasswords.new ? "text" : "password"}
                    placeholder={t("placeholders.newPassword")}
                    {...register("newPassword")}
                    error={!!errors.newPassword}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="material-symbols-outlined text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        {showPasswords.new ? "visibility" : "visibility_off"}
                      </button>
                    }
                  />
                </FormField>

                <FormField
                  label={t("pages.changePassword.confirmPasswordLabel")}
                  error={errors.confirmPassword?.message}
                >
                  <Input
                    type={showPasswords.confirm ? "text" : "password"}
                    placeholder={t("placeholders.confirmPassword")}
                    {...register("confirmPassword")}
                    error={!!errors.confirmPassword}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="material-symbols-outlined text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        {showPasswords.confirm
                          ? "visibility"
                          : "visibility_off"}
                      </button>
                    }
                  />
                </FormField>

                <div className="pt-6 flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 h-12 rounded-xl transition-all flex items-center justify-center gap-2 ${
                      !isSubmitting
                        ? "bg-brand-primary text-slate-900 hover:bg-brand-hover"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <MetaText>
                      {isSubmitting
                        ? t("common.loading")
                        : t("pages.changePassword.submitButton")}
                    </MetaText>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="flex-1 h-12 bg-transparent text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700"
                  >
                    <MetaText>
                      {t("pages.changePassword.cancelButton")}
                    </MetaText>
                  </button>
                </div>
              </form>

              {/* Password Requirements */}
              <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 h-fit max-w-md">
                <MetaText className="mb-6">
                  {t("pages.changePassword.passwordRequirementsTitle")}
                </MetaText>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-brand-primary text-xl">
                      check_circle
                    </span>
                    <SmallText>
                      {t("pages.changePassword.requirement1")}
                    </SmallText>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-brand-primary text-xl">
                      check_circle
                    </span>
                    <SmallText>
                      {t("pages.changePassword.requirement2")}
                    </SmallText>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-brand-primary text-xl">
                      check_circle
                    </span>
                    <SmallText>
                      {t("pages.changePassword.requirement3")}
                    </SmallText>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
