import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import your AdminContext
import AdminContextProvider, { AdminContext } from './Context/AppContext';

// Import your components (you'll need to create these)
import AdminLogin from './Pages/login';
import AdminDashboard from './Pages/AdminDash/AdminDash';
// import ClientManagement from './Pages/ClientManagement';
// import AccountManagement from './Pages/AccountManagement';
// import TransactionManagement from './Pages/TransactionManagement';
// import FixedDepositManagement from './Pages/FixedDepositManagement';
import AdminLayout from './Pages/AdminDash/AdminLayout';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAdminAuthenticated, loading } = React.useContext(AdminContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return isAdminAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

// Public Route Component (redirects if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAdminAuthenticated, loading } = React.useContext(AdminContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return !isAdminAuthenticated ? children : <Navigate to="/admin/dashboard" replace />;
};

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminContextProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/admin/login" 
              element={
                <PublicRoute>
                  <AdminLogin />
                </PublicRoute>
              } 
            />

            {/* Protected Admin Routes */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Routes>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      {/* <Route path="clients" element={<ClientManagement />} /> */}
                      {/* <Route path="accounts" element={<AccountManagement />} /> */}
                      {/* <Route path="transactions" element={<TransactionManagement />} /> */}
                      {/* <Route path="fixed-deposits" element={<FixedDepositManagement />} /> */}
                      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              } 
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/admin/login" replace />} />
            <Route path="*" element={<Navigate to="/admin/login" replace />} />
          </Routes>

          {/* Toast notifications */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            className="mt-16"
          />
        </Router>
      </AdminContextProvider>
    </div>
  );
};

export default App;