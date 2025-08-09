import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  // Banking App Context states
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
  
  // Authentication states
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Banking specific states
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);

  // Account states
  const [accountTypes, setAccountTypes] = useState({});
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Clear error function
  const clearError = () => setError(null);

  // Set auth token in headers
  const getAuthHeaders = () => {
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  };

  // Authentication methods for user
  const login = async (loginData) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.post(`${backendUrl}/api/client/login`, loginData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (data.success) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUserData(data.client);
        setIsAuthenticated(true);
        
        toast.success(data.message || 'Login successful');
        return {
          success: true,
          message: data.message,
          user: data.client
        };
      } else {
        throw new Error(data.message || 'Login failed');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Authentication methods for user
  const register = async (signupData) => {
    try {
      setLoading(true);
      setError(null);

      // The signupData now comes properly formatted from the Login component
      const backendData = signupData;

      const { data } = await axios.post(`${backendUrl}/api/client/register`, backendData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (data.success) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUserData(data.client);
        setIsAuthenticated(true);
        
        toast.success(data.message || 'Registration successful');
        return {
          success: true,
          message: data.message,
          user: data.client
        };
      } else {
        throw new Error(data.message || 'Registration failed');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };
  
  // Authentication methods for user
  const logout = async () => {
    try {
      setLoading(true);

      // Call backend logout if token exists
      if (token) {
        try {
          await axios.post(`${backendUrl}/api/client/logout`, {}, {
            headers: getAuthHeaders(),
          });
        } catch (logoutError) {
          console.warn('Logout API call failed:', logoutError);
        }
      }

      // Clear local storage and state
      localStorage.removeItem('token');
      setToken('');
      setUserData(false);
      setIsAuthenticated(false);
      setError(null);
      setAccounts([]);
      setTransactions([]);
      setBalance(0);
      setSelectedAccount(null);
      setAccountTypes({});

      toast.success('Logged out successfully');
      return {
        success: true,
        message: 'Logged out successfully'
      };

    } catch (err) {
      console.error('Logout error:', err);
      // Clear local state even if backend call fails
      localStorage.removeItem('token');
      setToken('');
      setUserData(false);
      setIsAuthenticated(false);
      
      return {
        success: true,
        message: 'Logged out successfully'
      };
    } finally {
      setLoading(false);
    }
  };

  // Load user profile data
  const loadUserProfileData = async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.get(`${backendUrl}/api/client/profile`, {
        headers: getAuthHeaders(),
      });

      if (data.success) {
        setUserData(data.client);
        setIsAuthenticated(true);
        return {
          success: true,
          user: data.client
        };
      } else {
        if (data.status === 401) {
          // Token expired or invalid
          logout();
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.message || 'Failed to fetch profile');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch profile';
      setError(errorMessage);
      
      if (err.response?.status === 401) {
        logout();
      }
      
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.put(`${backendUrl}/api/client/profile`, profileData, {
        headers: getAuthHeaders(),
      });

      if (data.success) {
        setUserData(data.client);
        toast.success(data.message || 'Profile updated successfully');
        return {
          success: true,
          message: data.message,
          user: data.client
        };
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile';
      setError(errorMessage);
      toast.error(errorMessage);
      
      if (err.response?.status === 401) {
        logout();
      }
      
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Upload profile image
  const uploadProfileImage = async (imageFile) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('image', imageFile);

      const { data } = await axios.post(`${backendUrl}/api/client/upload-image`, formData, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        },
      });

      if (data.success) {
        setUserData(data.client);
        toast.success(data.message || 'Profile image updated successfully');
        return {
          success: true,
          message: data.message,
          imageUrl: data.imageUrl,
          user: data.client
        };
      } else {
        throw new Error(data.message || 'Failed to upload image');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to upload image';
      setError(errorMessage);
      toast.error(errorMessage);
      
      if (err.response?.status === 401) {
        logout();
      }
      
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.put(`${backendUrl}/api/client/change-password`, passwordData, {
        headers: getAuthHeaders(),
      });

      if (data.success) {
        toast.success(data.message || 'Password changed successfully');
        return {
          success: true,
          message: data.message
        };
      } else {
        throw new Error(data.message || 'Failed to change password');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to change password';
      setError(errorMessage);
      toast.error(errorMessage);
      
      if (err.response?.status === 401) {
        logout();
      }
      
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Account Management Methods

  // Create new account
  const createAccount = async (accountData) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.post(`${backendUrl}/api/account/create`, accountData, {
        headers: getAuthHeaders(),
      });

      if (data.success) {
        // Refresh accounts list
        await getMyAccounts();
        toast.success(data.message || 'Account created successfully');
        return {
          success: true,
          message: data.message,
          account: data.account
        };
      } else {
        throw new Error(data.message || 'Failed to create account');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create account';
      setError(errorMessage);
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Get all user accounts
  const getMyAccounts = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.get(`${backendUrl}/api/account/my-accounts`, {
        headers: getAuthHeaders(),
      });

      if (data.success) {
        setAccounts(data.accounts);
        return {
          success: true,
          accounts: data.accounts
        };
      } else {
        throw new Error(data.message || 'Failed to fetch accounts');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch accounts';
      setError(errorMessage);
      if (err.response?.status !== 401) {
        toast.error(errorMessage);
      }
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, [token, backendUrl]);

  // Get specific account details
  const getAccountDetails = async (accountNumber) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.get(`${backendUrl}/api/account/details/${accountNumber}`, {
        headers: getAuthHeaders(),
      });

      if (data.success) {
        setSelectedAccount(data.account);
        return {
          success: true,
          account: data.account
        };
      } else {
        throw new Error(data.message || 'Failed to fetch account details');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch account details';
      setError(errorMessage);
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Update account status
  const updateAccountStatus = async (accountId, status) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.put(`${backendUrl}/api/account/status/${accountId}`, 
        { status }, 
        {
          headers: getAuthHeaders(),
        }
      );

      if (data.success) {
        // Refresh accounts list
        await getMyAccounts();
        toast.success(data.message || 'Account status updated successfully');
        return {
          success: true,
          message: data.message,
          account: data.account
        };
      } else {
        throw new Error(data.message || 'Failed to update account status');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update account status';
      setError(errorMessage);
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Get account types and their features
  const getAccountTypes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.get(`${backendUrl}/api/account/types`);

      if (data.success) {
        setAccountTypes(data.accountTypes);
        return {
          success: true,
          accountTypes: data.accountTypes
        };
      } else {
        throw new Error(data.message || 'Failed to fetch account types');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch account types';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  // Close account
  const closeAccount = async (accountId) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.delete(`${backendUrl}/api/account/close/${accountId}`, {
        headers: getAuthHeaders(),
      });

      if (data.success) {
        // Refresh accounts list
        await getMyAccounts();
        toast.success(data.message || 'Account closed successfully');
        return {
          success: true,
          message: data.message,
          account: data.account
        };
      } else {
        throw new Error(data.message || 'Failed to close account');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to close account';
      setError(errorMessage);
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Legacy methods for backward compatibility
  const getUserAccounts = getMyAccounts;

  const getUserTransactions = useCallback(async (params = {}) => {
    if (!token) return;

    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 20,
        ...params
      });

      // Placeholder for future transaction fetching API
      const { data } = await axios.get(`${backendUrl}/api/client/transactions?${queryParams}`, {
        headers: getAuthHeaders(),
      });

      if (data.success) {
        setTransactions(data.transactions);
        return data;
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [token, backendUrl]);

  const getUserBalance = useCallback(async () => {
    if (!token) return;

    try {
      // Placeholder for future balance fetching API
      const { data } = await axios.get(`${backendUrl}/api/client/balance`, {
        headers: getAuthHeaders(),
      });

      if (data.success) {
        setBalance(data.balance);
        return data.balance;
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch balance');
    }
  }, [token, backendUrl]);

  // Utility methods
  const getAccountByNumber = (accountNumber) => {
    return accounts.find(account => account.accountNumber === accountNumber);
  };

  const getAccountsByType = (accountType) => {
    return accounts.filter(account => account.accountType === accountType);
  };

  const getTotalBalance = () => {
    return accounts.reduce((total, account) => total + (account.balance || 0), 0);
  };

  const canCreateAccountType = (accountType) => {
    const existingAccount = accounts.find(
      account => account.accountType === accountType && account.status !== 'Closed'
    );
    return !existingAccount;
  };

  // Check authentication on app load
  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
      setIsAuthenticated(false);
    }
  }, [token]);

  // Context value
  const contextValue = {
    // Basic app values
    currencySymbol,
    backendUrl,

    // Authentication states
    token,
    setToken,
    userData,
    setUserData,
    isAuthenticated,
    loading,
    error,

    // Authentication methods
    login,
    register,
    logout,
    loadUserProfileData,
    updateUserProfile,
    uploadProfileImage,
    changePassword,
    clearError,

    // Banking specific states
    accounts,
    transactions,
    balance,
    accountTypes,
    selectedAccount,

    // Account management methods
    createAccount,
    getMyAccounts,
    getAccountDetails,
    updateAccountStatus,
    getAccountTypes,
    closeAccount,

    // Legacy methods for backward compatibility
    getUserAccounts,
    getUserTransactions,
    getUserBalance,

    // Utility methods
    getAccountByNumber,
    getAccountsByType,
    getTotalBalance,
    canCreateAccountType,

    // State setters
    setError,
    setSelectedAccount,
    setAccounts
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;