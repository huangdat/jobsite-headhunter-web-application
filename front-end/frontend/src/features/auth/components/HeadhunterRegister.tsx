import { Input, FormField } from "@/shared/ui";
import {
  MdOutlineMail,
  MdLockOutline,
  MdPerson,
  MdPhone,
  MdBusiness,
} from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface Props {
  formData: any;
  errors: Record<string, string>;
  handleChange: (field: string) => (value: string) => void;
  showPassword: boolean;
  showConfirmPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  setShowConfirmPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

export function HeadhunterRegister({
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
          placeholder="John Smith"
          value={formData.fullName}
          onChange={(e) => handleChange("fullName")(e.target.value)}
        />
      </FormField>

      <FormField label="Work Email" error={errors.email}>
        <Input
          icon={<MdOutlineMail />}
          placeholder="john@company.com"
          value={formData.email}
          onChange={(e) => handleChange("email")(e.target.value)}
        />
      </FormField>

      <FormField label="Company Name" error={errors.companyName}>
        <Input
          icon={<MdBusiness />}
          placeholder="Google Inc."
          value={formData.companyName}
          onChange={(e) => handleChange("companyName")(e.target.value)}
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-0">
        <FormField label="Phone Number" error={errors.phone}>
          <Input
            icon={<MdPhone />}
            placeholder="+84 123 456 789"
            value={formData.phone}
            onChange={(e) => handleChange("phone")(e.target.value)}
          />
        </FormField>

        <FormField label="Tax Code (MST)" error={errors.taxCode}>
          <Input
            icon={<MdBusiness />}
            placeholder="0123456789"
            value={formData.taxCode}
            onChange={(e) => handleChange("taxCode")(e.target.value)}
          />
        </FormField>
      </div>

      {/* PASSWORD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
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
