export type JobStatus = "DRAFT" | "OPEN" | "CLOSED";
export type WorkingType = "ONSITE" | "REMOTE" | "HYBRID";
export type RankLevel =
  | "INTERN"
  | "FRESHER"
  | "JUNIOR"
  | "MIDDLE"
  | "SENIOR"
  | "LEADER"
  | "MANAGER";
export type Currency = "USD" | "VND" | "EUR" | string;

export interface JobListResponse {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  data: JobSummary[];
}

export interface JobSummary {
  id: number;
  jobCode: string;
  title: string;
  quantity: number;
  workingType: WorkingType;
  salaryMin: number;
  salaryMax: number;
  currency: Currency;
  description: string;
  deadline: string | null;
  status: JobStatus;
  city: string | null;
  createdAt: string;
  headhunterId?: string;
  headhunterName?: string;
  companyName?: string;
  location?: string | null;
}

export interface JobDetail {
  id: number;
  jobCode: string;
  title: string;
  description: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  workingTime: string;
  location: string;
  addressDetail: string;
  experience: number;
  salaryMin: number;
  salaryMax: number;
  negotiable: boolean;
  currency: Currency;
  quantity: number;
  rankLevel: RankLevel;
  workingType: WorkingType;
  deadline: string | null;
  status: JobStatus;
  createdAt: string;
  imageUrl?: string;
  headhunterId?: string;
  headhunterName?: string;
  companyName?: string;
  companyWebsite?: string;
  companySize?: string;
  companyAddress?: string;
  skills: SkillOption[];
}

export interface SavedJob {
  jobId: number;
  title: string;
  companyName: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  currency: Currency;
  postedDate: string;
  status: JobStatus;
}

export interface SkillOption {
  id: number;
  name: string;
  category?: string;
}

export interface JobFilterParams {
  page?: number;
  size?: number;
  keyword?: string;
  location?: string;
  workingType?: WorkingType | "";
  rankLevel?: RankLevel | "";
  salaryMin?: number | "";
  salaryMax?: number | "";
  experienceMin?: number | "";
  experienceMax?: number | "";
  negotiable?: boolean;
}

export interface JobFormValues {
  title: string;
  description: string;
  rankLevel: RankLevel;
  workingType: WorkingType;
  location: string;
  addressDetail: string;
  experience: number;
  salaryMin: number;
  salaryMax: number;
  negotiable: boolean;
  currency: Currency;
  quantity: number;
  deadline: string;
  skillIds: number[];
  responsibilities: string;
  requirements: string;
  benefits: string;
  workingTime: string;
  postImage?: FileList;
}
