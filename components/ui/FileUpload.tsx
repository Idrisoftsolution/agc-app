import React, { useRef, useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { deleteImage } from '../../service/upload';



interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  accept?: string;
  bucket:'service'|'project'|'blog';
  folder?: string;
  maxSize?: number; // in MB
  label: string;
  currentUrl?: string;
  image_key?: string
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  accept = 'image/*',
  bucket,
  folder,
  maxSize = 500,
  label,
  currentUrl,
  image_key,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, uploading, uploadProgress } = useFileUpload();

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setErrorMessage(`File size must be less than ${maxSize}MB`);
      setUploadStatus('error');
      return;
    }

    if(image_key){
      deleteImage(image_key)
    }
    

    // Reset status
    setUploadStatus('idle');
    setErrorMessage('');

    // Upload file
    const { url, error,key } = await uploadFile(file, {
      bucket,
      folder,
      fileName: `${Date.now()}-${file.name}`
    });
    

    if (error) {
      setErrorMessage(error);
      setUploadStatus('error');
    } else if (url) {
      setUploadStatus('success');
      onUploadComplete({url,key});
      setTimeout(() => setUploadStatus('idle'), 2000);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const getStatusIcon = () => {
    if (uploading) {
      return (
        <div className="animate-spin w-5 h-5 border-2 border-brand-red border-t-transparent rounded-full" />
      );
    }
    if (uploadStatus === 'success') {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    if (uploadStatus === 'error') {
      return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
    return <Upload className="w-5 h-5 text-brand-dark/60" />;
  };

  const getStatusText = () => {
    if (uploading) {
      return `Uploading... ${uploadProgress}%`;
    }
    if (uploadStatus === 'success') {
      return 'Upload successful!';
    }
    if (uploadStatus === 'error') {
      return errorMessage;
    }
    if (currentUrl) {
      return 'File uploaded - click to replace';
    }
    return `Click or drag ${label.toLowerCase()} here`;
  };

  const getStatusColor = () => {
    if (uploadStatus === 'success') return 'text-green-600';
    if (uploadStatus === 'error') return 'text-red-600';
    if (currentUrl) return 'text-green-600';
    return 'text-brand-dark/60';
  };

  return (
    <div className="space-y-2 ">
      <label className="block font-roboto-slab text-sm text-brand-dark">
        {label}
      </label>
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
          dragActive
            ? 'border-brand-red bg-brand-red/5'
            : uploadStatus === 'success'
            ? 'border-green-500 bg-green-50'
            : uploadStatus === 'error'
            ? 'border-red-500 bg-red-50'
            : currentUrl
            ? 'border-green-500 bg-green-50'
            // ? 'border-brand-red bg-brand-red/5'
            : 'border-brand-dark/20 hover:border-brand-red hover:bg-brand-red/5'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          disabled={uploading}
        />

        <div className="flex flex-col items-center space-y-2">
          {getStatusIcon()}
          <p className={`font-roboto-thin text-sm ${getStatusColor()}`}>
            {getStatusText()}
          </p>
          {!uploading && (
            <p className="font-roboto-thin text-xs text-brand-dark/40">
              Max size: {maxSize> 2000 ? "No limit" :  `${maxSize}MB`}
            </p>
          )}
        </div>

        {uploading && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-dark/10 rounded-b-lg overflow-hidden">
            <div
              className="h-full bg-brand-red transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>

      {currentUrl && (
        <div className="flex items-center justify-between p-2 bg-brand-dark/5 rounded text-xs">
          <span className="font-roboto-thin text-brand-dark/70 truncate">
            Current file uploaded
          </span>
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-red hover:text-brand-red/80 font-roboto-thin"
          >
            Preview
          </a>
        </div>
      )}
    </div>
  );
};

export default FileUpload;