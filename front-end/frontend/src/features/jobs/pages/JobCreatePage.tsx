import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/RichTextEditor";
import { createJob, fetchSkills } from "../services/jobsApi";
import type { JobFormValues, SkillOption } from "../types";
import { SkillMultiSelect } from "@/components/SkillMultiSelect";

const defaultDeadline = () => {
  const today = new Date();
  today.setDate(today.getDate() + 30);
  return today.toISOString().slice(0, 10);
};

export function JobCreatePage() {
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
      title: "",
      description: "",
      rankLevel: "JUNIOR",
      workingType: "ONSITE",
      location: "Ho Chi Minh City",
      addressDetail: "",
      experience: 1,
      salaryMin: 15000000,
      salaryMax: 30000000,
      negotiable: false,
      currency: "VND",
      quantity: 1,
      deadline: defaultDeadline(),
      skillIds: [],
      responsibilities: "",
      requirements: "",
      benefits: "",
      workingTime: "Mon - Fri",
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
        toast.error("Unable to load skills list. Please retry later.");
      })
      .finally(() => {
        if (active) {
          setIsLoadingSkills(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const selectedSkillIds = watch("skillIds") ?? [];

  const onSubmit = async (values: JobFormValues) => {
    // Basic client-side validations according to ACs
    if (!values.title || values.title.trim().length === 0) {
      toast.error("Title cannot be empty");
      return;
    }

    if (!values.description || values.description.replace(/<[^>]*>/g, "").trim().length === 0) {
      toast.error("Description cannot be empty");
      return;
    }

    if ((values.quantity ?? 0) <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    if (values.deadline && values.deadline < todayStr) {
      toast.error("Deadline must be today or later");
      return;
    }

    if (!values.skillIds || values.skillIds.length === 0) {
      toast.error("At least one skill must be selected");
      return;
    }

    const strip = (s = "") => s.replace(/<[^>]*>/g, "").trim();
    if (strip(values.responsibilities).length < 50 || strip(values.requirements).length < 50) {
      toast.error("Responsibilities/Requirements must be at least 50 characters");
      return;
    }

    if (!values.negotiable) {
      if ((values.salaryMin ?? 0) < 0 || (values.salaryMax ?? 0) < 0) {
        toast.error("Salary cannot be negative");
        return;
      }
      if ((values.salaryMin ?? 0) > (values.salaryMax ?? 0)) {
        toast.error("Salary min cannot be greater than salary max");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await createJob(values as any);
      console.log("Job creation response:", res);
      if (res && (res.status === 201 || res.status === 200)) {
        toast.success("Job posted successfully.");
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
          location: "Ho Chi Minh City",
          experience: 1,
          salaryMin: 15000000,
          salaryMax: 30000000,
          negotiable: false,
          currency: "VND",
          quantity: 1,
          deadline: "",
          workingTime: "Mon - Fri",
        });
        setTimeout(() => {
          navigate("/headhunter/jobs");
        }, 500);
      } else {
        console.error("Unexpected response:", res);
        toast.error("Failed to create job. Please check the form and try again.");
      }
    } catch (error) {
      console.error("Job creation error:", error);
      toast.error("Failed to create job. Please check the form and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-700 to-emerald-400 p-10 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">
          HeadHunter control panel
        </p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight">
          Publish a compelling job and attract the right talents.
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-emerald-100">
          Fill in detailed requirements, responsibilities, and benefits so
          candidates know exactly what to expect.
        </p>
      </div>

      <form
        className="mt-10 space-y-8 rounded-3xl border border-slate-100 bg-white/80 p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900/70"
        onSubmit={handleSubmit(onSubmit)}
      >
        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">
              Job title
            </label>
            <Input
              placeholder="Senior Backend Engineer"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">
              Location
            </label>
            <Input
              placeholder="City"
              {...register("location", { required: "Location is required" })}
            />
            {errors.location && (
              <p className="text-sm text-destructive">
                {errors.location.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">
              Address detail
            </label>
            <Input
              placeholder="Office address"
              {...register("addressDetail", {
                required: "Address detail is required",
              })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">
              Deadline
            </label>
            <Input type="date" {...register("deadline", { required: true })} />
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">
              Rank level
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
              Working type
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
              Experience (years)
            </label>
            <Input
              type="number"
              min={0}
              step={0.5}
              {...register("experience", { valueAsNumber: true, required: true })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">
              Quantity
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
              Salary min (VND)
            </label>
            <Input
              type="number"
              min={0}
              {...register("salaryMin", { valueAsNumber: true, required: true })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">
              Salary max (VND)
            </label>
            <Input
              type="number"
              min={0}
              {...register("salaryMax", { valueAsNumber: true, required: true })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">
              Currency
            </label>
            <select
              className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm shadow-sm focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-200 dark:bg-slate-900"
              {...register("currency", { required: true })}
            >
              <option value="VND">VND</option>
              <option value="USD">USD</option>
            </select>
          </div>
          <div className="flex items-center gap-3 pt-8">
            <input type="checkbox" id="negotiable" {...register("negotiable")} />
            <label htmlFor="negotiable" className="text-sm text-slate-600">
              Salary negotiable
            </label>
          </div>
        </section>

        <section className="grid gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">
              Description
            </label>
            <Controller
              control={control}
              name="description"
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Describe the job position, company culture, and what makes this role special..."
                />
              )}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">
              Responsibilities
            </label>
            <Controller
              control={control}
              name="responsibilities"
              rules={{
                required: "Responsibilities is required",
                validate: (v) => (v && v.replace(/<[^>]*>/g, "").trim().length >= 50) || "Responsibilities must be at least 50 characters",
              }}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="List the main tasks and responsibilities for this role (minimum 50 characters)..."
                />
              )}
            />
            {errors.responsibilities && (
              <p className="text-sm text-destructive">{errors.responsibilities.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">
              Requirements
            </label>
            <Controller
              control={control}
              name="requirements"
              rules={{
                required: "Requirements is required",
                validate: (v) => (v && v.replace(/<[^>]*>/g, "").trim().length >= 50) || "Requirements must be at least 50 characters",
              }}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Specify the skills, experience, and qualifications needed (minimum 50 characters)..."
                />
              )}
            />
            {errors.requirements && (
              <p className="text-sm text-destructive">{errors.requirements.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">
              Benefits
            </label>
            <Textarea rows={3} {...register("benefits", { required: true })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">
              Working time
            </label>
            <Input {...register("workingTime", { required: true })} />
          </div>
        </section>

        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-500">
              Required skills
            </label>
            {errors.skillIds && (
              <span className="text-xs text-destructive">
                Please pick at least one skill
              </span>
            )}
          </div>
          <SkillMultiSelect
            skills={skills}
            selectedIds={selectedSkillIds}
            onChange={(ids) => setValue("skillIds", ids, { shouldDirty: true, shouldValidate: true })}
            disabled={isLoadingSkills}
          />
        </section>

        <section className="space-y-2">
          <label className="text-sm font-semibold text-slate-500">
            Cover image (optional)
          </label>
          <Input type="file" accept="image/*" {...register("postImage")} />
        </section>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => reset()}>
            Clear
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Publishing..." : "Publish job"}
          </Button>
        </div>
      </form>
    </div>
  );
}
