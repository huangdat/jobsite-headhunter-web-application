import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { ApplicationForm } from "../components/ApplicationForm";
import { useApplicationForm } from "../hooks/useApplicationForm";

export const ApplyJobPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { t } = useAppTranslation();
  const jobIdNum = jobId ? parseInt(jobId, 10) : 0;
  const [jobTitle] = useState<string>("Software Engineer");

  // 1. Hook useApplicationForm bây giờ chỉ cần quan tâm handleSubmit
  const { isSubmitting, handleSubmit } = useApplicationForm({
    jobId: jobIdNum,
    onSuccess: () => {
      navigate("/my-applications");
    },
  });

  // TODO: Fetch actual job title from API when implementing full feature

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto max-w-2xl px-4">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            {t("applications.form.title")}
          </h1>
          <p className="text-slate-500 mt-3 text-lg font-medium">
            {t("applications.form.submit")}
            <span className="text-emerald-600 ml-2 font-bold">{jobTitle}</span>
          </p>
        </div>

        {/* Form Card với Shadow mượt hơn */}
        <Card className="p-8 border-none shadow-xl shadow-slate-200/60 rounded-3xl bg-white">
          <ApplicationForm
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
            // onCVUpload đã bị xóa vì ApplicationForm không còn nhận prop này nữa
          />
        </Card>

        {/* Back Button */}
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-8 py-2.5 bg-slate-100 hover:bg-slate-200 cursor-pointer text-slate-600 font-bold text-sm rounded-xl transition-all duration-200 active:scale-95 shadow-sm"
          >
            {t("applications.form.back")}
          </button>
        </div>
      </div>
    </div>
  );
};
