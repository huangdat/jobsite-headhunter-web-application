/**
 * CV Management Types
 * Defines all interfaces and types for CV/Resume management feature
 */

/* ============================================
   CV File Types
   ============================================ */

/** File upload status */
export type CVStatus = "uploading" | "success" | "error" | "deleted";

/** Supported resume file formats */
export type FileFormat = "pdf" | "doc" | "docx" | "rtf";

/** Resume file information */
export interface CVFile {
  id: string;
  filename: string;
  fileSize: number; // in bytes
  format: FileFormat;
  uploadedAt: Date;
  status: CVStatus;
  isActive: boolean;
}

/** Response from CV upload API */
export interface CVUploadResponse {
  success: boolean;
  message: string;
  file?: CVFile;
  error?: {
    code: string;
    message: string;
  };
}

/* ============================================
   Profile Strength Types
   ============================================ */

/** Individual profile strength item */
export interface StrengthItem {
  id: string;
  label: string; // i18n translation key
  completed: boolean;
  impact: number; // percentage contribution to overall strength
}

/** Overall profile strength tracking */
export interface ProfileStrength {
  percentage: number;
  items: StrengthItem[];
  lastUpdated: Date;
}

/* ============================================
   Privacy & Settings Types
   ============================================ */

/** Privacy level for CV visibility */
export type PrivacyLevel = "private" | "verified_recruiters" | "all";

/** Privacy control settings */
export interface PrivacyControl {
  level: PrivacyLevel;
  blockList?: string[]; // company IDs to block
}

/* ============================================
   Upload Validation Types
   ============================================ */

/** File validation result */
export interface FileValidation {
  valid: boolean;
  format?: FileFormat;
  size?: number;
  error?: {
    type: "FORMAT_INVALID" | "SIZE_EXCEEDED" | "UNKNOWN";
    message: string; // i18n key
  };
}

/** Upload configuration */
export interface UploadConfig {
  maxFileSize: number; // in bytes
  supportedFormats: FileFormat[];
  maxResumes: number; // max resumes allowed
}

/* ============================================
   CV Management State Types
   ============================================ */

/** CV Management component state */
export interface CVManagementState {
  files: CVFile[];
  isLoading: boolean;
  isUploading: boolean;
  error: string | null; // i18n key
  uploadProgress?: number; // 0-100
  selectedFile: CVFile | null;
  profile: {
    strength: ProfileStrength;
    privacy: PrivacyControl;
  };
  config: UploadConfig;
}

/* ============================================
   Component Props Types
   ============================================ */

/** CVUploadZone component props */
export interface CVUploadZoneProps {
  isLoading?: boolean;
  onUpload: (files: File[]) => Promise<void>;
  onDragOver?: () => void;
  onDragLeave?: () => void;
  supportedFormats: FileFormat[];
  maxFileSize: number;
  error?: string | null;
  isDragging?: boolean;
}

/** CVList component props */
export interface CVListProps {
  files: CVFile[];
  isLoading?: boolean;
  maxFiles: number;
  onView?: (fileId: string) => void;
  onDownload?: (fileId: string) => void;
  onDelete?: (fileId: string) => Promise<void>;
  onMakeActive?: (fileId: string) => Promise<void>;
}

/** CVEmptyState component props */
export interface CVEmptyStateProps {
  onUpload: () => void;
}

/** CVErrorBanner component props */
export interface CVErrorBannerProps {
  error: string; // i18n key or message
  details?: string;
  onDismiss?: () => void;
  onRetry?: () => void;
}

/** ProfileStrengthIndicator component props */
export interface ProfileStrengthIndicatorProps {
  percentage: number;
  items: StrengthItem[];
  isLoading?: boolean;
}

/** CVOptimizationTips component props */
export interface CVOptimizationTipsProps {
  tips?: OptimizationTip[];
  isLoading?: boolean;
}

/** Single optimization tip */
export interface OptimizationTip {
  id: string;
  title: string; // i18n key
  description: string; // i18n key
  icon?: string; // material symbol icon name
  completed?: boolean;
}

/** CVBestPractices component props */
export interface CVBestPracticesProps {
  section: "privacy" | "best_practices";
  isLoading?: boolean;
}

/** Individual best practice item */
export interface BestPracticeItem {
  id: string;
  title: string; // i18n key
  description: string; // i18n key
  icon?: string; // material symbol icon name
  items?: string[]; // sub-items (i18n keys)
}

/** PrivacyControl component props */
export interface PrivacyControlComponentProps {
  currentLevel: PrivacyLevel;
  onChangeLevel?: (level: PrivacyLevel) => Promise<void>;
  isLoading?: boolean;
}

/** PremiumServices component props */
export interface PremiumServicesProps {
  section: "booking" | "expert_review";
  onAction?: () => void;
  isLoading?: boolean;
}

/* ============================================
   API Request/Response Types
   ============================================ */

/** CV upload API request body */
export interface CVUploadRequest {
  file: File;
  isActive?: boolean;
  metadata?: {
    description?: string;
    tags?: string[];
  };
}

/** CV list API response */
export interface CVListResponse {
  success: boolean;
  data: CVFile[];
  total: number;
  limit: number;
}

/** Profile strength API response */
export interface ProfileStrengthResponse {
  success: boolean;
  data: ProfileStrength;
}

/** CV delete API response */
export interface CVDeleteResponse {
  success: boolean;
  message: string;
}

/** CV download API response */
export interface CVDownloadResponse {
  success: boolean;
  url?: string;
  message?: string;
}

/* ============================================
   Hook Return Types
   ============================================ */

/** useCVManagement hook return type */
export interface UseCVManagementReturn {
  state: CVManagementState;
  uploadFile: (file: File) => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
  downloadFile: (fileId: string) => Promise<void>;
  makeFileActive: (fileId: string) => Promise<void>;
  setPrivacy: (level: PrivacyLevel) => Promise<void>;
  clearError: () => void;
  refreshData: () => Promise<void>;
}

/** useCVUpload hook return type */
export interface UseCVUploadReturn {
  uploadFile: (file: File) => Promise<CVFile>;
  isUploading: boolean;
  progress: number;
  error: string | null;
  clearError: () => void;
}

/* ============================================
   Constants
   ============================================ */

export const DEFAULT_UPLOAD_CONFIG: UploadConfig = {
  maxFileSize: 5 * 1024 * 1024, // 5 MB
  supportedFormats: ["pdf", "doc", "docx", "rtf"],
  maxResumes: 5,
};

export const FILE_FORMAT_LABELS: Record<FileFormat, string> = {
  pdf: "PDF",
  doc: "DOC",
  docx: "DOCX",
  rtf: "RTF",
};

export const CV_STATUS_LABELS: Record<CVStatus, string> = {
  uploading: "Uploading",
  success: "Success",
  error: "Error",
  deleted: "Deleted",
};

/**
 * Maps privacy levels to i18n key paths for displaying privacy level labels.
 * Usage: const labels = PRIVACY_LEVEL_LABELS[level]; const displayText = t(labels);
 */
export const PRIVACY_LEVEL_LABELS: Record<PrivacyLevel, string> = {
  private: "cv.tips.visibilityPrivate",
  verified_recruiters: "cv.tips.visibilityVerifiedOnly",
  all: "cv.tips.visibilityAllRecruiters",
};
