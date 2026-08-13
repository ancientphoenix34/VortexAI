import axios, { type AxiosInstance } from 'axios';

export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
});

export default api;
