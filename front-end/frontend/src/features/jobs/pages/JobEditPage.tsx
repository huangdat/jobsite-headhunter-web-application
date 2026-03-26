import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/RichTextEditor";
import { SkillMultiSelect } from "@/components/SkillMultiSelect";
import { getJobDetail, updateJob, fetchSkills } from "../services/jobsApi";
import type { JobFormValues, SkillOption } from "../types";

export function JobEditPage() {
  const { t } = useTranslation("jobs");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [skills, setSkills] = useState<SkillOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<JobFormValues>({
    defaultValues: {
      title: "",
      description: "",
      rankLevel: "JUNIOR",
      workingType: "ONSITE",
      location: "",
      addressDetail: "",
      experience: 1,
      salaryMin: 0,
      salaryMax: 0,
      negotiable: false,
      currency: "VND",
      quantity: 1,
      deadline: "",
      skillIds: [],
      responsibilities: "",
      requirements: "",
      benefits: "",
      workingTime: "",
    },
  });

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      fetchSkills(),
      id ? getJobDetail(Number(id)) : Promise.resolve(null),
    ])
      .then(([skillsData, job]) => {
        if (!active) return;
        setSkills(skillsData || []);
        if (job) {
          // map job detail to form
          reset({
            title: job.title,
            description: job.description ?? "",
            rankLevel: job.rankLevel,
            workingType: job.workingType,
            location: job.location ?? "",
            addressDetail: job.addressDetail ?? "",
            experience: job.experience ?? 0,
            salaryMin: job.salaryMin ?? 0,
            salaryMax: job.salaryMax ?? 0,
            negotiable: job.negotiable ?? false,
            currency: job.currency ?? "VND",
            quantity: job.quantity ?? 1,
            deadline: job.deadline ?? "",
            skillIds: (job.skills || []).map((s) => s.id),
            responsibilities: job.responsibilities ?? "",
            requirements: job.requirements ?? "",
            benefits: job.benefits ?? "",
            workingTime: job.workingTime ?? "",
          });
        }
      })
      .catch(() => {
        toast.error(t("edit.unableToLoad"));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, reset]);

  const selectedSkillIds = watch("skillIds") ?? [];

  const handleSkillChange = (ids: number[]) => {
    setValue("skillIds", ids, { shouldDirty: true, shouldValidate: true });
  };

  const onSubmit = async (values: JobFormValues) => {
    if (values.skillIds.length === 0) {
      toast.error(t("edit.pickAtLeastOneSkill"));
      return;
    }

    if (!id) return toast.error(t("edit.invalidJobId"));

    setSubmitting(true);
    try {
      await updateJob(Number(id), values);
      toast.success(t("edit.updatedSuccess"));
      navigate("/jobs/my");
    } catch (err) {
      console.error(err);
      toast.error(t("edit.failedToUpdate"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8">{t("edit.loading")}</div>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-700 to-emerald-400 p-10 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">
          {t("edit.pageTitle")}
        </p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight">
          {t("edit.heading")}
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-emerald-100">
          {t("edit.subtitle")}
        </p>
      </div>

      <form
        className="mt-10 space-y-8 rounded-3xl border border-slate-100 bg-white/80 p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900/70"
        onSubmit={handleSubmit(onSubmit)}
      >
        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">
              {t("edit.jobTitle")}
            </label>
            <Input
              placeholder={t("edit.jobTitlePlaceholder")}
              {...register("title", { required: t("edit.titleRequired") })}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">
              {t("edit.location")}
            </label>
            <Input
              placeholder={t("edit.locationPlaceholder")}
              {...register("location", {
                required: t("edit.locationRequired"),
              })}
            />
            {errors.location && (
              <p className="text-sm text-destructive">
                {errors.location.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">
              {t("edit.addressDetail")}
            </label>
            <Input
              placeholder={t("edit.addressDetailPlaceholder")}
              {...register("addressDetail")}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">
              {t("edit.deadline")}
            </label>
            <Input type="date" {...register("deadline")} />
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">
              {t("edit.rankLevel")}
            </label>
            <select
              className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm shadow-sm focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-200 dark:bg-slate-900"
              {...register("rankLevel", { required: true })}
            >
              <option value="INTERN">Intern</option>
              <option value="FRESHER">Fresher</option>
              <option value="JUNIOR">Junior</option>
              <option value="MIDDLE">Middle</option>
              <option value="SENIOR">Senior</option>
              <option value="LEADER">Leader</option>
              <option value="MANAGER">Manager</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">
              {t("edit.workingType")}
            </label>
            <select
              className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm shadow-sm focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-200 dark:bg-slate-900"
              {...register("workingType", { required: true })}
            >
              <option value="ONSITE">Onsite</option>
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">
              {t("edit.experience")}
            </label>
            <Input
              type="number"
              min={0}
              step={0.5}
              {...register("experience", {
                valueAsNumber: true,
                required: true,
              })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">
              {t("edit.quantity")}
            </label>
            <Input
              type="number"
              min={1}
              {...register("quantity", { valueAsNumber: true, required: true })}
            />
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">
              {t("edit.salaryMin")}
            </label>
            <Input
              type="number"
              min={0}
              {...register("salaryMin", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">
              {t("edit.salaryMax")}
            </label>
            <Input
              type="number"
              min={0}
              {...register("salaryMax", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">
              {t("edit.currency")}
            </label>
            <select
              className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm shadow-sm focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-200 dark:bg-slate-900"
              {...register("currency")}
            >
              <option value="VND">VND</option>
              <option value="USD">USD</option>
            </select>
          </div>
          <div className="flex items-center gap-3 pt-8">
            <input
              type="checkbox"
              id="negotiable"
              {...register("negotiable")}
            />
            <label htmlFor="negotiable" className="text-sm text-slate-600">
              {t("edit.salaryNegotiable")}
            </label>
          </div>
        </section>

        <section className="grid gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">
              {t("edit.description")}
            </label>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t("edit.descriptionPlaceholder")}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">
              {t("edit.responsibilities")}
            </label>
            <Controller
              control={control}
              name="responsibilities"
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t("edit.responsibilitiesPlaceholder")}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">
              {t("edit.requirements")}
            </label>
            <Controller
              control={control}
              name="requirements"
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t("edit.requirementsPlaceholder")}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">
              {t("edit.benefits")}
            </label>
            <Textarea rows={3} {...register("benefits")} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">
              {t("edit.workingTime")}
            </label>
            <Input {...register("workingTime")} />
          </div>
        </section>

        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-500">
              {t("edit.requiredSkills")}
            </label>
            {errors.skillIds && (
              <span className="text-xs text-destructive">
                {t("edit.pickAtLeastOneSkill")}
              </span>
            )}
          </div>
          <SkillMultiSelect
            skills={skills}
            selectedIds={selectedSkillIds}
            onChange={handleSkillChange}
            disabled={false}
          />
        </section>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            {t("edit.cancelButton")}
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? t("edit.savingButton") : t("edit.saveButton")}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default JobEditPage;
