import { Input } from "@/components/ui/input";
import { FormField } from "@/shared/components";
import { useAppTranslation } from "@/shared/hooks";
import type { UseAppFormReturn } from "@/shared/hooks/useAppForm";
import { MdPercent } from "react-icons/md";
import type { RegisterFormData } from "../types";

interface CollaboratorDetailsStepProps {
  form: UseAppFormReturn<RegisterFormData>;
}

export function CollaboratorDetailsStep({ form }: CollaboratorDetailsStepProps) {
  const { t } = useAppTranslation();
  const { register } = form;

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        {t("auth.descriptions.collaboratorDetails")}
      </p>

      <FormField label={t("auth.labels.commissionRate")}>
        <Input
          {...register("commissionRate", { valueAsNumber: true })}
          autoComplete="off"
          icon={<MdPercent />}
          type="number"
          placeholder={t("auth.placeholders.experience")}
        />
        <p className="text-xs text-slate-500 mt-1">
          {t("auth.descriptions.commissionRateTip")}
        </p>
      </FormField>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <p className="text-sm text-slate-600">
          {t("auth.descriptions.collaboratorInfo")}
        </p>
      </div>
    </div>
  );
}
