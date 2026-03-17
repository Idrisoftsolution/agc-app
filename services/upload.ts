import axios, { AxiosInstance } from "axios";

const uploadClient: AxiosInstance = axios.create({
  baseURL:import.meta.env.VITE_NODE_ENV=="production" ? import.meta.env.VITE_API_LIVE_SERVER+"/upload" : import.meta.env.VITE_API_SERVER +"/upload",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials:true
});


export const singleUpload =async (data)=>{
    const response = await uploadClient.post("/single",data,{
        headers:{
            "Content-Type":"multipart/form-data",
        }
    });
    return response.data
}

export const deleteImage =async (key)=>{
    const response = await uploadClient.delete(`/delete/${encodeURIComponent(key)}`); // you are passing post request but backend asks for delete method right check apis properly
    return response.data;
}