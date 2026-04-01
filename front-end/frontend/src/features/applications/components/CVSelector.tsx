import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { fetchMyCurrentCV } from "@/features/applications/services/applicationsApi";
import { FileText, Loader, AlertCircle } from "lucide-react";
import type { Application } from "../types";

interface CVSelectorProps {
  onCVSelect: (cvId: string, cvUrl: string) => void;
  selectedId?: string;
  error?: string;
}

export const CVSelector: React.FC<CVSelectorProps> = ({
  onCVSelect,
  selectedId,
  error,
}) => {
  const { t } = useAppTranslation();
  const [myCv, setMyCv] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleCVSelect = useCallback(onCVSelect, [onCVSelect]);

  useEffect(() => {
    const loadDefaultCV = async () => {
      try {
        setIsLoading(true);
        const data = await fetchMyCurrentCV();
        if (data) {
          setMyCv(data);
          handleCVSelect(String(data.id), data.cvSnapshotUrl);
        }
      } catch (err) {
        console.error("Failed to load CV profile", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDefaultCV();
  }, [handleCVSelect]);

  // Format filename
  const formatFileName = (url: string) => {
    if (!url) return "My_Resume.pdf";
    const fileName = url.split("/").pop() || "";
    return decodeURIComponent(fileName);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-slate-700">
          {t("applications.form.selectCV")}
        </label>
        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
          {t("applications.form.profileCvBadge")}
        </span>
      </div>

      {isLoading ? (
        <div className="p-4 text-center text-slate-500 animate-pulse font-medium flex items-center justify-center gap-2 border-2 border-slate-100 rounded-2xl">
          <Loader className="w-5 h-5 animate-spin text-emerald-500" />
          {t("common.loading")}
        </div>
      ) : myCv ? (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div
            className={`relative flex items-center justify-between rounded-2xl border-2 p-4 transition-all duration-300 ${
              selectedId === String(myCv.id) ||
              selectedId === myCv.cvSnapshotUrl
                ? "border-emerald-500 bg-emerald-50/50 shadow-md ring-1 ring-emerald-500/20"
                : "border-slate-100 bg-white"
            }`}
          >
            <div className="flex items-center gap-4 text-left overflow-hidden">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 shadow-inner">
                <FileText className="w-6 h-6" />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-sm font-bold text-slate-900 truncate">
                  {formatFileName(myCv.cvSnapshotUrl)}
                </h4>
              </div>
            </div>

            <div className="flex items-center ml-2">
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          <p className="mt-3 text-[11px] text-slate-400 italic px-1">
            {t("applications.form.defaultCvNote")}
          </p>
        </div>
      ) : (
        <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center bg-slate-50/50 animate-in zoom-in duration-300">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <FileText className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-sm font-bold text-slate-600">
            {t("applications.empty.noCV")}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {t("applications.form.noCvDescription")}
          </p>
          <Button
            className="mt-4 shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700"
            onClick={() => window.open("/candidate/cv", "_blank")}
          >
            {t("applications.form.updateCvNow")}
          </Button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-bold animate-in duration-500">
          <AlertCircle className="w-4 h-4" />
          {t(error)}
        </div>
      )}
    </div>
  );
};
