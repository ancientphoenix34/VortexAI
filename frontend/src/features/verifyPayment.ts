import { api } from '../utils/axios';

export const verifyPayment = async (payload: any) => {
    try {
        const { data } = await api.post('/api/billing/verify', payload);
        return data;
    } catch (error) {
        console.error('Error verifying payment:', error);
        return [];
    }
};
