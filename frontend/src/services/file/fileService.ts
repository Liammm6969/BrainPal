import api from "../api/api";

export interface FileData {
  _id: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  createdAt: string;
  user: string;
}

export const uploadFile = async (file: File): Promise<FileData> => {
  const formData = new FormData();
  formData.append("file", file);

  // Content-Type will be set automatically by axios for FormData
  const res = await api.post<FileData>("/files/upload", formData);
  return res.data;
};

export const getUserFiles = async (): Promise<FileData[]> => {
  const res = await api.get<FileData[]>("/files");
  return res.data;
};

export const deleteFile = async (fileId: string): Promise<{ message: string }> => {
  const res = await api.delete<{ message: string }>(`/files/${fileId}`);
  return res.data;
};