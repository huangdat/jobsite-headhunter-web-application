import type { UserDetail } from "../../types/user.types";
import type {
  ClassificationGroupData,
  ClassificationStatistics,
  ClassificationOverviewStats,
  ClassificationGroupBy,
} from "../types/classification.types";
import { getGroupingConfig } from "./groupingConfig";

/**
 * Calculate statistics for a single group
 */
export const calculateGroupStatistics = (
  users: UserDetail[],
  totalUsersOverall: number
): ClassificationStatistics => {
  const totalCount = users.length;
  const activeCount = users.filter((u) => u.status === "ACTIVE").length;
  const inactiveCount = totalCount - activeCount;

  return {
    totalCount,
    percentage: totalUsersOverall > 0 ? (totalCount / totalUsersOverall) * 100 : 0,
    activeCount,
    inactiveCount,
    activePercentage: totalCount > 0 ? (activeCount / totalCount) * 100 : 0,
  };
};

/**
 * Group users by the specified field and return classified groups
 */
export const classifyUsers = (
  users: UserDetail[],
  groupBy: ClassificationGroupBy
): ClassificationGroupData[] => {
  const config = getGroupingConfig(groupBy);
  if (!config) {
    console.warn(`Invalid grouping field: ${groupBy}`);
    return [];
  }

  // Step 1: Group users by the key
  const groupMap = new Map<string, UserDetail[]>();

  users.forEach((user) => {
    const key = config.extractKey(user);
    if (!groupMap.has(key)) {
      groupMap.set(key, []);
    }
    groupMap.get(key)!.push(user);
  });

  // Step 2: Convert grouped data to ClassificationGroupData
  const groups: ClassificationGroupData[] = Array.from(groupMap.entries()).map(
    ([key, groupUsers]) => ({
      id: key,
      displayName: config.getDisplayName(key),
      iconType: config.getIconType(),
      colorScheme: config.getColorScheme(key),
      subtitle: config.getSubtitle(key),
      users: groupUsers,
      statistics: calculateGroupStatistics(groupUsers, users.length),
      isExpanded: false, // Default: groups start collapsed
    })
  );

  // Step 3: Sort groups (by count descending)
  groups.sort((a, b) => b.statistics.totalCount - a.statistics.totalCount);

  return groups;
};

/**
 * Calculate overview statistics for all groups
 */
export const calculateOverviewStatistics = (
  groups: ClassificationGroupData[]
): ClassificationOverviewStats => {
  const totalUsers = groups.reduce((sum, g) => sum + g.statistics.totalCount, 0);
  const totalActiveUsers = groups.reduce((sum, g) => sum + g.statistics.activeCount, 0);
  const totalInactiveUsers = groups.reduce((sum, g) => sum + g.statistics.inactiveCount, 0);

  return {
    totalUsers,
    activeRate: totalUsers > 0 ? (totalActiveUsers / totalUsers) * 100 : 0,
    groupCount: groups.length,
    totalActiveUsers,
    totalInactiveUsers,
  };
};

/**
 * Format percentage for display
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format count for display (with thousands separator)
 */
export const formatCount = (value: number): string => {
  return value.toLocaleString();
};
