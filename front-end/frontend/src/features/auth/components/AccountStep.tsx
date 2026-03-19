import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { FormField, PasswordRequirements } from "@/shared/components";
import { useAuthTranslation } from "@/shared/hooks";
import type { UseAppFormReturn } from "@/shared/hooks/useAppForm";
import { MdOutlineMail, MdLockOutline, MdAccountCircle } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import type { RegisterFormData } from "../types";

interface AccountStepProps {
  form: UseAppFormReturn<RegisterFormData>;
  showPassword: boolean;
  showConfirmPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  setShowConfirmPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AccountStep({
  form,
  showPassword,
  showConfirmPassword,
  setShowPassword,
  setShowConfirmPassword,
}: AccountStepProps) {
  const { t } = useAuthTranslation();
  const { register, watch } = form;

  const password = watch("password");

  // Compute password requirements based on watched password value
  const passwordRequirements = useMemo(
    () => ({
      minLength: password?.length >= 8 && password?.length <= 16,
      hasUpperCase: /[A-Z]/.test(password || ""),
      hasLowerCase: /[a-z]/.test(password || ""),
      hasNumber: /\d/.test(password || ""),
    }),
    [password]
  );

  return (
    <>
      <FormField label={t("labels.username")} error={form.getError("username")}>
        <Input
          {...register("username")}
          autoComplete="username"
          icon={<MdAccountCircle />}
          placeholder={t("placeholders.username")}
          error={!!form.getError("username")}
        />
      </FormField>

      <FormField label={t("labels.email")} error={form.getError("email")}>
        <Input
          {...register("email")}
          autoComplete="email"
          icon={<MdOutlineMail />}
          placeholder={t("placeholders.email")}
          error={!!form.getError("email")}
        />
      </FormField>

      {/* PASSWORD + CONFIRM PASSWORD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("labels.password")}
          error={form.getError("password")}
        >
          <Input
            {...register("password")}
            autoComplete="new-password"
            icon={<MdLockOutline />}
            type={showPassword ? "text" : "password"}
            placeholder={t("placeholders.password")}
            error={!!form.getError("password")}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer text-slate-500"
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            }
          />
        </FormField>

        <FormField
          label={t("labels.confirmPassword")}
          error={form.getError("confirmPassword")}
        >
          <Input
            {...register("confirmPassword")}
            autoComplete="new-password"
            icon={<MdLockOutline />}
            type={showConfirmPassword ? "text" : "password"}
            placeholder={t("placeholders.confirmPassword")}
            error={!!form.getError("confirmPassword")}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="cursor-pointer text-slate-500"
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible />
                ) : (
                  <AiOutlineEye />
                )}
              </button>
            }
          />
        </FormField>
      </div>

      <PasswordRequirements
        minLength={passwordRequirements.minLength}
        hasUpperCase={passwordRequirements.hasUpperCase}
        hasLowerCase={passwordRequirements.hasLowerCase}
        hasNumber={passwordRequirements.hasNumber}
      />
    </>
  );
}
