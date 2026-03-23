/**
 * Index File - Commission Module
 * PROF-04: Collaborator Commission
 * Main entry point for commission features
 */

export { CommissionForm, CommissionBenefits } from "./components";
export { CommissionStats } from "./components"; // Component
export { useCommissionManagement } from "./hooks";
export { CommissionProfilePage } from "./pages";
export { commissionApi } from "./services";
export type {
  CommissionProfile,
  CommissionFormData,
  CommissionStats as CommissionStatsData, // Type - alias to avoid conflict
} from "./types";
