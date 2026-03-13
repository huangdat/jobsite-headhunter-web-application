import { Input } from "@/components/ui/input";
import { FormField } from "@/shared/components";
import { MdPercent } from "react-icons/md";

interface CollaboratorDetailsStepProps {
  formData: {
    commissionRate?: number;
  };
  errors?: Record<string, string>;
  handleChange: (field: string) => (value: number) => void;
}

export function CollaboratorDetailsStep({
  formData,
  handleChange,
}: CollaboratorDetailsStepProps) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        Optional information for collaboration
      </p>

      <FormField label="Commission Rate (%, Optional)">
        <Input
          name="commissionRate"
          autoComplete="off"
          icon={<MdPercent />}
          type="number"
          placeholder="e.g., 10"
          value={formData.commissionRate?.toString() || ""}
          onChange={(e) =>
            handleChange("commissionRate")(
              e.target.value ? parseFloat(e.target.value) : 0,
            )
          }
        />
        <p className="text-xs text-slate-500 mt-1">
          Your preferred commission rate for successful referrals
        </p>
      </FormField>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <p className="text-sm text-slate-600">
          As a collaborator, you help connect talented candidates with great
          opportunities. Start earning commissions by referring qualified
          professionals!
        </p>
      </div>
    </div>
  );
}
