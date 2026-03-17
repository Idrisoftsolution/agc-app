import axios from 'axios';

const StoreClient = axios.create({
    baseURL: `${process.env.EXPO_PUBLIC_BACKEND_API}/api/store`,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

export const createStore = async (
    storeData: {
        storeName: string;
        description?: string;
        contact?: {
            phone?: string;
            email?: string;
            whatsapp?: string;
        };
        address?: {
            line1?: string;
            line2?: string;
            city?: string;
            state?: string;
            zipCode?: string;
            country?: string;
        };
        location?: {
            type: string;
            coordinates: [number, number];
        };
        businessHours?: {
            monday?: { open?: string; close?: string; isClosed?: boolean };
            tuesday?: { open?: string; close?: string; isClosed?: boolean };
            wednesday?: { open?: string; close?: string; isClosed?: boolean };
            thursday?: { open?: string; close?: string; isClosed?: boolean };
            friday?: { open?: string; close?: string; isClosed?: boolean };
            saturday?: { open?: string; close?: string; isClosed?: boolean };
            sunday?: { open?: string; close?: string; isClosed?: boolean };
        };
        socialLinks?: {
            instagram?: string;
            facebook?: string;
            website?: string;
        };
    },
    token: string
) => {
    try {
        const response = await StoreClient.post('', storeData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
};

export const getMyStore = async (token: string) => {
    try {
        const response = await StoreClient.get('/my-store', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
};

export const updateMyStore = async (
    storeData: {
        storeName?: string;
        description?: string;
        contact?: {
            phone?: string;
            email?: string;
            whatsapp?: string;
        };
        address?: {
            line1?: string;
            line2?: string;
            city?: string;
            state?: string;
            zipCode?: string;
            country?: string;
        };
        location?: {
            type: string;
            coordinates: [number, number];
        };
        businessHours?: {
            monday?: { open?: string; close?: string; isClosed?: boolean };
            tuesday?: { open?: string; close?: string; isClosed?: boolean };
            wednesday?: { open?: string; close?: string; isClosed?: boolean };
            thursday?: { open?: string; close?: string; isClosed?: boolean };
            friday?: { open?: string; close?: string; isClosed?: boolean };
            saturday?: { open?: string; close?: string; isClosed?: boolean };
            sunday?: { open?: string; close?: string; isClosed?: boolean };
        };
        socialLinks?: {
            instagram?: string;
            facebook?: string;
            website?: string;
        };
    },
    token: string
) => {
    try {
        const response = await StoreClient.put('/my-store', storeData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
};

export const deleteMyStore = async (token: string) => {
    try {
        const response = await StoreClient.delete('/my-store', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
};

export const getAllStores = async (params?: {
    page?: number;
    limit?: number;
    city?: string;
    verified?: boolean;
}) => {
    try {
        const response = await StoreClient.get('/all', { params });
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
};

export const searchStores = async (params?: {
    q?: string;
    page?: number;
    limit?: number;
}) => {
    try {
        const response = await StoreClient.get('/search', { params });
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
};

export const getNearbyStores = async (params: {
    longitude: number;
    latitude: number;
    maxDistance?: number;
}) => {
    try {
        const response = await StoreClient.get('/nearby', { params });
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
};

export const getStoreById = async (storeId: string) => {
    try {
        const response = await StoreClient.get(`/${storeId}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
};

export const getStoreBySlug = async (storeSlug: string) => {
    try {
        const response = await StoreClient.get(`/slug/${storeSlug}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
};
