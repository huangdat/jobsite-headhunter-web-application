import { Input } from "@/shared/ui-primitives/input";
import { Textarea } from "@/shared/ui-primitives/textarea";
import { useCandidateTranslation } from "@/shared/hooks/useFeatureTranslation";
import { getSemanticClass } from "@/lib/design-tokens";
import {
  type CandidateProfileFormValues,
  type ProfileValidationErrors,
  AVAILABILITY_OPTIONS,
} from "@/features/candidate/profile/types/profile.types";

interface ProfessionalIdentityProps {
  values: CandidateProfileFormValues;
  errors: ProfileValidationErrors;
  disabled?: boolean;
  onFieldChange: <K extends keyof CandidateProfileFormValues>(
    field: K,
    value: CandidateProfileFormValues[K]
  ) => void;
}

const FieldError = ({ message }: { message?: string }) => {
  if (!message) {
    return null;
  }

  return (
    <div
      className={`mt-2 flex items-center gap-1.5 ${getSemanticClass("danger", "text", true)}`}
    >
      <span className="material-symbols-outlined text-sm!">error</span>
      <span className="text-xs font-medium">{message}</span>
    </div>
  );
};

export function ProfessionalIdentity({
  values,
  errors,
  disabled = false,
  onFieldChange,
}: ProfessionalIdentityProps) {
  const { t } = useCandidateTranslation();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50">
            {t("profile.form.sectionTitle")}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {t("profile.form.sectionSubtitle")}
          </p>
        </div>

        <label
          className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold ${getSemanticClass("success", "border", true)} ${getSemanticClass("success", "bg", true)} ${getSemanticClass("success", "text", true)}`}
        >
          <input
            type="checkbox"
            checked={values.openForWork}
            disabled={disabled}
            onChange={(event) =>
              onFieldChange("openForWork", event.target.checked)
            }
          />
          {t("profile.form.openForWork")}
        </label>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
            {t("profile.form.fullName")}
          </label>
          <Input
            value={values.fullName}
            readOnly
            disabled
            className="h-11 border-slate-200 bg-slate-100 font-medium text-slate-700"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
            {t("profile.form.jobTitle")}
          </label>
          <Input
            value={values.currentTitle}
            disabled={disabled}
            className="h-11 border-slate-200 bg-slate-50 font-medium"
            onChange={(event) =>
              onFieldChange("currentTitle", event.target.value)
            }
            placeholder={t("profile.form.currentTitlePlaceholder")}
          />
          <FieldError message={errors.currentTitle} />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
            {t("profile.form.currentStatus")}
          </label>
          <select
            aria-label={t("profile.form.currentStatusAria")}
            value={values.currentStatus}
            disabled={disabled}
            className={`h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-medium outline-none transition focus:border-green-500 focus:ring-2 ${getSemanticClass(
              "success",
              "bg",
              true
            )
              .split(" ")
              .filter((c) => c.includes("ring"))
              .join(" ")}`}
            onChange={(event) =>
              onFieldChange(
                "currentStatus",
                event.target
                  .value as CandidateProfileFormValues["currentStatus"]
              )
            }
          >
            {AVAILABILITY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {t(`profile.statuses.${option}`)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
            {t("profile.form.yearsOfExperience")}
          </label>
          <Input
            type="number"
            min={0}
            max={60}
            disabled={disabled}
            className="h-11 border-slate-200 bg-slate-50 font-medium"
            value={values.yearsOfExperience ?? ""}
            onChange={(event) => {
              const next = event.target.value;
              onFieldChange(
                "yearsOfExperience",
                next === "" ? null : Number(next)
              );
            }}
          />
          <FieldError message={errors.yearsOfExperience} />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
            {t("profile.form.city")}
          </label>
          <Input
            value={values.city}
            disabled={disabled}
            className="h-11 border-slate-200 bg-slate-50 font-medium"
            onChange={(event) => onFieldChange("city", event.target.value)}
            placeholder={t("profile.form.cityPlaceholder")}
          />
          <FieldError message={errors.city} />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
            {t("profile.form.salaryMin")}
          </label>
          <Input
            type="number"
            min={0}
            disabled={disabled}
            className="h-11 border-slate-200 bg-slate-50 font-medium"
            value={values.expectedSalaryMin ?? ""}
            onChange={(event) => {
              const next = event.target.value;
              onFieldChange(
                "expectedSalaryMin",
                next === "" ? null : Number(next)
              );
            }}
          />
          <FieldError message={errors.expectedSalaryMin} />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
            {t("profile.form.salaryMax")}
          </label>
          <Input
            type="number"
            min={0}
            disabled={disabled}
            className="h-11 border-slate-200 bg-slate-50 font-medium"
            value={values.expectedSalaryMax ?? ""}
            onChange={(event) => {
              const next = event.target.value;
              onFieldChange(
                "expectedSalaryMax",
                next === "" ? null : Number(next)
              );
            }}
          />
          <FieldError message={errors.expectedSalaryMax} />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
            {t("profile.form.professionalBio")}
          </label>
          <Textarea
            rows={5}
            value={values.bio}
            disabled={disabled}
            className="resize-none border-slate-200 bg-slate-50 font-medium"
            onChange={(event) => onFieldChange("bio", event.target.value)}
            placeholder={t("profile.form.bioPlaceholder")}
          />
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <FieldError message={errors.bio} />
            <span className="ml-auto">{values.bio.length}/1000</span>
          </div>
        </div>
      </div>
    </section>
  );
}

