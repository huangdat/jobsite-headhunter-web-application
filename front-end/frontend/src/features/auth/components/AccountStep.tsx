import { Input } from "@/components/ui/input";
import { FormField, PasswordRequirements } from "@/shared/components";
import { MdOutlineMail, MdLockOutline, MdAccountCircle } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

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
    hasSpecialChar: boolean;
    hasNumber: boolean;
  };
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
}: AccountStepProps) {
  return (
    <>
      <FormField label="Username" error={errors.username}>
        <Input
          icon={<MdAccountCircle />}
          placeholder="john_doe123"
          value={formData.username}
          onChange={(e) => handleChange("username")(e.target.value)}
          error={!!errors.username}
        />
      </FormField>

      <FormField label="Email" error={errors.email}>
        <Input
          icon={<MdOutlineMail />}
          placeholder="jane@email.com"
          value={formData.email}
          onChange={(e) => handleChange("email")(e.target.value)}
          error={!!errors.email}
        />
      </FormField>

      {/* PASSWORD + CONFIRM PASSWORD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Password" error={errors.password}>
          <Input
            icon={<MdLockOutline />}
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
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
            icon={<MdLockOutline />}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
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
        hasSpecialChar={passwordRequirements.hasSpecialChar}
        hasNumber={passwordRequirements.hasNumber}
      />
    </>
  );
}
