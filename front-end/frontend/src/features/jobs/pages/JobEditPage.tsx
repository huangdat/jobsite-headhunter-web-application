import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [skills, setSkills] = useState<SkillOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { control, register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm<JobFormValues>({
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
    Promise.all([fetchSkills(), id ? getJobDetail(Number(id)) : Promise.resolve(null)])
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
        toast.error("Unable to load job or skills.");
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
      toast.error("Please select at least one required skill.");
      return;
    }

    if (!id) return toast.error("Invalid job id");

    setSubmitting(true);
    try {
      await updateJob(Number(id), values);
      toast.success("Job updated successfully.");
      navigate("/jobs/my");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update job.");
    } finally {
      setSubmitting(false);
    }
  };

  const skillsByCategory = useMemo(() => {
    const grouped: Record<string, SkillOption[]> = {};
    skills.forEach((skill) => {
      const key = skill.category ?? "GENERAL";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(skill);
    });
    return grouped;
  }, [skills]);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-700 to-emerald-400 p-10 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">Edit job</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight">Update an existing job posting</h1>
        <p className="mt-4 max-w-3xl text-lg text-emerald-100">Adjust details and requirements; save to update the live posting.</p>
      </div>

      <form
        className="mt-10 space-y-8 rounded-3xl border border-slate-100 bg-white/80 p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900/70"
        onSubmit={handleSubmit(onSubmit)}
      >
        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">Job title</label>
            <Input placeholder="Senior Backend Engineer" {...register("title", { required: "Title is required" })} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">Location</label>
            <Input placeholder="City" {...register("location", { required: "Location is required" })} />
            {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">Address detail</label>
            <Input placeholder="Office address" {...register("addressDetail")} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">Deadline</label>
            <Input type="date" {...register("deadline")} />
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">Rank level</label>
            <select className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm shadow-sm focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-200 dark:bg-slate-900" {...register("rankLevel", { required: true })}>
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
            <label className="text-sm font-semibold text-slate-500">Working type</label>
            <select className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm shadow-sm focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-200 dark:bg-slate-900" {...register("workingType", { required: true })}>
              <option value="ONSITE">Onsite</option>
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">Experience (years)</label>
            <Input type="number" min={0} step={0.5} {...register("experience", { valueAsNumber: true, required: true })} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">Quantity</label>
            <Input type="number" min={1} {...register("quantity", { valueAsNumber: true, required: true })} />
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">Salary min (VND)</label>
            <Input type="number" min={0} {...register("salaryMin", { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">Salary max (VND)</label>
            <Input type="number" min={0} {...register("salaryMax", { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">Currency</label>
            <select className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm shadow-sm focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-200 dark:bg-slate-900" {...register("currency")}>
              <option value="VND">VND</option>
              <option value="USD">USD</option>
            </select>
          </div>
          <div className="flex items-center gap-3 pt-8">
            <input type="checkbox" id="negotiable" {...register("negotiable")} />
            <label htmlFor="negotiable" className="text-sm text-slate-600">Salary negotiable</label>
          </div>
        </section>

        <section className="grid gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">Description</label>
            <Controller control={control} name="description" render={({ field }) => (
              <RichTextEditor value={field.value} onChange={field.onChange} placeholder="Describe the job position, company culture, and what makes this role special..." />
            )} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">Responsibilities</label>
            <Controller control={control} name="responsibilities" render={({ field }) => (
              <RichTextEditor value={field.value} onChange={field.onChange} placeholder="List the main tasks and responsibilities for this role" />
            )} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">Requirements</label>
            <Controller control={control} name="requirements" render={({ field }) => (
              <RichTextEditor value={field.value} onChange={field.onChange} placeholder="Specify the skills, experience, and qualifications needed" />
            )} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">Benefits</label>
            <Textarea rows={3} {...register("benefits")} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">Working time</label>
            <Input {...register("workingTime")} />
          </div>
        </section>

        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-500">Required skills</label>
            {errors.skillIds && <span className="text-xs text-destructive">Please pick at least one skill</span>}
          </div>
          <SkillMultiSelect skills={skills} selectedIds={selectedSkillIds} onChange={handleSkillChange} disabled={false} />
        </section>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save changes'}</Button>
        </div>
      </form>
    </div>
  );
}

export default JobEditPage;
