import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "@/components/ui/input";
import { FormField } from "@/shared/components";
import type { ChangePasswordFormData } from "@/features/auth/types";
import { changePassword } from "@/features/auth/services/authApi";
import {
  useAuthTranslation,
  useCommonTranslation,
  useHomeTranslation,
  usePagesTranslation,
} from "@/shared/hooks";
import { useAppForm } from "@/shared/hooks/useAppForm";
import { toast } from "sonner";
import { extractApiErrorMessage } from "@/features/auth/utils/apiError";

export function ChangePasswordPage() {
  const { t } = useAuthTranslation();
  const { t: tPages } = usePagesTranslation();
  const { t: tCommon } = useCommonTranslation();
  const { t: tNav } = useHomeTranslation();
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
    <div className="relative flex h-screen w-full overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-80 bg-slate-900 text-white flex flex-col border-r border-white/10 shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-slate-900">
            <span className="material-symbols-outlined font-bold">
              account_tree
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            {tCommon("appName")}
          </h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-left w-full"
          >
            <span className="material-symbols-outlined text-brand-primary">
              dashboard
            </span>
            <span className="font-medium">{tNav("navigation.dashboard")}</span>
          </button>
          <button
            onClick={() => navigate("/jobs")}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer text-left w-full"
          >
            <span className="material-symbols-outlined text-brand-primary">
              work
            </span>
            <span className="font-medium">{tNav("navigation.jobs")}</span>
          </button>
          <button
            onClick={() => navigate("/referrals")}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer text-left w-full"
          >
            <span className="material-symbols-outlined text-brand-primary">
              group_add
            </span>
            <span className="font-medium">{tNav("navigation.referrals")}</span>
          </button>

          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-white/40 uppercase tracking-wider">
            {tCommon("section.account")}
          </div>
          <button
            onClick={() => navigate("/settings")}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-primary/10 text-brand-primary transition-colors border border-brand-primary/20 cursor-pointer text-left w-full"
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="font-medium">{tNav("navigation.settings")}</span>
          </button>
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-full bg-brand-primary/20 border border-brand-primary/30 bg-cover bg-center"></div>
            <div className="grow overflow-hidden">
              <p className="text-sm font-semibold truncate">
                {tCommon("currentUserName")}
              </p>
              <p className="text-xs text-white/50 truncate">
                {tCommon("exampleEmail")}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-white overflow-y-auto">
        {/* Header */}
        <header className="h-16 border-b border-slate-100 flex items-center justify-between px-8 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <span>{tNav("navigation.settings")}</span>
            <span className="material-symbols-outlined text-xs">
              chevron_right
            </span>
            <span className="text-slate-900 font-medium">
              {tPages("changePassword.securitySectionLabel")}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600">
              <span className="material-symbols-outlined">help_outline</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 w-full py-12 px-12">
          <div className="w-full">
            <div className="mb-10">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                {tPages("changePassword.title")}
              </h1>
              <p className="text-slate-500 max-w-3xl">
                {tPages("changePassword.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Form */}
              <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-8">
                <FormField
                  label={tPages("changePassword.currentPasswordLabel")}
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
                        className="material-symbols-outlined text-slate-400 hover:text-slate-600"
                      >
                        {showPasswords.current
                          ? "visibility"
                          : "visibility_off"}
                      </button>
                    }
                  />
                </FormField>

                <FormField
                  label={tPages("changePassword.newPasswordLabel")}
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
                        className="material-symbols-outlined text-slate-400 hover:text-slate-600"
                      >
                        {showPasswords.new ? "visibility" : "visibility_off"}
                      </button>
                    }
                  />
                </FormField>

                <FormField
                  label={tPages("changePassword.confirmPasswordLabel")}
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
                        className="material-symbols-outlined text-slate-400 hover:text-slate-600"
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
                    className={`flex-1 h-12 font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                      !isSubmitting
                        ? "bg-brand-primary text-slate-900 hover:bg-brand-hover"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    {isSubmitting
                      ? t("loading")
                      : tPages("changePassword.submitButton")}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="flex-1 h-12 bg-transparent text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all border border-slate-200"
                  >
                    {tPages("changePassword.cancelButton")}
                  </button>
                </div>
              </form>

              {/* Password Requirements */}
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 h-fit max-w-md">
                <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider">
                  {tPages("changePassword.passwordRequirementsTitle")}
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="material-symbols-outlined text-brand-primary text-xl">
                      check_circle
                    </span>
                    <span>{tPages("changePassword.requirement1")}</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slash-600">
                    <span className="material-symbols-outlined text-brand-primary text-xl">
                      check_circle
                    </span>
                    <span>{tPages("changePassword.requirement2")}</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="material-symbols-outlined text-brand-primary text-xl">
                      check_circle
                    </span>
                    <span>{tPages("changePassword.requirement3")}</span>
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
