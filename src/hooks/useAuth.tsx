import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, LoginRequest, LoginResponse } from '@/types';
import { api } from '../services/api';
import { useCookies } from 'react-cookie';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(['refresh_Token', 'access_Token']);


  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data);
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
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
      const { access_token, refresh_token } = response.data;
      console.log('Login successful:', response.data);
      //cookieStore.setItem('accessToken', access_token);
      setCookie('access_Token', access_token, { path: '/' });
      setCookie('refresh_Token', refresh_token, { path: '/' });
      localStorage.setItem('refreshToken', refresh_token);

      // Fetch user info after login
      // try {
      //   const userResponse = await api.get('/auth/me');
      //   setUser(userResponse.data);
      // } catch {
      //   // If /auth/me doesn't exist, create a basic user from the login response
      //   setUser({
      //     id: '',
      //     username: credentials.email,
      //     email: credentials.email,
      //     firstName: credentials.email,
      //     lastName: '',
      //     status: 'ACTIVE',
      //     roles: [],
      //     teams: [],
      //     createdAt: new Date().toISOString(),
      //     updatedAt: new Date().toISOString(),
      //     mustChangePassword: false,
      //   } as User);
      // }

      toast.success(`Welcome back!`);
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return user.roles.some((r) => r.name === role);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.roles.some((role) =>
      role.permissions.some((p) => p.name === permission)
    );
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
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