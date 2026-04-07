import { Input } from "@/shared/ui-primitives/input";
import { FormField } from "@/shared/common-blocks";
import { useAuthTranslation } from "@/shared/hooks";
import type { UseAppFormReturn } from "@/shared/hooks/useAppForm";
import { MdPercent } from "react-icons/md";
import type { RegisterFormData } from "@/features/auth/types";

interface CollaboratorDetailsStepProps {
  form: UseAppFormReturn<RegisterFormData>;
}

export function CollaboratorDetailsStep({
  form,
}: CollaboratorDetailsStepProps) {
  const { t } = useAuthTranslation();
  const { register } = form;
  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        {t("descriptions.collaboratorDetails")}
      </p>

      <FormField label={t("labels.commissionRate")}>
        <Input
          {...register("commissionRate", { valueAsNumber: true })}
          autoComplete="off"
          icon={<MdPercent />}
          type="number"
          placeholder={t("placeholders.commissionRate")}
        />
        <p className="text-xs text-slate-500 mt-1">
          {t("descriptions.commissionRateTip")}
        </p>
      </FormField>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <p className="text-sm text-slate-600">
          {t("descriptions.collaboratorInfo")}
        </p>
      </div>
    </div>
  );
}


