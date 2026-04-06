/**
 * Mock Data Factory
 * Creates realistic mock data for testing
 */
/* eslint-disable @typescript-eslint/no-explicit-any, custom/no-api-urls */

/**
 * Utility to generate unique IDs
 */
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Utility to generate fake email
 */
function generateEmail(): string {
  return `user${generateId()}@example.com`;
}

/**
 * Utility to generate fake name
 */
function generateName(): string {
  const firstNames = ["John", "Jane", "Bob", "Alice", "Charlie", "Diana"];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
  ];
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

/**
 * Create mock user with fake data
 */
export function createMockUser(overrides?: Record<string, any>): any {
  return {
    id: generateId(),
    email: generateEmail(),
    name: generateName(),
    phone: "+1-555-0100",
    avatar: "https://api.example.com/avatars/default.jpg",
    role: "user",
    status: "active",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Create mock admin user
 */
export function createMockAdmin(overrides?: Record<string, any>): any {
  return createMockUser({
    role: "admin",
    ...overrides,
  });
}

/**
 * Create mock job posting
 */
export function createMockJob(overrides?: Record<string, any>): any {
  return {
    id: generateId(),
    title: "Senior Software Engineer",
    description: "We are looking for an experienced software engineer...",
    company: "Tech Company Inc",
    location: "San Francisco, CA",
    salary: 150000,
    level: "mid",
    status: "open",
    createdBy: generateId(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Create mock candidate profile
 */
export function createMockCandidate(overrides?: Record<string, any>): any {
  return {
    id: generateId(),
    user: createMockUser(),
    skills: ["JavaScript", "React", "TypeScript"],
    experience: 5,
    bio: "Experienced software developer with expertise in web technologies",
    status: "active",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Create mock job application
 */
export function createMockApplication(overrides?: Record<string, any>): any {
  return {
    id: generateId(),
    jobId: generateId(),
    candidateId: generateId(),
    status: "pending",
    appliedAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Create mock collaborator
 */
export function createMockCollaborator(overrides?: Record<string, any>): any {
  return {
    id: generateId(),
    user: createMockUser(),
    company: "Tech Company Inc",
    role: "recruiter",
    status: "active",
    joinedAt: new Date(Date.now() - 86400000).toISOString(),
    ...overrides,
  };
}

/**
 * Create mock pagination response
 */
export function createMockPaginationResponse<T>(
  data: T[],
  overrides?: {
    page?: number;
    pageSize?: number;
    total?: number;
  }
) {
  return {
    data,
    page: overrides?.page ?? 1,
    pageSize: overrides?.pageSize ?? 10,
    total: overrides?.total ?? data.length,
    totalPages: Math.ceil(
      (overrides?.total ?? data.length) / (overrides?.pageSize ?? 10)
    ),
  };
}

/**
 * Create multiple mock items
 */
export function createMockArray<T>(
  factory: (index: number) => T,
  count: number = 5
): T[] {
  return Array.from({ length: count }, (_, index) => factory(index));
}
