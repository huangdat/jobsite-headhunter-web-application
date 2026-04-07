// LoginHistoryTable.tsx
import React from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useUsersTranslation } from "@/shared/hooks";
import { getSemanticClass } from "@/lib/design-tokens";

interface LoginSession {
  dateTime: string;
  ipAddress: string;
  deviceBrowser: string;
  location: string;
  status: "Successful" | "Failed";
}

interface LoginHistoryTableProps {
  sessions: LoginSession[];
}

const LoginHistoryTable: React.FC<LoginHistoryTableProps> = ({ sessions }) => {
  const { t } = useUsersTranslation();
  if (sessions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{t("detail.noLoginHistory")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
              {t("detail.dateTime")}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
              {t("detail.ipAddress")}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
              {t("detail.deviceBrowser")}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
              {t("detail.location")}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
              {t("detail.status")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sessions.map((session, idx) => (
            <tr key={idx} className="hover:bg-gray-50 transition">
              <td className="px-4 py-4 text-sm font-medium text-gray-900">
                {session.dateTime}
              </td>

              <td className="px-4 py-4 text-sm text-gray-700">
                {session.ipAddress}
              </td>

              <td className="px-4 py-4 text-sm text-gray-700">
                {session.deviceBrowser}
              </td>

              <td className="px-4 py-4 text-sm text-gray-700">
                {session.location}
              </td>

              <td className="px-4 py-4 text-sm">
                <div className="flex items-center gap-2">
                  {session.status === "Successful" ? (
                    <>
                      <CheckCircle
                        className={`w-4 h-4 ${getSemanticClass("success", "icon", true)}`}
                      />
                      <span
                        className={`${getSemanticClass("success", "text", true)} font-medium`}
                      >
                        {t("loginStatus.success")}
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle
                        className={`w-4 h-4 ${getSemanticClass("danger", "icon", true)}`}
                      />
                      <span
                        className={`${getSemanticClass("danger", "text", true)} font-medium`}
                      >
                        {t("loginStatus.failedAttempt")}
                      </span>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoginHistoryTable;
