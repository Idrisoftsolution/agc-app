import axios from 'axios';

const ProductClient = axios.create({
    baseURL: `${process.env.EXPO_PUBLIC_BACKEND_API}/api/product`,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

export const getAllProducts = async () => {
    try {
        const response = await ProductClient.get('/all');
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
};

export const getProductById = async (id: string) => {
    try {
        const response = await ProductClient.get(`/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
};

export const getProductBySlug = async (slug: string) => {
    try {
        const response = await ProductClient.get(`/slug/${slug}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
};

export const getProductsByCatalogue = async (catalogue: string) => {
    try {
        const response = await ProductClient.get(`/catalogue/${catalogue}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
};

export const getProductsByMaterial = async (material: string) => {
    try {
        const response = await ProductClient.get(`/material/${material}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
};

export const getProductsByUserId = async (userId: string) => {
    try {
        const response = await ProductClient.get(`/user/${userId}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
};

export const addProduct = async (productData: {
    name: string;
    slug: string;
    catalogue: string;
    material: string;
    price: number;
    stock?: number;
    description?: string;
    tags?: string[];
    image: {
        source: string;
        key: string;
    };
}, token: string) => {
    try {
        const response = await ProductClient.post('/add', productData, {
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

export const updateProduct = async (id: string, data: {
    name?: string;
    slug?: string;
    catalogue?: string;
    material?: string;
    price?: number;
    stock?: number;
    description?: string;
    tags?: string[];
    image?: {
        source: string;
        key: string;
    };
}, token: string) => {
    try {
        const response = await ProductClient.put('/update', { id, data }, {
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

export const deleteProduct = async (id: string, token: string) => {
    try {
        const response = await ProductClient.delete(`/${id}`, {
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
