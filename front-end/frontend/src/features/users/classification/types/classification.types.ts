import type { UserDetail } from "../../types/user.types";

/**
 * Classification types and interfaces
 * Supports grouping by: Role, Status, Company, Created Month
 */

export type ClassificationGroupBy =
  | "role"
  | "status"
  | "company"
  | "createdMonth";

export interface ClassificationGroupData {
  /**
   * Group identifier (e.g., "ADMIN", "ACTIVE", "TechCorp", "2024-01")
   */
  id: string;

  /**
   * Display name for the group
   */
  displayName: string;

  /**
   * Icon type for visual identification
   */
  iconType: "role" | "status" | "company" | "calendar";

  /**
   * Color scheme for the group
   */
  colorScheme: "blue" | "purple" | "green" | "orange" | "red" | "slate";

  /**
   * Detailed description of the group
   */
  subtitle: string;

  /**
   * Users in this group
   */
  users: UserDetail[];

  /**
   * Statistics for this group
   */
  statistics: ClassificationStatistics;

  /**
   * Whether the group is expanded (for UI collapse/expand state)
   */
  isExpanded: boolean;
}

export interface ClassificationStatistics {
  /**
   * Total count of users in the group
   */
  totalCount: number;

  /**
   * Percentage of total users
   */
  percentage: number;

  /**
   * Number of active users
   */
  activeCount: number;

  /**
   * Number of inactive/locked users
   */
  inactiveCount: number;

  /**
   * Active percentage within the group
   */
  activePercentage: number;
}

export interface ClassificationOverviewStats {
  /**
   * Total number of users across all groups
   */
  totalUsers: number;

  /**
   * Overall active rate percentage
   */
  activeRate: number;

  /**
   * Number of groups
   */
  groupCount: number;

  /**
   * Total active users
   */
  totalActiveUsers: number;

  /**
   * Total inactive users
   */
  totalInactiveUsers: number;
}

/**
 * Grouping functions based on classification type
 */
export interface GroupingConfig {
  field: ClassificationGroupBy;
  label: string;
  description: string;
  extractKey: (user: UserDetail) => string;
  getDisplayName: (key: string) => string;
  getSubtitle: (key: string) => string;
  getIconType: () => "role" | "status" | "company" | "calendar";
  getColorScheme: (
    key: string
  ) => "blue" | "purple" | "green" | "orange" | "red" | "slate";
}
