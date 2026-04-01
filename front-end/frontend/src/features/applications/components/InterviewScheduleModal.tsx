import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

export const InterviewScheduleModal: React.FC<InterviewScheduleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const { t } = useAppTranslation();
  const [interviewType, setInterviewType] = useState<
    InterviewType | undefined
  >();

  const form = useForm<InterviewScheduleFormData>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues: {
      interviewType: undefined,
      scheduledAt: "",
      durationMinutes: 30,
      meetingLink: "",
      location: "",
      notes: "",
    },
  });

  const handleSubmit = async (data: InterviewScheduleFormData) => {
    await onSubmit(data);
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("applications.interview.title")}</DialogTitle>
          <DialogDescription>
            {t("applications.interview.notes")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Interview Type */}
            <FormField
              control={form.control}
              name="interviewType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("applications.interview.type")}</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val);
                      setInterviewType(val as InterviewType);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={InterviewType.ONLINE}>
                        {t("applications.interview.typeOnline")}
                      </SelectItem>
                      <SelectItem value={InterviewType.OFFLINE}>
                        {t("applications.interview.typeOffline")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Scheduled At */}
            <FormField
              control={form.control}
              name="scheduledAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("applications.interview.scheduledAt")}
                  </FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Duration */}
            <FormField
              control={form.control}
              name="durationMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("applications.interview.duration")}</FormLabel>
                  <FormControl>
                    <Input type="number" min="15" step="15" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Meeting Link or Location */}
            {interviewType === InterviewType.ONLINE && (
              <FormField
                control={form.control}
                name="meetingLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("applications.interview.meetingLink")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://meet.google.com/..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {interviewType === InterviewType.OFFLINE && (
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("applications.interview.location")}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Office address..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("applications.interview.notes")}</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading
                  ? t("common.loading")
                  : t("applications.interview.save")}
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={onClose}
                className="flex-1"
              >
                {t("common.cancel")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
