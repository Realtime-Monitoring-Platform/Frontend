import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:8222/api/v1';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      //authorization: `Bearer ${localStorage.getItem('access_token')}`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('access_token');
        console.log('Request interceptor - Authorization header:', token);
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
          const refresh_Token = localStorage.getItem('refresh_Token');
          if (refresh_Token) {
            try {

              const response = await axios.post(`'http://localhost:8222/api/v1/auth/refresh-token`, {
                refresh_Token,
              });
              const { access_token } = response.data;
              localStorage.setItem('access_token', access_token);
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${access_token}`;
              }
              return this.client(originalRequest);
            } catch {
              // Refresh failed, redirect to login
           //   localStorage.removeItem('access_token');
             // localStorage.removeItem('refresh_Token');
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