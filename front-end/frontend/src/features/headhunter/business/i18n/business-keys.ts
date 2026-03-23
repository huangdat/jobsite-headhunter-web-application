/**
 * PROF-03 Business Profile & Verification
 * Phase 6: i18n Translation Keys Mapping
 * 
 * Complete list of all i18n keys used across all components
 * Use this as reference for translation file structure
 * 
 * Pattern: business.{section}.{key}
 */

export const BUSINESS_I18N_KEYS = {
  // ============================================
  // PAGE LEVEL
  // ============================================
  page: {
    title: "business.page.title",
    description: "business.page.description",
  },

  // ============================================
  // BREADCRUMBS
  // ============================================
  breadcrumb: {
    business: "business.breadcrumb.business",
    profile: "business.breadcrumb.profile",
  },

  // ============================================
  // BUTTONS
  // ============================================
  button: {
    documentation: "business.button.documentation",
    preview: "business.button.preview",
    upgrade: "business.button.upgrade",
    submit: "business.button.submit", // fallback for form button
  },

  // ============================================
  // FORM SECTION
  // ============================================
  form: {
    title: "business.form.title",
    subtitle: "business.form.subtitle",
    company_identity: "business.form.company_identity",
    company_identity_desc: "business.form.company_identity_desc",
    company_name: "business.form.company_name",
    company_name_placeholder: "business.form.company_name_placeholder",
    company_size: "business.form.company_size",
    select_size: "business.form.select_size",
    headquarters_address: "business.form.headquarters_address",
    address_placeholder: "business.form.address_placeholder",
    tax_id: "business.form.tax_id",
    tax_id_placeholder: "business.form.tax_id_placeholder",
    website: "business.form.website",
    website_placeholder: "business.form.website_placeholder",
    submitting: "business.form.submitting",
  },

  // ============================================
  // VERIFICATION SECTION
  // ============================================
  verification: {
    title: "business.verification.title",
    status: "business.verification.status",
    submitted: "business.verification.submitted",
    under_review: "business.verification.under_review",
    in_progress: "business.verification.in_progress",
    approved: "business.verification.approved",
    approved_title: "business.verification.approved_title",
  },

  // ============================================
  // DOCUMENTS SECTION
  // ============================================
  documents: {
    title: "business.documents.title",
  },
  document: {
    submitted: "business.document.submitted",
    verified: "business.document.verified",
    uploaded: "business.document.uploaded",
    download: "business.document.download",
    delete: "business.document.delete",
    confirm: "business.document.confirm",
    cancel: "business.document.cancel",
    deleting: "business.document.deleting",
    no_documents: "business.document.no_documents",
    delete_error: "business.document.delete_error",
  },

  // ============================================
  // PROFILE STRENGTH SECTION
  // ============================================
  strength: {
    title: "business.strength.title",
    complete: "business.strength.complete",
    incomplete: "business.strength.incomplete",
    of: "business.strength.of",
    items: "business.strength.items",
    breakdown: "business.strength.breakdown",
    no_data: "business.strength.no_data",
    next_action: "business.strength.next_action",
    updated: "business.strength.updated",
  },

  // ============================================
  // OPTIMIZATION TIPS SECTION
  // ============================================
  optimization: {
    title: "business.optimization.title",
    start_here: "business.optimization.start_here",
    additional: "business.optimization.additional",
  },

  // ============================================
  // PRIVACY SECTION
  // ============================================
  privacy: {
    title: "business.privacy.title",
    description: "business.privacy.description",
  },

  // ============================================
  // PREMIUM SECTION
  // ============================================
  premium: {
    title: "business.premium.title",
    description: "business.premium.description",
  },

  // ============================================
  // ACTIONS
  // ============================================
  action: {
    configure: "business.action.configure",
  },

  // ============================================
  // STATES
  // ============================================
  state: {
    loading: "business.state.loading",
  },

  // ============================================
  // FORM VALIDATION ERRORS (key structure mapping)
  // ============================================
  error: {
    validation: "business.error.validation",
    submission: "business.error.submission",
    server: "business.error.server",
    companyName: "business.error.company_name",
    taxId: "business.error.tax_id",
    website: "business.error.website",
    address: "business.error.address",
  },

  // ============================================
  // SUCCESS MESSAGES
  // ============================================
  success: {
    submitted: "business.success.submitted",
  },
};

/**
 * Usage Examples
 * ==============
 * 
 * In Components:
 * const { t } = useTranslation();
 * <h1>{t(BUSINESS_I18N_KEYS.page.title)}</h1>
 * 
 * Or Direct (current implementation):
 * <h1>{t("business.page.title")}</h1>
 * 
 * Translation File Structure (i18n/locales/en/business.json):
 * 
 * {
 *   "business": {
 *     "page": {
 *       "title": "Business Profile & Verification",
 *       "description": "Enter the official details of your organization."
 *     },
 *     "breadcrumb": {
 *       "business": "BUSINESS",
 *       "profile": "PROFILE"
 *     },
 *     "button": {
 *       "documentation": "Documentation",
 *       "preview": "Preview Business Page",
 *       "upgrade": "UPGRADE NOW"
 *     },
 *     "form": {
 *       "title": "Company Identity",
 *       "subtitle": "Enter the official details of your organization.",
 *       "company_identity": "Company Identity",
 *       "company_identity_desc": "Enter the official details of your organization.",
 *       "company_name": "COMPANY NAME",
 *       "company_name_placeholder": "Your registered company name",
 *       "company_size": "COMPANY SIZE",
 *       "select_size": "Select company size",
 *       "headquarters_address": "HEADQUARTERS ADDRESS",
 *       "address_placeholder": "123 Nguyen Hue, District 1, Ho Chi Minh City",
 *       "tax_id": "TAX ID / REGISTRATION",
 *       "tax_id_placeholder": "1234567890",
 *       "website": "WEBSITE",
 *       "website_placeholder": "https://yourcompany.com",
 *       "submitting": "SUBMITTING..."
 *     },
 *     "verification": {
 *       "title": "Verification Status",
 *       "status": "Verification Status",
 *       "submitted": "Submitted",
 *       "under_review": "Under Review",
 *       "in_progress": "In Progress",
 *       "approved": "Approved",
 *       "approved_title": "Profile Approved"
 *     },
 *     "documents": {
 *       "title": "Submitted Documents"
 *     },
 *     "document": {
 *       "submitted": "Submitted Documents",
 *       "verified": "Verified",
 *       "uploaded": "Uploaded",
 *       "download": "Download",
 *       "delete": "Delete",
 *       "confirm": "Confirm",
 *       "cancel": "Cancel",
 *       "deleting": "Deleting...",
 *       "no_documents": "No documents uploaded",
 *       "delete_error": "Failed to delete document"
 *     },
 *     ... (continue for all sections)
 *   }
 * }
 */

export default BUSINESS_I18N_KEYS;
