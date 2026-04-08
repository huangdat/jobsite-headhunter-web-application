import type { UserRole, UserStatus } from "@/features/users/types/user.types";

export const mockUserRoleStats: Array<{ role: UserRole; count: number }> = [
  { role: "ADMIN", count: 5 },
  { role: "CANDIDATE", count: 42 },
  { role: "HEADHUNTER", count: 18 },
  { role: "COLLABORATOR", count: 12 },
];

export const mockUserStatusStats: Array<{ status: UserStatus; count: number }> =
  [
    { status: "PENDING", count: 20 },
    { status: "ACTIVE", count: 65 },
    { status: "SUSPENDED", count: 8 },
    { status: "DELETED", count: 4 },
  ];
