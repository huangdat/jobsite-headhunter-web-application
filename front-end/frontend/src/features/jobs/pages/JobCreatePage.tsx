import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useJobsTranslation } from "@/shared/hooks";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/RichTextEditor.lazy";
import { createJob, fetchSkills } from "../services/jobsApi";
import type { JobFormValues, SkillOption } from "../types";
import { SkillMultiSelect } from "@/components/SkillMultiSelect";
import { JOB_FORM_DEFAULTS, calculateDefaultDeadline } from "../utils";
import { ChevronLeft } from "lucide-react";
import { PageContainer, PageHeader } from "@/shared/components/layout";

export function JobCreatePage() {
  const { t } = useJobsTranslation();
  const navigate = useNavigate();
  const [skills, setSkills] = useState<SkillOption[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<JobFormValues>({
    defaultValues: {
      ...JOB_FORM_DEFAULTS,
      deadline: calculateDefaultDeadline(),
    },
  });

  useEffect(() => {
    let active = true;
    setIsLoadingSkills(true);
    fetchSkills()
      .then((data) => {
        if (!active) return;
        setSkills(data);
      })
      .catch(() => {
        toast.error(t("validation.unableToLoadSkills"));
      })
      .finally(() => {
        if (active) {
          setIsLoadingSkills(false);
        }
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedSkillIds = watch("skillIds") ?? [];

  const onSubmit = async (values: JobFormValues) => {
    // Basic client-side validations according to ACs
    if (!values.title || values.title.trim().length === 0) {
      toast.error(t("create.validation.titleRequired"));
      return;
    }

    const stripMarkdown = (s = "") =>
      s
        .replace(/<[^>]*>/g, "")
        .replace(/[*_~`>#\-[()!]/g, "")
        .replace(/\s+/g, " ")
        .trim();

    if (!values.description || stripMarkdown(values.description).length === 0) {
      toast.error(t("create.validation.descriptionRequired"));
      return;
    }

    if ((values.quantity ?? 0) <= 0) {
      toast.error(t("validation.quantityPositive"));
      return;
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    if (values.deadline && values.deadline < todayStr) {
      toast.error(t("validation.dateInFuture"));
      return;
    }

    if (!values.skillIds || values.skillIds.length === 0) {
      toast.error(t("validation.skillRequired"));
      return;
    }

    const strip = (s = "") =>
      s
        .replace(/<[^>]*>/g, "")
        .replace(/[*_~`>#\-[()!]/g, "")
        .trim();
    if (
      strip(values.responsibilities).length < 50 ||
      strip(values.requirements).length < 50
    ) {
      toast.error(t("validation.minCharacters"));
      return;
    }

    if (!values.negotiable) {
      if ((values.salaryMin ?? 0) < 0 || (values.salaryMax ?? 0) < 0) {
        toast.error(t("validation.salaryNegative"));
        return;
      }
      if ((values.salaryMin ?? 0) > (values.salaryMax ?? 0)) {
        toast.error(t("validation.salaryOrder"));
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await createJob(values as JobFormValues);
      if (res) {
        toast.success(t("messages.jobCreatedSuccess"));
        reset({
          title: "",
          description: "",
          addressDetail: "",
          responsibilities: "",
          requirements: "",
          benefits: "",
          skillIds: [],
          postImage: undefined,
          rankLevel: "JUNIOR",
          workingType: "ONSITE",
          location: t("defaults.location"),
          experience: 1,
          salaryMin: 15000000,
          salaryMax: 30000000,
          negotiable: false,
          currency: "VND",
          quantity: 1,
          deadline: "",
          workingTime: t("defaults.workingTime"),
        });
        setTimeout(() => {
          navigate("/headhunter/jobs");
        }, 500);
      } else {
        toast.error(t("create.messages.failedToCreate"));
      }
    } catch {
      toast.error(t("create.messages.failedToCreate"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer variant="white" maxWidth="5xl">
      <PageHeader
        variant="bordered"
        title={t("create.messages.publishJob")}
        description={t("create.messages.subtitle")}
        actions={
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/home")}
            className="rounded-xl border-slate-200 dark:border-slate-700 hover:border-brand-primary dark:hover:border-brand-primary hover:bg-brand-primary/10 dark:hover:bg-brand-primary/10 font-bold px-6 h-12 flex gap-2 transition-all cursor-pointer"
          >
            <ChevronLeft size={18} className="text-brand-primary" />
            {t("detail.backToJobs")}
          </Button>
        }
      />

      <form
        className="mt-10 space-y-8 rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-lg dark:shadow-slate-900/30"
        onSubmit={handleSubmit(onSubmit)}
      >
        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t("create.labels.jobTitle")}
            </label>
            <Input
              placeholder={t("create.placeholders.jobTitle")}
              {...register("title", {
                required: t("create.validation.titleRequired"),
              })}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t("create.labels.location")}
            </label>
            <Input
              placeholder={t("create.placeholders.location")}
              {...register("location", {
                required: t("create.validation.locationRequired"),
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
              {t("create.labels.addressDetail")}
            </label>
            <Input
              placeholder={t("create.placeholders.addressDetail")}
              {...register("addressDetail", {
                required: t("create.validation.addressDetailRequired"),
              })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t("create.labels.deadline")}
            </label>
            <Input type="date" {...register("deadline", { required: true })} />
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">
              {t("create.labels.rankLevel")}
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
              {t("create.labels.workingType")}
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
              {t("create.labels.experience")}
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
              {t("create.labels.quantity")}
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
              {t("create.labels.salaryMin")}
            </label>
            <Input
              type="number"
              min={0}
              {...register("salaryMin", {
                valueAsNumber: true,
                required: true,
              })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t("create.labels.salaryMax")}
            </label>
            <Input
              type="number"
              min={0}
              {...register("salaryMax", {
                valueAsNumber: true,
                required: true,
              })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t("create.labels.currency")}
            </label>
            <select
              className="h-10 w-full rounded-lg border border-input bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 text-sm shadow-sm focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary/20"
              {...register("currency", { required: true })}
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
              {t("create.labels.salaryNegotiable")}
            </label>
          </div>
        </section>

        <section className="grid gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t("create.labels.description")}
            </label>
            <Controller
              control={control}
              name="description"
              rules={{ required: t("create.validation.descriptionRequired") }}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t("create.placeholders.description")}
                />
              )}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t("create.labels.responsibilities")}
            </label>
            <Controller
              control={control}
              name="responsibilities"
              rules={{
                required: t("create.validation.responsibilitiesRequired"),
                validate: (v) => {
                  const stripped = (v || "")
                    .replace(/<[^>]*>/g, "")
                    .replace(/[*_~`>#\-[]()!]/g, "")
                    .trim();
                  return (
                    (v && stripped.length >= 50) ||
                    t("create.validation.responsibilitiesMinLength")
                  );
                },
              }}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t("create.placeholders.responsibilities")}
                />
              )}
            />
            {errors.responsibilities && (
              <p className="text-sm text-destructive">
                {errors.responsibilities.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t("create.labels.requirements")}
            </label>
            <Controller
              control={control}
              name="requirements"
              rules={{
                required: t("create.validation.requirementsRequired"),
                validate: (v) => {
                  const stripped = (v || "")
                    .replace(/<[^>]*>/g, "")
                    .replace(/[*_~`>#\-[]()!]/g, "")
                    .trim();
                  return (
                    (v && stripped.length >= 50) ||
                    t("create.validation.requirementsMinLength")
                  );
                },
              }}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t("create.placeholders.requirements")}
                />
              )}
            />
            {errors.requirements && (
              <p className="text-sm text-destructive">
                {errors.requirements.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t("create.labels.benefits")}
            </label>
            <Textarea rows={3} {...register("benefits", { required: true })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t("create.labels.workingTime")}
            </label>
            <Input {...register("workingTime", { required: true })} />
          </div>
        </section>

        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t("create.labels.requiredSkills")}
            </label>
            {errors.skillIds && (
              <span className="text-xs text-destructive">
                {t("create.messages.pickAtLeastOneSkill")}
              </span>
            )}
          </div>
          <SkillMultiSelect
            skills={skills}
            selectedIds={selectedSkillIds}
            onChange={(ids) =>
              setValue("skillIds", ids, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            disabled={isLoadingSkills}
          />
        </section>

        <section className="space-y-2">
          <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {t("create.labels.coverImage")}
          </label>
          <Input type="file" accept="image/*" {...register("postImage")} />
        </section>

        <div className="flex justify-end items-center gap-3 pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={() => reset()}
            className="rounded-xl font-bold text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 h-11 px-6 cursor-pointer transition-colors"
          >
            {t("edit.buttons.cancel") || "Clear"}
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl border border-lime-500 bg-white text-lime-600 hover:bg-lime-50 dark:bg-slate-900 dark:border-lime-500 dark:text-lime-400 dark:hover:bg-lime-500/10 font-bold px-6 h-12 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                {t("create.messages.publishingJob")}
              </div>
            ) : (
              t("create.messages.publishJob")
            )}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
