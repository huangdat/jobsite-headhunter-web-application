import { useState } from "react";
import { Input } from "@/shared/ui-primitives/input";
import { Button } from "@/shared/ui-primitives/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui-primitives/select";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import type { ApplicationStatus } from "../types";
import { APPLICATION_STATUS_LABELS } from "../utils";

interface ApplicationFiltersProps {
  onFilterChange: (keyword: string, status?: ApplicationStatus) => void;
  onReset: () => void;
}

export const ApplicationFilters: React.FC<ApplicationFiltersProps> = ({
  onFilterChange,
  onReset,
}) => {
  const { t } = useAppTranslation();
  const allStatusValue = "ALL" as const;
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<
    ApplicationStatus | typeof allStatusValue
  >(allStatusValue);

  const handleApplyFilters = () => {
    onFilterChange(
      keyword,
      status === allStatusValue ? undefined : status
    );
  };

  const handleReset = () => {
    setKeyword("");
    setStatus(allStatusValue);
    onReset();
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <label className="block text-sm font-medium mb-2">
          {t("applications.filter.search")}
        </label>
        <Input
          placeholder={t("applications.filter.search")}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {t("applications.filter.status")}
        </label>
        <Select
          value={status}
          onValueChange={(val) =>
            setStatus(val as ApplicationStatus | typeof allStatusValue)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("applications.filter.all")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={allStatusValue}>
              {t("applications.filter.all")}
            </SelectItem>
            {Object.entries(APPLICATION_STATUS_LABELS).map(
              ([key, labelKey]) => (
                <SelectItem key={key} value={key}>
                  {t(labelKey)}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleApplyFilters} className="flex-1">
          {t("common.apply")}
        </Button>
        <Button variant="outline" onClick={handleReset} className="flex-1">
          {t("common.reset")}
        </Button>
      </div>
    </div>
  );
};

