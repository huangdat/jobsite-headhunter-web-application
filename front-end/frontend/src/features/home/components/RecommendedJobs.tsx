import { useEffect, useState } from "react";
import type { Job } from "../types";
import { useHomeTranslation, useMessagesTranslation } from "@/shared/hooks";
import { getRecommendedJobs } from "@/shared/utils/jobService";
import { MATCH_BADGE_COLORS, HOME_ICONS } from "../constants";

export function RecommendedJobs() {
  const { t } = useHomeTranslation();
  const { t: tMsg } = useMessagesTranslation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await getRecommendedJobs();
        setJobs(data.jobs || []);
        setInfoMessage(data.message || null);
      } catch (err) {
        console.error("Failed to fetch recommended jobs:", err);
        setError(tMsg("errorLoadJobs"));
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [tMsg]);
  return (
    <section id="recommended" className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold">{t("recommendedJobs.title")}</h2>
          <p className="text-gray-500 text-sm">
            {t("recommendedJobs.description")}
          </p>
        </div>
        <span className="text-gray-400 text-sm">
          {HOME_ICONS.CHEVRON_RIGHT}
        </span>
      </div>

      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">{tMsg("loadingJobs")}</p>
        </div>
      )}

      {!loading && infoMessage && (
        <div className="text-center py-4">
          <p className="text-gray-500">{infoMessage}</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">{tMsg("noRecommendedJobs")}</p>
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

              <h3 className="font-semibold mt-4">{job.title}</h3>
              <p className="text-gray-500 text-sm">{job.company}</p>

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
