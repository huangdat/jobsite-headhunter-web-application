import { useEffect, useState } from "react";
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
      toast.error("Unable to load your jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleEdit = (id: number) => navigate(`/headhunter/jobs/${id}/edit`);

  const handleOpen = async (job: JobSummary) => {
    // open modal instead of prompt
    setDialogJob(job);
    setDialogDeadline(job.deadline ?? "");
    setDeadlineDialogOpen(true);
  };

  const handleClose = async (job: JobSummary) => {
    if (!confirm('Close this job?')) return;
    setProcessingId(job.id);
    try {
      await toggleJobStatus(job.id);
      toast.success("Job closed.");
      await load();
    } catch (err) {
      console.error(err);
      toast.error("Failed to close job.");
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
        alert("Please choose a deadline.");
        return;
      }
      const parsed = new Date(dialogDeadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (isNaN(parsed.getTime()) || parsed <= today) {
        alert('Invalid deadline. Please choose a future date.');
        return;
      }
      await toggleJobStatus(dialogJob.id, dialogDeadline);
      toast.success("Job opened.");
      setDeadlineDialogOpen(false);
      setDialogJob(null);
      await load();
    } catch (err) {
      console.error(err);
      toast.error("Failed to open job.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleHide = async (id: number) => {
    if (!confirm("Are you sure you want to hide this job?")) return;
    setProcessingId(id);
    try {
      await deleteJobSoft(id);
      toast.success("Job visibility toggled.");
      await load();
    } catch (err) {
      console.error(err);
      toast.error("Failed to change visibility.");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="p-8">Loading jobs...</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">My Job Posts</h2>
        <Button onClick={() => navigate('/headhunter/jobs/new')}>Create new</Button>
      </div>

      {jobs.length === 0 ? (
        <div>No jobs yet.</div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <div className="text-lg font-medium">{job.title}</div>
                <div className="text-sm text-slate-500">{job.companyName ?? ''} • {job.location}</div>
                <div className="text-sm text-slate-400">Status: {job.status} • Deadline: {job.deadline ?? '—'}</div>
              </div>
              <div className="flex items-center gap-2">
                {((user && (user.role?.toString().toLowerCase() === 'headhunter' || user.role?.toString().toLowerCase() === 'admin')) || user?.id === job.headhunterId) && (
                  <>
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(job.id)}>Edit</Button>
                    <div className="inline-flex rounded-md shadow-sm" role="group">
                      {job.status !== 'OPEN' && (
                        <Button size="sm" onClick={() => handleOpen(job)} disabled={processingId === job.id} className="bg-emerald-500 text-white hover:bg-emerald-600">
                          {processingId === job.id ? 'Updating...' : 'Open'}
                        </Button>
                      )}
                      {job.status !== 'CLOSED' && (
                        <Button size="sm" onClick={() => handleClose(job)} disabled={processingId === job.id} className="bg-red-500 text-white hover:bg-red-600">
                          {processingId === job.id ? 'Updating...' : 'Close'}
                        </Button>
                      )}
                    </div>
                    <Button size="sm" variant="destructive" onClick={() => handleHide(job.id)} disabled={processingId === job.id}>Hide</Button>
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
          <DialogTitle>Set new deadline</DialogTitle>
          <DialogDescription>Choose a new deadline to re-open this job.</DialogDescription>
          <div className="mt-2">
            <Input
              type="date"
              value={dialogDeadline}
              onChange={(e) => setDialogDeadline(e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={confirmOpenFromDialog} disabled={processingId === dialogJob?.id}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default JobManagePage;
