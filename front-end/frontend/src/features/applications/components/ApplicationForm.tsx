import { useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui-primitives/form";
import { Input } from "@/shared/ui-primitives/input";
import { Textarea } from "@/shared/ui-primitives/textarea";
import { Button } from "@/shared/ui-primitives/button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { createValidationSchema } from "../utils/validation";
import type { Resolver } from "react-hook-form";
import { CVSelector } from "./CVSelector";
import type { ApplicationFormData } from "../types";
import { AlertCircle } from "lucide-react";

interface ApplicationFormProps {
  onSubmit: (data: ApplicationFormData) => Promise<void>;
  isLoading?: boolean;
  defaultValues?: Partial<ApplicationFormData>;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  onSubmit,
  isLoading = false,
  defaultValues,
}) => {
  const { t } = useAppTranslation();

  // ✅ Dynamic schema với i18n
  const validationSchema = createValidationSchema(t);

  const form = useForm<ApplicationFormData>({
    resolver: yupResolver(
      validationSchema
    ) as unknown as Resolver<ApplicationFormData>,
    defaultValues: defaultValues || {
      fullName: "",
      email: "",
      phone: "",
      coverLetter: "",
      salaryExpectation: "",
      cvSnapshotUrl: "",
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        ...form.getValues(),
        ...defaultValues,
      });
    }
  }, [defaultValues, form]);

  /**
   * Xử lý khi CVSelector báo đã lấy được CV thành công
   */
  const handleCVSelect = (_cvId: string, cvUrl: string) => {
    // Chúng ta lưu cvUrl vào form để gửi lên server
    form.setValue("cvSnapshotUrl", cvUrl, { shouldValidate: true });
  };

  const handleFormSubmit = (data: ApplicationFormData) => {
    // Vì chỉ dùng CV có sẵn nên data gửi đi là JSON thuần, không cần FormData
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        {/* CV Selection Section */}
        <FormItem>
          <CVSelector
            onCVSelect={handleCVSelect}
            selectedId={form.watch("cvSnapshotUrl")}
            error={form.formState.errors.cvSnapshotUrl?.message}
          />
          {form.formState.errors.cvSnapshotUrl && (
            <FormMessage>
              {form.formState.errors.cvSnapshotUrl.message}
            </FormMessage>
          )}
        </FormItem>

        {/* CV Warning Alert - Real-time */}
        {!form.watch("cvSnapshotUrl") && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                {t("applications.form.cvRequired") || "CV is required"}
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                {t("applications.form.cvUploadHint") ||
                  "Please select or upload a CV before submitting your application"}
              </p>
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">
                {t("applications.form.fullName")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    t("applications.form.fullNamePlaceholder") ||
                    "Enter your full name"
                  }
                  {...field}
                  className="rounded-xl h-11"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">
                  {t("applications.form.email")}
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={
                      t("applications.form.emailPlaceholder") ||
                      "email@example.com"
                    }
                    {...field}
                    className="rounded-xl h-11"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">
                  {t("applications.form.phone")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={
                      t("applications.form.phonePlaceholder") || "090..."
                    }
                    {...field}
                    className="rounded-xl h-11"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="coverLetter"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">
                {t("applications.form.coverLetter")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={
                    t("applications.form.coverLetterPlaceholder") ||
                    "Tell us about yourself..."
                  }
                  rows={4}
                  {...field}
                  value={field.value || ""}
                  className="rounded-xl resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="salaryExpectation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">
                {t("applications.form.salaryExpectation")}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder={
                    t("applications.form.salaryExpectationPlaceholder") ||
                    "e.g., 15000000"
                  }
                  {...field}
                  value={field.value || ""}
                  className="rounded-xl h-11"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 pt-6">
          <Button
            type="submit"
            disabled={isLoading || !form.watch("cvSnapshotUrl")}
            size="xl"
            className="flex-1 cursor-pointer bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-700 text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={
              !form.watch("cvSnapshotUrl")
                ? t("applications.form.selectCvFirst") ||
                  "Please select a CV first"
                : ""
            }
          >
            {isLoading ? t("common.processing") : t("applications.form.submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
};
