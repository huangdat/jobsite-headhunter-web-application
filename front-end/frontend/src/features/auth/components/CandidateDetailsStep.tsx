import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/shared/components";
import { useAuthTranslation } from "@/shared/hooks";
import type { UseAppFormReturn } from "@/shared/hooks/useAppForm";
import {
  MdWorkOutline,
  MdLocationCity,
  MdAttachMoney,
  MdCheckBox,
} from "react-icons/md";
import type { RegisterFormData } from "@/features/auth/types";

interface CandidateDetailsStepProps {
  form: UseAppFormReturn<RegisterFormData>;
}

export function CandidateDetailsStep({ form }: CandidateDetailsStepProps) {
  const { t } = useAuthTranslation();
  const { register } = form;
  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        {t("descriptions.candidateDetails")}
      </p>

      <FormField label={t("labels.currentJobTitle")}>
        <Input
          {...register("currentTitle")}
          autoComplete="organization-title"
          icon={<MdWorkOutline />}
          placeholder={t("placeholders.jobTitle")}
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label={t("labels.yearsOfExperience")}>
          <Input
            {...register("yearsOfExperience", { valueAsNumber: true })}
            autoComplete="off"
            icon={<MdWorkOutline />}
            type="number"
            placeholder={t("placeholders.experience")}
          />
        </FormField>

        <FormField label={t("labels.city")}>
          <Input
            {...register("city")}
            autoComplete="address-level2"
            icon={<MdLocationCity />}
            placeholder={t("placeholders.location")}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label={t("labels.expectedSalaryMin")}>
          <Input
            {...register("expectedSalaryMin", { valueAsNumber: true })}
            autoComplete="off"
            icon={<MdAttachMoney />}
            type="number"
            placeholder={t("placeholders.salaryMin")}
          />
        </FormField>

        <FormField label={t("labels.expectedSalaryMax")}>
          <Input
            {...register("expectedSalaryMax", { valueAsNumber: true })}
            autoComplete="off"
            icon={<MdAttachMoney />}
            type="number"
            placeholder={t("placeholders.salaryMax")}
          />
        </FormField>
      </div>

      <FormField label={t("labels.bio")}>
        <Textarea
          {...register("bio")}
          autoComplete="off"
          placeholder={t("placeholders.bio")}
          rows={4}
        />
      </FormField>

      <FormField label={t("labels.jobSearchStatus")}>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            {...register("openForWork")}
            type="checkbox"
            className="w-5 h-5 text-brand-primary focus:ring-brand-primary border-slate-300 rounded"
          />
          <span className="flex items-center gap-2 text-slate-700">
            <MdCheckBox className="text-brand-primary" />
            {t("checkboxLabels.openForWork")}
          </span>
        </label>
      </FormField>
    </div>
  );
}
