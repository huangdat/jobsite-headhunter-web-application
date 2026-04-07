/**
 * CV Services Exports
 * Kết nối các hàm cũ với logic mới từ CV API
 */
import { apiClient } from "@/shared/utils/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import type { CVFile, FileFormat } from "../types";

type CandidateCvResp = {
  id?: string | number;
  cvUrl?: string;
  createdAt?: string | Date;
  isVisible?: boolean;
};

const SUPPORTED_FORMATS: FileFormat[] = ["pdf", "doc", "docx", "rtf"];

const mapCandidateCvToFile = (cv: CandidateCvResp): CVFile => {
  const url = cv?.cvUrl ?? "";
  const filename = url.split("/").pop() || "resume";
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const format = SUPPORTED_FORMATS.includes(ext as FileFormat)
    ? (ext as FileFormat)
    : "pdf";

  return {
    id: String(cv?.id ?? filename),
    filename,
    fileSize: 0,
    format,
    uploadedAt: cv?.createdAt ? new Date(cv.createdAt) : new Date(),
    status: "success",
    isActive: true,
  };
};

export const fetchCVList = async () => {
  try {
    const response = await apiClient.get<{ result?: CandidateCvResp }>(
      API_ENDPOINTS.CANDIDATE.CV_LIST
    );
    const cv = response.data?.result;
    const files = cv ? [mapCandidateCvToFile(cv)] : [];
    return { success: true, data: { result: files } };
  } catch {
    return { success: false, data: { result: [] } };
  }
};

export const uploadCVFile = async (file: File) => {
  try {
    const form = new FormData();
    form.append("cvFile", file);

    const response = await apiClient.put<{ result?: CandidateCvResp }>(
      API_ENDPOINTS.CANDIDATE.CV_UPLOAD,
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    const cv = response.data?.result;
    return { success: true, file: cv ? mapCandidateCvToFile(cv) : undefined };
  } catch {
    return { success: false, error: { message: "messages.uploadFailed" } };
  }
};

export * from "./cvApi";
