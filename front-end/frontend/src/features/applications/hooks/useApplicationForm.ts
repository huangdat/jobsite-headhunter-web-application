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
  const [cvFile, setCvFile] = useState<File | null>(null);

  // ✅ Thêm state này để nhận biết khi chọn CV từ Profile
  const [existingCvId, setExistingCvId] = useState<string | null>(null);

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
          toast.error(t(cvError as any)); // Dùng t() cho key validation
          return;
        }

        setCvFile(fileOrId);
        setExistingCvId(null);
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
        // 🚀 THAY ĐỔI QUAN TRỌNG: Không dùng FormData nữa, dùng Object JSON thuần
        const payload = {
          jobId: jobId,
          fullName: String(data.fullName || "").trim(),
          email: String(data.email || "").trim(),
          phone: String(data.phone || "").trim(),
          coverLetter: String(data.coverLetter || "").trim(),
          // Đảm bảo salaryExpectation gửi đi đúng định dạng Backend cần (thường là string hoặc number)
          salaryExpectation: String(data.salaryExpectation || "0"),
          // Gửi trực tiếp link CV đã chọn từ Profile
          cvSnapshotUrl: data.cvSnapshotUrl,
        };

        console.log("📤 Submitting JSON Payload to Job:", jobId, payload);

        // Gọi API nộp đơn (submitApplication lúc này sẽ gửi JSON)
        await submitApplication(jobId, payload);

        toast.success(t("applications.success.applied"));

        if (onSuccess) {
          onSuccess();
        } else {
          navigate("/my-applications");
        }
      } catch (err: any) {
        console.error("❌ Submit Error:", err.response?.data || err.message);
        // Ưu tiên hiển thị message từ Backend trả về
        const errorMsg = err.response?.data?.message || err.message;
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
