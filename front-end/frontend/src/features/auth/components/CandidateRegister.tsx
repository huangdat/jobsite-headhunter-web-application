import { Input } from "@/components/ui/input";
import { FormField } from "@/shared/components";
import { useAuthTranslation } from "@/shared/hooks";
import {
  MdOutlineMail,
  MdLockOutline,
  MdPerson,
  MdPhone,
  MdAccountCircle,
  MdWc,
  MdCameraAlt,
} from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface FormData {
  username: string;
  fullName: string;
  email: string;
  phone: string;
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

export function CandidateRegister({
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
      <FormField label={t("auth.labels.username")} error={errors.username}>
        <Input
          icon={<MdAccountCircle />}
          placeholder={t("auth.placeholders.username")}
          value={formData.username}
          onChange={(e) => handleChange("username")(e.target.value)}
        />
      </FormField>

      <FormField label={t("auth.labels.fullName")} error={errors.fullName}>
        <Input
          icon={<MdPerson />}
          placeholder={t("auth.placeholders.name")}
          value={formData.fullName}
          onChange={(e) => handleChange("fullName")(e.target.value)}
        />
      </FormField>

      <FormField label={t("auth.labels.email")} error={errors.email}>
        <Input
          icon={<MdOutlineMail />}
          placeholder={t("auth.placeholders.email")}
          value={formData.email}
          onChange={(e) => handleChange("email")(e.target.value)}
        />
      </FormField>

      <FormField label={t("auth.labels.phoneNumber")} error={errors.phone}>
        <Input
          icon={<MdPhone />}
          placeholder={t("auth.placeholders.phone")}
          value={formData.phone}
          onChange={(e) => handleChange("phone")(e.target.value)}
        />
      </FormField>

      {/* GENDER + AVATAR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label={t("auth.labels.gender")}>
          <div className="relative">
            <MdWc className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <select
              value={formData.gender || ""}
              onChange={(e) => handleChange("gender")(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={t("auth.aria.selectGender")}
            >
              <option value="">{t("auth.selectOptions.selectGender")}</option>
              <option value="MALE">
                {t("auth.selectOptions.genders.male")}
              </option>
              <option value="FEMALE">
                {t("auth.selectOptions.genders.female")}
              </option>
              <option value="OTHER">
                {t("auth.selectOptions.genders.other")}
              </option>
            </select>
          </div>
        </FormField>

        <FormField label={t("auth.labels.profilePicture")}>
          <div className="relative">
            <MdCameraAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 z-10" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                handleChange("avatar")(file || null);
              }}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              aria-label={t("auth.aria.uploadProfilePicture")}
            />
          </div>
        </FormField>
      </div>

      {/* PASSWORD + CONFIRM PASSWORD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label={t("auth.labels.password")}>
          <div className="relative">
            <Input
              icon={<MdLockOutline />}
              type={showPassword ? "text" : "password"}
              placeholder={t("auth.placeholders.password")}
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

        <FormField label={t("auth.labels.confirmPassword")}>
          <div className="relative">
            <Input
              icon={<MdLockOutline />}
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("auth.placeholders.confirmPassword")}
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
