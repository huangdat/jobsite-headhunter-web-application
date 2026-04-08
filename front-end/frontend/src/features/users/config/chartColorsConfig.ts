/**
 * Centralized color configuration for chart components
 * Used by UserRoleChart and UserStatusChart to ensure consistency
 */

// Color palette - Chart color definitions using HSL format
export const CHART_COLORS = {
  RED: "hsl(0, 84%, 60%)", // Red
  BLUE: "hsl(217, 91%, 60%)", // Blue
  GREEN: "hsl(142, 71%, 45%)", // Green
  PURPLE: "hsl(280, 85%, 65%)", // Purple
  AMBER: "hsl(45, 93%, 47%)", // Amber
} as const;

// Role-specific color mapping
export const ROLE_COLOR_MAP = {
  ADMIN: CHART_COLORS.RED,
  CANDIDATE: CHART_COLORS.BLUE,
  HEADHUNTER: CHART_COLORS.GREEN,
  COLLABORATOR: CHART_COLORS.PURPLE,
} as const;

// Status-specific color mapping
export const STATUS_COLOR_MAP = {
  PENDING: CHART_COLORS.AMBER,
  ACTIVE: CHART_COLORS.GREEN,
  SUSPENDED: CHART_COLORS.BLUE,
  DELETED: CHART_COLORS.RED,
} as const;
