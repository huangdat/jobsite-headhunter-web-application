import { Input } from "@/components/ui/input";
import { FormField } from "@/shared/components";
import {
  MdOutlineMail,
  MdLockOutline,
  MdPerson,
  MdPhone,
} from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface Props {
  formData: FormData;
  errors: Record<string, string>;
  handleChange: (field: string) => (value: string) => void;
  showPassword: boolean;
  showConfirmPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  setShowConfirmPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CandidateRegister({
  formData,
  errors,
  handleChange,
  showPassword,
  showConfirmPassword,
  setShowPassword,
  setShowConfirmPassword,
}: Props) {
  return (
    <>
      <FormField label="Full Name" error={errors.fullName}>
        <Input
          icon={<MdPerson />}
          placeholder="Jane Cooper"
          value={formData.fullName}
          onChange={(e) => handleChange("fullName")(e.target.value)}
        />
      </FormField>

      <FormField label="Email" error={errors.email}>
        <Input
          icon={<MdOutlineMail />}
          placeholder="jane@email.com"
          value={formData.email}
          onChange={(e) => handleChange("email")(e.target.value)}
        />
      </FormField>

      <FormField label="Phone Number" error={errors.phone}>
        <Input
          icon={<MdPhone />}
          placeholder="+84 123 456 789"
          value={formData.phone}
          onChange={(e) => handleChange("phone")(e.target.value)}
        />
      </FormField>

      {/* PASSWORD + CONFIRM PASSWORD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Password">
          <div className="relative">
            <Input
              icon={<MdLockOutline />}
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) => handleChange("password")(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>
        </FormField>

        <FormField label="Confirm Password">
          <div className="relative">
            <Input
              icon={<MdLockOutline />}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword")(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible />
              ) : (
                <AiOutlineEye />
              )}
            </button>
          </div>
        </FormField>
      </div>
    </>
  );
}
