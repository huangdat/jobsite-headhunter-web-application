/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { InterviewType } from "../types";
import type { InterviewScheduleFormData } from "../types";
import { Calendar, Clock, Video, MapPin, FileText, X } from "lucide-react";

interface InterviewScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InterviewScheduleFormData) => Promise<void>;
  isLoading?: boolean;
}

const validationSchema = yup.object().shape({
  interviewType: yup.string().required("Interview type is required"),
  scheduledAt: yup.string().required("Date and time is required"),
  durationMinutes: yup.number().required("Duration is required").positive(),
  meetingLink: yup.string().when("interviewType", {
    is: InterviewType.ONLINE,
    then: (schema) => schema.required("Meeting link is required"),
    otherwise: (schema) => schema.optional(),
  }),
  location: yup.string().when("interviewType", {
    is: InterviewType.OFFLINE,
    then: (schema) => schema.required("Location is required"),
    otherwise: (schema) => schema.optional(),
  }),
  notes: yup.string().optional(),
});

export const InterviewScheduleModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: InterviewScheduleModalProps) => {
  const { t } = useAppTranslation();
  const [interviewType, setInterviewType] = useState<
    InterviewType | undefined
  >();

  const form = useForm<InterviewScheduleFormData>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues: {
      interviewType: "" as any,
      scheduledAt: "",
      durationMinutes: 30,
      meetingLink: "",
      location: "",
      notes: "",
    },
  });

  const handleSubmit = async (data: InterviewScheduleFormData) => {
    try {
      await onSubmit(data);
      form.reset();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const labelStyle =
    "text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-1.5";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* SỬA CHỖ NÀY: Ép sm:max-w-[700px] và w-full để đè default của Shadcn */}
      <DialogContent className="sm:max-w-[700px] w-[95vw] rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl [&>button]:hidden">
        <DialogHeader className="bg-lime-400 p-6 px-8">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-black font-black text-2xl flex items-center gap-3">
              <Calendar size={28} />
              {t("applications.interview.title") || "Schedule Interview"}
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-black/40 hover:text-black transition-colors cursor-pointer p-1"
            >
              <X size={24} />
            </button>
          </div>
        </DialogHeader>

        <div className="p-8 px-10 bg-white">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="interviewType"
                render={({ field }) => (
                  <FormItem className="w-1/2 pr-4">
                    {" "}
                    {/* Chỉnh lại để ko chiếm full chiều ngang */}
                    <FormLabel className={labelStyle}>
                      <Video size={14} /> {t("applications.interview.type")}
                    </FormLabel>
                    <Select
                      value={field.value || ""}
                      onValueChange={(val) => {
                        field.onChange(val);
                        setInterviewType(val as InterviewType);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-xl border-slate-100 bg-slate-50 h-11 font-bold focus:ring-lime-400 px-4">
                          <SelectValue placeholder="Select type..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-slate-100 shadow-xl p-1">
                        <SelectItem
                          value={InterviewType.ONLINE}
                          className="font-bold cursor-pointer rounded-lg py-2"
                        >
                          {t("applications.interview.typeOnline")}
                        </SelectItem>
                        <SelectItem
                          value={InterviewType.OFFLINE}
                          className="font-bold cursor-pointer rounded-lg py-2"
                        >
                          {t("applications.interview.typeOffline")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[10px] font-bold text-red-500 uppercase italic" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="scheduledAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelStyle}>
                        <Calendar size={14} />{" "}
                        {t("applications.interview.scheduledAt")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          className="rounded-xl border-slate-100 bg-slate-50 h-11 font-bold focus-visible:ring-lime-400 px-4"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold text-red-500 uppercase italic" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="durationMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelStyle}>
                        <Clock size={14} />{" "}
                        {t("applications.interview.duration")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="rounded-xl border-slate-100 bg-slate-50 h-11 font-bold focus-visible:ring-lime-400 px-4"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold text-red-500 uppercase italic" />
                    </FormItem>
                  )}
                />
              </div>

              {interviewType === InterviewType.ONLINE && (
                <FormField
                  control={form.control}
                  name="meetingLink"
                  render={({ field }) => (
                    <FormItem className="animate-in fade-in slide-in-from-top-1 duration-300">
                      <FormLabel className={labelStyle}>
                        <Video size={14} />{" "}
                        {t("applications.interview.meetingLink")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://meet.google.com/..."
                          className="rounded-xl border-slate-100 bg-slate-50 h-11 font-bold focus-visible:ring-lime-400 px-4"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold text-red-500 uppercase italic" />
                    </FormItem>
                  )}
                />
              )}

              {interviewType === InterviewType.OFFLINE && (
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="animate-in fade-in slide-in-from-top-1 duration-300">
                      <FormLabel className={labelStyle}>
                        <MapPin size={14} />{" "}
                        {t("applications.interview.location")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Office address..."
                          className="rounded-xl border-slate-100 bg-slate-50 h-11 font-bold focus-visible:ring-lime-400 px-4"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold text-red-500 uppercase italic" />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelStyle}>
                      <FileText size={14} /> {t("applications.interview.notes")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        className="rounded-xl border-slate-100 bg-slate-50 font-medium italic focus-visible:ring-lime-400 resize-none p-4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold text-red-500 uppercase italic" />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-4 justify-end">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={onClose}
                  className="px-8 border-none hover:bg-red-50 font-bold h-12 rounded-xl transition-all text-xs uppercase tracking-widest text-red-500 hover:text-red-600 cursor-pointer"
                >
                  {t("common.cancel")}
                </Button>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 bg-lime-400 hover:bg-lime-500 text-black font-black h-12 rounded-xl transition-all active:scale-95 text-xs uppercase tracking-widest shadow-lg shadow-lime-400/30 cursor-pointer"
                >
                  {isLoading
                    ? t("common.loading")
                    : t("applications.interview.save") ||
                      "Save and Send Invitation"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
