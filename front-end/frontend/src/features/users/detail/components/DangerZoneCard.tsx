import React from "react";
import { AlertTriangle, Lock, Unlock, Trash2, AlertCircle } from "lucide-react";
import { useUsersTranslation } from "@/shared/hooks";

interface DangerZoneSectionProps {
  onLockAccount: () => void;
  onUnlockAccount?: () => void;
  onSoftDelete: () => void;
  onHardDelete: () => void;
  isOtherAdmin: boolean;
  canLock?: boolean;
  userStatus?: "PENDING" | "ACTIVE" | "SUSPENDED" | "DELETED";
}

const DangerZoneSection: React.FC<DangerZoneSectionProps> = ({
  onLockAccount,
  onUnlockAccount,
  onSoftDelete,
  onHardDelete,
  isOtherAdmin,
  canLock = true,
  userStatus,
}) => {
  const { t } = useUsersTranslation();
  const isUserLocked = userStatus === "SUSPENDED" || userStatus === "DELETED";
  const getButtonClass = (disabled: boolean, isDangerous: boolean = false) => {
    if (disabled) {
      return "px-4 py-3 rounded-lg font-medium opacity-50 cursor-not-allowed bg-gray-200 text-gray-500 flex items-center gap-2 justify-center w-full";
    }
    if (isDangerous) {
      return "px-4 py-3 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition flex items-center gap-2 justify-center w-full";
    }
    return "px-4 py-3 rounded-lg font-medium bg-gray-800 text-white hover:bg-gray-900 transition flex items-center gap-2 justify-center w-full";
  };

  return (
    <div className="bg-white rounded-lg border-2 border-red-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle className="w-6 h-6 text-red-600" />
        <h2 className="text-lg font-bold text-red-700">
          {t("detail.dangerZone")}
        </h2>
      </div>

      <p className="text-gray-600 text-sm mb-6">{t("detail.dangerZoneDesc")}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Lock Account Section - Only show if user has lock permission and user is NOT locked */}
        {canLock && !isUserLocked && (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <Lock className="w-5 h-5 text-gray-700" />
              <h3 className="font-semibold text-gray-900">
                {t("detail.lockAccount")}
              </h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
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
          <div className="border border-green-200 rounded-lg p-4 bg-green-50">
            <div className="flex items-center gap-3 mb-3">
              <Unlock className="w-5 h-5 text-green-700" />
              <h3 className="font-semibold text-gray-900">
                {t("detail.unlockAccount")}
              </h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
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

        <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="w-5 h-5 text-orange-700" />
            <h3 className="font-semibold text-gray-900">
              {t("detail.softDelete")}
            </h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            {t("detail.softDeleteDesc")}
          </p>
          <button
            onClick={onSoftDelete}
            disabled={isOtherAdmin}
            className={getButtonClass(isOtherAdmin)}
            title={
              isOtherAdmin
                ? t("detail.cannotPerformOnAdmin")
                : t("detail.softDelete")
            }
          >
            <Trash2 className="w-4 h-4" />
            {t("detail.softDelete")}
          </button>
        </div>

        <div className="border border-red-300 rounded-lg p-4 bg-red-50">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-700" />
            <h3 className="font-semibold text-gray-900">
              {t("detail.hardDelete")}
            </h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            {t("detail.hardDeleteDesc")}
          </p>
          <button
            onClick={onHardDelete}
            disabled={isOtherAdmin}
            className={getButtonClass(isOtherAdmin, true)}
            title={
              isOtherAdmin
                ? t("detail.cannotPerformOnAdmin")
                : t("detail.hardDelete")
            }
          >
            <Trash2 className="w-4 h-4" />
            {t("common.permanentDelete")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DangerZoneSection;
