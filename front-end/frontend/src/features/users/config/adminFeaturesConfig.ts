/**
 * Admin Features Configuration
 * Defines all admin-only features, routes, and permissions
 * This file serves as a central registry for admin functionality
 */

import { API_ENDPOINTS } from "@/lib/constants";

export interface AdminFeature {
  id: string; // Feature identifier
  icon: string; // Material symbol icon name
  labelKey: string; // i18n translation key for feature label
  route: string; // Frontend route path
  apiEndpoint?: string; // Optional backend API endpoint
  requiredRole: "admin" | "superadmin";
  description?: string; // Optional feature description
}

/**
 * Admin Features Registry
 * Add new admin features here for consistent management and access control
 */
export const ADMIN_FEATURES_CONFIG: Record<string, AdminFeature> = {
  // Dashboard / Users Management
  users_list: {
    id: "users_list",
    icon: "group",
    labelKey: "navigation.users",
    route: "/admin/users",
    apiEndpoint: API_ENDPOINTS.USERS.GET_ALL,
    requiredRole: "admin",
    description: "adminFeatures.usersListDesc",
  },

  // Classification Feature
  user_classification: {
    id: "user_classification",
    icon: "category",
    labelKey: "navigation.classification",
    route: "/admin/users/classification",
    apiEndpoint: API_ENDPOINTS.USERS.SEARCH,
    requiredRole: "admin",
    description: "adminFeatures.userClassificationDesc",
  },

  // Logs / Audit Trail
  activity_logs: {
    id: "activity_logs",
    icon: "assignment",
    labelKey: "navigation.logs",
    route: "/admin/logs",
    requiredRole: "admin",
    description: "adminFeatures.activityLogsDesc",
  },

  // Settings (placeholder for future)
  admin_settings: {
    id: "admin_settings",
    icon: "settings",
    labelKey: "navigation.settings",
    route: "/admin/settings",
    requiredRole: "superadmin",
    description: "adminFeatures.adminSettingsDesc",
  },
};

/**
 * Get admin features list for rendering in sidebar/navigation
 * Optionally filter by user role
 */
export function getAdminFeatures(userRole?: string): AdminFeature[] {
  const role = userRole?.toLowerCase();
  const features = Object.values(ADMIN_FEATURES_CONFIG);

  // Filter based on required role
  if (role === "admin") {
    return features.filter((f) => f.requiredRole === "admin");
  }

  if (role === "superadmin") {
    return features; // Superadmin can access all features
  }

  return [];
}

/**
 * Check if a user has access to a specific admin feature
 */
export function hasAdminFeatureAccess(
  userRole: string | undefined,
  featureId: string
): boolean {
  // eslint-disable-next-line security/detect-object-injection
  const feature = ADMIN_FEATURES_CONFIG[featureId];
  if (!feature) return false;

  const role = userRole?.toLowerCase();
  return role === feature.requiredRole || role === "superadmin";
}
