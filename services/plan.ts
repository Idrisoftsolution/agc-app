import axios from 'axios';

const PlanClient = axios.create({
    baseURL: `${process.env.EXPO_PUBLIC_BACKEND_API}/api/plan`,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

export const getAllPlans = async () => {
    try {
        const response = await PlanClient.get('/all');
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
};

export const getUserPlans = async () => {
    try {
        const response = await PlanClient.get('/user-plans');
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
};

export const getStorePlans = async () => {
    try {
        const response = await PlanClient.get('/store-plans');
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
};

export const getPlanById = async (planId: string) => {
    try {
        const response = await PlanClient.get(`/${planId}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
};

export const subscribeToPlan = async (
    planId: string,
    duration: 'monthly' | 'quarterly',
    token: string
) => {
    try {
        const response = await PlanClient.post('/subscribe', { planId, duration }, {
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

export const verifyPayment = async (
    paymentData: {
        razorpayPaymentId: string;
        razorpaySubscriptionId?: string;
        razorpayOrderId?: string;
    },
    token: string
) => {
    try {
        const response = await PlanClient.post('/verify-payment', paymentData, {
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

export const getMySubscription = async (token: string) => {
    try {
        const response = await PlanClient.get('/my-subscription', {
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

export const cancelSubscription = async (subscriptionId: string, token: string) => {
    try {
        const response = await PlanClient.post(`/cancel/${subscriptionId}`, {}, {
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

export const checkScanLimit = async (token: string) => {
    try {
        const response = await PlanClient.post('/check-scan-limit', {}, {
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

export const recordScan = async (token: string) => {
    try {
        const response = await PlanClient.post('/record-scan', {}, {
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

export const checkUploadLimit = async (token: string) => {
    try {
        const response = await PlanClient.post('/check-upload-limit', {}, {
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

export const recordUpload = async (token: string) => {
    try {
        const response = await PlanClient.post('/record-upload', {}, {
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

export const getStoreAnalytics = async (token: string) => {
    try {
        const response = await PlanClient.get('/store-analytics', {
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

export const handleWebhook = async (webhookData: any) => {
    try {
        const response = await PlanClient.post('/webhook', webhookData);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
};
