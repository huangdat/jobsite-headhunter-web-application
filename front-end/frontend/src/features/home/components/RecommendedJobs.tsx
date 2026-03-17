import { useEffect, useState } from "react";
import type { Job } from "../types";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { getRecommendedJobs } from "@/shared/utils/jobService";

export function RecommendedJobs() {
  const { t } = useAppTranslation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await getRecommendedJobs();
        setJobs(data.jobs || []);
      } catch (err) {
        console.error("Failed to fetch recommended jobs:", err);
        setError("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);
  return (
    <section id="recommended" className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold">
            {t("home.recommendedJobs.title")}
          </h2>
          <p className="text-gray-500 text-sm">
            {t("home.recommendedJobs.description")}
          </p>
        </div>
        <span className="text-gray-400 text-sm">chevron_right</span>
      </div>

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
          <p className="text-gray-500">No recommended jobs found</p>
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
                <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                  {job.match || "NEW"}
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
