import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  useJobsTranslation,
  useMyJobsQuery,
  useToggleJobStatusMutation,
  useDeleteJobMutation,
} from "@/shared/hooks";
import type { JobSummary } from "../types";
import { useAuth } from "@/features/auth/context/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Edit3,
  Users,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  MapPin,
  Building2,
  Calendar,
  Briefcase,
} from "lucide-react";

const getErrorMessage = (err: Error, fallback: string): string => {
  const apiError = err as unknown as {
    response?: { data?: { message?: string } };
  };
  return apiError?.response?.data?.message || err?.message || fallback;
};

export function JobManagePage() {
  const { t } = useJobsTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: response, isLoading } = useMyJobsQuery(1, 50);
  const jobs = response?.data ?? [];

  const toggleJobStatusMutation = useToggleJobStatusMutation();
  const deleteJobMutation = useDeleteJobMutation();

  const [deadlineDialogOpen, setDeadlineDialogOpen] = useState(false);
  const [dialogJob, setDialogJob] = useState<JobSummary | null>(null);
  const [dialogDeadline, setDialogDeadline] = useState<string>("");

  const handleEdit = (id: number) => navigate(`/headhunter/jobs/${id}/edit`);

  const handleOpen = (job: JobSummary) => {
    setDialogJob(job);
    setDialogDeadline(job.deadline ?? "");
    setDeadlineDialogOpen(true);
  };

  const handleClose = (job: JobSummary) => {
    if (!confirm(t("messages.closeJobConfirm"))) return;
    toggleJobStatusMutation.mutate(
      { jobId: job.id },
      {
        onSuccess: () => toast.success(t("messages.jobClosed")),
        onError: (err: Error) =>
          toast.error(getErrorMessage(err, t("messages.failedToCloseJob"))),
      }
    );
  };

  const confirmOpenFromDialog = () => {
    if (!dialogJob || !dialogDeadline) {
      alert(t("messages.pleaseChooseDeadline"));
      return;
    }
    const parsed = new Date(dialogDeadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(parsed.getTime()) || parsed <= today) {
      alert(t("messages.invalidDeadlineMessage"));
      return;
    }
    toggleJobStatusMutation.mutate(
      { jobId: dialogJob.id, deadline: dialogDeadline },
      {
        onSuccess: () => {
          toast.success(t("messages.jobOpened"));
          setDeadlineDialogOpen(false);
          setDialogJob(null);
        },
        onError: (err: Error) =>
          toast.error(getErrorMessage(err, t("messages.failedToOpenJob"))),
      }
    );
  };

  const handleHide = (id: number) => {
    if (!confirm(t("messages.toggleVisibilityConfirm"))) return;
    deleteJobMutation.mutate(id, {
      onSuccess: () => toast.success(t("messages.jobVisibilityToggled")),
      onError: (err: Error) =>
        toast.error(
          getErrorMessage(err, t("messages.failedToChangeVisibility"))
        ),
    });
  };

  if (isLoading)
    return (
      <div className="p-8 flex justify-center items-center min-h-[400px]">
        <p className="text-slate-500 font-medium animate-pulse">
          {t("manage.loadingJobs")}
        </p>
      </div>
    );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            {t("manage.pageTitle")}
          </h2>
          <p className="text-slate-500 mt-1 font-medium italic">
            {t("common.total")}: {jobs.length}
          </p>
        </div>
        <Button
          onClick={() => navigate("/headhunter/jobs/new")}
          className="bg-lime-400 cursor-pointer hover:bg-lime-500 text-black font-bold px-6 py-6 rounded-2xl shadow-lg shadow-lime-400/20 transition-all active:scale-95 flex gap-2"
        >
          <Plus size={20} />
          {t("manage.createNewButton")}
        </Button>
      </div>

      {jobs.length === 0 ? (
        <Card className="p-20 text-center border-dashed border-2 bg-transparent rounded-3xl">
          <div className="text-slate-400 mb-4 flex justify-center">
            <Briefcase size={48} />
          </div>
          <p className="text-slate-500 font-bold">{t("manage.noJobsYet")}</p>
        </Card>
      ) : (
        <div className="grid gap-5">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="group flex flex-col lg:flex-row lg:items-center justify-between rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300"
            >
              <div className="flex gap-4 items-center">
                {/* Logo Placeholder */}
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-lime-100 group-hover:text-lime-600 transition-colors shrink-0 border border-slate-100">
                  <Building2 size={28} />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-lime-600 transition-colors">
                      {job.title}
                    </h3>

                    {/* Visibility Badge */}
                    <div
                      className={`flex items-center gap-1.5 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                        job.visible === false
                          ? "bg-slate-100 text-slate-500 border-slate-200"
                          : "bg-lime-100 text-lime-700 border-lime-200"
                      }`}
                    >
                      {job.visible === false ? (
                        <EyeOff size={12} />
                      ) : (
                        <Eye size={12} />
                      )}
                      {job.visible === false
                        ? t("manage.hidden")
                        : t("manage.visible")}
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                        job.status === "CLOSED"
                          ? "bg-red-50 text-red-600 border-red-100"
                          : "bg-emerald-50 text-emerald-600 border-emerald-100"
                      }`}
                    >
                      {job.status}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-lime-500" />
                      {job.location}
                    </div>
                    {job.deadline && (
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-red-100">
                        <Calendar size={14} />
                        <span className="text-[12px]">{job.deadline}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap items-center gap-2 mt-6 lg:mt-0 pt-6 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-xl font-bold hover:bg-slate-100 text-slate-600 flex gap-1.5 cursor-pointer"
                  onClick={() => handleEdit(job.id)}
                >
                  <Edit3 size={16} />
                  {t("manage.editButton")}
                </Button>

                <Button
                  size="sm"
                  className="bg-slate-900 text-white hover:bg-slate-800 cursor-pointer rounded-xl font-bold flex gap-1.5 px-4  transition-all active:scale-95"
                  onClick={() =>
                    navigate(`/headhunter/jobs/${job.id}/applications`)
                  }
                >
                  <Users size={16} />
                  {t("manage.viewCandidates")}
                </Button>

                <div className="flex items-center bg-slate-50 rounded-xl p-1 gap-1 border border-slate-100">
                  {job.status !== "OPEN" && (
                    <Button
                      size="sm"
                      onClick={() => handleOpen(job)}
                      disabled={toggleJobStatusMutation.isPending}
                      className="bg-lime-400 text-black hover:bg-lime-500 cursor-pointer rounded-lg shadow-sm font-black h-8 text-[11px] px-3"
                    >
                      <Unlock size={14} className="mr-1" />
                      {t("manage.openButton")}
                    </Button>
                  )}
                  {job.status !== "CLOSED" && (
                    <Button
                      size="sm"
                      onClick={() => handleClose(job)}
                      disabled={toggleJobStatusMutation.isPending}
                      className="bg-white text-red-500 hover:bg-red-50 rounded-lg cursor-pointer border border-red-100 font-black h-8 text-[11px] px-3"
                    >
                      <Lock size={14} className="mr-1" />
                      {t("manage.closeButton")}
                    </Button>
                  )}
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleHide(job.id)}
                  disabled={deleteJobMutation.isPending}
                  className={`rounded-xl cursor-pointer font-bold h-9 w-9 p-0 transition-colors ${
                    job.visible === false
                      ? "text-lime-600 hover:bg-lime-50"
                      : "text-slate-300 hover:bg-slate-100"
                  }`}
                >
                  {job.visible === false ? (
                    <Eye size={18} />
                  ) : (
                    <EyeOff size={18} />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DEADLINE DIALOG */}
      <Dialog open={deadlineDialogOpen} onOpenChange={setDeadlineDialogOpen}>
        <DialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
          <div className="bg-lime-400 p-6 text-black">
            <DialogTitle className="text-2xl font-black">
              {t("manage.setNewDeadlineTitle")}
            </DialogTitle>
            <DialogDescription className="font-medium text-black/70">
              {t("manage.setNewDeadlineDescription")}
            </DialogDescription>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {t("applications.interview.scheduledAt")}
              </label>
              <Input
                type="date"
                className="rounded-xl border-slate-200 focus:ring-lime-400 focus:border-lime-400 h-12"
                value={dialogDeadline}
                onChange={(e) => setDialogDeadline(e.target.value)}
              />
            </div>
            <DialogFooter className="gap-2 pt-4">
              <Button
                variant="ghost"
                className="rounded-xl font-bold px-6"
                onClick={() => setDeadlineDialogOpen(false)}
              >
                {t("manage.cancelButton")}
              </Button>
              <Button
                className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-8 font-bold"
                onClick={confirmOpenFromDialog}
                disabled={toggleJobStatusMutation.isPending}
              >
                {t("manage.confirmButton")}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default JobManagePage;
