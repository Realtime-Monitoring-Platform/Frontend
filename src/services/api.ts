import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:8222/api/v1';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && originalRequest) {
          // Token expired, try to refresh
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            try {
              
              const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
                refreshToken,
              });
              const { accessToken } = response.data;
              localStorage.setItem('accessToken', accessToken);
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              }
              return this.client(originalRequest);
            } catch {
              // Refresh failed, redirect to login
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              window.location.href = '/auth/authenticate';
            }
          } else {
            // No refresh token, redirect to login
            window.location.href = '/auth/authenticate';
          }
        }

        // Show error toast
        const message = this.getErrorMessage(error);
        toast.error(message);

        return Promise.reject(error);
      }
    );
  }

  private getErrorMessage(error: AxiosError): string {
    if (error.response?.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
      return (error.response.data as { message: string }).message;
    }

    if (error.message) {
      return error.message;
    }

    return 'An unexpected error occurred';
  }

  public getClient(): AxiosInstance {
    return this.client;
  }
}

export const apiService = new ApiService();
export const api = apiService.getClient();