import { Input } from "@/components/ui/input";
import { FormField, PasswordRequirements } from "@/shared/components";
import { useAppTranslation } from "@/shared/hooks";
import { MdOutlineMail, MdLockOutline, MdAccountCircle } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BsCheckCircle, BsExclamationCircle } from "react-icons/bs";

interface AccountStepProps {
  formData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  errors: Record<string, string>;
  handleChange: (field: string) => (value: string) => void;
  showPassword: boolean;
  showConfirmPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  setShowConfirmPassword: React.Dispatch<React.SetStateAction<boolean>>;
  passwordRequirements: {
    minLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumber: boolean;
  };
  // New props for duplicate check
  emailCheck?: {
    isLoading: boolean;
    error: string | null;
    isDuplicate: boolean;
  };
  usernameCheck?: {
    isLoading: boolean;
    error: string | null;
    isDuplicate: boolean;
  };
  onEmailChange?: (value: string) => void;
  onUsernameChange?: (value: string) => void;
}

export function AccountStep({
  formData,
  errors,
  handleChange,
  showPassword,
  showConfirmPassword,
  setShowPassword,
  setShowConfirmPassword,
  passwordRequirements,
  emailCheck,
  usernameCheck,
  onEmailChange,
  onUsernameChange,
}: AccountStepProps) {
  const { t } = useAppTranslation();


  const handleUsernameChange = (value: string) => {
    handleChange("username")(value);
  };
  const handleUsernameBlur = () => {
    onUsernameChange?.(formData.username);
  };
  const handleUsernameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onUsernameChange?.(formData.username);
    }
  };

  const handleEmailChange = (value: string) => {
    handleChange("email")(value);
  };
  const handleEmailBlur = () => {
    onEmailChange?.(formData.email);
  };
  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onEmailChange?.(formData.email);
    }
  };

  return (
    <>
      <FormField label="Username" error={errors.username || usernameCheck?.error || undefined}>
        <div className="relative">
          <Input
            name="username"
            autoComplete="username"
            icon={<MdAccountCircle />}
            placeholder={t("auth.placeholders.username")}
            value={formData.username}
            onChange={(e) => handleUsernameChange(e.target.value)}
            onBlur={handleUsernameBlur}
            onKeyDown={handleUsernameKeyDown}
            error={!!errors.username || usernameCheck?.isDuplicate}
            disabled={usernameCheck?.isLoading}
          />
          {/* Loading indicator */}
          {usernameCheck?.isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin">
                <svg
                  className="h-5 w-5 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            </div>
          )}
          {/* Success indicator */}
          {!usernameCheck?.isLoading &&
            formData.username &&
            !usernameCheck?.isDuplicate && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <BsCheckCircle className="h-5 w-5 text-green-500" />
              </div>
            )}
          {/* Error indicator */}
          {usernameCheck?.isDuplicate && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <BsExclamationCircle className="h-5 w-5 text-red-500" />
            </div>
          )}
        </div>
      </FormField>

      <FormField label="Email" error={errors.email || emailCheck?.error || undefined}>
        <div className="relative">
          <Input
            name="email"
            autoComplete="email"
            icon={<MdOutlineMail />}
            placeholder={t("auth.placeholders.email")}
            value={formData.email}
            onChange={(e) => handleEmailChange(e.target.value)}
            onBlur={handleEmailBlur}
            onKeyDown={handleEmailKeyDown}
            error={!!errors.email || emailCheck?.isDuplicate}
            disabled={emailCheck?.isLoading}
          />
          {/* Loading indicator */}
          {emailCheck?.isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin">
                <svg
                  className="h-5 w-5 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            </div>
          )}
          {/* Success indicator */}
          {!emailCheck?.isLoading &&
            formData.email &&
            !emailCheck?.isDuplicate && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <BsCheckCircle className="h-5 w-5 text-green-500" />
              </div>
            )}
          {/* Error indicator */}
          {emailCheck?.isDuplicate && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <BsExclamationCircle className="h-5 w-5 text-red-500" />
            </div>
          )}
        </div>
      </FormField>

      {/* PASSWORD + CONFIRM PASSWORD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Password" error={errors.password}>
          <Input
            name="password"
            autoComplete="new-password"
            icon={<MdLockOutline />}
            type={showPassword ? "text" : "password"}
            placeholder={t("auth.placeholders.password")}
            value={formData.password}
            onChange={(e) => handleChange("password")(e.target.value)}
            error={!!errors.password}
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

        <FormField label="Confirm Password" error={errors.confirmPassword}>
          <Input
            name="confirmPassword"
            autoComplete="new-password"
            icon={<MdLockOutline />}
            type={showConfirmPassword ? "text" : "password"}
            placeholder={t("auth.placeholders.confirmPassword")}
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword")(e.target.value)}
            error={!!errors.confirmPassword}
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
