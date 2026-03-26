import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getMyJobs, toggleJobStatus, deleteJobSoft } from "../services/jobsApi";
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

export function JobManagePage() {
  const { t } = useTranslation("jobs");
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  console.log("[JobManagePage] Current user:", user);

  const load = async () => {
    setLoading(true);
    try {
      console.log("[JobManagePage] Loading with user ID:", user?.id);
      const res = await getMyJobs(1, 50);
      console.log("My jobs response:", res);
      setJobs(res.data ?? res);
    } catch (err) {
      console.error("Error loading my jobs:", err);
      toast.error(t("jobs.messages.unableToLoadYourJobs"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load jobs after `user` is available so returned jobs include headhunter-specific fields
    if (user?.id) void load();
  }, [user?.id]);

  const handleEdit = (id: number) => navigate(`/headhunter/jobs/${id}/edit`);

  const handleOpen = async (job: JobSummary) => {
    // open modal instead of prompt
    setDialogJob(job);
    setDialogDeadline(job.deadline ?? "");
    setDeadlineDialogOpen(true);
  };

  const handleClose = async (job: JobSummary) => {
    if (!confirm(t("jobs.messages.closeJobConfirm"))) return;
    setProcessingId(job.id);
    try {
      await toggleJobStatus(job.id);
      toast.success(t("jobs.messages.jobClosed"));
      await load();
    } catch (err) {
      console.error("Failed to close job:", err);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const e: any = err;
      const msg = e?.response?.data?.message || e?.message;
      toast.error(msg || t("jobs.messages.failedToCloseJob"));
    } finally {
      setProcessingId(null);
    }
  };

  // Dialog state and handlers
  const [deadlineDialogOpen, setDeadlineDialogOpen] = useState(false);
  const [dialogJob, setDialogJob] = useState<JobSummary | null>(null);
  const [dialogDeadline, setDialogDeadline] = useState<string>("");

  const confirmOpenFromDialog = async () => {
    if (!dialogJob) return;
    setProcessingId(dialogJob.id);
    try {
      if (!dialogDeadline) {
        alert(t("jobs.messages.pleaseChooseDeadline"));
        return;
      }
      const parsed = new Date(dialogDeadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (isNaN(parsed.getTime()) || parsed <= today) {
        alert(t("jobs.messages.invalidDeadlineMessage"));
        return;
      }
      await toggleJobStatus(dialogJob.id, dialogDeadline);
      toast.success(t("jobs.messages.jobOpened"));
      setDeadlineDialogOpen(false);
      setDialogJob(null);
      await load();
    } catch (err) {
      console.error("Failed to open job:", err);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const e: any = err;
      const msg = e?.response?.data?.message || e?.message;
      toast.error(msg || t("jobs.messages.failedToOpenJob"));
    } finally {
      setProcessingId(null);
    }
  };

  const handleHide = async (id: number) => {
    if (!confirm(t("jobs.messages.toggleVisibilityConfirm")))
      return;
    setProcessingId(id);
    try {
      await deleteJobSoft(id);
      toast.success(t("jobs.messages.jobVisibilityToggled"));
      await load();
    } catch (err) {
      console.error("Failed to change visibility:", err);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const e: any = err;
      const msg = e?.response?.data?.message || e?.message;
      toast.error(msg || t("jobs.messages.failedToChangeVisibility"));
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="p-8">{t("jobs.manage.loadingJobs")}</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">{t("jobs.manage.pageTitle")}</h2>
        <Button onClick={() => navigate("/headhunter/jobs/new")}>
          {t("jobs.manage.createNewButton")}
        </Button>
      </div>

      {jobs.length === 0 ? (
        <div>{t("jobs.manage.noJobsYet")}</div>
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
                    {job.visible === false ? t("jobs.manage.hidden") : t("jobs.manage.visible")}
                  </div>
                </div>
                <div className="text-sm text-slate-500">
                  {job.companyName ?? ""} • {job.location}
                </div>
                <div className="text-sm text-slate-400">
                  {t("jobs.manage.statusDeadline", { status: job.status, deadline: job.deadline ?? "—" })}
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
                      {t("jobs.manage.editButton")}
                    </Button>
                    <div
                      className="inline-flex rounded-md shadow-sm"
                      role="group"
                    >
                      {job.status !== "OPEN" && (
                        <Button
                          size="sm"
                          onClick={() => handleOpen(job)}
                          disabled={processingId === job.id}
                          className="bg-emerald-500 text-white hover:bg-emerald-600"
                        >
                          {processingId === job.id ? t("jobs.manage.updatingButton") : t("jobs.manage.openButton")}
                        </Button>
                      )}
                      {job.status !== "CLOSED" && (
                        <Button
                          size="sm"
                          onClick={() => handleClose(job)}
                          disabled={processingId === job.id}
                          className="bg-red-500 text-white hover:bg-red-600"
                        >
                          {processingId === job.id ? t("jobs.manage.updatingButton") : t("jobs.manage.closeButton")}}
                        </Button>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleHide(job.id)}
                      disabled={processingId === job.id}
                      title={
                        job.visible === false
                          ? t("jobs.manage.currentlyHidden")
                          : t("jobs.manage.currentlyVisible")
                      }
                    >
                      {processingId === job.id
                        ? t("jobs.manage.updatingButton")
                        : job.visible === false
                          ? t("jobs.manage.unhideButton")
                          : t("jobs.manage.hideButton")}
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
          <DialogTitle>{t("jobs.manage.setNewDeadlineTitle")}</DialogTitle>
          <DialogDescription>
            {t("jobs.manage.setNewDeadlineDescription")}
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
              <Button variant="outline">{t("jobs.manage.cancelButton")}</Button>
            </DialogClose>
            <Button
              onClick={confirmOpenFromDialog}
              disabled={processingId === dialogJob?.id}
            >
              {t("jobs.manage.confirmButton")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default JobManagePage;
