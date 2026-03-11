import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/shared/components";
import {
  MdWorkOutline,
  MdLocationCity,
  MdAttachMoney,
  MdCheckBox,
} from "react-icons/md";

interface CandidateDetailsStepProps {
  formData: {
    currentTitle?: string;
    yearsOfExperience?: number;
    expectedSalaryMin?: number;
    expectedSalaryMax?: number;
    bio?: string;
    city?: string;
    openForWork?: boolean;
  };
  errors?: Record<string, string>;
  handleChange: (
    field: string,
  ) => (value: string | boolean | number | undefined) => void;
}

export function CandidateDetailsStep({
  formData,
  handleChange,
}: CandidateDetailsStepProps) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        Optional fields to help recruiters find you faster
      </p>

      <FormField label="Current Job Title (Optional)">
        <Input
          icon={<MdWorkOutline />}
          placeholder="e.g., Senior Software Engineer"
          value={formData.currentTitle || ""}
          onChange={(e) => handleChange("currentTitle")(e.target.value)}
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Years of Experience (Optional)">
          <Input
            icon={<MdWorkOutline />}
            type="number"
            placeholder="e.g., 5"
            value={formData.yearsOfExperience?.toString() || ""}
            onChange={(e) =>
              handleChange("yearsOfExperience")(
                e.target.value ? parseInt(e.target.value) : undefined,
              )
            }
          />
        </FormField>

        <FormField label="City (Optional)">
          <Input
            icon={<MdLocationCity />}
            placeholder="e.g., Ho Chi Minh City"
            value={formData.city || ""}
            onChange={(e) => handleChange("city")(e.target.value)}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Expected Salary Min (USD, Optional)">
          <Input
            icon={<MdAttachMoney />}
            type="number"
            placeholder="e.g., 50000"
            value={formData.expectedSalaryMin?.toString() || ""}
            onChange={(e) =>
              handleChange("expectedSalaryMin")(
                e.target.value ? parseInt(e.target.value) : 0,
              )
            }
          />
        </FormField>

        <FormField label="Expected Salary Max (USD, Optional)">
          <Input
            icon={<MdAttachMoney />}
            type="number"
            placeholder="e.g., 80000"
            value={formData.expectedSalaryMax?.toString() || ""}
            onChange={(e) =>
              handleChange("expectedSalaryMax")(
                e.target.value ? parseInt(e.target.value) : 0,
              )
            }
          />
        </FormField>
      </div>

      <FormField label="Bio (Optional)">
        <Textarea
          placeholder="Tell us about yourself, your skills, and experience..."
          value={formData.bio || ""}
          onChange={(e) => handleChange("bio")(e.target.value)}
          rows={4}
        />
      </FormField>

      <FormField label="Job Search Status">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.openForWork ?? false}
            onChange={(e) => handleChange("openForWork")(e.target.checked)}
            className="w-5 h-5 text-brand-primary focus:ring-brand-primary border-slate-300 rounded"
          />
          <span className="flex items-center gap-2 text-slate-700">
            <MdCheckBox className="text-brand-primary" />
            I'm open to new opportunities
          </span>
        </label>
      </FormField>
    </div>
  );
}
