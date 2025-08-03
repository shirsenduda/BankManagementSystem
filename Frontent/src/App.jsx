import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import React from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Nav from "./Componets/UserFrontentComponets/Nav";
import Footer from "./Componets/UserFrontentComponets/Footer";
import Home from "./Pages/UserFrontent/Home";
import OfferSection from "./Pages/UserFrontent/OfferSection";
import About from "./Pages/UserFrontent/About";
import Contact from "./Pages/UserFrontent/Contact";
import Login from "./Pages/Login";
import AppContextProvider from "./Context/AppContext";

// Admin Components
import AdminLayout from "./Pages/UserDashboard/AdminLayout";
import AdminDashboard from "./Pages/UserDashboard/AdminDashboard";

// Component to conditionally show footer
const ConditionalFooter = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  
  return !isAdminPath ? <Footer /> : null;
};

const AppContent = () => {
  return (
    <div className="min-h-screen bg-dark-900">
      {/* Unified Navigation - shows for all pages */}
      <Nav />
      
      <Routes>
        {/* Regular User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/offers" element={<OfferSection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          {/* Add more admin routes here as needed */}
          <Route path="users" element={<div className="text-white p-6">Users Management Page</div>} />
          <Route path="users/verification" element={<div className="text-white p-6">User Verification Page</div>} />
          <Route path="users/blocked" element={<div className="text-white p-6">Blocked Users Page</div>} />
          <Route path="accounts" element={<div className="text-white p-6">Accounts Management Page</div>} />
          <Route path="accounts/verification" element={<div className="text-white p-6">Account Verification Page</div>} />
          <Route path="accounts/closed" element={<div className="text-white p-6">Closed Accounts Page</div>} />
          <Route path="transactions" element={<div className="text-white p-6">Transactions Page</div>} />
          <Route path="transactions/pending" element={<div className="text-white p-6">Pending Transactions Page</div>} />
          <Route path="transactions/failed" element={<div className="text-white p-6">Failed Transactions Page</div>} />
          <Route path="reports/financial" element={<div className="text-white p-6">Financial Reports Page</div>} />
          <Route path="reports/users" element={<div className="text-white p-6">User Analytics Page</div>} />
          <Route path="reports/transactions" element={<div className="text-white p-6">Transaction Analytics Page</div>} />
          <Route path="branches" element={<div className="text-white p-6">Branch Management Page</div>} />
          <Route path="atms" element={<div className="text-white p-6">ATM Locations Page</div>} />
          <Route path="bank-settings" element={<div className="text-white p-6">Bank Settings Page</div>} />
          <Route path="notifications" element={<div className="text-white p-6">Notifications Page</div>} />
          <Route path="security/logs" element={<div className="text-white p-6">Security Logs Page</div>} />
          <Route path="security/fraud" element={<div className="text-white p-6">Fraud Detection Page</div>} />
          <Route path="security/access" element={<div className="text-white p-6">Access Control Page</div>} />
          <Route path="settings" element={<div className="text-white p-6">System Settings Page</div>} />
        </Route>
      </Routes>

      {/* Footer - conditionally shown based on path */}
      <ConditionalFooter />

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
        theme="dark"
        toastClassName="bg-dark-800 text-white"
      />
    </div>
  );
};

const App = () => {
  return (
    <AppContextProvider>
      <Router>
        <AppContent />
      </Router>
    </AppContextProvider>
  );
};

export default App;