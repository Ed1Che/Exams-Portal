// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import authAPI from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing authentication on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = authAPI.getCurrentUser();
        if (storedUser && authAPI.isAuthenticated()) {
          setUser(storedUser);
          
          // Optionally refresh user data from API
          try {
            const profileData = await authAPI.getProfile();
            if (profileData.success) {
              const updatedUser = { 
                ...storedUser, 
                ...profileData.data.user,
                profile: profileData.data.profile 
              };
              setUser(updatedUser);
              localStorage.setItem('user', JSON.stringify(updatedUser));
            }
          } catch (err) {
            console.error('Failed to refresh user profile:', err);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (username, password, role) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authAPI.login(username, password, role);
      
      if (response.success) {
        const userData = {
          ...response.data.user,
          profile: response.data.profile,
        };
        setUser(userData);
        return { success: true, data: userData };
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setError(null);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await authAPI.updateProfile(profileData);
      
      if (response.success) {
        // Refresh user data
        const profileResponse = await authAPI.getProfile();
        if (profileResponse.success) {
          const updatedUser = {
            ...user,
            ...profileResponse.data.user,
            profile: profileResponse.data.profile,
          };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        return { success: true };
      }
      
      throw new Error(response.error || 'Profile update failed');
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const changePassword = async (currentPassword, newPassword, confirmPassword) => {
    try {
      setError(null);
      const response = await authAPI.changePassword(
        currentPassword,
        newPassword,
        confirmPassword
      );
      
      if (response.success) {
        return { success: true, message: response.message };
      }
      
      throw new Error(response.error || 'Password change failed');
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    updateProfile,
    changePassword,
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;