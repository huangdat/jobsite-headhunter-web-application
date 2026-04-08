import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useJobsTranslation } from "@/shared/hooks";
import {
  useJobDetailQuery,
  useSkillsQuery,
} from "@/shared/hooks/useJobsQueries";
import { Input } from "@/shared/ui-primitives/input";
import { Textarea } from "@/shared/ui-primitives/textarea";
import { Button } from "@/shared/ui-primitives/button";
import { RichTextEditor } from "@/shared/common-blocks/RichTextEditor.lazy";
import { SkillMultiSelect } from "@/shared/common-blocks/SkillMultiSelect";
import { updateJob } from "../services/jobsApi";
import type { JobFormValues } from "../types";
import { JOB_FORM_DEFAULTS } from "../utils";
import { useQueryClient } from "@tanstack/react-query";
import { PageContainer, PageHeader } from "@/shared/common-blocks/layout";
import {
  LabelText,
  SmallText,
} from "@/shared/common-blocks/typography/Typography";
import { PageSkeleton } from "@/shared/common-blocks/states/PageSkeleton";
import { ErrorState } from "@/shared/common-blocks/states/ErrorState";
import { getSemanticClass } from "@/lib/design-tokens";

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

  // Force refetch job details when entering page to get fresh data
  useEffect(() => {
    if (jobId) {
      refetchJob();
    }
  }, [jobId, refetchJob]);

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

  // Working time checkbox handling (days of week) + per-day optional hours
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
  type Day = (typeof DAYS)[number];
  const DEFAULT_START = "09:00";
  const DEFAULT_END = "17:00";

  const initialDayTimes = DAYS.reduce((acc, d) => {
    acc[d] = { enabled: false, start: DEFAULT_START, end: DEFAULT_END };
    return acc;
  }, {} as Record<Day, { enabled: boolean; start: string; end: string }>);

  const [dayTimes, setDayTimes] = useState<Record<Day, { enabled: boolean; start: string; end: string }>>(initialDayTimes);

  const parseWorkingTimeString = (s?: string) => {
    const res: Record<Day, { enabled: boolean; start: string; end: string }> = { ...initialDayTimes };
    if (!s) return res;

    const segRegex = /([A-Za-z]{3}(?:\s*-\s*[A-Za-z]{3})?)(?:\s*\(([^)]+)\))?/g;
    let m: RegExpExecArray | null = null;
    while ((m = segRegex.exec(s)) !== null) {
      const dayPart = m[1].trim();
      const timePart = m[2]?.trim();
      let sTime = DEFAULT_START;
      let eTime = DEFAULT_END;
      if (timePart) {
        const parts = timePart.split("-").map((p) => p.trim());
        if (parts.length >= 2) {
          sTime = parts[0];
          eTime = parts[1];
        }
      }
      const order = Array.from(DAYS);
      if (dayPart.includes("-")) {
        const [start, end] = dayPart.split("-").map((v) => v.trim());
        const si = order.indexOf(start as Day);
        const ei = order.indexOf(end as Day);
        if (si >= 0 && ei >= si) {
          for (let i = si; i <= ei; i++) {
            const d = order[i] as Day;
            res[d] = { enabled: true, start: sTime, end: eTime };
          }
          continue;
        }
      }
      const day = dayPart as Day;
      if (DAYS.includes(day)) {
        res[day] = { enabled: true, start: sTime, end: eTime };
      }
    }
    return res;
  };

  const joinWorkingTime = (map: Record<Day, { enabled: boolean; start: string; end: string }>) => {
    const order = Array.from(DAYS) as Day[];
    type Run = { startIdx: number; endIdx: number; start: string; end: string };
    const runs: Run[] = [];
    let i = 0;
    while (i < order.length) {
      const d = order[i];
      const info = map[d];
      if (!info || !info.enabled) {
        i++;
        continue;
      }
      let j = i;
      while (j + 1 < order.length) {
        const next = order[j + 1];
        const nextInfo = map[next];
        if (!nextInfo || !nextInfo.enabled) break;
        if (nextInfo.start !== info.start || nextInfo.end !== info.end) break;
        j++;
      }
      runs.push({ startIdx: i, endIdx: j, start: info.start, end: info.end });
      i = j + 1;
    }
    if (runs.length === 0) return "";
    const parts = runs.map((r) => {
      const startDay = order[r.startIdx];
      const endDay = order[r.endIdx];
      if (r.startIdx === r.endIdx) return `${startDay} (${r.start} - ${r.end})`;
      return `${startDay} - ${endDay} (${r.start} - ${r.end})`;
    });
    return parts.join(", ");
  };

  const watchedWorkingTime = watch("workingTime");
  useEffect(() => {
    try {
      const parsed = parseWorkingTimeString(watchedWorkingTime);
      setDayTimes(parsed);
    } catch (err) {
      // ignore parse errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedWorkingTime]);

  useEffect(() => {
    setValue("workingTime", joinWorkingTime(dayTimes));
  }, [dayTimes, setValue]);

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

      // Invalidate caches and refetch immediately
      await queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
      await queryClient.refetchQueries({ queryKey: ["my-jobs"] });

      await queryClient.invalidateQueries({ queryKey: ["job-detail", id] });
      await queryClient.refetchQueries({ queryKey: ["job-detail", id] });

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
        className={`mt-10 space-y-8 rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-lg dark:shadow-slate-900/30 ${getSemanticClass("info", "border", true)}`}
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
            <Input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              {...register("deadline")}
            />
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
            <LabelText className="block">{t("edit.labels.workingTime")}</LabelText>
            <div className="space-y-2">
              {DAYS.map((day) => {
                const info = dayTimes[day as Day];
                return (
                  <div key={day} className="flex items-center justify-between gap-4 py-1">
                    <div className="flex items-center gap-2">
                      <input
                        id={`day-${day}`}
                        type="checkbox"
                        checked={info?.enabled}
                        onChange={(e) =>
                          setDayTimes((prev) => ({
                            ...prev,
                            [day]: {
                              ...prev[day as Day],
                              enabled: e.target.checked,
                              start: e.target.checked && !prev[day as Day].start ? DEFAULT_START : prev[day as Day].start,
                              end: e.target.checked && !prev[day as Day].end ? DEFAULT_END : prev[day as Day].end,
                            },
                          }))
                        }
                        className="h-4 w-4 rounded border-input"
                      />
                      <label htmlFor={`day-${day}`} className="text-sm">{day}</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        id={`start-${day}`}
                        type="time"
                        value={info?.start || DEFAULT_START}
                        onChange={(e) => setDayTimes((prev) => ({ ...prev, [day]: { ...prev[day as Day], start: e.target.value } }))}
                        disabled={!info?.enabled}
                      />
                      <span className="text-sm">—</span>
                      <Input
                        id={`end-${day}`}
                        type="time"
                        value={info?.end || DEFAULT_END}
                        onChange={(e) => setDayTimes((prev) => ({ ...prev, [day]: { ...prev[day as Day], end: e.target.value } }))}
                        disabled={!info?.enabled}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
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
