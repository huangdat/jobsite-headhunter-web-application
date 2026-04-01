/**
 * CV Services Exports
 * Kết nối các hàm cũ với logic mới từ profileApi
 */
import { profileApi } from "../../profile/services/profileApi";

export const fetchCVList = async () => {
  try {
    const data = await profileApi.fetchCVs();
    return { success: true, data: { result: data } };
  } catch (error) {
    return { success: false, data: { result: [] } };
  }
};

export const uploadCVFile = async (file: File) => {
  try {
    const url = await profileApi.uploadCV(file);
    return { success: true, file: { cvUrl: url, id: Date.now() } };
  } catch (error) {
    return { success: false, error: { message: "Upload failed" } };
  }
};

export * from "./cvApi";
