// Export main pages
export { UserListPage } from "./list/pages/UserListPage";
export { default as UserDetailPage } from "./detail/pages/UserDetailPage";
export { UserClassificationPage } from "./classification/pages/UserClassificationPage";

// Export detail components and sub-exports
export * from "./detail";

// Export common components
export { UserTable } from "./components/common/UserTable";
export { UserFilters } from "./components/common/UserFilters";

// Export services
export { usersApi } from "./services/usersApi";

// Export types
export type { UserDetail } from "./types/user.types";
