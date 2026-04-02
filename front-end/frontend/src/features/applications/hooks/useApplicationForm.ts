import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { toast } from "sonner";
import type { ApplicationFormData } from "../types";
import { submitApplication } from "../services/applicationsApi";
import { validateApplicationForm, validateCVFile } from "../utils";

interface UseApplicationFormOptions {
  jobId: number;
  onSuccess?: () => void;
}

export const useApplicationForm = (options: UseApplicationFormOptions) => {
  const { jobId, onSuccess } = options;
  const navigate = useNavigate();
  const { t } = useAppTranslation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Local file handling (kept minimal; we store filename in formData.cvSnapshotUrl)

  const [formData, setFormData] = useState<Partial<ApplicationFormData>>({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
    salaryExpectation: "",
    cvSnapshotUrl: "",
  });

  const handleFieldChange = useCallback(
    (field: keyof ApplicationFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const validateForm = useCallback((data: ApplicationFormData): boolean => {
    const validationErrors = validateApplicationForm(data);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, []);

  // ✅ Sửa lại hàm này để nhận cả File (upload) hoặc string (profile ID)
  const handleCVUpload = useCallback(
    (fileOrId: File | string) => {
      if (typeof fileOrId === "string") {
        // TRƯỜNG HỢP 1: CHỌN CV TỪ PROFILE
        setExistingCvId(fileOrId);
        setCvFile(null);
        setFormData((prev) => ({
          ...prev,
          cvSnapshotUrl: fileOrId, // Lưu ID vào để validate pass
        }));
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.cvSnapshotUrl;
          return newErrors;
        });
      } else {
        // TRƯỜNG HỢP 2: UPLOAD FILE MỚI
        const cvError = validateCVFile(fileOrId);
        if (cvError) {
          setErrors((prev) => ({ ...prev, cvSnapshotUrl: cvError }));
          toast.error(t(String(cvError)));
          return;
        }

        setFormData((prev) => ({
          ...prev,
          cvSnapshotUrl: fileOrId.name,
        }));
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.cvSnapshotUrl;
          return newErrors;
        });
      }
    },
    [t]
  );

  const handleSubmit = useCallback(
    async (data: ApplicationFormData) => {
      // 1. Validate form (giữ nguyên logic của bạn)
      if (!validateForm(data)) {
        return;
      }

      // 2. Validate CV (đảm bảo đã có URL từ Profile)
      if (!data.cvSnapshotUrl) {
        toast.error(t("applications.error.noCV"));
        return;
      }

      setIsSubmitting(true);
      try {
        // Backend expects @ModelAttribute, so send multipart/form-data
        const payload = new FormData();
        payload.append("jobId", String(jobId));
        payload.append("fullName", String(data.fullName || "").trim());
        payload.append("email", String(data.email || "").trim());
        payload.append("phone", String(data.phone || "").trim());
        payload.append("coverLetter", String(data.coverLetter || "").trim());
        payload.append(
          "salaryExpectation",
          String(data.salaryExpectation || "0")
        );

        console.log("📤 Submitting FormData to Job:", jobId);

        await submitApplication(jobId, payload);

        toast.success(t("applications.success.applied"));

        if (onSuccess) {
          onSuccess();
        } else {
          navigate("/my-applications");
        }
      } catch (err) {
        // Prefer structured backend message when available
        type AxiosLike = { response?: { data?: { message?: string } } };
        const maybe = err as AxiosLike;
        const errorMsg =
          maybe.response?.data?.message || (err instanceof Error ? err.message : String(err));
        console.error("❌ Submit Error:", errorMsg);
        toast.error(errorMsg);
      } finally {
        setIsSubmitting(false);
      }
    },
    [validateForm, jobId, onSuccess, navigate, t]
  );

  const resetForm = useCallback(() => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      coverLetter: "",
      salaryExpectation: "",
      cvSnapshotUrl: "",
    });
    setErrors({});
    setCvFile(null);
    setExistingCvId(null);
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    handleFieldChange,
    handleCVUpload,
    handleSubmit,
    resetForm,
  };
};
