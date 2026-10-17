import instance from "@/lib/axios/instance";

export interface UploadResponse {
  status: boolean;
  url: string;
  public_id: string;
  original_filename?: string;
  bytes?: number;
  format?: string;
  message?: string;
}

export const uploadServices = {
  uploadFile: (file: File, folder?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    if (folder) formData.append("folder", folder);

    return instance.post<UploadResponse>("/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
