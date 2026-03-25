import axios from 'axios';

// export const singleUpload = async (
//   uri: string, 
//   fileName: string, 
//   mimeType: string, 
//   folder: string
// ) => {
//   const url = `${process.env.EXPO_PUBLIC_BACKEND_API}/v1/upload/single`;
  
//   const formData = new FormData();
//   formData.append('file', {
//     uri: uri,
//     type: mimeType || 'image/jpeg',
//     name: fileName
//   } as any);
//   formData.append('folder', folder);
  
//   const config ={
//     headers:{
//       "Content-Type":"multipart/form-data",
//     },
//     withCredentials:true
//   }
//   const response = await axios.post(url, formData, config);
  
//   return response.data;
// };

import { Platform } from 'react-native';

export const singleUpload = async (
  uri: string, 
  fileName: string, 
  mimeType: string, 
  folder: string
) => {
  const url = `${process.env.EXPO_PUBLIC_BACKEND_API}/v1/upload/single`;
  const formData = new FormData();

  if (uri.startsWith('blob:')) {
    // ✅ WEB FIX: Convert blob URI to actual File object
    const response = await fetch(uri);
    const blob = await response.blob();
    formData.append('file', blob, fileName);
  } else {
    // ✅ NATIVE FIX: Use the special object structure
    formData.append('file', {
      uri: uri,
      type: mimeType || 'image/jpeg',
      name: fileName || 'upload.jpg',
    } as any);
  }

  formData.append('folder', folder);

  const response = await axios.post(url, formData, {
    headers: {
      'Accept': 'application/json',
      // Let Axios handle the Content-Type for both Web and Native
    },
    withCredentials: true
  });

  return response.data;
};

export const deleteImage = async (key: string) => {
  const url = `${process.env.EXPO_PUBLIC_BACKEND_API}/v1/upload/delete/${encodeURIComponent(key)}`;
  
  const response = await axios.delete(url, { withCredentials: true });
  return response.data;
};
