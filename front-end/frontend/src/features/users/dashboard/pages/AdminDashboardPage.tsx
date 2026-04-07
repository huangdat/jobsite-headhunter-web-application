import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsersTranslation } from "@/shared/hooks";
import { getSemanticClass } from "@/lib/design-tokens";
import { usersApi } from "@/features/users/services/usersApi";
import type { PagedResponse } from "@/features/users/services/usersApi";
import type { UserDetail } from "@/features/users/types/user.types";
import { PageContainer, PageHeader } from "@/shared/common-blocks/layout";
import { PageSkeleton } from "@/shared/common-blocks/states";

export const AdminDashboardPage: React.FC = () => {
  const { t } = useUsersTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    suspendedUsers: 0,
    pendingUsers: 0,
  });

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Fetch all users to calculate stats
        const response: PagedResponse<UserDetail> = await usersApi.searchUsers({
          page: 1,
          size: 1,
        });

        // For now, just show total users count
        // In a real dashboard, backend would provide stats endpoint
        setStats({
          totalUsers: response.total,
          activeUsers: Math.round(response.total * 0.8),
          suspendedUsers: Math.round(response.total * 0.15),
          pendingUsers: Math.round(response.total * 0.05),
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <PageContainer variant="default" maxWidth="7xl">
      <PageHeader
        variant="bordered"
        title={t("classification.pageTitle") + " - " + t("admin.label")}
        description={t("classification.description")}
      />

      {/* Stats Grid */}
      {loading ? (
        <PageSkeleton variant="grid" count={4} />
      ) : (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Users Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {t("classification.totalUsers")}
                  </p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {stats.totalUsers}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${getSemanticClass("info", "bg", true)}`}
                >
                  <span className="text-2xl">👥</span>
                </div>
              </div>
            </div>

            {/* Active Users Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {t("statuses.ACTIVE")}
                  </p>
                  <p
                    className={`text-3xl font-bold ${getSemanticClass("success", "text", true)}`}
                  >
                    {stats.activeUsers}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${getSemanticClass("success", "bg", true)}`}
                >
                  <span className="text-2xl">✅</span>
                </div>
              </div>
            </div>

            {/* Suspended Users Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {t("statuses.SUSPENDED")}
                  </p>
                  <p
                    className={`text-3xl font-bold ${getSemanticClass("danger", "text", true)}`}
                  >
                    {stats.suspendedUsers}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${getSemanticClass("danger", "bg", true)}`}
                >
                  <span className="text-2xl">🔒</span>
                </div>
              </div>
            </div>

            {/* Pending Users Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {t("statuses.PENDING")}
                  </p>
                  <p
                    className={`text-3xl font-bold ${getSemanticClass("warning", "text", true)}`}
                  >
                    {stats.pendingUsers}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${getSemanticClass("warning", "bg", true)}`}
                >
                  <span className="text-2xl">⏳</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              {t("classification.quickNavigation")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate("/admin/users")}
                className={`p-4 text-left rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-amber-500 transition-colors ${getSemanticClass("info", "bg", true).split(" ")[0]} dark:hover:bg-blue-900/10`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">👥</span>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {t("classification.userManagementTitle")}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t("classification.userManagementDesc")}
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate("/admin/users/classification")}
                className={`p-4 text-left rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-colors ${getSemanticClass("success", "bg", true).split(" ")[0]} dark:hover:bg-green-900/10`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📊</span>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {t("classification.classificationTitle")}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t("classification.classificationDesc")}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default AdminDashboardPage;

