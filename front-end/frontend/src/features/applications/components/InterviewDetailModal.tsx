import React from "react";
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
import {
  Video,
  MapPin,
  Clock,
  Calendar,
  FileText,
  Link as LinkIcon,
  Hash,
} from "lucide-react";

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

  // Hàm helper để render màu cho Badge status
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100 border-none";
      case "COMPLETED":
        return "bg-green-100 text-green-700 hover:bg-green-100 border-none";
      case "CANCELLED":
        return "bg-red-100 text-red-700 hover:bg-red-100 border-none";
      default:
        return "secondary";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md rounded-3xl p-0 overflow-hidden 
      border-none shadow-2xl [&>button]:top-7 [&>button]:right-6 [&>button]:text-black 
      [&>button]:hover:bg-transparent [&>button]:focus:ring-0 [&>button]:outline-none [&>button]:bg-transparent 
      [&>button]:cursor-pointer"
      >
        <DialogHeader className="bg-brand-primary p-6">
          <DialogTitle className="text-black font-black text-xl flex items-center gap-2">
            <Calendar size={24} />
            {t("applications.interview.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Status & Code */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest flex items-center gap-1">
                <Hash size={12} /> {t("common.code")}
              </p>
              <p className="font-mono text-sm font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                {interview.interviewCode}
              </p>
            </div>
            <Badge
              className={`rounded-full px-3 py-1 font-bold ${getStatusVariant(interview.status)}`}
            >
              {interview.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Interview Type */}
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                {t("applications.interview.type")}
              </p>
              <p className="font-bold text-slate-800 flex items-center gap-2">
                {interview.interviewType === "ONLINE" ? (
                  <Video size={16} className="text-blue-500" />
                ) : (
                  <MapPin size={16} className="text-orange-500" />
                )}
                {formatInterviewType(
                  interview.interviewType as InterviewType,
                  t
                )}
              </p>
            </div>

            {/* Duration */}
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                {t("applications.interview.duration")}
              </p>
              <p className="font-bold text-slate-800 flex items-center gap-2">
                <Clock size={16} className="text-brand-primary" />
                {formatDuration(interview.durationMinutes)}
              </p>
            </div>
          </div>

          {/* Scheduled At */}
          <div className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
              {t("applications.interview.scheduledAt")}
            </p>
            <p className="font-bold text-slate-900 text-lg">
              {formatDate(interview.scheduledAt, i18n.language)}
            </p>
          </div>

          {/* Meeting Link or Location */}
          {interview.meetingLink && (
            <div className="space-y-2">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                {t("applications.interview.meetingLink")}
              </p>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 border-brand-primary/20 bg-brand-primary/10 hover:bg-brand-primary/20 hover:border-brand-primary/30 text-slate-700 dark:text-slate-300 rounded-xl transition-all"
                asChild
              >
                <a
                  href={interview.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Video size={18} />
                  <span className="truncate">{interview.meetingLink}</span>
                  <LinkIcon size={14} className="ml-auto opacity-50" />
                </a>
              </Button>
            </div>
          )}

          {interview.location && (
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                {t("applications.interview.location")}
              </p>
              <p className="text-sm font-medium text-slate-700 flex items-start gap-2 italic">
                <MapPin size={16} className="text-red-500 shrink-0 mt-0.5" />
                {interview.location}
              </p>
            </div>
          )}

          {/* Notes */}
          {interview.notes && (
            <div className="space-y-2">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest flex items-center gap-1">
                <FileText size={12} /> {t("applications.interview.notes")}
              </p>
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                <p className="text-sm text-amber-900 leading-relaxed italic">
                  "{interview.notes}"
                </p>
              </div>
            </div>
          )}

          <Button
            onClick={onClose}
            className="w-full bg-slate-900 hover:bg-black text-white cursor-pointer font-bold py-6 rounded-2xl shadow-lg transition-all active:scale-[0.98]"
          >
            {t("common.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
