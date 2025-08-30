import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  // Banking App Context states
  const currencySymbol = "$";
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "https://bankmanagementsystem-backend.onrender.com";

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

  // FD specific states
  const [fixedDeposits, setFixedDeposits] = useState([]);
  const [fdPlans, setFDPlans] = useState({});
  const [selectedFD, setSelectedFD] = useState(null);
  const [fdSummary, setFDSummary] = useState({});

  // Clear error function
  const clearError = () => setError(null);

  // Set auth token in headers
  const getAuthHeaders = () => {
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // Replace these functions (around lines 55-67):
  const setLoadingState = (state) => {
    setLoading(state);
  };

  const getLoadingState = () => {
    return loading;
  };

  const getHeaders = () => {
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // Authentication methods for user
  const login = async (loginData) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.post(
        `${backendUrl}/api/client/login`,
        loginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        // Store token and user data
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUserData(data.client);
        setIsAuthenticated(true);

        toast.success(data.message || "Login successful");
        return {
          success: true,
          message: data.message,
          user: data.client,
        };
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage,
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

      const { data } = await axios.post(
        `${backendUrl}/api/client/register`,
        backendData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        // Store token and user data
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUserData(data.client);
        setIsAuthenticated(true);

        toast.success(data.message || "Registration successful");
        return {
          success: true,
          message: data.message,
          user: data.client,
        };
      } else {
        throw new Error(data.message || "Registration failed");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage,
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
          await axios.post(
            `${backendUrl}/api/client/logout`,
            {},
            {
              headers: getAuthHeaders(),
            }
          );
        } catch (logoutError) {
          console.warn("Logout API call failed:", logoutError);
        }
      }

      // Clear local storage and state
      localStorage.removeItem("token");
      setToken("");
      setUserData(false);
      setIsAuthenticated(false);
      setError(null);
      setAccounts([]);
      setTransactions([]);
      setBalance(0);
      setSelectedAccount(null);
      setAccountTypes({});

      toast.success("Logged out successfully");
      return {
        success: true,
        message: "Logged out successfully",
      };
    } catch (err) {
      console.error("Logout error:", err);
      // Clear local state even if backend call fails
      localStorage.removeItem("token");
      setToken("");
      setUserData(false);
      setIsAuthenticated(false);

      return {
        success: true,
        message: "Logged out successfully",
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
          user: data.client,
        };
      } else {
        if (data.status === 401) {
          // Token expired or invalid
          logout();
          throw new Error("Session expired. Please login again.");
        }
        throw new Error(data.message || "Failed to fetch profile");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to fetch profile";
      setError(errorMessage);

      if (err.response?.status === 401) {
        logout();
      }

      return {
        success: false,
        message: errorMessage,
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

      const { data } = await axios.put(
        `${backendUrl}/api/client/profile`,
        profileData,
        {
          headers: getAuthHeaders(),
        }
      );

      if (data.success) {
        setUserData(data.client);
        toast.success(data.message || "Profile updated successfully");
        return {
          success: true,
          message: data.message,
          user: data.client,
        };
      } else {
        throw new Error(data.message || "Failed to update profile");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update profile";
      setError(errorMessage);
      toast.error(errorMessage);

      if (err.response?.status === 401) {
        logout();
      }

      return {
        success: false,
        message: errorMessage,
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
      formData.append("image", imageFile);

      const { data } = await axios.post(
        `${backendUrl}/api/client/upload-image`,
        formData,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (data.success) {
        setUserData(data.client);
        toast.success(data.message || "Profile image updated successfully");
        return {
          success: true,
          message: data.message,
          imageUrl: data.imageUrl,
          user: data.client,
        };
      } else {
        throw new Error(data.message || "Failed to upload image");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to upload image";
      setError(errorMessage);
      toast.error(errorMessage);

      if (err.response?.status === 401) {
        logout();
      }

      return {
        success: false,
        message: errorMessage,
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

      const { data } = await axios.put(
        `${backendUrl}/api/client/change-password`,
        passwordData,
        {
          headers: getAuthHeaders(),
        }
      );

      if (data.success) {
        toast.success(data.message || "Password changed successfully");
        return {
          success: true,
          message: data.message,
        };
      } else {
        throw new Error(data.message || "Failed to change password");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to change password";
      setError(errorMessage);
      toast.error(errorMessage);

      if (err.response?.status === 401) {
        logout();
      }

      return {
        success: false,
        message: errorMessage,
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

      const { data } = await axios.post(
        `${backendUrl}/api/account/create`,
        accountData,
        {
          headers: getAuthHeaders(),
        }
      );

      if (data.success) {
        // Refresh accounts list
        await getMyAccounts();
        toast.success(data.message || "Account created successfully");
        return {
          success: true,
          message: data.message,
          account: data.account,
        };
      } else {
        throw new Error(data.message || "Failed to create account");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to create account";
      setError(errorMessage);
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage,
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

      const { data } = await axios.get(
        `${backendUrl}/api/account/my-accounts`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (data.success) {
        setAccounts(data.accounts);
        return {
          success: true,
          accounts: data.accounts,
        };
      } else {
        throw new Error(data.message || "Failed to fetch accounts");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch accounts";
      setError(errorMessage);
      if (err.response?.status !== 401) {
        toast.error(errorMessage);
      }
      return {
        success: false,
        message: errorMessage,
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

      const { data } = await axios.get(
        `${backendUrl}/api/account/details/${accountNumber}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (data.success) {
        setSelectedAccount(data.account);
        return {
          success: true,
          account: data.account,
        };
      } else {
        throw new Error(data.message || "Failed to fetch account details");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch account details";
      setError(errorMessage);
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage,
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

      const { data } = await axios.put(
        `${backendUrl}/api/account/status/${accountId}`,
        { status },
        {
          headers: getAuthHeaders(),
        }
      );

      if (data.success) {
        // Refresh accounts list
        await getMyAccounts();
        toast.success(data.message || "Account status updated successfully");
        return {
          success: true,
          message: data.message,
          account: data.account,
        };
      } else {
        throw new Error(data.message || "Failed to update account status");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update account status";
      setError(errorMessage);
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage,
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
          accountTypes: data.accountTypes,
        };
      } else {
        throw new Error(data.message || "Failed to fetch account types");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch account types";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
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

      const { data } = await axios.delete(
        `${backendUrl}/api/account/close/${accountId}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (data.success) {
        // Refresh accounts list
        await getMyAccounts();
        toast.success(data.message || "Account closed successfully");
        return {
          success: true,
          message: data.message,
          account: data.account,
        };
      } else {
        throw new Error(data.message || "Failed to close account");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to close account";
      setError(errorMessage);
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  // Transaction Management Methods

  // Search account by ID for transfer
  const searchAccountById = async (accountId) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.get(
        `${backendUrl}/api/account/search/${accountId}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (data.success) {
        return {
          success: true,
          account: data.account,
        };
      } else {
        throw new Error(data.message || "Failed to find account");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to search account";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  // Get all active accounts for search
  const getAllActiveAccounts = async (searchParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: searchParams.page || 1,
        limit: searchParams.limit || 10,
        ...(searchParams.search && { search: searchParams.search }),
      });

      const { data } = await axios.get(
        `${backendUrl}/api/account/all-active?${queryParams}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (data.success) {
        return {
          success: true,
          accounts: data.accounts,
          pagination: data.pagination,
        };
      } else {
        throw new Error(data.message || "Failed to fetch accounts");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch accounts";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  // Get accounts by type for transfers (recipient accounts)
  const getAccountsByType = async (accountType, searchParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: searchParams.page || 1,
        limit: searchParams.limit || 20,
        ...(searchParams.search && { search: searchParams.search }),
      });

      const { data } = await axios.get(
        `${backendUrl}/api/transaction/accounts-by-type/${accountType}?${queryParams}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (data.success) {
        return {
          success: true,
          accounts: data.accounts,
        };
      } else {
        throw new Error(data.message || "Failed to fetch recipient accounts");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch recipient accounts";
      setError(errorMessage);
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  // Get user's sender accounts by type
  const getMySenderAccounts = async (accountType) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.get(
        `${backendUrl}/api/transaction/my-accounts/${accountType}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (data.success) {
        return {
          success: true,
          accounts: data.accounts,
        };
      } else {
        throw new Error(data.message || "Failed to fetch sender accounts");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch sender accounts";
      setError(errorMessage);
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  // Enhanced get recipient accounts with better search and pagination
  const getRecipientAccounts = async (accountType, searchParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: searchParams.page || 1,
        limit: searchParams.limit || 20,
        ...(searchParams.search && { search: searchParams.search }),
      });

      const { data } = await axios.get(
        `${backendUrl}/api/account/recipients/${accountType}?${queryParams}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (data.success) {
        return {
          success: true,
          message: data.message,
          accounts: data.accounts,
          pagination: data.pagination,
        };
      } else {
        throw new Error(data.message || "Failed to fetch recipient accounts");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch recipient accounts";
      setError(errorMessage);
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  // Create Razorpay order for fund transfer
  const createTransferOrder = async (transferData) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.post(
        `${backendUrl}/api/transaction/create-order`,
        transferData,
        {
          headers: getAuthHeaders(),
        }
      );

      if (data.success) {
        return {
          success: true,
          message: data.message,
          order: data.order,
          transferDetails: data.transferDetails,
        };
      } else {
        throw new Error(data.message || "Failed to create transfer order");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to create transfer order";
      setError(errorMessage);
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  // Replace the verifyAndCompleteTransfer function in your AppContext.jsx with this fixed version:

  // Verify and complete fund transfer
  const verifyAndCompleteTransfer = async (paymentData) => {
    try {
      setLoading(true);
      setError(null);

      console.log("=== VERIFY TRANSFER START ===");
      console.log("Original payment data received:", paymentData);

      // FIXED: Proper field mapping to match what Razorpay actually sends
      const backendPaymentData = {
        // Handle all possible Razorpay response formats
        razorpay_order_id:
          paymentData.razorpay_order_id ||
          paymentData.orderId ||
          paymentData.order_id ||
          (paymentData.orderData && paymentData.orderData.id),

        razorpay_payment_id:
          paymentData.razorpay_payment_id ||
          paymentData.paymentId ||
          paymentData.payment_id ||
          paymentData.razorpay_payment_id,

        razorpay_signature:
          paymentData.razorpay_signature ||
          paymentData.signature ||
          paymentData.razorpaySignature,
      };

      console.log("Mapped payment data for backend:", backendPaymentData);

      // Validate required fields with detailed error messages
      const missingFields = [];
      if (!backendPaymentData.razorpay_order_id) {
        missingFields.push("razorpay_order_id");
      }
      if (!backendPaymentData.razorpay_payment_id) {
        missingFields.push("razorpay_payment_id");
      }
      if (!backendPaymentData.razorpay_signature) {
        missingFields.push("razorpay_signature");
      }

      if (missingFields.length > 0) {
        const errorMessage = `Missing required payment fields: ${missingFields.join(
          ", "
        )}`;
        console.error("Validation error:", errorMessage);
        console.error("Available fields:", Object.keys(paymentData));
        throw new Error(errorMessage);
      }

      const { data } = await axios.post(
        `${backendUrl}/api/transaction/verify-transfer`,
        backendPaymentData,
        {
          headers: getAuthHeaders(),
        }
      );

      console.log("Backend response:", data);

      if (data.success) {
        // Refresh accounts and transactions after successful transfer
        await getMyAccounts();
        await getTransactionHistory();

        toast.success(data.message || "Transfer completed successfully");
        console.log("=== VERIFY TRANSFER SUCCESS ===");
        return {
          success: true,
          message: data.message,
          transaction: data.transaction,
        };
      } else {
        throw new Error(data.message || "Failed to complete transfer");
      }
    } catch (err) {
      console.error("=== VERIFY TRANSFER ERROR ===");
      console.error("Error details:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to complete transfer";
      setError(errorMessage);
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  // Enhanced transaction history with filtering
  const getTransactionHistory = useCallback(
    async (params = {}) => {
      if (!token) return;

      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams({
          page: params.page || 1,
          limit: params.limit || 10,
          ...(params.type && { type: params.type }), // 'sent', 'received', or undefined for all
        });

        const { data } = await axios.get(
          `${backendUrl}/api/transaction/history?${queryParams}`,
          {
            headers: getAuthHeaders(),
          }
        );

        if (data.success) {
          setTransactions(data.transactions);
          return {
            success: true,
            transactions: data.transactions,
            pagination: data.pagination,
          };
        } else {
          throw new Error(
            data.message || "Failed to fetch transaction history"
          );
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch transaction history";
        setError(errorMessage);
        if (err.response?.status !== 401) {
          toast.error(errorMessage);
        }
        return {
          success: false,
          message: errorMessage,
        };
      } finally {
        setLoading(false);
      }
    },
    [token, backendUrl]
  );

  // Get detailed transaction information
  const getTransactionDetails = async (transactionId) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.get(
        `${backendUrl}/api/transaction/details/${transactionId}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (data.success) {
        return {
          success: true,
          transaction: data.transaction,
        };
      } else {
        throw new Error(data.message || "Failed to fetch transaction details");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch transaction details";
      setError(errorMessage);
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  // Utility Functions for Transfer Logic

  const calculateTransferFees = (amount, accountType = "Savings") => {
    try {
      const numericAmount = parseFloat(amount);

      if (accountType === "Current") {
        if (numericAmount <= 50000) return 0;
        if (numericAmount <= 100000) return Math.round(numericAmount * 0.005);
        return Math.round(numericAmount * 0.003);
      } else {
        // Savings account fee structure
        if (numericAmount <= 1000) return 5;
        if (numericAmount <= 10000) return 10;
        return Math.min(Math.round(numericAmount * 0.001), 100);
      }
    } catch (error) {
      console.error("Fee calculation error:", error);
      return 10; // Default fee
    }
  };

  // Enhanced validate transfer data with simplified validation
  const validateTransferData = (transferData) => {
    const { senderAccountId, recipientAccountId, amount, description } =
      transferData;

    const errors = [];

    if (!senderAccountId) {
      errors.push("Sender account is required");
    }

    if (!recipientAccountId) {
      errors.push("Recipient account is required");
    }

    if (!amount || amount <= 0) {
      errors.push("Valid transfer amount is required");
    }

    if (amount < 1) {
      errors.push("Minimum transfer amount is ₹1");
    }

    if (senderAccountId === recipientAccountId) {
      errors.push("Cannot transfer to the same account");
    }

    if (description && description.length > 200) {
      errors.push("Description cannot exceed 200 characters");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const canAccountTransfer = (account, amount) => {
    if (!account) {
      return { canTransfer: false, reason: "Account not found" };
    }

    if (account.status !== "Active") {
      return { canTransfer: false, reason: "Account is not active" };
    }

    const fees = calculateTransferFees(amount);
    const totalAmount = amount + fees;

    // SIMPLIFIED: Only check if account has sufficient balance (no minimum balance requirement)
    if (account.balance < totalAmount) {
      return {
        canTransfer: false,
        reason: `Insufficient balance. Available: ₹${account.balance}, Required: ₹${totalAmount} (including ₹${fees} fees)`,
      };
    }

    // Check daily transaction limits if available
    if (
      account.dailyTransactionLimit &&
      account.dailyTransactionAmount + totalAmount >
        account.dailyTransactionLimit
    ) {
      return {
        canTransfer: false,
        reason: `Daily transaction limit exceeded. Limit: ₹${
          account.dailyTransactionLimit
        }, Used: ₹${account.dailyTransactionAmount || 0}`,
      };
    }

    // Check monthly transaction limits if available
    if (
      account.monthlyTransactionLimit &&
      account.monthlyTransactionAmount + totalAmount >
        account.monthlyTransactionLimit
    ) {
      return {
        canTransfer: false,
        reason: `Monthly transaction limit exceeded. Limit: ₹${
          account.monthlyTransactionLimit
        }, Used: ₹${account.monthlyTransactionAmount || 0}`,
      };
    }

    return { canTransfer: true, reason: null };
  };

  // Get account type limits and features
  const getAccountTypeLimits = (accountType) => {
    if (accountTypes[accountType]) {
      return accountTypes[accountType];
    }

    // Default values if accountTypes not loaded yet
    const defaults = {
      Savings: {
        minimumBalance: 1000,
        dailyTransactionLimit: 10000,
        monthlyTransactionLimit: 50000,
      },
      Current: {
        minimumBalance: 5000,
        dailyTransactionLimit: 50000,
        monthlyTransactionLimit: 200000,
      },
    };

    return defaults[accountType] || {};
  };

  // Search and filter functions
  const searchAccounts = (accountsList, searchTerm) => {
    if (!searchTerm) return accountsList;

    const term = searchTerm.toLowerCase();
    return accountsList.filter(
      (account) =>
        account.accountNumber.toLowerCase().includes(term) ||
        (account.clientName &&
          account.clientName.toLowerCase().includes(term)) ||
        (account.clientEmail &&
          account.clientEmail.toLowerCase().includes(term))
    );
  };

  const filterTransactionsByDateRange = (
    transactionsList,
    startDate,
    endDate
  ) => {
    if (!startDate && !endDate) return transactionsList;

    return transactionsList.filter((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && end) {
        return transactionDate >= start && transactionDate <= end;
      } else if (start) {
        return transactionDate >= start;
      } else if (end) {
        return transactionDate <= end;
      }

      return true;
    });
  };

  const filterTransactionsByAmount = (
    transactionsList,
    minAmount,
    maxAmount
  ) => {
    if (!minAmount && !maxAmount) return transactionsList;

    return transactionsList.filter((transaction) => {
      const amount = transaction.amount;

      if (minAmount && maxAmount) {
        return amount >= minAmount && amount <= maxAmount;
      } else if (minAmount) {
        return amount >= minAmount;
      } else if (maxAmount) {
        return amount <= maxAmount;
      }

      return true;
    });
  };

  // Account statistics
  const getAccountStatistics = () => {
    const stats = {
      totalAccounts: accounts.length,
      totalBalance: getTotalBalance(),
      savingsAccounts: accounts.filter((acc) => acc.accountType === "Savings")
        .length,
      currentAccounts: accounts.filter((acc) => acc.accountType === "Current")
        .length,
      activeAccounts: accounts.filter((acc) => acc.status === "Active").length,
      inactiveAccounts: accounts.filter((acc) => acc.status !== "Active")
        .length,
    };

    return stats;
  };

  // Enhanced fund transfer workflow
  const initiateTransfer = async (transferData) => {
    try {
      // First validate the transfer data
      const validation = validateTransferData(transferData);
      if (!validation.isValid) {
        const errorMessage = validation.errors.join(", ");
        setError(errorMessage);
        toast.error(errorMessage);
        return {
          success: false,
          message: errorMessage,
        };
      }

      // Check if sender account can perform the transfer
      const senderAccount = accounts.find(
        (acc) => acc._id === transferData.senderAccountId
      );

      if (!senderAccount) {
        const errorMessage = "Sender account not found";
        setError(errorMessage);
        toast.error(errorMessage);
        return {
          success: false,
          message: errorMessage,
        };
      }

      // Use the sender account type for fee calculation
      const transferCheck = canAccountTransfer(
        senderAccount,
        transferData.amount
      );

      if (!transferCheck.canTransfer) {
        setError(transferCheck.reason);
        toast.error(transferCheck.reason);
        return {
          success: false,
          message: transferCheck.reason,
        };
      }

      // Create the transfer order
      return await createTransferOrder(transferData);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to initiate transfer";
      setError(errorMessage);
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  // Complete transfer with Razorpay verification
  const completeTransfer = async (paymentData) => {
    try {
      const result = await verifyAndCompleteTransfer(paymentData);

      if (result.success) {
        // Refresh all relevant data after successful transfer
        await Promise.all([getMyAccounts(), getTransactionHistory()]);
      }

      return result;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to complete transfer";
      setError(errorMessage);
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  // Cancel pending transaction
  const cancelTransaction = async (transactionId) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.put(
        `${backendUrl}/api/transaction/cancel/${transactionId}`,
        {},
        {
          headers: getAuthHeaders(),
        }
      );

      if (data.success) {
        // Refresh transaction history after cancellation
        await getTransactionHistory();

        toast.success(data.message || "Transaction cancelled successfully");
        return {
          success: true,
          message: data.message,
        };
      } else {
        throw new Error(data.message || "Failed to cancel transaction");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to cancel transaction";
      setError(errorMessage);
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  // Account management helpers
  const refreshAccountData = async () => {
    try {
      setLoading(true);
      await Promise.all([getMyAccounts(), getAccountTypes()]);
    } catch (error) {
      console.error("Error refreshing account data:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshTransactionData = async (params = {}) => {
    try {
      setLoading(true);
      await getTransactionHistory(params);
    } catch (error) {
      console.error("Error refreshing transaction data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Legacy methods for backward compatibility
  const getUserAccounts = getMyAccounts;
  const getUserTransactions = getTransactionHistory;

  const getUserBalance = useCallback(async () => {
    if (!token) return;

    try {
      // Calculate total balance from all accounts
      const accountsResult = await getMyAccounts();
      if (accountsResult.success) {
        const totalBalance = accountsResult.accounts.reduce(
          (total, account) => total + (account.balance || 0),
          0
        );
        setBalance(totalBalance);
        return totalBalance;
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      toast.error("Failed to fetch balance");
    }
  }, [token, getMyAccounts]);

  // Utility methods
  const getAccountByNumber = (accountNumber) => {
    return accounts.find((account) => account.accountNumber === accountNumber);
  };

  const getAccountsByTypeLocal = (accountType) => {
    return accounts.filter((account) => account.accountType === accountType);
  };

  const getTotalBalance = () => {
    return accounts.reduce(
      (total, account) => total + (account.balance || 0),
      0
    );
  };

  const canCreateAccountType = (accountType) => {
    const existingAccount = accounts.find(
      (account) =>
        account.accountType === accountType && account.status !== "Closed"
    );
    return !existingAccount;
  };

  const getAccountSummary = (accountId) => {
    const account = accounts.find((acc) => acc._id === accountId);
    if (!account) return null;

    const accountTransactions = transactions.filter(
      (t) =>
        (t.senderAccountId === accountId ||
          t.recipientAccountId === accountId) &&
        t.status === "Completed" // Only count completed transactions
    );

    const sentTransactions = accountTransactions.filter(
      (t) => t.type === "sent"
    );
    const receivedTransactions = accountTransactions.filter(
      (t) => t.type === "received"
    );

    return {
      account,
      totalTransactions: accountTransactions.length,
      sentCount: sentTransactions.length,
      receivedCount: receivedTransactions.length,
      totalSent: sentTransactions.reduce((sum, t) => sum + (t.amount || 0), 0),
      totalReceived: receivedTransactions.reduce(
        (sum, t) => sum + (t.amount || 0),
        0
      ),
      totalFeesPaid: sentTransactions.reduce(
        (sum, t) => sum + (t.fees || 0),
        0
      ),
      lastTransaction:
        accountTransactions.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )[0] || null,
      // Calculate available balance (current balance)
      availableBalance: account.balance,
      // Account utilization percentage (for display purposes)
      utilizationPercentage:
        account.monthlyTransactionLimit > 0
          ? (
              ((account.monthlyTransactionAmount || 0) /
                account.monthlyTransactionLimit) *
              100
            ).toFixed(2)
          : 0,
    };
  };

  // Enhanced transaction statistics with fee calculations
  const getTransactionStatistics = (timeframe = "all") => {
    let filteredTransactions = [...transactions];

    if (timeframe !== "all") {
      const now = new Date();
      let startDate;

      switch (timeframe) {
        case "today":
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
          break;
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case "year":
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = null;
      }

      if (startDate) {
        filteredTransactions = transactions.filter(
          (t) => new Date(t.createdAt) >= startDate
        );
      }
    }

    const sentTransactions = filteredTransactions.filter(
      (t) => t.type === "sent" && t.status === "Completed"
    );
    const receivedTransactions = filteredTransactions.filter(
      (t) => t.type === "received" && t.status === "Completed"
    );
    const completedTransactions = filteredTransactions.filter(
      (t) => t.status === "Completed"
    );
    const failedTransactions = filteredTransactions.filter(
      (t) => t.status === "Failed"
    );
    const pendingTransactions = filteredTransactions.filter(
      (t) => t.status === "Pending"
    );

    return {
      total: filteredTransactions.length,
      sent: sentTransactions.length,
      received: receivedTransactions.length,
      completed: completedTransactions.length,
      failed: failedTransactions.length,
      pending: pendingTransactions.length,
      totalSentAmount: sentTransactions.reduce(
        (sum, t) => sum + (t.amount || 0),
        0
      ),
      totalReceivedAmount: receivedTransactions.reduce(
        (sum, t) => sum + (t.amount || 0),
        0
      ),
      totalFeesPaid: sentTransactions.reduce(
        (sum, t) => sum + (t.fees || 0),
        0
      ),
      // Net transfer amount (received - sent)
      netAmount:
        receivedTransactions.reduce((sum, t) => sum + (t.amount || 0), 0) -
        sentTransactions.reduce((sum, t) => sum + (t.amount || 0), 0),
      // Success rate
      successRate:
        filteredTransactions.length > 0
          ? (
              (completedTransactions.length / filteredTransactions.length) *
              100
            ).toFixed(2)
          : 0,
    };
  };

  const getMonthlyTransactionSummary = () => {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyTransactions = transactions.filter(
      (t) => new Date(t.createdAt) >= currentMonth
    );

    const dailyData = {};

    monthlyTransactions.forEach((t) => {
      const day = new Date(t.createdAt).getDate();
      if (!dailyData[day]) {
        dailyData[day] = { sent: 0, received: 0, count: 0 };
      }

      if (t.type === "sent") {
        dailyData[day].sent += t.amount;
      } else {
        dailyData[day].received += t.amount;
      }
      dailyData[day].count += 1;
    });

    return dailyData;
  };

  const initiateFundTransfer = async (transferData) => {
    try {
      // First validate the transfer data
      const validation = validateTransferData(transferData);
      if (!validation.isValid) {
        const errorMessage = validation.errors.join(", ");
        setError(errorMessage);
        toast.error(errorMessage);
        return {
          success: false,
          message: errorMessage,
        };
      }

      // Check if sender account can perform the transfer
      const senderAccount = accounts.find(
        (acc) => acc._id === transferData.senderAccountId
      );

      if (!senderAccount) {
        const errorMessage = "Sender account not found";
        setError(errorMessage);
        toast.error(errorMessage);
        return {
          success: false,
          message: errorMessage,
        };
      }

      // Use the sender account type for fee calculation
      const transferCheck = canAccountTransfer(
        senderAccount,
        transferData.amount
      );

      if (!transferCheck.canTransfer) {
        setError(transferCheck.reason);
        toast.error(transferCheck.reason);
        return {
          success: false,
          message: transferCheck.reason,
        };
      }

      // Create the transfer order
      return await createTransferOrder(transferData);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to initiate transfer";
      setError(errorMessage);
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  // Complete fund transfer after payment
  const completeFundTransfer = async (paymentData) => {
    try {
      setLoading(true);
      setError(null);

      const result = await verifyAndCompleteTransfer(paymentData);

      if (result.success) {
        // Refresh all relevant data after successful transfer
        await Promise.all([getMyAccounts(), getTransactionHistory()]);
      }

      return result;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to complete transfer";
      setError(errorMessage);
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  // Create new Fixed Deposit
  const createFixedDeposit = async (fdData) => {
    try {
      setLoadingState(true);
      setError(null);

      const { data } = await axios.post(`${backendUrl}/api/fd/create`, fdData, {
        headers: getHeaders(),
      });

      if (data.success) {
        // Refresh FD list after creation
        await getMyFixedDeposits();

        toast.success(data.message || "Fixed Deposit created successfully");
        return {
          success: true,
          message: data.message,
          fixedDeposit: data.fixedDeposit,
        };
      } else {
        throw new Error(data.message || "Failed to create Fixed Deposit");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to create Fixed Deposit";
      setError(errorMessage);
      toast.error(errorMessage);

      if (err.response?.status === 401 && logout) {
        logout();
      }

      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoadingState(false);
    }
  };

  // Get all FDs for the client
  const getMyFixedDeposits = useCallback(async () => {
    if (!token) return;

    try {
      setLoadingState(true);
      setError(null);

      const { data } = await axios.get(`${backendUrl}/api/fd/my-fds`, {
        headers: getHeaders(),
      });

      if (data.success) {
        setFixedDeposits(data.fixedDeposits);
        setFDSummary(data.summary);
        return {
          success: true,
          fixedDeposits: data.fixedDeposits,
          summary: data.summary,
        };
      } else {
        throw new Error(data.message || "Failed to fetch Fixed Deposits");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch Fixed Deposits";
      setError(errorMessage);

      if (err.response?.status === 401 && logout) {
        logout();
      } else if (err.response?.status !== 401) {
        toast.error(errorMessage);
      }

      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoadingState(false);
    }
  }, [token, backendUrl]);

  // Get detailed FD information
  const getFixedDepositDetails = async (fdId) => {
    try {
      setLoadingState(true);
      setError(null);

      const { data } = await axios.get(`${backendUrl}/api/fd/details/${fdId}`, {
        headers: getHeaders(),
      });

      if (data.success) {
        setSelectedFD(data.fixedDeposit);
        return {
          success: true,
          fixedDeposit: data.fixedDeposit,
        };
      } else {
        throw new Error(data.message || "Failed to fetch FD details");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch FD details";
      setError(errorMessage);
      toast.error(errorMessage);

      if (err.response?.status === 401 && logout) {
        logout();
      }

      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoadingState(false);
    }
  };

  // Close Fixed Deposit (Premature or at maturity)
  const closeFixedDeposit = async (fdId, targetAccountId) => {
    try {
      setLoadingState(true);
      setError(null);

      const { data } = await axios.post(
        `${backendUrl}/api/fd/close/${fdId}`,
        { targetAccountId },
        {
          headers: getHeaders(),
        }
      );

      if (data.success) {
        // Refresh FD list after closure
        await getMyFixedDeposits();

        toast.success(data.message || "Fixed Deposit closed successfully");
        return {
          success: true,
          message: data.message,
          closure: data.closure,
        };
      } else {
        throw new Error(data.message || "Failed to close Fixed Deposit");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to close Fixed Deposit";
      setError(errorMessage);
      toast.error(errorMessage);

      if (err.response?.status === 401 && logout) {
        logout();
      }

      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoadingState(false);
    }
  };

  // Get FD plans and rates (Public endpoint)
  const getFDPlans = useCallback(async () => {
    try {
      setLoadingState(true);
      setError(null);

      const { data } = await axios.get(`${backendUrl}/api/fd/plans`);

      if (data.success) {
        setFDPlans(data.plans);
        return {
          success: true,
          plans: data.plans,
          features: data.features,
        };
      } else {
        throw new Error(data.message || "Failed to fetch FD plans");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch FD plans";
      setError(errorMessage);
      toast.error(errorMessage);

      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoadingState(false);
    }
  }, [backendUrl]);

  // Utility Functions

  // Calculate maturity amount for a given principal and term
  const calculateMaturityAmount = (
    principalAmount,
    termInMonths,
    interestRate = null
  ) => {
    try {
      const plans = fdPlans || {};
      const selectedPlan = plans[termInMonths.toString()];
      const rate =
        interestRate || (selectedPlan ? selectedPlan.interestRate : 6.0);
      const monthlyIncrement = selectedPlan
        ? selectedPlan.monthlyIncrement
        : 500;

      const totalIncrements = termInMonths * monthlyIncrement;
      const avgPrincipal = principalAmount + totalIncrements / 2;
      const years = termInMonths / 12;
      const interest = (avgPrincipal * rate * years) / 100;

      return principalAmount + totalIncrements + interest;
    } catch (error) {
      console.error("Maturity calculation error:", error);
      return principalAmount; // Return at least the principal
    }
  };

  // Calculate current value of FD
  const calculateCurrentValue = (fd) => {
    try {
      if (!fd) return 0;

      const now = new Date();
      const start = new Date(fd.startDate);

      let monthsElapsed = (now.getFullYear() - start.getFullYear()) * 12;
      monthsElapsed += now.getMonth() - start.getMonth();
      monthsElapsed = Math.max(0, monthsElapsed);

      const totalIncrements = monthsElapsed * (fd.monthlyIncrement || 500);
      const avgPrincipal = fd.principalAmount + totalIncrements / 2;
      const yearsFraction = monthsElapsed / 12;
      const interest = (avgPrincipal * fd.interestRate * yearsFraction) / 100;

      return fd.principalAmount + totalIncrements + interest;
    } catch (error) {
      console.error("Current value calculation error:", error);
      return fd?.principalAmount || 0;
    }
  };

  // Calculate premature penalty
  const calculatePrematurePenalty = (fd) => {
    try {
      if (!fd) return 0;

      const maturityDate = new Date(fd.maturityDate);
      const now = new Date();

      if (now >= maturityDate) return 0; // No penalty if mature

      const currentValue = calculateCurrentValue(fd);
      return (currentValue * (fd.penaltyRate || 1.0)) / 100;
    } catch (error) {
      console.error("Penalty calculation error:", error);
      return 0;
    }
  };

  // Check if FD is mature
  const isFDMature = (fd) => {
    try {
      if (!fd || !fd.maturityDate) return false;
      return new Date() >= new Date(fd.maturityDate);
    } catch (error) {
      console.error("Maturity check error:", error);
      return false;
    }
  };

  // Get months elapsed since FD start
  const getMonthsElapsed = (fd) => {
    try {
      if (!fd || !fd.startDate) return 0;

      const now = new Date();
      const start = new Date(fd.startDate);

      let months = (now.getFullYear() - start.getFullYear()) * 12;
      months += now.getMonth() - start.getMonth();

      return Math.max(0, months);
    } catch (error) {
      console.error("Months elapsed calculation error:", error);
      return 0;
    }
  };

  // Get months remaining until maturity
  const getMonthsRemaining = (fd) => {
    try {
      if (!fd) return 0;
      const elapsed = getMonthsElapsed(fd);
      return Math.max(0, fd.termInMonths - elapsed);
    } catch (error) {
      console.error("Months remaining calculation error:", error);
      return 0;
    }
  };

  // Validate FD creation data
  const validateFDData = (fdData) => {
    const { sourceAccountId, principalAmount, termInMonths } = fdData;
    const errors = [];

    if (!sourceAccountId) {
      errors.push("Source account is required");
    }

    if (!principalAmount || principalAmount < 10000) {
      errors.push("Minimum FD amount is ₹10,000");
    }

    if (!termInMonths || ![12, 24, 36, 60].includes(parseInt(termInMonths))) {
      errors.push("Invalid term. Must be 12, 24, 36, or 60 months");
    }

    if (principalAmount > 10000000) {
      // 1 crore limit
      errors.push("Maximum FD amount is ₹1,00,00,000");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  // Filter FDs by status
  const filterFDsByStatus = (status) => {
    return fixedDeposits.filter((fd) => fd.status === status);
  };

  // Filter mature FDs
  const getMatureFDs = () => {
    return fixedDeposits.filter((fd) => isFDMature(fd));
  };

  // Filter active FDs
  const getActiveFDs = () => {
    return fixedDeposits.filter((fd) => fd.status === "Active");
  };

  // Get FD statistics
  const getFDStatistics = () => {
    const activeFDs = getActiveFDs();
    const matureFDs = getMatureFDs();

    return {
      totalFDs: fixedDeposits.length,
      activeFDs: activeFDs.length,
      matureFDs: matureFDs.length,
      totalInvested: fixedDeposits.reduce(
        (sum, fd) => sum + fd.principalAmount,
        0
      ),
      currentTotalValue: fixedDeposits.reduce(
        (sum, fd) => sum + calculateCurrentValue(fd),
        0
      ),
      totalInterestEarned: fixedDeposits.reduce((sum, fd) => {
        const currentValue = calculateCurrentValue(fd);
        const monthsElapsed = getMonthsElapsed(fd);
        const incrementsAdded = monthsElapsed * (fd.monthlyIncrement || 500);
        return sum + (currentValue - fd.principalAmount - incrementsAdded);
      }, 0),
      avgInterestRate:
        fixedDeposits.length > 0
          ? fixedDeposits.reduce((sum, fd) => sum + fd.interestRate, 0) /
            fixedDeposits.length
          : 0,
    };
  };

  // Get FD by ID
  const getFDById = (fdId) => {
    return fixedDeposits.find((fd) => fd._id === fdId);
  };

  // Get FDs by term
  const getFDsByTerm = (termInMonths) => {
    return fixedDeposits.filter((fd) => fd.termInMonths === termInMonths);
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount || 0);
  };

  // Get plan details by term
  const getPlanByTerm = (termInMonths) => {
    return fdPlans[termInMonths.toString()] || null;
  };

  // Refresh FD data
  const refreshFDData = async () => {
    try {
      setLoadingState(true);
      await Promise.all([getMyFixedDeposits(), getFDPlans()]);
    } catch (error) {
      console.error("Error refreshing FD data:", error);
    } finally {
      setLoadingState(false);
    }
  };

  // Get upcoming maturities (FDs maturing in next 30 days)
  const getUpcomingMaturities = () => {
    const now = new Date();
    const next30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return fixedDeposits.filter((fd) => {
      const maturityDate = new Date(fd.maturityDate);
      return (
        maturityDate >= now &&
        maturityDate <= next30Days &&
        fd.status === "Active"
      );
    });
  };

  // Get monthly growth projection
  const getMonthlyGrowthProjection = (fd) => {
    try {
      if (!fd) return [];

      const projection = [];
      const monthlyIncrement = fd.monthlyIncrement || 500;

      for (let month = 0; month <= fd.termInMonths; month++) {
        const totalIncrements = month * monthlyIncrement;
        const avgPrincipal = fd.principalAmount + totalIncrements / 2;
        const yearsFraction = month / 12;
        const interest = (avgPrincipal * fd.interestRate * yearsFraction) / 100;

        projection.push({
          month,
          principalAmount: fd.principalAmount,
          incrementsAdded: totalIncrements,
          interestEarned: interest,
          totalValue: fd.principalAmount + totalIncrements + interest,
        });
      }

      return projection;
    } catch (error) {
      console.error("Growth projection error:", error);
      return [];
    }
  };

  // Check authentication on app load and fetch initial data
  useEffect(() => {
    if (token) {
      loadUserProfileData();
      getMyAccounts();
      getAccountTypes();
    } else {
      setUserData(false);
      setIsAuthenticated(false);
    }
  }, [token, getMyAccounts, getAccountTypes]);

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

    // Transaction management methods (matching backend APIs)
    searchAccountById,
    getAllActiveAccounts,
    getAccountsByType, // For recipient accounts (transaction controller)
    getMySenderAccounts,
    getRecipientAccounts, // Enhanced recipient search (account controller)
    createTransferOrder,
    verifyAndCompleteTransfer,
    getTransactionHistory,
    getTransactionDetails,
    cancelTransaction,

    // Enhanced transfer workflow methods
    initiateTransfer,
    completeTransfer,
    initiateFundTransfer,
    completeFundTransfer,

    // Utility functions
    calculateTransferFees,
    validateTransferData,
    canAccountTransfer,
    formatCurrency,
    getAccountTypeLimits,

    // Search and filter functions
    searchAccounts,
    filterTransactionsByDateRange,
    filterTransactionsByAmount,

    // Statistics functions
    getAccountStatistics,
    getTransactionStatistics,
    getAccountSummary,
    getMonthlyTransactionSummary,

    // Data refresh functions
    refreshAccountData,
    refreshTransactionData,

    // Legacy methods for backward compatibility
    getUserAccounts,
    getUserTransactions,
    getUserBalance,

    // Local utility methods
    getAccountByNumber,
    getAccountsByType: getAccountsByTypeLocal, // Local filtering method
    getTotalBalance,
    canCreateAccountType,

    // States
    fixedDeposits,
    fdPlans,
    selectedFD,
    fdSummary,
    loading: getLoadingState(),

    // Core FD operations
    createFixedDeposit,
    getMyFixedDeposits,
    getFixedDepositDetails,
    closeFixedDeposit,
    getFDPlans,
    getHeaders,

    // Utility functions
    calculateMaturityAmount,
    calculateCurrentValue,
    calculatePrematurePenalty,
    isFDMature,
    getMonthsElapsed,
    getMonthsRemaining,
    validateFDData,

    // Filter and search functions
    filterFDsByStatus,
    getMatureFDs,
    getActiveFDs,
    getFDById,
    getFDsByTerm,
    getPlanByTerm,

    // Statistics and analytics
    getFDStatistics,
    getUpcomingMaturities,
    getMonthlyGrowthProjection,

    // State setters
    setError,
    setSelectedAccount,
    setAccounts,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
