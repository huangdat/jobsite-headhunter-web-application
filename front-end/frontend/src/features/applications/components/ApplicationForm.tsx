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
import { yupResolver as yupResolverLib } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { CVSelector } from "./CVSelector";
import type { ApplicationFormData } from "../types";

interface ApplicationFormProps {
  onSubmit: (data: ApplicationFormData) => Promise<void>;
  isLoading?: boolean;
  defaultValues?: Partial<ApplicationFormData>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const createValidationSchema = (t: (key: string) => string) => {
  return yup.object().shape({
    cvSnapshotUrl: yup
      .string()
      .required(t("applications.validation.cvRequired")),
    fullName: yup
      .string()
      .required(t("applications.validation.fullNameRequired"))
      .min(2, t("applications.validation.fullNameMinLength")),
    email: yup
      .string()
      .email(t("applications.validation.emailInvalid"))
      .required(t("applications.validation.emailRequired")),
    phone: yup
      .string()
      .required(t("applications.validation.phoneRequired"))
      .min(9, t("applications.validation.phoneInvalid")),
    coverLetter: yup.string().nullable(),
    salaryExpectation: yup.string().nullable(),
  });
};

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  onSubmit,
  isLoading = false,
  defaultValues,
}) => {
  const { t } = useAppTranslation();

  const validationSchema = createValidationSchema(t);

  const form = useForm<ApplicationFormData>({
    resolver: yupResolverLib(validationSchema),
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
    if (defaultValues) form.reset(defaultValues);
  }, [defaultValues, form]);

  /**
   * Xử lý khi CVSelector báo đã lấy được CV thành công
   */
  const handleCVSelect = (cvId: string, cvUrl: string) => {
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

        {/* Nút Submit */}
        <div className="flex gap-3 pt-6">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 cursor-pointer text-white font-bold h-12 rounded-xl shadow-lg shadow-emerald-200"
          >
            {isLoading ? t("common.processing") : t("applications.form.submit")}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-32 h-12 font-bold cursor-pointer rounded-xl border-2"
            onClick={() => form.reset()}
          >
            {t("applications.form.cancel")}
          </Button>
        </div>
      </form>
    </Form>
  );
};
