/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import {
  MetaText,
  Caption,
  Display,
} from "@/shared/components/typography/Typography";
import { InterviewType } from "../types";
import type { InterviewScheduleFormData } from "../types";
import { Calendar, Clock, Video, MapPin, FileText, X } from "lucide-react";

interface InterviewScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InterviewScheduleFormData) => Promise<void>;
  isLoading?: boolean;
}

const createValidationSchema = (t: (key: string) => string) =>
  yup.object().shape({
    interviewType: yup
      .string()
      .required(t("applications.validation.interviewTypeRequired")),
    scheduledAt: yup
      .string()
      .required(t("applications.validation.scheduledAtRequired")),
    durationMinutes: yup
      .number()
      .required(t("applications.validation.durationRequired"))
      .positive(),
    meetingLink: yup.string().when("interviewType", {
      is: InterviewType.ONLINE,
      then: (schema) =>
        schema.required(t("applications.validation.meetingLinkRequired")),
      otherwise: (schema) => schema.optional(),
    }),
    location: yup.string().when("interviewType", {
      is: InterviewType.OFFLINE,
      then: (schema) =>
        schema.required(t("applications.validation.locationRequired")),
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
    resolver: yupResolver(createValidationSchema(t)) as any,
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* SỬA CHỖ NÀY: Ép sm:max-w-[700px] và w-full để đè default của Shadcn */}
      <DialogContent className="sm:max-w-175 w-[95vw] rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl [&>button]:hidden">
        <DialogHeader className="bg-brand-primary p-6 px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Calendar size={28} />
              <Display size="sm" className="text-black">
                {t("applications.interview.title") || "Schedule Interview"}
              </Display>
            </div>
            <button
              aria-label={t("common.close")}
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
                    <MetaText
                      as="div"
                      className="flex items-center gap-2 mb-1.5"
                    >
                      <Video size={14} /> {t("applications.interview.type")}
                    </MetaText>
                    <Select
                      value={field.value || ""}
                      onValueChange={(val) => {
                        field.onChange(val);
                        setInterviewType(val as InterviewType);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-xl border-slate-100 bg-slate-50 h-11 focus:ring-lime-400 px-4">
                          <SelectValue
                            placeholder={t("applications.interview.selectType")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-slate-100 shadow-xl p-1">
                        <SelectItem
                          value={InterviewType.ONLINE}
                          className="cursor-pointer rounded-lg py-2"
                        >
                          {t("applications.interview.typeOnline")}
                        </SelectItem>
                        <SelectItem
                          value={InterviewType.OFFLINE}
                          className="cursor-pointer rounded-lg py-2"
                        >
                          {t("applications.interview.typeOffline")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage>
                      <Caption variant="error" className="uppercase italic">
                        {form.formState.errors.interviewType?.message}
                      </Caption>
                    </FormMessage>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="scheduledAt"
                  render={({ field }) => (
                    <FormItem>
                      <MetaText
                        as="div"
                        className="flex items-center gap-2 mb-1.5"
                      >
                        <Calendar size={14} />
                        {t("applications.interview.scheduledAt")}
                      </MetaText>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          className="rounded-xl border-slate-100 bg-slate-50 h-11 focus-visible:ring-lime-400 px-4"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>
                        <Caption variant="error" className="uppercase italic">
                          {form.formState.errors.scheduledAt?.message}
                        </Caption>
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="durationMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <MetaText
                        as="div"
                        className="flex items-center gap-2 mb-1.5"
                      >
                        <Clock size={14} />
                        {t("applications.interview.duration")}
                      </MetaText>
                      <FormControl>
                        <Input
                          type="number"
                          className="rounded-xl border-slate-100 bg-slate-50 h-11 focus-visible:ring-lime-400 px-4"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>
                        <Caption variant="error" className="uppercase italic">
                          {form.formState.errors.durationMinutes?.message}
                        </Caption>
                      </FormMessage>
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
                      <MetaText
                        as="div"
                        className="flex items-center gap-2 mb-1.5"
                      >
                        <Video size={14} />
                        {t("applications.interview.meetingLink")}
                      </MetaText>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "applications.interview.meetingLinkPlaceholder"
                          )}
                          className="rounded-xl border-slate-100 bg-slate-50 h-11 focus-visible:ring-lime-400 px-4"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>
                        <Caption variant="error" className="uppercase italic">
                          {form.formState.errors.meetingLink?.message}
                        </Caption>
                      </FormMessage>
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
                      <MetaText
                        as="div"
                        className="flex items-center gap-2 mb-1.5"
                      >
                        <MapPin size={14} />
                        {t("applications.interview.location")}
                      </MetaText>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "applications.interview.locationPlaceholder"
                          )}
                          className="rounded-xl border-slate-100 bg-slate-50 h-11 focus-visible:ring-lime-400 px-4"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>
                        <Caption variant="error" className="uppercase italic">
                          {form.formState.errors.location?.message}
                        </Caption>
                      </FormMessage>
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <MetaText
                      as="div"
                      className="flex items-center gap-2 mb-1.5"
                    >
                      <FileText size={14} /> {t("applications.interview.notes")}
                    </MetaText>
                    <FormControl>
                      <Textarea
                        rows={3}
                        className="rounded-xl border-slate-100 bg-slate-50 focus-visible:ring-lime-400 resize-none p-4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>
                      <Caption variant="error" className="uppercase italic">
                        {form.formState.errors.notes?.message}
                      </Caption>
                    </FormMessage>
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-4 justify-end">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={onClose}
                  className="px-8 border-none hover:bg-red-50 h-12 rounded-xl transition-all text-xs uppercase tracking-widest text-red-500 hover:text-red-600 cursor-pointer"
                >
                  {t("common.cancel")}
                </Button>

                <Button
                  type="submit"
                  disabled={isLoading}
                  variant="brand-primary"
                  size="xl"
                  className="px-8 text-xs uppercase tracking-widest cursor-pointer"
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
