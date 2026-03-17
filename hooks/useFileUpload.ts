import { singleUpload } from '@/service/upload';
import { useState } from 'react';

interface UploadOptions {
  bucket: 'service'|'project'|'blog';
  folder?: string;
  fileName?: string;
}

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = async (
    file: File,
    options: UploadOptions
  ): Promise<{ url: string | null; error: string | null }> => {
    try {
      setUploading(true);
      setUploadProgress(0);



      // Generate unique filename if not provided
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = options.fileName || `${timestamp}.${fileExt}`;

      // Construct file path
      const filePath = options.folder
        ? `${options.folder}/${fileName}`
        : fileName;

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder',options.folder );
      const response = await singleUpload(formData);
      console.log(response)
      clearInterval(progressInterval);


      setUploadProgress(100);
      // console.log(response.url)
      return { url: response.url, error: null,key:response.key };

    } catch (error: any) {
      console.error('Upload error:', error);
      return { url: null, error: error.message };
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const deleteFile = async (
    bucket: string,
    filePath: string
  ): Promise<{ success: boolean; error: string | null }> => {
    try {
    

      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const getFileUrl = (bucket: string, filePath: string): string => {
    return "";
  };

  return {
    uploadFile,
    deleteFile,
    getFileUrl,
    uploading,
    uploadProgress
  };
};