import { useEffect } from "react";
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
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { createValidationSchema } from "../utils/validation";
import type { Resolver } from "react-hook-form";
import { CVSelector } from "./CVSelector";
import type { ApplicationFormData } from "../types";

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
        </FormItem>

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
            disabled={isLoading}
            size="xl"
            className="flex-1 cursor-pointer bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-700 text-white font-bold transition-colors"
          >
            {isLoading ? t("common.processing") : t("applications.form.submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
};
