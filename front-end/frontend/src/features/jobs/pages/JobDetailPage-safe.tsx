import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { MarkdownViewer } from "@/components/MarkdownViewer";

export const JobDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams(); // ← USE id!

  // Use id (demo)
  if (!id) return <div>{t("jobs.notFound")}</div>;

  const job = { description: "" }; // Real API data

  return (
    <div>
      <h1>{t("jobs.detail.title", { id })}</h1>
      <MarkdownViewer content={job.description} />
    </div>
  );
};
