import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

const App = () => {
  return (
    <AppContextProvider>
      <Router>
        <div className="min-h-screen bg-dark-900">
          <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/offers" element={<OfferSection />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
          </Routes>
          <Footer />
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
          />
        </div>
      </Router>
    </AppContextProvider>
  );
};

export default App;