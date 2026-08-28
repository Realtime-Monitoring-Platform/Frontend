import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { toast } from 'react-hot-toast';

import { User, LoginRequest, LoginResponse } from '@/types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isFirstLogin: boolean;
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  logout: () => void;
  completeFirstLogin: () => void;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [, setCookie] = useCookies(['access_token', 'refresh_Token']);

  const [isFirstLogin, setIsFirstLogin] = useState(false);

  /**
   * Get token before executing the query.
   */
  const token = localStorage.getItem('access_token');

  /**
   * Configure Authorization header when token exists.
   */
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  /**
   * Fetch current authenticated user.
   */
  const {
    data: user = null,
    isLoading,
    isError,
  } = useQuery<User>({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const { data } = await api.get<User>('/auth/me');

      console.log('Fetched user data:', data);

      return data;
    },
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  /**
   * If /auth/me fails, the token is probably invalid/expired.
   */
  useEffect(() => {
    if (isError) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      delete api.defaults.headers.common['Authorization'];

      queryClient.removeQueries({
        queryKey: ['auth', 'me'],
      });
    }
  }, [isError, queryClient]);

  const login = async (
    credentials: LoginRequest
  ): Promise<LoginResponse> => {
    try {
      const { data } = await api.post<LoginResponse>(
        '/auth/authenticate',
        {
          email: credentials.email,
          password: credentials.password,
        }
      );

      const {
        access_token,
        refresh_token,
        first_login,
      } = data;

      console.log('Login successful:', data);

      /**
       * Save tokens.
       */
      setCookie('access_token', access_token, {
        path: '/',
      });

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      /**
       * Update axios immediately.
       */
      api.defaults.headers.common['Authorization'] =
        `Bearer ${access_token}`;

      setIsFirstLogin(first_login === true);

      /**
       * Fetch /auth/me again after login.
       */
      await queryClient.invalidateQueries({
        queryKey: ['auth', 'me'],
      });

      toast.success(
        first_login
          ? 'Welcome! Please complete your profile.'
          : 'Welcome back!'
      );

      navigate('/dashboard');

      return data;
    } catch (error) {
      toast.error(
        'Login failed. Please check your credentials.'
      );

      throw error;
    }
  };

  const completeFirstLogin = () => {
    setIsFirstLogin(false);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    setCookie('access_token', '', {
      path: '/',
      maxAge: 0,
    });

    delete api.defaults.headers.common['Authorization'];

    /**
     * Remove authenticated user from React Query cache.
     */
    queryClient.removeQueries({
      queryKey: ['auth', 'me'],
    });

    setIsFirstLogin(false);

    toast.success('Logged out successfully');

    navigate('/login');
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;

    const roleName =
      typeof user.role === 'string'
        ? user.role
        : user.role?.name;

    return roleName === role;
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    return (user.permissions ?? []).includes(permission);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading: !!token && isLoading,
    isFirstLogin,
    login,
    logout,
    completeFirstLogin,
    hasRole,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
};