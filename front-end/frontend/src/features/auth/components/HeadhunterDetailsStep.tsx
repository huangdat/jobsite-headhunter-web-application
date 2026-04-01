import { Input } from "@/components/ui/input";
import { FormField } from "@/shared/components";
import { useAuthTranslation, usePagesTranslation } from "@/shared/hooks";
import type { UseAppFormReturn } from "@/shared/hooks/useAppForm";
import { MdBusiness, MdReceipt, MdLanguage, MdGroups } from "react-icons/md";
import type { RegisterFormData } from "@/features/auth/types";

interface HeadhunterDetailsStepProps {
  form: UseAppFormReturn<RegisterFormData>;
}

export function HeadhunterDetailsStep({ form }: HeadhunterDetailsStepProps) {
  const { t } = useAuthTranslation();
  const { t: pagesT } = usePagesTranslation();
  const { register } = form;
  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        {t("descriptions.headhunterDetails")}
      </p>

      <div className="flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
        <MdBusiness className="mt-0.5 shrink-0 text-base" />
        <span>
          {t("descriptions.taxCodeInfo")}
          Your <strong>
            {pagesT("headhunterDetails.companyName")}
          </strong> and{" "}
          <strong>{pagesT("headhunterDetails.registeredAddress")}</strong>{" "}
          {pagesT("headhunterDetails.registeredAddressHelp")}
        </span>
      </div>

      <FormField label={t("labels.taxCode")} error={form.getError("taxCode")}>
        <Input
          {...register("taxCode")}
          autoComplete="off"
          icon={<MdReceipt />}
          placeholder={t("placeholders.taxId")}
          error={!!form.getError("taxCode")}
        />
      </FormField>

      <FormField label={t("labels.companyWebsite")}>
        <Input
          {...register("websiteUrl")}
          autoComplete="url"
          icon={<MdLanguage />}
          placeholder={t("placeholders.companyWebsite")}
        />
      </FormField>

      <FormField label={t("labels.companyScale")}>
        <div className="relative">
          <MdGroups className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <select
            {...register("companyScale")}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={t("aria.selectCompanyScale")}
          >
            <option value="">{t("selectOptions.selectCompanyScale")}</option>
            <option value="1-10">
              {t("selectOptions.companyScaleOptions.0.label")}
            </option>
            <option value="11-50">
              {t("selectOptions.companyScaleOptions.1.label")}
            </option>
            <option value="51-200">
              {t("selectOptions.companyScaleOptions.2.label")}
            </option>
            <option value="201-500">
              {t("selectOptions.companyScaleOptions.3.label")}
            </option>
            <option value="500+">
              {t("selectOptions.companyScaleOptions.4.label")}
            </option>
          </select>
        </div>
      </FormField>
    </div>
  );
}
