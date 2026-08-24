import { api } from '../utils/axios';

export const createOrder = async (plan: any) => {
    try {
        const { data } = await api.post('/api/billing/create', {plan});
        return data;
    } catch (error) {
        console.error('Error creating order:', error);
        return [];
    }
};
