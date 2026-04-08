import React from "react";
import { AlertTriangle, Lock, Unlock, Trash2 } from "lucide-react";
import { useUsersTranslation } from "@/shared/hooks";
import { getSemanticClass } from "@/lib/design-tokens";

interface DangerZoneSectionProps {
  onLockAccount: () => void;
  onUnlockAccount?: () => void;
  onDeleteAccount: () => void;
  isOtherAdmin: boolean;
  canLock?: boolean;
  userStatus?: "PENDING" | "ACTIVE" | "SUSPENDED" | "DELETED";
}

const DangerZoneSection: React.FC<DangerZoneSectionProps> = ({
  onLockAccount,
  onUnlockAccount,
  onDeleteAccount,
  isOtherAdmin,
  canLock = true,
  userStatus,
}) => {
  const { t } = useUsersTranslation();
  const isUserLocked = userStatus === "SUSPENDED" || userStatus === "DELETED";
  const getButtonClass = (disabled: boolean, isDangerous: boolean = false) => {
    if (disabled) {
      return "px-4 py-3 rounded-lg font-medium opacity-50 cursor-not-allowed bg-slate-100 text-slate-500 flex items-center gap-2 justify-center w-full";
    }
    if (isDangerous) {
      return `px-4 py-3 rounded-lg font-medium ${getSemanticClass("danger", "bg", true)} text-white hover:${getSemanticClass("danger", "bg", true)} transition flex items-center gap-2 justify-center w-full`;
    }
    return "px-4 py-3 rounded-lg font-medium bg-slate-900 text-white hover:bg-slate-950 transition flex items-center gap-2 justify-center w-full";
  };

  return (
    <div
      className={`bg-white rounded-lg border-2 ${getSemanticClass("danger", "border", true)} p-6`}
    >
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle
          className={`w-6 h-6 ${getSemanticClass("danger", "text", true)}`}
        />
        <h2
          className={`text-lg font-bold ${getSemanticClass("danger", "text", true)}`}
        >
          {t("detail.dangerZone")}
        </h2>
      </div>

      <p className="text-slate-600 text-sm mb-6">
        {t("detail.dangerZoneDesc")}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Lock Account Section - Only show if user has lock permission and user is NOT locked */}
        {canLock && !isUserLocked && (
          <div
            className={`border ${getSemanticClass("danger", "border", true)} rounded-lg p-4`}
          >
            <div className="flex items-center gap-3 mb-3">
              <Lock className="w-5 h-5 text-slate-700" />
              <h3 className="font-semibold text-slate-900 dark:text-slate-50">
                {t("detail.lockAccount")}
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
              {t("detail.lockAccountDesc")}
            </p>
            <button
              onClick={onLockAccount}
              disabled={isOtherAdmin}
              className={getButtonClass(isOtherAdmin)}
              title={
                isOtherAdmin
                  ? t("detail.cannotPerformOnAdmin")
                  : t("detail.lockAccount")
              }
            >
              <Lock className="w-4 h-4" />
              {t("detail.lockAccount")}
            </button>
          </div>
        )}

        {/* Unlock Account Section - Only show if user has unlock permission and user IS locked */}
        {canLock && isUserLocked && onUnlockAccount && (
          <div
            className={`border ${getSemanticClass("success", "border", true)} rounded-lg p-4 ${getSemanticClass("success", "bg", true)}`}
          >
            <div className="flex items-center gap-3 mb-3">
              <Unlock
                className={`w-5 h-5 ${getSemanticClass("success", "text", true)}`}
              />
              <h3 className="font-semibold text-slate-900 dark:text-slate-50">
                {t("detail.unlockAccount")}
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
              {t("detail.unlockAccountDesc")}
            </p>
            <button
              onClick={onUnlockAccount}
              disabled={isOtherAdmin}
              className={getButtonClass(isOtherAdmin)}
              title={
                isOtherAdmin
                  ? t("detail.cannotPerformOnAdmin")
                  : t("detail.unlockAccount")
              }
            >
              <Unlock className="w-4 h-4" />
              {t("detail.unlockAccount")}
            </button>
          </div>
        )}

        {/* Delete Account Section */}
        <div
          className={`border ${getSemanticClass("danger", "border", true)} rounded-lg p-4 ${getSemanticClass("danger", "bg", true)}`}
        >
          <div className="flex items-center gap-3 mb-3">
            <Trash2
              className={`w-5 h-5 ${getSemanticClass("danger", "text", true)}`}
            />
            <h3 className="font-semibold text-slate-900 dark:text-slate-50">
              {t("detail.deleteAccount")}
            </h3>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
            {t("detail.deleteAccountDesc")}
          </p>
          <button
            onClick={onDeleteAccount}
            disabled={isOtherAdmin}
            className={
              isOtherAdmin
                ? "px-4 py-3 rounded-lg font-medium opacity-50 cursor-not-allowed bg-slate-100 text-slate-500 flex items-center gap-2 justify-center w-full"
                : "px-4 py-3 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 active:bg-red-800 transition flex items-center gap-2 justify-center w-full"
            }
            title={
              isOtherAdmin
                ? t("detail.cannotPerformOnAdmin")
                : t("detail.deleteAccount")
            }
          >
            <Trash2 className="w-4 h-4" />
            {t("detail.deleteAccount")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DangerZoneSection;
