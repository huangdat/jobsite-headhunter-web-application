import { Input } from "@/components/ui/input";
import { FormField } from "@/shared/components";
import { useAppTranslation } from "@/shared/hooks";
import { MdPerson, MdPhone, MdWc, MdCameraAlt } from "react-icons/md";

interface PersonalStepProps {
  formData: {
    fullName: string;
    phone: string;
    gender?: string;
    avatar?: File | null;
  };
  errors: Record<string, string>;
  handleChange: (field: string) => (value: string | File | null) => void;
}

export function PersonalStep({
  formData,
  errors,
  handleChange,
}: PersonalStepProps) {
  const { t } = useAppTranslation();
  return (
    <>
      <FormField label="Full Name" error={errors.fullName}>
        <Input
          name="fullName"
          autoComplete="name"
          icon={<MdPerson />}
          placeholder={t("auth.placeholders.name")}
          value={formData.fullName}
          onChange={(e) => handleChange("fullName")(e.target.value)}
          error={!!errors.fullName}
        />
      </FormField>

      <FormField label="Phone Number" error={errors.phone}>
        <Input
          name="phone"
          autoComplete="tel"
          icon={<MdPhone />}
          placeholder={t("auth.placeholders.phone")}
          value={formData.phone}
          onChange={(e) => handleChange("phone")(e.target.value)}
          error={!!errors.phone}
        />
      </FormField>

      {/* GENDER + AVATAR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Gender (Optional)">
          <div className="relative">
            <MdWc className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <select
              name="gender"
              value={formData.gender || ""}
              onChange={(e) => handleChange("gender")(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={t("auth.aria.selectGender")}
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </FormField>

        <FormField label="Profile Picture (Optional)">
          <div className="relative">
            <MdCameraAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 z-10 pointer-events-none" />
            <input
              name="avatar"
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
    </>
  );
}
