import { Input } from "@/components/ui/input";
import { FormField } from "@/shared/components";
import { useAuthTranslation } from "@/shared/hooks";
import {
  MdOutlineMail,
  MdLockOutline,
  MdPerson,
  MdPhone,
  MdBusiness,
  MdAccountCircle,
  MdWc,
  MdCameraAlt,
} from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface FormData {
  username: string;
  fullName: string;
  email: string;
  companyName: string;
  phone: string;
  taxCode: string;
  password: string;
  confirmPassword: string;
  gender?: string;
  avatar?: File | null;
}

interface Props {
  formData: FormData;
  errors: Record<string, string>;
  handleChange: (
    field: string
  ) => (value: string | boolean | File | null) => void;
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
  const { t } = useAuthTranslation();
  return (
    <>
      <FormField label={t("labels.username")} error={errors.username}>
        <Input
          icon={<MdAccountCircle />}
          placeholder={t("placeholders.username")}
          value={formData.username}
          onChange={(e) => handleChange("username")(e.target.value)}
        />
      </FormField>

      <FormField label={t("labels.fullName")} error={errors.fullName}>
        <Input
          icon={<MdPerson />}
          placeholder={t("placeholders.name")}
          value={formData.fullName}
          onChange={(e) => handleChange("fullName")(e.target.value)}
        />
      </FormField>

      <FormField label={t("labels.workEmail")} error={errors.email}>
        <Input
          icon={<MdOutlineMail />}
          placeholder={t("placeholders.email")}
          value={formData.email}
          onChange={(e) => handleChange("email")(e.target.value)}
        />
      </FormField>

      <FormField label={t("labels.companyName")} error={errors.companyName}>
        <Input
          icon={<MdBusiness />}
          placeholder={t("placeholders.companyName")}
          value={formData.companyName}
          onChange={(e) => handleChange("companyName")(e.target.value)}
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-0">
        <FormField label={t("labels.phoneNumber")} error={errors.phone}>
          <Input
            icon={<MdPhone />}
            placeholder={t("placeholders.phone")}
            value={formData.phone}
            onChange={(e) => handleChange("phone")(e.target.value)}
          />
        </FormField>

        <FormField label={t("labels.taxCode")} error={errors.taxCode}>
          <Input
            icon={<MdBusiness />}
            placeholder={t("placeholders.taxId")}
            value={formData.taxCode}
            onChange={(e) => handleChange("taxCode")(e.target.value)}
          />
        </FormField>
      </div>

      {/* GENDER & AVATAR (optional) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-0">
        <FormField label={t("labels.gender")}>
          <div className="relative">
            <MdWc
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10"
              size={18}
            />
            <select
              value={formData.gender || ""}
              onChange={(e) => handleChange("gender")(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white text-sm"
              aria-label={t("aria.selectGender")}
            >
              <option value="">{t("selectOptions.selectGender")}</option>
              <option value="MALE">{t("selectOptions.genders.male")}</option>
              <option value="FEMALE">
                {t("selectOptions.genders.female")}
              </option>
              <option value="OTHER">{t("selectOptions.genders.other")}</option>
            </select>
          </div>
        </FormField>

        <FormField label={t("labels.avatar")}>
          <div className="relative">
            <MdCameraAlt
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10"
              size={18}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleChange("avatar")(e.target.files?.[0] || null)
              }
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary/20 file:text-black hover:file:bg-brand-primary/30"
              aria-label={t("aria.uploadAvatar")}
            />
          </div>
        </FormField>
      </div>

      {/* PASSWORD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
        <FormField label={t("labels.password")}>
          <div className="relative">
            <Input
              icon={<MdLockOutline />}
              type={showPassword ? "text" : "password"}
              placeholder={t("placeholders.password")}
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

        <FormField label={t("labels.confirmPassword")}>
          <div className="relative">
            <Input
              icon={<MdLockOutline />}
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("placeholders.confirmPassword")}
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
