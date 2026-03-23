/**
 * Commission Profile Types
 * PROF-04: Collaborator Commission
 */

export interface CommissionProfile {
  id: string;
  collaboratorId: string;
  
  // Personal Information
  fullName: string;
  email: string;
  phoneNumber: string;
  
  // Banking Information
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  swiftCode?: string;
  
  // Commission Settings
  commissionRate: number; // percentage (e.g., 10 for 10%)
  minimumCommission?: number;
  bankingStatus: "verified" | "pending" | "rejected";
  
  // Stats
  totalEarnings: number;
  pendingCommissions: number;
  paidCommissions: number;
  referralsCount: number;
  activeJobsReferred: number;
  
  // Profile Metadata
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommissionFormData {
  fullName: string;
  phoneNumber: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  swiftCode?: string;
}

export interface CommissionStats {
  totalEarnings: number;
  monthlyEarnings: number;
  pendingCommissions: number;
  paidCommissions: number;
  referralsCount: number;
  commissionRate: number; // Current commission rate percentage
  conversionRate: number; // percentage
  activeJobsReferred: number;
}

export interface CommissionBenefit {
  id: string;
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
}
