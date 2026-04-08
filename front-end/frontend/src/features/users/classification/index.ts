// Pages
export { UserClassificationPage } from "./pages";

// Hooks
export { useUserClassification } from "./hooks";
export type { UseUserClassificationReturn } from "./hooks";

// Components
export {
  UserClassificationHeader,
  UserClassificationGroup,
  UserClassificationOverview,
} from "./components";

// Types
export type {
  ClassificationGroupBy,
  ClassificationGroupData,
  ClassificationStatistics,
  ClassificationOverviewStats,
  GroupingConfig,
} from "./types/classification.types";

// Utils
export {
  classifyUsers,
  calculateGroupStatistics,
  calculateOverviewStatistics,
  formatPercentage,
  formatCount,
} from "./utils/classificationUtils";
export { getGroupingConfig, groupingConfigs } from "./utils/groupingConfig";
