import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, LoginRequest, LoginResponse } from '@/types';
import { api } from '../services/api';
import { useCookies } from 'react-cookie';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isFirstLogin: boolean;
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => void;
  completeFirstLogin: () => void;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [, setCookie] = useCookies(['refresh_Token', 'access_token']);


  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await api.get('/auth/me');
          console.log('Fetched user data:', response.data);
          setUser(response.data);
        } catch {
         // localStorage.removeItem('access_token');
          //localStorage.removeItem('refresh_token');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await api.post<LoginResponse>('/auth/authenticate', {
        email: credentials.email,
        password: credentials.password,
      });
      const { access_token, refresh_token, first_login } = response.data;
      console.log('Login successful:', response.data);
      setCookie('access_token', access_token, { path: '/' });
      setCookie('refresh_Token', refresh_token, { path: '/' });
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      setIsFirstLogin(first_login === true);

      toast.success(`Welcome back!`);
      return first_login === true;
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      throw error;
    }
  };

  const completeFirstLogin = () => {
    setIsFirstLogin(false);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsFirstLogin(false);
    toast.success('Logged out successfully');
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    const roleName = typeof user.role === 'string' ? user.role : user.role?.name;
    return roleName === role;
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return (user.permissions ?? []).includes(permission);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
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
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};