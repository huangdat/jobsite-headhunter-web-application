/**
 * FormData Builder Utility
 * Provides helper functions for constructing FormData objects
 * Eliminates code duplication across API services
 */

export interface FormDataEntry {
  key: string;
  value: string | number | boolean | File | undefined | null;
}

/**
 * Append a field to FormData with type-safe handling
 */
export const appendFormField = (
  formData: FormData,
  key: string,
  value: string | number | boolean | File | undefined | null
): void => {
  if (value === undefined || value === null) {
    return;
  }

  if (typeof value === "boolean") {
    formData.append(key, String(value));
  } else if (typeof value === "number") {
    formData.append(key, String(value));
  } else {
    formData.append(key, value);
  }
};

/**
 * Append string field to FormData
 */
export const appendString = (
  formData: FormData,
  key: string,
  value?: string
): void => {
  if (value) {
    formData.append(key, value);
  }
};

/**
 * Append number field to FormData
 */
export const appendNumber = (
  formData: FormData,
  key: string,
  value?: number
): void => {
  if (value !== undefined && value !== null) {
    formData.append(key, String(value));
  }
};

/**
 * Append boolean field to FormData as string
 */
export const appendBoolean = (
  formData: FormData,
  key: string,
  value?: boolean
): void => {
  if (value !== undefined && value !== null) {
    formData.append(key, String(value));
  }
};

/**
 * Append file field to FormData
 */
export const appendFile = (
  formData: FormData,
  key: string,
  file?: File
): void => {
  if (file) {
    formData.append(key, file);
  }
};

/**
 * Append array of files (for multiple file upload)
 */
export const appendFiles = (
  formData: FormData,
  key: string,
  files?: File[] | FileList
): void => {
  if (files && files.length > 0) {
    for (const file of files) {
      formData.append(key, file);
    }
  }
};

/**
 * Append array items with index notation for backend (e.g., "items[0]", "items[1]")
 */
export const appendArrayItems = (
  formData: FormData,
  key: string,
  items?: (string | number)[]
): void => {
  if (items && items.length > 0) {
    items.forEach((item) => {
      formData.append(`${key}[]`, String(item));
    });
  }
};

/**
 * Append indexed documents/files (e.g., "documents[0]", "documents[1]")
 * Used for multi-document uploads
 */
export const appendIndexedFiles = (
  formData: FormData,
  baseKey: string,
  files?: File[]
): void => {
  if (files && files.length > 0) {
    files.forEach((file, index) => {
      formData.append(`${baseKey}[${index}]`, file);
    });
  }
};

/**
 * Create FormData from object (shallow level)
 * @example
 * const formData = buildFormData({
 *   username: "john",
 *   email: "john@example.com",
 *   age: 30
 * });
 */
export const buildFormData = (
  data: Record<string, FormDataEntry["value"]>
): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    appendFormField(formData, key, value);
  });

  return formData;
};

/**
 * Merge multiple FormData objects
 */
export const mergeFormData = (...formDataList: FormData[]): FormData => {
  const merged = new FormData();

  formDataList.forEach((fd) => {
    fd.forEach((value, key) => {
      merged.append(key, value);
    });
  });

  return merged;
};
