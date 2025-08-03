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
import Profile from "./Pages/UserDashboard/Profile";

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

        {/* Admin Routes - Fixed Architecture */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<Profile />} />
          {/* Add more admin routes here */}
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