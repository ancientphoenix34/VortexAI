import { api } from '../utils/axios';

export const getConversation = async () => {
  try {
    const { data } = await api.get('/api/chat/get-conversations');
    console.log('Conversations Data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
};
