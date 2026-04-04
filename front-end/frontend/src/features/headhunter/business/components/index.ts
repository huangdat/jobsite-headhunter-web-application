// Banners & UI Status
export { SuccessBanner } from "./SuccessBanner";
export { ErrorBanner } from "./ErrorBanner";
export { VerificationStatus } from "./VerificationStatus";

// --- NEW: Read-only Display Component ---
export { BusinessProfileDisplay } from "./BusinessProfileDisplay";

// Form & Validation
export {
  FormValidationError,
  FormValidationErrorsList,
} from "./FormValidationErrors";
export { BusinessIdentityForm } from "./BusinessIdentityForm";

// Documents
export { SubmittedDocuments } from "./SubmittedDocuments";

// Sidebar Components
export { ProfileStrengthCard } from "./ProfileStrengthCard";
export { OptimizationTips } from "./OptimizationTips";
export { CompanyBestPractices } from "./CompanyBestPractices";

// --- Export types ---
export type { VerificationStep } from "./VerificationStatus";
export type { SubmittedDocumentsProps } from "./SubmittedDocuments";
export type { ProfileStrengthCardProps } from "./ProfileStrengthCard";
export type {
  OptimizationTipsProps,
  OptimizationTip,
} from "./OptimizationTips";
export type {
  CompanyBestPracticesProps,
  BestPractice,
} from "./CompanyBestPractices";
