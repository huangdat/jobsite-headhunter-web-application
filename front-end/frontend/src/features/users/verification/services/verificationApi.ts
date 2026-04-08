/**
 * Business Verification API Service
 * PROF-05: Business Verification Admin Module
 */

import { apiClient } from "@/shared/utils/axios";
import { handleError } from "@/shared/api/errorHandler";
import { API_ENDPOINTS } from "@/lib/constants";
import type {
  ApiResponse,
  Verification,
  VerificationStats,
  RecentEvent,
  PaginatedVerifications,
  VerificationFilters,
  ApprovalRequest,
  RejectionRequest,
} from "../types/verification.types";

// ============================================================================
// API SERVICE FUNCTIONS (using API_ENDPOINTS from constants)
// ============================================================================

/**
 * Get paginated list of verifications
 * GET /api/admin/verifications
 */
export const getVerifications = async (
  filters?: VerificationFilters
): Promise<PaginatedVerifications> => {
  try {
    const response = await apiClient.get<ApiResponse<PaginatedVerifications>>(
      API_ENDPOINTS.VERIFICATION.GET_LIST,
      { params: filters }
    );
    return response.data.result;
  } catch (error) {
    handleError(error, {
      service: "verification",
      action: "getVerifications",
    });
    throw error;
  }
};

/**
 * Get verification detail by ID
 * GET /api/admin/verifications/:id
 */
export const getVerificationDetail = async (
  verificationId: number
): Promise<Verification> => {
  try {
    const url = API_ENDPOINTS.VERIFICATION.GET_DETAIL.replace(
      "{id}",
      String(verificationId)
    );
    const response = await apiClient.get<ApiResponse<Verification>>(url);
    return response.data.result;
  } catch (error) {
    handleError(error, {
      service: "verification",
      action: "getVerificationDetail",
    });
    throw error;
  }
};

/**
 * Approve a business verification
 * POST /api/admin/verifications/:id/approve
 */
export const approveVerification = async (
  verificationId: number,
  data?: ApprovalRequest
): Promise<Verification> => {
  try {
    const url = API_ENDPOINTS.VERIFICATION.APPROVE.replace(
      "{id}",
      String(verificationId)
    );
    const response = await apiClient.post<ApiResponse<Verification>>(
      url,
      data || {}
    );
    return response.data.result;
  } catch (error) {
    handleError(error, {
      service: "verification",
      action: "approveVerification",
    });
    throw error;
  }
};

/**
 * Reject a business verification
 * POST /api/admin/verifications/:id/reject
 */
export const rejectVerification = async (
  verificationId: number,
  data: RejectionRequest
): Promise<Verification> => {
  try {
    const url = API_ENDPOINTS.VERIFICATION.REJECT.replace(
      "{id}",
      String(verificationId)
    );
    const response = await apiClient.post<ApiResponse<Verification>>(url, data);
    return response.data.result;
  } catch (error) {
    handleError(error, {
      service: "verification",
      action: "rejectVerification",
    });
    throw error;
  }
};

/**
 * Get verification statistics (KPIs)
 * GET /api/admin/verification-stats
 */
export const getVerificationStats = async (): Promise<VerificationStats> => {
  try {
    const response = await apiClient.get<ApiResponse<VerificationStats>>(
      API_ENDPOINTS.VERIFICATION.GET_STATS
    );
    return response.data.result;
  } catch (error) {
    handleError(error, {
      service: "verification",
      action: "getVerificationStats",
    });
    throw error;
  }
};

/**
 * Get recent verification events/activity
 * GET /api/admin/verification-events
 */
export const getRecentEvents = async (
  limit?: number
): Promise<RecentEvent[]> => {
  try {
    const response = await apiClient.get<ApiResponse<RecentEvent[]>>(
      API_ENDPOINTS.VERIFICATION.GET_EVENTS,
      { params: { limit } }
    );
    return response.data.result;
  } catch (error) {
    handleError(error, {
      service: "verification",
      action: "getRecentEvents",
    });
    throw error;
  }
};

// ============================================================================
// EXPORT
// ============================================================================

export default {
  getVerifications,
  getVerificationDetail,
  approveVerification,
  rejectVerification,
  getVerificationStats,
  getRecentEvents,
};
