import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Job } from "../types";
import { useHomeTranslation } from "@/shared/hooks";
import { getRandomLatestJobs } from "@/shared/utils/jobService";
import { JOB_TYPE_COLORS } from "../constants";

export function FeaturedJobs() {
  const { t } = useHomeTranslation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await getRandomLatestJobs();
        setJobs(data.jobs || []);
      } catch (err) {
        console.error("Failed to fetch featured jobs:", err);
        setError(t("messages.errorLoadJobs"));
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [t]);
  return (
    <section id="featured-jobs" className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-2xl font-bold mb-10">{t("featuredJobs.title")}</h2>

      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">{t("messages.loadingJobs")}</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">{t("messages.noFeaturedJobs")}</p>
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
                <h3 className="font-semibold">{job.title}</h3>
                <p className="text-gray-500 text-sm">{job.company}</p>

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
              dvddjvnzsdvnzsjk
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
