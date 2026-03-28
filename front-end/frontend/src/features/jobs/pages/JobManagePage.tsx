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
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// Helper function to extract error message from API errors
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

  // Query for current user's jobs
  const { data: response, isLoading } = useMyJobsQuery(1, 50);
  const jobs = response?.data ?? [];

  // Mutations for job actions
  const toggleJobStatusMutation = useToggleJobStatusMutation();
  const deleteJobMutation = useDeleteJobMutation();

  // Dialog state
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
        onSuccess: () => {
          toast.success(t("messages.jobClosed"));
        },
        onError: (err: Error) => {
          toast.error(
            getErrorMessage(err, t("messages.failedToCloseJob"))
          );
        },
      }
    );
  };

  const confirmOpenFromDialog = () => {
    if (!dialogJob) return;

    if (!dialogDeadline) {
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
        onError: (err: Error) => {
          toast.error(getErrorMessage(err, t("messages.failedToOpenJob")));
        },
      }
    );
  };

  const handleHide = (id: number) => {
    if (!confirm(t("messages.toggleVisibilityConfirm"))) return;
    deleteJobMutation.mutate(id, {
      onSuccess: () => {
        toast.success(t("messages.jobVisibilityToggled"));
      },
      onError: (err: Error) => {
        toast.error(
          getErrorMessage(err, t("messages.failedToChangeVisibility"))
        );
      },
    });
  };

  if (isLoading)
    return <div className="p-8">{t("manage.loadingJobs")}</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">{t("manage.pageTitle")}</h2>
        <Button onClick={() => navigate("/headhunter/jobs/new")}>
          {t("manage.createNewButton")}
        </Button>
      </div>

      {jobs.length === 0 ? (
        <div>{t("manage.noJobsYet")}</div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <div className="flex items-center gap-3">
                  <div className="text-lg font-medium">{job.title}</div>
                  {/* Visibility badge */}
                  <div
                    className={`text-xs px-2 py-0.5 rounded ${job.visible === false ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                  >
                    {job.visible === false
                      ? t("manage.hidden")
                      : t("manage.visible")}
                  </div>
                </div>
                <div className="text-sm text-slate-500">
                  {job.companyName ?? ""} • {job.location}
                </div>
                <div className="text-sm text-slate-400">
                  {t("manage.statusDeadline")}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {((user &&
                  (user.role?.toString().toLowerCase() === "headhunter" ||
                    user.role?.toString().toLowerCase() === "admin")) ||
                  user?.id === job.headhunterId) && (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(job.id)}
                    >
                      {t("manage.editButton")}
                    </Button>
                    <div
                      className="inline-flex rounded-md shadow-sm"
                      role="group"
                    >
                      {job.status !== "OPEN" && (
                        <Button
                          size="sm"
                          onClick={() => handleOpen(job)}
                          disabled={toggleJobStatusMutation.isPending}
                          className="bg-emerald-500 text-white hover:bg-emerald-600"
                        >
                          {toggleJobStatusMutation.isPending
                            ? t("manage.updatingButton")
                            : t("manage.openButton")}
                        </Button>
                      )}
                      {job.status !== "CLOSED" && (
                        <Button
                          size="sm"
                          onClick={() => handleClose(job)}
                          disabled={toggleJobStatusMutation.isPending}
                          className="bg-red-500 text-white hover:bg-red-600"
                        >
                          {toggleJobStatusMutation.isPending
                            ? t("manage.updatingButton")
                            : t("manage.closeButton")}
                        </Button>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleHide(job.id)}
                      disabled={deleteJobMutation.isPending}
                      title={
                        job.visible === false
                          ? t("manage.currentlyHidden")
                          : t("manage.currentlyVisible")
                      }
                    >
                      {deleteJobMutation.isPending
                        ? t("manage.updatingButton")
                        : job.visible === false
                          ? t("manage.unhideButton")
                          : t("manage.hideButton")}
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Deadline modal for opening a job */}
      <Dialog open={deadlineDialogOpen} onOpenChange={setDeadlineDialogOpen}>
        <DialogContent>
          <DialogTitle>{t("manage.setNewDeadlineTitle")}</DialogTitle>
          <DialogDescription>
            {t("manage.setNewDeadlineDescription")}
          </DialogDescription>
          <div className="mt-2">
            <Input
              type="date"
              value={dialogDeadline}
              onChange={(e) => setDialogDeadline(e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline">{t("manage.cancelButton")}</Button>
            </DialogClose>
            <Button
              onClick={confirmOpenFromDialog}
              disabled={toggleJobStatusMutation.isPending}
            >
              {t("manage.confirmButton")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default JobManagePage;

