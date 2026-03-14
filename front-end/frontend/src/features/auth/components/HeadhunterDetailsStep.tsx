import { Input } from "@/components/ui/input";
import { FormField } from "@/shared/components";
import { useAppTranslation } from "@/shared/hooks";
import {
  MdBusiness,
  MdReceipt,
  MdLanguage,
  MdGroups,
} from "react-icons/md";

interface HeadhunterDetailsStepProps {
  formData: {
    taxCode: string;
    websiteUrl?: string;
    companyScale?: string;
  };
  errors: Record<string, string>;
  handleChange: (field: string) => (value: string) => void;
}

export function HeadhunterDetailsStep({
  formData,
  errors,
  handleChange,
}: HeadhunterDetailsStepProps) {
  const { t } = useAppTranslation();
  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        Company information and recruitment details
      </p>

      <div className="flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
        <MdBusiness className="mt-0.5 shrink-0 text-base" />
        <span>
          Your <strong>company name</strong> and <strong>registered address</strong> will be
          looked up automatically from your tax code via the MST registry.
        </span>
      </div>

      <FormField label="Tax Code" error={errors.taxCode}>
        <Input
          name="taxCode"
          autoComplete="off"
          icon={<MdReceipt />}
          placeholder={t("auth.placeholders.taxId")}
          value={formData.taxCode}
          onChange={(e) => handleChange("taxCode")(e.target.value)}
          error={!!errors.taxCode}
        />
      </FormField>

      <FormField label="Company Website (Optional)">
        <Input
          name="websiteUrl"
          autoComplete="url"
          icon={<MdLanguage />}
          placeholder={t("auth.placeholders.companyWebsite")}
          value={formData.websiteUrl || ""}
          onChange={(e) => handleChange("websiteUrl")(e.target.value)}
        />
      </FormField>

      <FormField label="Company Scale (Optional)">
        <div className="relative">
          <MdGroups className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <select
            name="companyScale"
            value={formData.companyScale || ""}
            onChange={(e) => handleChange("companyScale")(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={t("auth.aria.selectCompanyScale")}
          >
            <option value="">Select Company Scale</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-500">201-500 employees</option>
            <option value="500+">500+ employees</option>
          </select>
        </div>
      </FormField>
    </div>
  );
}
