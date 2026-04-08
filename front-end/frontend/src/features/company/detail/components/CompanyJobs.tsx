import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getSemanticClass } from "@/lib/design-tokens";
import {
  getJobsByBusinessProfileId,
  type JobDetailResp,
} from "../services/companyApi";
import { Briefcase, MapPin, DollarSign, Calendar } from "lucide-react";

interface CompanyJobsProps {
  businessProfileId: number | string;
}

export function CompanyJobs({ businessProfileId }: CompanyJobsProps) {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState<JobDetailResp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessProfileId) {
      setLoading(false);
      return;
    }

    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await getJobsByBusinessProfileId(businessProfileId);
        setJobs(data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError(t("failedToLoadJobs") || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [businessProfileId, t]);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-6">
      <h2 className="text-xl font-bold text-slate-900 mb-6">
        {t("navigation.jobs")}
      </h2>

      {loading && (
        <p className="text-slate-500 italic">{t("business.state.loading")}</p>
      )}

      {error && (
        <p className={`text-sm ${getSemanticClass("danger", "text", true)}`}>
          {error}
        </p>
      )}

      {!loading && !error && jobs.length === 0 && (
        <p className="text-slate-500 italic">
          {t("noJobsAvailable") || "No jobs available"}
        </p>
      )}

      {!loading && !error && jobs.length > 0 && (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Link
              key={job.id}
              to={`/jobs/${job.id}`}
              className="block border border-slate-200 rounded-2xl p-4 hover:shadow-md hover:border-brand-primary transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">
                    {job.title}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-2">
                    {job.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
                {job.location && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{job.location}</span>
                  </div>
                )}
                {job.salary && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <DollarSign className="w-4 h-4" />
                    <span className="truncate">{job.salary}</span>
                  </div>
                )}
                {job.workType && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Briefcase className="w-4 h-4" />
                    <span className="truncate">{job.workType}</span>
                  </div>
                )}
                {job.deadline && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span className="truncate">
                      {new Date(job.deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
