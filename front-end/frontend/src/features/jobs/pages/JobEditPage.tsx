import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useJobsTranslation } from "@/shared/hooks";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/RichTextEditor.lazy";
import { SkillMultiSelect } from "@/components/SkillMultiSelect";
import { getJobDetail, updateJob, fetchSkills } from "../services/jobsApi";
import type { JobFormValues, SkillOption } from "../types";
import { JOB_FORM_DEFAULTS } from "../utils";
import { useQueryClient } from "@tanstack/react-query";
import { PageContainer, PageHeader } from "@/shared/components/layout";

export function JobEditPage() {
  const { t } = useJobsTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [skills, setSkills] = useState<SkillOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();

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
      ...JOB_FORM_DEFAULTS,
      location: "",
      salaryMin: 0,
      salaryMax: 0,
      deadline: "",
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
        toast.error(t("edit.messages.unableToLoad"));
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
      toast.error(t("edit.messages.pickAtLeastOneSkill"));
      return;
    }

    if (!id) return toast.error(t("edit.messages.invalidJobId"));

    setSubmitting(true);
    try {
      await updateJob(Number(id), values);

      await queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
      await queryClient.invalidateQueries({ queryKey: ["job-detail", id] });

      toast.success(t("edit.messages.updatedSuccess"));

      setTimeout(() => {
        navigate("/headhunter/jobs");
      }, 500);
    } catch (err) {
      console.error(err);
      toast.error(t("edit.messages.failedToUpdate"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <PageContainer variant="white" maxWidth="5xl">
        <div className="flex justify-center items-center min-h-100">
          <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">
            {t("edit.messages.loading")}
          </p>
        </div>
      </PageContainer>
    );

  return (
    <PageContainer variant="white" maxWidth="5xl">
      <PageHeader
        variant="gradient"
        title={t("edit.messages.heading")}
        description={t("edit.messages.subtitle")}
      />

      <form
        className="mt-10 space-y-8 rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-lg dark:shadow-slate-900/30"
        onSubmit={handleSubmit(onSubmit)}
      >
        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t("edit.labels.jobTitle")}
            </label>
            <Input
              placeholder={t("edit.placeholders.jobTitle")}
              {...register("title", {
                required: t("edit.validation.titleRequired"),
              })}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t("edit.labels.location")}
            </label>
            <Input
              placeholder={t("edit.placeholders.location")}
              {...register("location", {
                required: t("edit.validation.locationRequired"),
              })}
            />
            {errors.location && (
              <p className="text-sm text-destructive">
                {errors.location.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t("edit.labels.addressDetail")}
            </label>
            <Input
              placeholder={t("edit.placeholders.addressDetail")}
              {...register("addressDetail")}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t("edit.labels.deadline")}
            </label>
            <Input type="date" {...register("deadline")} />
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">
              {t("edit.labels.rankLevel")}
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
            <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t("edit.labels.workingType")}
            </label>
            <select
              className="h-10 w-full rounded-lg border border-input bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 text-sm shadow-sm focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary/20"
              {...register("workingType", { required: true })}
            >
              <option value="ONSITE">Onsite</option>
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t("edit.labels.experience")}
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
            <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t("edit.labels.quantity")}
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
            <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t("edit.labels.salaryMin")}
            </label>
            <Input
              type="number"
              min={0}
              {...register("salaryMin", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t("edit.labels.salaryMax")}
            </label>
            <Input
              type="number"
              min={0}
              {...register("salaryMax", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t("edit.labels.currency")}
            </label>
            <select
              className="h-10 w-full rounded-lg border border-input bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 text-sm shadow-sm focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary/20"
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
            <label
              htmlFor="negotiable"
              className="text-sm text-slate-600 dark:text-slate-400"
            >
              {t("edit.labels.salaryNegotiable")}
            </label>
          </div>
        </section>

        <section className="grid gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t("edit.labels.description")}
            </label>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t("edit.placeholders.description")}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t("edit.labels.responsibilities")}
            </label>
            <Controller
              control={control}
              name="responsibilities"
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t("edit.placeholders.responsibilities")}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t("edit.labels.requirements")}
            </label>
            <Controller
              control={control}
              name="requirements"
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t("edit.placeholders.requirements")}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t("edit.labels.benefits")}
            </label>
            <Textarea rows={3} {...register("benefits")} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t("edit.labels.workingTime")}
            </label>
            <Input {...register("workingTime")} />
          </div>
        </section>

        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t("edit.labels.requiredSkills")}
            </label>
            {errors.skillIds && (
              <span className="text-xs text-destructive">
                {t("edit.messages.pickAtLeastOneSkill")}
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
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(-1)}
            className="rounded-xl text-red-400 font-bold px-6 h-12 transition-all cursor-pointer hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
          >
            {t("edit.buttons.cancel")}
          </Button>

          <Button
            type="submit"
            disabled={submitting}
            className="rounded-xl border border-lime-500 bg-white text-lime-600 hover:bg-lime-50 dark:bg-slate-900 dark:border-lime-500 dark:text-lime-400 dark:hover:bg-lime-500/10 font-bold px-6 h-12 transition-all cursor-pointer"
          >
            {submitting ? t("edit.buttons.saving") : t("edit.buttons.save")}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}

export default JobEditPage;
