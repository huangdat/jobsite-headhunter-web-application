import { useEffect, useState } from "react";
import type { Job } from "../types";
import { useHomeTranslation } from "@/shared/hooks";
import { getRecommendedJobs } from "@/shared/utils/jobService";
import { MATCH_BADGE_COLORS, HOME_ICONS } from "../constants";
import {
  SubsectionTitle,
  SmallText,
} from "@/shared/components/typography/Typography";

export function RecommendedJobs() {
  const { t, currentLanguage } = useHomeTranslation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null); //new

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await getRecommendedJobs();
        setJobs(data.jobs || []);
        setInfoMessage(data.message || null);
      } catch (err) {
        console.error("Failed to fetch recommended jobs:", err);
        setError(t("messages.errorLoadJobs"));
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentLanguage?.code]);
  return (
    <section id="recommended" className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <SubsectionTitle>{t("recommendedJobs.title")}</SubsectionTitle>
          <SmallText variant="muted" className="mt-1 block">
            {t("recommendedJobs.description")}
          </SmallText>
        </div>
        <span className="text-gray-400 text-sm">
          {HOME_ICONS.CHEVRON_RIGHT}
        </span>
      </div>

      {loading && (
        <div className="text-center py-12">
          <SmallText variant="muted">{t("messages.loadingJobs")}</SmallText>
        </div>
      )}

      {!loading && infoMessage && (
        <div className="text-center py-4">
          <SmallText variant="muted">{infoMessage}</SmallText>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <SmallText className="text-red-500">{error}</SmallText>
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="text-center py-12">
          <SmallText variant="muted">
            {t("messages.noRecommendedJobs")}
          </SmallText>
        </div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <div className="grid md:grid-cols-4 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-end">
                <span
                  className={`${MATCH_BADGE_COLORS.bg} ${MATCH_BADGE_COLORS.text} text-xs px-2 py-1 rounded-full`}
                >
                  {job.match || t("badges.new")}
                </span>
              </div>

              <SmallText weight="semibold" className="mt-4 block">
                {job.title}
              </SmallText>
              <SmallText variant="muted" className="block">
                {job.company}
              </SmallText>

              <div className="flex justify-between mt-6 text-sm">
                <span>{job.salary}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
