import { api } from '../utils/axios';

export const sendMessage = async (payload: any) => {
  try {
    const { data } = await api.post('/api/agent/chat', payload);
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
  }
};
