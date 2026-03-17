import { useEffect, useState } from "react";
import type { Job } from "../types";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { getRandomLatestJobs } from "@/shared/utils/jobService";

export function FeaturedJobs() {
  const { t } = useAppTranslation();
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
        setError("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);
  return (
    <section id="featured-jobs" className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-2xl font-bold mb-10">{t("home.featuredJobs.title")}</h2>

      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading jobs...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No featured jobs found</p>
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
                  <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded">
                    FULL-TIME
                  </span>
                  <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded">
                    REMOTE
                  </span>
                </div>

                <div className="flex justify-between mt-6 text-sm">
                  <span>{job.location}</span>
                  <span className="font-semibold">{job.salary}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="border px-6 py-3 rounded-xl hover:bg-gray-100 transition cursor-pointer">
              {t("home.featuredJobs.viewMore")}
            </button>
          </div>
        </>
      )}
    </section>
  );
}
