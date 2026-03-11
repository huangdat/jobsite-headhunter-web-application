import { Input } from "@/components/ui/input";
import { FormField } from "@/shared/components";
import {
  MdBusiness,
  MdReceipt,
  MdLanguage,
  MdLocationOn,
  MdGroups,
} from "react-icons/md";

interface HeadhunterDetailsStepProps {
  formData: {
    companyName: string;
    taxCode: string;
    websiteUrl?: string;
    addressMain?: string;
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
  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        Company information and recruitment details
      </p>

      <FormField label="Company Name" error={errors.companyName}>
        <Input
          icon={<MdBusiness />}
          placeholder="ABC Recruitment Ltd."
          value={formData.companyName}
          onChange={(e) => handleChange("companyName")(e.target.value)}
          error={!!errors.companyName}
        />
      </FormField>

      <FormField label="Tax Code" error={errors.taxCode}>
        <Input
          icon={<MdReceipt />}
          placeholder="0123456789"
          value={formData.taxCode}
          onChange={(e) => handleChange("taxCode")(e.target.value)}
          error={!!errors.taxCode}
        />
      </FormField>

      <FormField label="Company Website (Optional)">
        <Input
          icon={<MdLanguage />}
          placeholder="https://www.company.com"
          value={formData.websiteUrl || ""}
          onChange={(e) => handleChange("websiteUrl")(e.target.value)}
        />
      </FormField>

      <FormField label="Main Office Address (Optional)">
        <Input
          icon={<MdLocationOn />}
          placeholder="123 Business Street, District 1, HCMC"
          value={formData.addressMain || ""}
          onChange={(e) => handleChange("addressMain")(e.target.value)}
        />
      </FormField>

      <FormField label="Company Scale (Optional)">
        <div className="relative">
          <MdGroups className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <select
            value={formData.companyScale || ""}
            onChange={(e) => handleChange("companyScale")(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select company scale"
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
