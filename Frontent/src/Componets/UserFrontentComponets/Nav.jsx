import React, { useState, useEffect, useContext } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../../Context/AppContext';

const Nav = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userData, logout } = useContext(AppContext);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setShowProfileMenu(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/offers', label: 'OfferSection' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    
  ];

  // Custom Green Logo Component
  const GreenBankLogo = ({ size = 32 }) => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className="hover:scale-105 transition-transform duration-300"
    >
      {/* Main green square with rounded corners */}
      <rect 
        x="8" 
        y="8" 
        width="68" 
        height="68" 
        rx="12" 
        ry="12" 
        fill="#22C55E"
        className="drop-shadow-lg"
      />
      
      {/* Overlapping lighter green square */}
      <rect 
        x="24" 
        y="24" 
        width="68" 
        height="68" 
        rx="12" 
        ry="12" 
        fill="#34D399"
        className="drop-shadow-md"
      />
      
      {/* Inner cutout to create the "G" shape */}
      <rect 
        x="40" 
        y="40" 
        width="36" 
        height="36" 
        rx="6" 
        ry="6" 
        fill="transparent"
        stroke="#1F2937"
        strokeWidth="3"
      />
      
      {/* Additional design elements for depth */}
      <rect 
        x="12" 
        y="12" 
        width="60" 
        height="4" 
        rx="2" 
        fill="#16A34A"
        opacity="0.8"
      />
      
      <rect 
        x="28" 
        y="28" 
        width="60" 
        height="4" 
        rx="2" 
        fill="#10B981"
        opacity="0.8"
      />
    </svg>
  );

  // Helper function to get user display name
  const getUserDisplayName = () => {
    if (!userData) return 'User';
    
    // If name field exists (from backend), use it
    if (userData.name) {
      return userData.name.split(' ')[0]; // Get first name
    }
    
    // Fallback to firstName if available
    if (userData.firstName) {
      return userData.firstName;
    }
    
    // Final fallback
    return 'User';
  };

  const getUserFullName = () => {
    if (!userData) return 'User';
    
    // If name field exists (from backend), use it
    if (userData.name) {
      return userData.name;
    }
    
    // Fallback to firstName + lastName if available
    if (userData.firstName && userData.lastName) {
      return `${userData.firstName} ${userData.lastName}`;
    }
    
    // Final fallback
    return userData.firstName || userData.email || 'User';
  };

  return (
    <nav className={`fixed top-0 w-full z-50 bg-dark-900/95 backdrop-blur-md border-b border-dark-700 transition-all duration-300 ${isSticky ? "shadow-lg" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            onClick={() => navigate("/")} 
            className="flex items-center space-x-3 cursor-pointer"
          >
            <GreenBankLogo size={32} />
            <span className="text-xl font-bold text-white">GreenBank</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `pb-1 border-b-2 transition duration-200 font-medium ${
                    isActive 
                      ? "border-primary-500 text-primary-400 font-semibold" 
                      : "border-transparent text-gray-300 hover:border-primary-300 hover:text-primary-400"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Desktop Login Button */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <button 
                onClick={() => navigate("/login")}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
              >
                Login
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-dark-700 transition duration-200"
                >
                  {userData?.image ? (
                    <img
                      src={userData.image}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-primary-500"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                  )}
                  <span className="text-white font-medium">
                    {getUserDisplayName()}
                  </span>
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-dark-800 rounded-lg shadow-lg border border-dark-700 py-2 z-50">
                    <div className="px-4 py-2 border-b border-dark-700">
                      <p className="text-white font-medium">
                        {getUserFullName()}
                      </p>
                      <p className="text-gray-400 text-sm">{userData?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/profile');
                      }}
                      className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-700 transition duration-200 flex items-center space-x-2"
                    >
                      <User size={16} />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-700 transition duration-200 flex items-center space-x-2"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-dark-800 rounded-lg mt-2 shadow-md">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 transition-colors duration-200 rounded ${
                      isActive 
                        ? "text-primary-400 font-semibold bg-dark-700" 
                        : "text-gray-300 hover:text-primary-400 hover:bg-dark-700"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
              {!isAuthenticated ? (
                <div className="px-3 py-2">
                  <button 
                    onClick={() => {
                      navigate("/login");
                      setIsMenuOpen(false);
                    }}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200 w-full"
                  >
                    Login
                  </button>
                </div>
              ) : (
                <div className="px-3 py-2 border-t border-dark-700 mt-2">
                  <div className="flex items-center space-x-3 mb-3">
                    {userData?.image ? (
                      <img
                        src={userData.image}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover border-2 border-primary-500"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                        <User size={20} className="text-white" />
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium">
                        {getUserFullName()}
                      </p>
                      <p className="text-gray-400 text-sm">{userData?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate('/profile');
                    }}
                    className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-dark-700 rounded transition duration-200 flex items-center space-x-2 mb-2"
                  >
                    <User size={16} />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-dark-700 rounded transition duration-200 flex items-center space-x-2"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Overlay for profile menu */}
      {showProfileMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </nav>
  );
};

export default Nav;