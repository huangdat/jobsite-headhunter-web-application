import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/shared/components";
import { useAppTranslation } from "@/shared/hooks";
import type { UseAppFormReturn } from "@/shared/hooks/useAppForm";
import {
  MdWorkOutline,
  MdLocationCity,
  MdAttachMoney,
  MdCheckBox,
} from "react-icons/md";
import type { RegisterFormData } from "../types";

interface CandidateDetailsStepProps {
  form: UseAppFormReturn<RegisterFormData>;
}

export function CandidateDetailsStep({ form }: CandidateDetailsStepProps) {
  const { t } = useAppTranslation();
  const { register } = form;

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        {t("auth.descriptions.candidateDetails")}
      </p>

      <FormField label={t("auth.labels.currentJobTitle")}>
        <Input
          {...register("currentTitle")}
          autoComplete="organization-title"
          icon={<MdWorkOutline />}
          placeholder={t("auth.placeholders.jobTitle")}
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label={t("auth.labels.yearsOfExperience")}>
          <Input
            {...register("yearsOfExperience", { valueAsNumber: true })}
            autoComplete="off"
            icon={<MdWorkOutline />}
            type="number"
            placeholder={t("auth.placeholders.experience")}
          />
        </FormField>

        <FormField label={t("auth.labels.city")}>
          <Input
            {...register("city")}
            autoComplete="address-level2"
            icon={<MdLocationCity />}
            placeholder={t("auth.placeholders.location")}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label={t("auth.labels.expectedSalaryMin")}>
          <Input
            {...register("expectedSalaryMin", { valueAsNumber: true })}
            autoComplete="off"
            icon={<MdAttachMoney />}
            type="number"
            placeholder={t("auth.placeholders.salaryMin")}
          />
        </FormField>

        <FormField label={t("auth.labels.expectedSalaryMax")}>
          <Input
            {...register("expectedSalaryMax", { valueAsNumber: true })}
            autoComplete="off"
            icon={<MdAttachMoney />}
            type="number"
            placeholder={t("auth.placeholders.salaryMax")}
          />
        </FormField>
      </div>

      <FormField label={t("auth.labels.bio")}>
        <Textarea
          {...register("bio")}
          autoComplete="off"
          placeholder={t("auth.placeholders.bio")}
          rows={4}
        />
      </FormField>

      <FormField label={t("auth.labels.jobSearchStatus")}>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            {...register("openForWork")}
            type="checkbox"
            className="w-5 h-5 text-brand-primary focus:ring-brand-primary border-slate-300 rounded"
          />
          <span className="flex items-center gap-2 text-slate-700">
            <MdCheckBox className="text-brand-primary" />
            {t("auth.checkboxLabels.openForWork")}
          </span>
        </label>
      </FormField>
    </div>
  );
}
