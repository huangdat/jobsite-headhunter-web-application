/**
 * CV Services Exports
 * Kết nối các hàm cũ với logic mới từ profileApi
 */
import { profileApi } from "../../profile/services/profileApi";
import type { CVFile } from "../types";

export const fetchCVList = async () => {
  try {
    const data = await profileApi.fetchCVs();
    // Cast API response to CVFile array (adapter pattern)
    // Note: profileApi.fetchCVs() returns { id, cvUrl } but we need full CVFile
    return { success: true, data: data as unknown as CVFile[] };
  } catch {
    return { success: false, data: [] };
  }
};

export const uploadCVFile = async (file: File) => {
  try {
    const url = await profileApi.uploadCV(file);
    return { success: true, file: { cvUrl: url, id: Date.now() } };
  } catch {
    return { success: false, error: { message: "Upload failed" } };
  }
};

export * from "./cvApi";
