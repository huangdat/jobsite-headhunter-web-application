import type { UserDetail } from "../../types/user.types";
import type { GroupingConfig } from "../types/classification.types";

/**
 * Grouping configurations for different classification types.
 * Each config defines how to extract group keys, display names, colors, etc.
 */

const ROLE_COLORS: Record<
  string,
  "blue" | "purple" | "green" | "orange" | "red" | "slate"
> = {
  ADMIN: "blue",
  HEADHUNTER: "purple",
  COLLABORATOR: "green",
  CANDIDATE: "orange",
};

const STATUS_COLORS: Record<
  string,
  "blue" | "purple" | "green" | "orange" | "red" | "slate"
> = {
  ACTIVE: "green",
  LOCKED: "red",
  SUSPENDED: "orange",
  PENDING: "slate",
};

const MONTH_COLORS: Record<
  string,
  "blue" | "purple" | "green" | "orange" | "red" | "slate"
> = {
  "2024-01": "blue",
  "2024-02": "purple",
  "2024-03": "green",
  "2024-04": "orange",
  "2024-05": "red",
};

export const groupingConfigs: Record<string, GroupingConfig> = {
  role: {
    field: "role",
    label: "classification.groupByRole",
    description: "classification.roleDescription",
    extractKey: (user: UserDetail) => user.role || "CANDIDATE",
    getDisplayName: (key: string) =>
      `classification.roles.${key.toLowerCase()}`,
    getSubtitle: (key: string) =>
      `classification.roleSubtitles.${key.toLowerCase()}`,
    getIconType: () => "role",
    getColorScheme: (key: string) => ROLE_COLORS[key] || "slate",
  },

  status: {
    field: "status",
    label: "classification.groupByStatus",
    description: "classification.statusDescription",
    extractKey: (user: UserDetail) => user.status || "ACTIVE",
    getDisplayName: (key: string) =>
      `classification.statuses.${key.toLowerCase()}`,
    getSubtitle: (key: string) =>
      `classification.statusSubtitles.${key.toLowerCase()}`,
    getIconType: () => "status",
    getColorScheme: (key: string) => STATUS_COLORS[key] || "slate",
  },

  company: {
    field: "company",
    label: "classification.groupByCompany",
    description: "classification.companyDescription",
    extractKey: (user: UserDetail) => user.company || "classification.unknown",
    getDisplayName: (key: string) => key,
    getSubtitle: (key: string) => key,
    getIconType: () => "company",
    getColorScheme: () => "blue",
  },

  createdMonth: {
    field: "createdMonth",
    label: "classification.groupByCreatedMonth",
    description: "classification.createdMonthDescription",
    extractKey: (user: UserDetail) => {
      if (!user.createdAt) return "classification.unknown";
      const date = new Date(user.createdAt);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      return `${year}-${month}`;
    },
    getDisplayName: (key: string) => {
      if (key === "classification.unknown") return key;
      try {
        const [year, month] = key.split("-").map(Number);
        const date = new Date(year, month - 1);
        return date.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
      } catch {
        return key;
      }
    },
    getSubtitle: (key: string) => key,
    getIconType: () => "calendar",
    getColorScheme: (key: string) => MONTH_COLORS[key] || "slate",
  },
};

/**
 * Get grouping config by field.
 */
export const getGroupingConfig = (field: string): GroupingConfig | null => {
  return groupingConfigs[field] || null;
};
