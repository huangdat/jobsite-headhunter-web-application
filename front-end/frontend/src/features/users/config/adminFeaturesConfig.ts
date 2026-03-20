/**
 * Admin Features Configuration
 * Defines all admin-only features, routes, and permissions
 * This file serves as a central registry for admin functionality
 */

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
    route: "/users",
    apiEndpoint: "/api/account",
    requiredRole: "admin",
    description: "View and manage all users",
  },

  // Classification Feature
  user_classification: {
    id: "user_classification",
    icon: "category",
    labelKey: "navigation.classification",
    route: "/users/classification",
    apiEndpoint: "/api/account/search",
    requiredRole: "admin",
    description:
      "View user distribution and classification by role, status, company, etc.",
  },

  // Logs / Audit Trail
  activity_logs: {
    id: "activity_logs",
    icon: "assignment",
    labelKey: "navigation.logs",
    route: "/admin/logs",
    requiredRole: "admin",
    description: "View system activity and audit logs",
  },

  // Settings (placeholder for future)
  admin_settings: {
    id: "admin_settings",
    icon: "settings",
    labelKey: "navigation.settings",
    route: "/admin/settings",
    requiredRole: "superadmin",
    description: "Manage system settings and configurations",
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
  const feature = ADMIN_FEATURES_CONFIG[featureId];
  if (!feature) return false;

  const role = userRole?.toLowerCase();
  return role === feature.requiredRole || role === "superadmin";
}
