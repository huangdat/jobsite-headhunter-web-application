import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  useJobsTranslation,
  useMyJobsQuery,
  useToggleJobStatusMutation,
  useDeleteJobMutation,
} from "@/shared/hooks";
import {
  SmallText,
  SubsectionTitle,
} from "@/shared/components/typography/Typography";
import type { JobSummary } from "../types";
import { PageContainer, PageHeader } from "@/shared/components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
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
      <PageContainer variant="white" maxWidth="7xl">
        <div className="flex justify-center items-center min-h-100">
          <SmallText variant="muted" weight="bold" className="animate-pulse">
            {t("manage.loadingJobs")}
          </SmallText>
        </div>
      </PageContainer>
    );

  return (
    <PageContainer variant="white" maxWidth="7xl">
      <PageHeader
        variant="default"
        title={t("manage.pageTitle")}
        description={`${t("common.total")}: ${jobs.length}`}
        actions={
          <button
            onClick={() => navigate("/headhunter/jobs/new")}
            className="bg-brand-primary cursor-pointer hover:bg-brand-primary/90 text-white px-6 py-6 rounded-2xl shadow-lg shadow-brand-primary/20 transition-all active:scale-95 flex gap-2"
          >
            <Plus size={20} />
            <SmallText className="text-white">
              {t("manage.createNewButton")}
            </SmallText>
          </button>
        }
      />

      {jobs.length === 0 ? (
        <Card className="p-20 text-center border-dashed border-2 bg-transparent dark:bg-slate-900/50 dark:border-slate-700 rounded-3xl">
          <div className="text-slate-400 dark:text-slate-500 mb-4 flex justify-center">
            <Briefcase size={48} />
          </div>
          <SmallText
            weight="bold"
            className="text-slate-500 dark:text-slate-400"
          >
            {t("manage.noJobsYet")}
          </SmallText>
        </Card>
      ) : (
        <div className="grid gap-5">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="group flex flex-col lg:flex-row lg:items-center justify-between rounded-3xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm dark:shadow-slate-900/20 transition-all duration-300"
            >
              <div className="flex gap-4 items-center">
                {/* Logo Placeholder */}
                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors shrink-0 border border-slate-100 dark:border-slate-700">
                  <Building2 size={28} />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <SubsectionTitle className="text-xl group-hover:text-brand-primary transition-colors">
                      {job.title}
                    </SubsectionTitle>

                    {/* Visibility Badge */}
                    <div
                      className={`flex items-center gap-1.5 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                        job.visible === false
                          ? "bg-slate-100 text-slate-500 border-slate-200"
                          : "bg-brand-primary/20 text-brand-primary border-brand-primary/30 font-bold"
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
                          : "bg-brand-primary/20 text-brand-primary border-brand-primary/30 font-bold"
                      }`}
                    >
                      {job.status}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-brand-primary" />
                      <SmallText>{job.location}</SmallText>
                    </div>
                    {job.deadline && (
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-red-100">
                        <Calendar size={14} />
                        <SmallText className="text-[12px]">
                          {job.deadline}
                        </SmallText>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap items-center gap-2 mt-6 lg:mt-0 pt-6 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-700">
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex gap-1.5 cursor-pointer"
                  onClick={() => handleEdit(job.id)}
                >
                  <Edit3 size={16} />
                  <SmallText className="text-inherit">
                    {t("manage.editButton")}
                  </SmallText>
                </Button>

                <Button
                  size="sm"
                  className="bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 cursor-pointer rounded-xl flex gap-1.5 px-4 transition-all active:scale-95"
                  onClick={() =>
                    navigate(`/headhunter/jobs/${job.id}/applications`)
                  }
                >
                  <Users size={16} />
                  <SmallText className="text-white">
                    {t("manage.viewCandidates")}
                  </SmallText>
                </Button>

                <div className="flex items-center bg-slate-50 dark:bg-slate-700/50 rounded-xl p-1 gap-1 border border-slate-100 dark:border-slate-700">
                  {job.status !== "OPEN" && (
                    <Button
                      size="sm"
                      onClick={() => handleOpen(job)}
                      disabled={toggleJobStatusMutation.isPending}
                      className="bg-brand-primary text-white hover:bg-brand-primary/90 cursor-pointer rounded-lg shadow-sm font-black h-8 text-[11px] px-3"
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
                      className="bg-white dark:bg-slate-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg cursor-pointer border border-red-100 dark:border-red-800 font-black h-8 text-[11px] px-3"
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
                      ? "text-brand-primary hover:bg-brand-primary/10"
                      : "text-slate-300 dark:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
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
        <DialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden dark:bg-slate-800">
          <div className="bg-brand-primary p-6 text-white">
            <DialogTitle className="text-2xl font-black">
              {t("manage.setNewDeadlineTitle")}
            </DialogTitle>
            <DialogDescription className="font-medium text-white/80">
              {t("manage.setNewDeadlineDescription")}
            </DialogDescription>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                {t("applications.interview.scheduledAt")}
              </label>
              <Input
                type="date"
                className="rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-900 focus:ring-brand-primary focus:border-brand-primary h-12"
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
                className="bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 rounded-xl px-8 font-bold"
                onClick={confirmOpenFromDialog}
                disabled={toggleJobStatusMutation.isPending}
              >
                {t("manage.confirmButton")}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}

export default JobManagePage;
