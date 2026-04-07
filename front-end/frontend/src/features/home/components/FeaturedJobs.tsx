import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Job } from "../types";
import { useHomeTranslation } from "@/shared/hooks";
import { getRandomLatestJobs } from "@/shared/utils/jobService";
import { ErrorState } from "@/shared/common-blocks/states/ErrorState";
import { JOB_TYPE_COLORS } from "../constants";
import {
  SubsectionTitle,
  SmallText,
} from "@/shared/common-blocks/typography/Typography";

export function FeaturedJobs() {
  const { t, currentLanguage } = useHomeTranslation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await getRandomLatestJobs();
        setJobs(data.jobs || []);
      } catch (err) {
        console.error("Failed to fetch featured jobs:", err);
        setError(
          err instanceof Error ? err : new Error(t("messages.errorLoadJobs"))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLanguage?.code]);

  return (
    <section id="featured-jobs" className="max-w-7xl mx-auto px-6 py-20">
      <SubsectionTitle className="mb-10">
        {t("featuredJobs.title")}
      </SubsectionTitle>

      {loading && (
        <div className="text-center py-12">
          <SmallText variant="muted">{t("messages.loadingJobs")}</SmallText>
        </div>
      )}

      {error && (
        <ErrorState
          error={error}
          onRetry={() => window.location.reload()}
          variant="inline"
          title={
            t("featuredJobs.errorTitle") || "Không thể tải công việc nổi bật"
          }
        />
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="text-center py-12">
          <SmallText variant="muted">{t("messages.noFeaturedJobs")}</SmallText>
        </div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <>
          <div className="grid md:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition"
              >
                <SmallText weight="semibold" className="block">
                  {job.title}
                </SmallText>
                <SmallText variant="muted" className="block">
                  {job.company}
                </SmallText>

                <div className="flex gap-2 mt-3 text-xs">
                  {job.workingType && (
                    <span
                      className={`${JOB_TYPE_COLORS[job.workingType as keyof typeof JOB_TYPE_COLORS]?.bg} ${JOB_TYPE_COLORS[job.workingType as keyof typeof JOB_TYPE_COLORS]?.text} px-2 py-1 rounded`}
                    >
                      {t(`jobTypes.${job.workingType.toLowerCase()}`)}
                    </span>
                  )}
                </div>

                <div className="flex justify-between mt-6 text-sm">
                  <span>{job.location}</span>
                  <span className="font-semibold">{job.salary}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/jobs"
              className="inline-block border px-6 py-3 rounded-xl hover:bg-gray-100 transition"
            >
              {t("featuredJobs.viewMore")}
            </Link>
          </div>
        </>
      )}
    </section>
  );
}

