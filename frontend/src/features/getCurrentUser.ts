import { api } from '../utils/axios';
import type { CurrentUser } from '../types/auth';

export const getCurrentUser = async (): Promise<CurrentUser | undefined> => {
  try {
    const response = await api.get<CurrentUser>('/api/me');
    const data: CurrentUser = response.data;
    return data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};


