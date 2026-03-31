import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { formatInterviewType, formatDate, formatDuration } from "../utils";
import type { Interview, InterviewType } from "../types";

interface InterviewDetailModalProps {
  isOpen: boolean;
  interview?: Interview;
  onClose: () => void;
}

export const InterviewDetailModal: React.FC<InterviewDetailModalProps> = ({
  isOpen,
  interview,
  onClose,
}) => {
  const { t, i18n } = useAppTranslation();

  if (!interview) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("applications.interview.title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Interview Code */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              {t("common.code")}
            </label>
            <p className="font-mono text-sm mt-1">{interview.interviewCode}</p>
          </div>

          {/* Interview Type */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              {t("applications.interview.type")}
            </label>
            <p className="mt-1">
              {formatInterviewType(interview.interviewType as InterviewType, t)}
            </p>
          </div>

          {/* Scheduled At */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              {t("applications.interview.scheduledAt")}
            </label>
            <p className="mt-1">
              {formatDate(interview.scheduledAt, i18n.language)}
            </p>
          </div>

          {/* Duration */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              {t("applications.interview.duration")}
            </label>
            <p className="mt-1">{formatDuration(interview.durationMinutes)}</p>
          </div>

          {/* Meeting Link or Location */}
          {interview.meetingLink && (
            <div>
              <label className="text-sm font-medium text-gray-600">
                {t("applications.interview.meetingLink")}
              </label>
              <Button variant="link" className="p-0 h-auto mt-1" asChild>
                <a
                  href={interview.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {interview.meetingLink}
                </a>
              </Button>
            </div>
          )}

          {interview.location && (
            <div>
              <label className="text-sm font-medium text-gray-600">
                {t("applications.interview.location")}
              </label>
              <p className="mt-1">{interview.location}</p>
            </div>
          )}

          {/* Notes */}
          {interview.notes && (
            <div>
              <label className="text-sm font-medium text-gray-600">
                {t("applications.interview.notes")}
              </label>
              <p className="mt-1 text-sm text-gray-700">{interview.notes}</p>
            </div>
          )}

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              {t("common.status")}
            </label>
            <Badge className="mt-1">{interview.status}</Badge>
          </div>

          {/* Close Button */}
          <Button onClick={onClose} className="w-full mt-4">
            {t("common.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
