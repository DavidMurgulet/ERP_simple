import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(false); // Add auth operation loading state

  // Check if user is authenticated on app startup
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const response = await authAPI.getCurrentUser();
        setUser(response.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setAuthLoading(true);
    const startTime = Date.now();
    
    try {
      const response = await authAPI.login(credentials);
      const { access, refresh, user: userData } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.non_field_errors?.[0] || 
               error.response?.data?.message || 
               'Invalid credentials'
      };
    } finally {
      // Ensure loading screen shows for at least 3 seconds
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 3000 - elapsedTime);
      
      setTimeout(() => {
        setAuthLoading(false);
      }, remainingTime);
    }
  };

  const register = async (userData) => {
    setAuthLoading(true);
    const startTime = Date.now();
    
    try {
      console.log('Registering user with data:', userData); // Debug log
      const response = await authAPI.register(userData);
      const { access, refresh, user: newUser } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setUser(newUser);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      console.error('Error response:', error.response); // More detailed error logging
      
      // Extract specific error messages
      let errorMessage = 'Registration failed';
      if (error.response?.data) {
        const data = error.response.data;
        if (data.non_field_errors) {
          errorMessage = data.non_field_errors[0];
        } else if (data.message) {
          errorMessage = data.message;
        } else if (typeof data === 'object') {
          // Handle field-specific errors
          const firstError = Object.values(data)[0];
          if (Array.isArray(firstError)) {
            errorMessage = firstError[0];
          } else if (typeof firstError === 'string') {
            errorMessage = firstError;
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    } finally {
      // Ensure loading screen shows for at least 3 seconds
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 3000 - elapsedTime);
      
      setTimeout(() => {
        setAuthLoading(false);
      }, remainingTime);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    authLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
