export interface ApiResponse<T> {
  status?: number;
  message?: string;
  result: T;
}

export interface ValidationError {
  field: string;
  message: string;
}
