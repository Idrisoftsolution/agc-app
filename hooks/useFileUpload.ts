import { useState } from 'react';
import { singleUpload } from '../services/upload';

interface UploadOptions {
  folder?: string;
  fileName?: string;
  mimeType?: string;
}

interface UploadResult {
  url: string | null;
  key: string | null;
  error: string | null;
}

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = async (uri: string, options: UploadOptions = {}): Promise<UploadResult> => {
    console.log("=== UPLOAD DEBUG ===");
    console.log("URI:", uri);
    console.log("FileName:", options.fileName);
    console.log("MimeType:", options.mimeType);
    console.log("Folder:", options.folder);
    
    try {
      setUploading(true);
      setUploadProgress(0);

      const fileName = options.fileName || `${Date.now()}.jpg`;
      const mimeType = options.mimeType || 'image/jpeg';
      const folder = options.folder || 'products';

      console.log("Making upload request...");
      const response: any = await singleUpload(uri, fileName, mimeType, folder);
      
      setUploadProgress(100);

      if (response && response.url) {
        return { url: response.url, key: response.key || null, error: null };
      } else {
        return { url: null, key: null, error: response?.error || 'Upload failed' };
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      return { url: null, key: null, error: error.message || 'Upload failed' };
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const deleteFile = async (key: string): Promise<{ success: boolean; error: string | null }> => {
    try {
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return {
    uploadFile,
    deleteFile,
    uploading,
    uploadProgress
  };
};
