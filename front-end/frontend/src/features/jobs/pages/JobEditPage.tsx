import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useJobsTranslation } from "@/shared/hooks";
import {
  useJobDetailQuery,
  useSkillsQuery,
} from "@/shared/hooks/useJobsQueries";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/RichTextEditor.lazy";
import { SkillMultiSelect } from "@/components/SkillMultiSelect";
import { updateJob } from "../services/jobsApi";
import type { JobFormValues } from "../types";
import { JOB_FORM_DEFAULTS } from "../utils";
import { useQueryClient } from "@tanstack/react-query";
import { PageContainer, PageHeader } from "@/shared/components/layout";
import {
  LabelText,
  SmallText,
} from "@/shared/components/typography/Typography";
import { PageSkeleton } from "@/shared/components/states/PageSkeleton";
import { ErrorState } from "@/shared/components/states/ErrorState";

export function JobEditPage() {
  const { t } = useJobsTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const jobId = id ? Number(id) : null;
  const {
    data: jobDetail,
    isLoading: jobLoading,
    error: jobError,
    refetch: refetchJob,
  } = useJobDetailQuery(jobId);
  const { data: skills = [] } = useSkillsQuery();

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

  // Populate form when job detail is loaded
  useEffect(() => {
    if (jobDetail) {
      reset({
        title: jobDetail.title,
        description: jobDetail.description ?? "",
        rankLevel: jobDetail.rankLevel,
        workingType: jobDetail.workingType,
        location: jobDetail.location ?? "",
        addressDetail: jobDetail.addressDetail ?? "",
        experience: jobDetail.experience ?? 0,
        salaryMin: jobDetail.salaryMin ?? 0,
        salaryMax: jobDetail.salaryMax ?? 0,
        negotiable: jobDetail.negotiable ?? false,
        currency: jobDetail.currency ?? "VND",
        quantity: jobDetail.quantity ?? 1,
        deadline: jobDetail.deadline ?? "",
        skillIds: (jobDetail.skills || []).map((s) => s.id),
        responsibilities: jobDetail.responsibilities ?? "",
        requirements: jobDetail.requirements ?? "",
        benefits: jobDetail.benefits ?? "",
        workingTime: jobDetail.workingTime ?? "",
      });
    }
  }, [jobDetail, reset]);

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

  if (jobLoading) {
    return (
      <PageContainer variant="white" maxWidth="5xl">
        <PageSkeleton variant="grid" columns={2} count={4} />
      </PageContainer>
    );
  }

  if (jobError) {
    return (
      <PageContainer variant="white" maxWidth="5xl">
        <ErrorState
          error={jobError}
          onRetry={() => refetchJob()}
          variant="page"
          title={t("edit.messages.failedToLoad") || "Failed to load job"}
        />
      </PageContainer>
    );
  }

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
            <LabelText className="block">{t("edit.labels.jobTitle")}</LabelText>
            <Input
              placeholder={t("edit.placeholders.jobTitle")}
              {...register("title", {
                required: t("edit.validation.titleRequired"),
              })}
            />
            {errors.title && (
              <SmallText className="text-destructive">
                {errors.title.message}
              </SmallText>
            )}
          </div>

          <div className="space-y-2">
            <LabelText className="block">{t("edit.labels.location")}</LabelText>
            <Input
              placeholder={t("edit.placeholders.location")}
              {...register("location", {
                required: t("edit.validation.locationRequired"),
              })}
            />
            {errors.location && (
              <SmallText className="text-destructive">
                {errors.location.message}
              </SmallText>
            )}
          </div>

          <div className="space-y-2">
            <LabelText className="block">
              {t("edit.labels.addressDetail")}
            </LabelText>
            <Input
              placeholder={t("edit.placeholders.addressDetail")}
              {...register("addressDetail")}
            />
          </div>

          <div className="space-y-2">
            <LabelText className="block">{t("edit.labels.deadline")}</LabelText>
            <Input type="date" {...register("deadline")} />
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <LabelText className="block">
              {t("edit.labels.rankLevel")}
            </LabelText>
            <select
              className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm shadow-sm focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary/20 dark:bg-slate-900"
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
            <LabelText className="block">
              {t("edit.labels.workingType")}
            </LabelText>
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
            <LabelText className="block">
              {t("edit.labels.experience")}
            </LabelText>
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
            <LabelText className="block">{t("edit.labels.quantity")}</LabelText>
            <Input
              type="number"
              min={1}
              {...register("quantity", { valueAsNumber: true, required: true })}
            />
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <LabelText className="block">
              {t("edit.labels.salaryMin")}
            </LabelText>
            <Input
              type="number"
              min={0}
              {...register("salaryMin", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <LabelText className="block">
              {t("edit.labels.salaryMax")}
            </LabelText>
            <Input
              type="number"
              min={0}
              {...register("salaryMax", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <LabelText className="block">{t("edit.labels.currency")}</LabelText>
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
            <label htmlFor="negotiable" className="text-sm font-medium">
              {t("edit.labels.salaryNegotiable")}
            </label>
          </div>
        </section>

        <section className="grid gap-6">
          <div className="space-y-2">
            <LabelText className="block">
              {t("edit.labels.description")}
            </LabelText>
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
            <LabelText className="block">
              {t("edit.labels.responsibilities")}
            </LabelText>
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
            <LabelText className="block">
              {t("edit.labels.requirements")}
            </LabelText>
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
            <LabelText className="block">{t("edit.labels.benefits")}</LabelText>
            <Textarea rows={3} {...register("benefits")} />
          </div>

          <div className="space-y-2">
            <LabelText className="block">
              {t("edit.labels.workingTime")}
            </LabelText>
            <Input {...register("workingTime")} />
          </div>
        </section>

        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <LabelText className="block">
              {t("edit.labels.requiredSkills")}
            </LabelText>
            {errors.skillIds && (
              <SmallText className="text-destructive">
                {t("edit.messages.pickAtLeastOneSkill")}
              </SmallText>
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
            className={`rounded-xl ${getSemanticClass("danger", "text", true)} font-bold px-6 h-12 transition-all cursor-pointer ${getSemanticClass("danger", "bg", true).replace("bg-", "hover:bg-")} ${getSemanticClass("danger", "text", true).replace("text-", "hover:text-")} dark:hover:bg-red-500/10`}
          >
            {t("edit.buttons.cancel")}
          </Button>

          <Button
            type="submit"
            disabled={submitting}
            className={`rounded-xl ${getSemanticClass("success", "border", true).replace("border-", "border ")} bg-white ${getSemanticClass("success", "text", true)} hover:bg-lime-50 dark:bg-slate-900 dark:border-lime-500 dark:text-lime-400 dark:hover:bg-lime-500/10 font-bold px-6 h-12 transition-all cursor-pointer`}
          >
            {submitting ? t("edit.buttons.saving") : t("edit.buttons.save")}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}

export default JobEditPage;
