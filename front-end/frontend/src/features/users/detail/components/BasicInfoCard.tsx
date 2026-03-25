import React from "react";
import { Users } from "lucide-react";
import { useUsersTranslation } from "@/shared/hooks";

interface BasicInfoCardProps {
  user: {
    fullName: string;
    email: string;
    phone: string;
    company?: string;
    biography?: string;
  };
}

const BasicInfoCard: React.FC<BasicInfoCardProps> = ({ user }) => {
  const { t } = useUsersTranslation();
  const displayCompany = user.company ? user.company : "—";

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
        <Users className="w-5 h-5 text-emerald-500" />
        {t("detail.basicInformation")}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t("detail.fullName")}
          </label>
          <input
            aria-label={t("aria.fullName")}
            type="text"
            value={user.fullName}
            readOnly
            disabled
            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t("detail.email")}
          </label>
          <input
            aria-label={t("aria.email")}
            type="email"
            value={user.email}
            readOnly
            disabled
            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t("detail.phoneNumber")}
          </label>
          <input
            aria-label={t("aria.phone")}
            type="tel"
            value={user.phone}
            readOnly
            disabled
            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t("detail.company")}
          </label>
          <input
            aria-label={t("aria.company")}
            type="text"
            value={displayCompany}
            readOnly
            disabled
            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 cursor-not-allowed"
          />
        </div>

        {user.biography && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t("detail.biography")}
            </label>
            <textarea
              aria-label={t("aria.biography")}
              value={user.biography}
              readOnly
              disabled
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 cursor-not-allowed h-24 resize-none"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicInfoCard;
