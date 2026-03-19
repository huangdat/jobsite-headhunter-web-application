// Export main pages
export { UserListPage } from './list/pages/UserListPage';
export { UserDetailPage } from './detail/pages/UserDetailPage';

// Export detail components and sub-exports
export * from './detail';

// Export common components
export { UserTable } from './components/common/UserTable';
export { UserFilters } from './components/common/UserFilters';

// Export services
export { usersApi } from './services/usersApi';

// Export types
export type { User } from './types/user.types';