import * as ImagePicker from 'expo-image-picker';
import { AlertCircle, CheckCircle, Upload, X } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { bg } from '../../assets/css/css';
import { useFileUpload } from '../../hooks/useFileUpload';

interface FileUploadProps {
  onUploadComplete: (data: { url: string; key: string }) => void;
  folder?: string;
  label: string;
  currentUrl?: string;
  currentKey?: string;
}

interface PickedFile {
  uri: string;
  name: string;
  type: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  folder = 'products',
  label,
  currentUrl,
  currentKey,
}) => {
  const { uploadFile, uploading, uploadProgress } = useFileUpload();
  const [previewUri, setPreviewUri] = React.useState<string | undefined>(currentUrl);
  const [uploadStatus, setUploadStatus] = React.useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [fileName, setFileName] = React.useState<string>('');

  React.useEffect(() => {
    if (currentUrl) {
      setPreviewUri(currentUrl);
    }
  }, [currentUrl]);

  const pickDocument = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        setUploadStatus('error');
        setErrorMessage('Permission to access media library is required');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1,
      });

      console.log('Image picker result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        console.log('Picked image:', asset);
        
        const fileName = asset.fileName || `image_${Date.now()}.jpg`;
        setFileName(fileName);
        
        setPreviewUri(asset.uri);
        
        await handleUpload(asset.uri, fileName, asset.mimeType || 'image/jpeg');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      setUploadStatus('error');
      setErrorMessage('Failed to select file');
    }
  };

  const handleUpload = async (uri: string, name: string, mimeType: string) => {
    setUploadStatus('uploading');
    setErrorMessage('');
    console.log("Uploading file:", uri, name, mimeType);
    
    const result = await uploadFile(uri, { 
      folder, 
      fileName: name,
      mimeType
    });
    console.log("Upload result:", result);

    if (result.error) {
      setUploadStatus('error');
      setErrorMessage(result.error);
    } else if (result.url) {
      setUploadStatus('success');
      onUploadComplete({ url: result.url, key: result.key || '' });
      setTimeout(() => setUploadStatus('idle'), 2000);
    } else {
      setUploadStatus('error');
      setErrorMessage('Upload failed - no URL returned');
    }
  };

  const removeImage = () => {
    setPreviewUri(undefined);
    setFileName('');
    setUploadStatus('idle');
    onUploadComplete({ url: '', key: '' });
  };

  const getStatusColor = () => {
    if (uploadStatus === 'uploading' || uploadStatus === 'success') return '#4CAF50';
    if (uploadStatus === 'error') return '#F44336';
    return '#666';
  };

  const getStatusText = () => {
    if (uploadStatus === 'uploading') return `Uploading... ${uploadProgress}%`;
    if (uploadStatus === 'success') return 'Upload successful!';
    if (uploadStatus === 'error') return errorMessage;
    if (previewUri) return fileName || 'Click to replace';
    return `Tap to upload ${label.toLowerCase()}`;
  };

  if (previewUri) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.previewContainer}>
          <Image source={{ uri: previewUri }} style={styles.preview} />
          <TouchableOpacity style={styles.removeButton} onPress={removeImage}>
            <X size={18} color="#fff" />
          </TouchableOpacity>
        </View>
        {fileName && <Text style={styles.fileName}>{fileName}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[
          styles.uploadButton,
          uploadStatus === 'success' && styles.uploadButtonSuccess,
          uploadStatus === 'error' && styles.uploadButtonError,
        ]}
        onPress={pickDocument}
        disabled={uploadStatus === 'uploading'}
      >
        {uploadStatus === 'uploading' ? (
          <ActivityIndicator color={bg.tertiary} />
        ) : (
          <>
            {uploadStatus === 'success' ? (
              <CheckCircle size={24} color="#4CAF50" />
            ) : uploadStatus === 'error' ? (
              <AlertCircle size={24} color="#F44336" />
            ) : (
              <Upload size={24} color={bg.tertiary} />
            )}
            <Text style={[styles.uploadText, { color: getStatusColor() }]}>
              {getStatusText()}
            </Text>
          </>
        )}
      </TouchableOpacity>
      {uploadStatus === 'uploading' && (
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 8,
  },
  uploadButton: {
    backgroundColor: '#1C1D21',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2A2B30',
    borderStyle: 'dashed',
    minHeight: 100,
  },
  uploadButtonSuccess: {
    borderColor: '#4CAF50',
    backgroundColor: '#1a4CAF50',
  },
  uploadButtonError: {
    borderColor: '#F44336',
    backgroundColor: '#1aF44336',
  },
  uploadText: {
    marginTop: 8,
    fontSize: 14,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#2A2B30',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: bg.tertiary,
    borderRadius: 2,
  },
  previewContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  preview: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#1C1D21',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#F44336',
    borderRadius: 12,
    padding: 4,
  },
  fileName: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default FileUpload;
