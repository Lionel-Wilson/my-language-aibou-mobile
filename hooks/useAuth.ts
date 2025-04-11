import { useState, useEffect, useCallback } from 'react';
import { router } from 'expo-router';
import { User } from '@/types/auth';
import { getAuthToken, getUser, storeAuthData, clearAuthData, updateStoredUser } from '@/utils/auth';
import { apiRequest, endpoints } from '@/utils/api';
import {RegisterResponse} from "@/types/api/register";
import {LoginResponse} from "@/types/api/login";
import {StatusResponse} from "@/types/api/subscription";
import {UpdateDetailsResponse} from "@/types/api/updatedetails";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const userData = await getUser();
      if (userData) {
        setUser(userData);
      }
    } catch (err) {
      console.error('Error loading user:', err);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await apiRequest(endpoints.register, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      const data: RegisterResponse = await response.json();
      await storeAuthData(data.token, data.userDetails);
      setUser(data.userDetails);
      router.replace('/(tabs)');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await apiRequest(endpoints.login, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      const data: LoginResponse = await response.json();
      await storeAuthData(data.token, data.userDetails);
      setUser(data.userDetails);
      router.replace('/(tabs)');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    }
  };

  const logout = async () => {
    await clearAuthData();
    setUser(null);
    router.replace('/login');
  };

  const updateEmail = async (newEmail: string) => {
    try {
      setError(null);
      const response = await apiRequest(endpoints.updateUser, {
        method: 'POST',
        body: JSON.stringify({ email: newEmail }),
        requiresAuth: true,
      });
      
      const resp:UpdateDetailsResponse = await response.json();

      const updatedUser: User = {
        ...user!,
        email: resp.userDetails.email,
      };

      await updateStoredUser(updatedUser);
      setUser(updatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update email');
      throw err;
    }
  };

  const deleteAccount = async () => {
    try {
      setError(null);
      await apiRequest(endpoints.deleteUser, {
        method: 'DELETE',
        requiresAuth: true,
      });
      
      await clearAuthData();
      setUser(null);
      router.replace('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
      throw err;
    }
  };

  const checkSubscriptionStatus = useCallback(async () => {
    try {
      const response = await apiRequest(endpoints.subscriptionStatus, {
        method: 'GET',
        requiresAuth: true,
      });

      const status: StatusResponse = await response.json();
      if (user) {
        const updatedUser = { ...user, ...status };
        await updateStoredUser(updatedUser);
        setUser(updatedUser);
      }
      return status;
    } catch (err) {
      console.error('Error checking subscription status:', err);
      throw err;
    }
  }, [user]);

  // ✅ Step 2: Polling effect — check subscription every hour
  useEffect(() => {
    const ONE_HOUR = 60 * 60 * 1000;

    const interval = setInterval(() => {
      if (user) {
        checkSubscriptionStatus();
      }
    }, ONE_HOUR);

    // Clean up on unmount
    return () => clearInterval(interval);
  }, [user, checkSubscriptionStatus]);

  return {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateEmail,
    deleteAccount,
    checkSubscriptionStatus,
  };
}