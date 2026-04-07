import { Input } from "@/components/ui/input";
import { FormField } from "@/shared/components";
import { useAuthTranslation } from "@/shared/hooks";
import type { UseAppFormReturn } from "@/shared/hooks/useAppForm";
import { MdPerson, MdPhone, MdWc, MdCameraAlt } from "react-icons/md";
import type { RegisterFormData } from "@/features/auth/types";

interface PersonalStepProps {
  form: UseAppFormReturn<RegisterFormData>;
}

export function PersonalStep({ form }: PersonalStepProps) {
  const { t } = useAuthTranslation();
  const { register } = form;
  return (
    <>
      <FormField label={t("labels.fullName")} error={form.getError("fullName")}>
        <Input
          {...register("fullName")}
          autoComplete="name"
          icon={<MdPerson />}
          placeholder={t("placeholders.name")}
          error={!!form.getError("fullName")}
        />
      </FormField>

      <FormField label={t("labels.phoneNumber")} error={form.getError("phone")}>
        <Input
          {...register("phone")}
          autoComplete="tel"
          icon={<MdPhone />}
          placeholder={t("placeholders.phone")}
          error={!!form.getError("phone")}
        />
      </FormField>

      {/* GENDER + AVATAR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label={t("labels.gender")}>
          <div className="relative">
            <MdWc className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <select
              {...register("gender")}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
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

        <FormField label={t("labels.profilePicture")}>
          <div className="relative">
            <MdCameraAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 z-10 pointer-events-none" />
            <input
              {...register("avatar")}
              type="file"
              accept="image/*"
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
              aria-label={t("aria.uploadProfilePicture")}
            />
          </div>
        </FormField>
      </div>
    </>
  );
}
