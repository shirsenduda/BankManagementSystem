import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  // Base configuration
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://bankmanagementsystem-backend.onrender.com";
  
  // Authentication states - using React state instead of localStorage
  const [adminToken, setAdminToken] = useState("");
  const [adminData, setAdminData] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Clear error function
  const clearError = () => setError(null);

  // Get auth headers for admin requests
  const getAdminHeaders = () => {
    return {
      "Content-Type": "application/json",
      ...(adminToken && { Authorization: `Bearer ${adminToken}` }),
    };
  };

  // Admin Login
  const adminLogin = async (loginData) => {
    try {
      setLoading(true);
      setError(null);

      // Real backend call
      const { data } = await axios.post(
        `${backendUrl}/api/admin/login`,
        {
          adminId: loginData.email, // Using email field to send adminId
          password: loginData.password
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        setAdminToken(data.token);
        setAdminData(data.admin);
        setIsAdminAuthenticated(true);

        toast.success(data.message || "Admin login successful");
        return {
          success: true,
          message: data.message,
          admin: data.admin,
          token: data.token,
        };
      } else {
        throw new Error(data.message || "Admin login failed");
      }

    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Admin login failed. Please try again.";
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

  // Admin Logout
  const adminLogout = async () => {
    try {
      setLoading(true);

      // Call backend logout if token exists
      if (adminToken) {
        try {
          await axios.post(
            `${backendUrl}/api/admin/logout`,
            {},
            {
              headers: getAdminHeaders(),
            }
          );
        } catch (logoutError) {
          console.warn("Admin logout API call failed:", logoutError);
        }
      }

      // Clear state
      setAdminToken("");
      setAdminData(null);
      setIsAdminAuthenticated(false);
      setError(null);

      toast.success("Admin logged out successfully");
      return {
        success: true,
        message: "Admin logged out successfully",
      };
    } catch (err) {
      console.error("Admin logout error:", err);
      // Clear local state even if backend call fails
      setAdminToken("");
      setAdminData(null);
      setIsAdminAuthenticated(false);

      return {
        success: true,
        message: "Admin logged out successfully",
      };
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const contextValue = {
    // Base configuration
    backendUrl,

    // Authentication states
    adminToken,
    adminData,
    isAdminAuthenticated,
    loading,
    error,

    // Authentication methods
    adminLogin,
    adminLogout,
    clearError,

    // Headers utility
    getAdminHeaders,
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
