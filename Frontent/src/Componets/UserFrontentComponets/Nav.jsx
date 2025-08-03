import React, { useState, useEffect, useContext } from "react";
import { Menu, X, User, LogOut, Shield, Home, ChevronDown } from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

const Nav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, userData, logout } = useContext(AppContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Check if current path is admin panel
  const isAdminPath = location.pathname.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown')) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setShowProfileMenu(false);
    navigate("/");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/offers", label: "Offers" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  // Enhanced Professional Logo Component
  const GreenBankLogo = ({ size = 36 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="transition-transform duration-300 hover:scale-105"
    >
      <defs>
        <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#16A34A" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <dropShadow dx="2" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      {/* Main logo shape */}
      <rect
        x="15"
        y="15"
        width="70"
        height="70"
        rx="8"
        fill="url(#greenGradient)"
        filter="url(#shadow)"
      />
      
      {/* Bank building design */}
      <rect x="25" y="35" width="50" height="3" fill="white" opacity="0.9" />
      <rect x="30" y="42" width="8" height="25" fill="white" opacity="0.8" />
      <rect x="42" y="42" width="8" height="25" fill="white" opacity="0.8" />
      <rect x="54" y="42" width="8" height="25" fill="white" opacity="0.8" />
      <rect x="25" y="67" width="50" height="5" fill="white" opacity="0.9" />
      
      {/* Dollar sign */}
      <text x="50" y="58" fontSize="20" fontWeight="bold" fill="white" textAnchor="middle">$</text>
    </svg>
  );

  // Helper functions
  const getUserDisplayName = () => {
    if (!userData) return "User";
    if (userData.name) return userData.name.split(" ")[0];
    if (userData.firstName) return userData.firstName;
    return "User";
  };

  const getUserFullName = () => {
    if (!userData) return "User";
    if (userData.name) return userData.name;
    if (userData.firstName && userData.lastName) {
      return `${userData.firstName} ${userData.lastName}`;
    }
    return userData.firstName || userData.email || "User";
  };

  const isAdmin = () => {
    return (
      userData?.role === "admin" ||
      userData?.isAdmin ||
      userData?.email === "admin@greenbank.com"
    );
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isSticky 
            ? "bg-slate-900/95 backdrop-blur-lg shadow-lg border-b border-slate-700/50" 
            : "bg-slate-900/90 backdrop-blur-md border-b border-slate-800/30"
        }`}
      >
        <div
          className={`${
            isAdminPath ? "px-6" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          }`}
        >
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <GreenBankLogo size={36} />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-200">
                  GreenBank
                </span>
                {isAdminPath && (
                  <span className="text-xs text-slate-400 -mt-1">Admin Panel</span>
                )}
              </div>
            </div>

            {/* Desktop Navigation */}
            {!isAdminPath && (
              <div className="hidden md:flex items-center space-x-1">
                {navLinks.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-blue-500/10 text-blue-400 shadow-sm border border-blue-500/20"
                          : "text-slate-300 hover:text-blue-400 hover:bg-slate-800/50"
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
              </div>
            )}

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {!isAuthenticated ? (
                !isAdminPath && (
                  <button
                    onClick={() => navigate("/login")}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
                  >
                    Sign In
                  </button>
                )
              ) : (
                <div className="relative profile-dropdown">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-3 p-2 pr-3 rounded-lg hover:bg-slate-800/50 transition-all duration-200 border border-transparent hover:border-slate-700/50"
                  >
                    {userData?.image ? (
                      <img
                        src={userData.image}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover border-2 border-blue-400/50"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-sm">
                        <User size={16} className="text-white" />
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <span className="text-slate-200 font-medium text-sm">
                        {getUserDisplayName()}
                      </span>
                      <ChevronDown 
                        size={16} 
                        className={`text-slate-400 transition-transform duration-200 ${
                          showProfileMenu ? 'rotate-180' : ''
                        }`} 
                      />
                    </div>
                  </button>

                  {/* Enhanced Profile Dropdown */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-lg rounded-xl shadow-xl border border-slate-700/50 py-2 z-50 overflow-hidden">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-slate-700/50 bg-slate-900/50">
                        <div className="flex items-center space-x-3">
                          {userData?.image ? (
                            <img
                              src={userData.image}
                              alt="Profile"
                              className="w-10 h-10 rounded-full object-cover border-2 border-blue-400/50"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                              <User size={20} className="text-white" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-200 truncate">
                              {getUserFullName()}
                            </p>
                            <p className="text-xs text-slate-400 truncate">
                              {userData?.email}
                            </p>
                            {isAdmin() && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 mt-1">
                                Administrator
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        {isAuthenticated && !isAdminPath && (
                          <button
                            onClick={() => {
                              navigate("/admin");
                              setShowProfileMenu(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-slate-300 hover:text-blue-400 hover:bg-slate-700/50 transition-all duration-200 flex items-center space-x-3"
                          >
                            <Shield size={18} className="text-slate-400" />
                            <span className="font-medium">Admin Panel</span>
                          </button>
                        )}

                        {isAdminPath && (
                          <button
                            onClick={() => {
                              navigate("/");
                              setShowProfileMenu(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-slate-300 hover:text-blue-400 hover:bg-slate-700/50 transition-all duration-200 flex items-center space-x-3"
                          >
                            <Home size={18} className="text-slate-400" />
                            <span className="font-medium">Back to Home</span>
                          </button>
                        )}

                        <div className="border-t border-slate-700/50 my-1"></div>
                        
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 flex items-center space-x-3"
                        >
                          <LogOut size={18} className="text-red-400" />
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            {(!isAdminPath || isAuthenticated) && (
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-lg text-slate-300 hover:text-blue-400 hover:bg-slate-800/50 transition-all duration-200"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-3">
              <div className="bg-slate-800/95 backdrop-blur-lg rounded-xl shadow-xl border border-slate-700/50 overflow-hidden">
                {/* Mobile nav links */}
                {!isAdminPath && (
                  <div className="py-2">
                    {navLinks.map(({ to, label }, index) => (
                      <NavLink
                        key={to}
                        to={to}
                        onClick={() => setIsMenuOpen(false)}
                        className={({ isActive }) =>
                          `block px-4 py-3 transition-all duration-200 ${
                            isActive
                              ? "text-blue-400 bg-blue-500/10 border-r-4 border-blue-500 font-semibold"
                              : "text-slate-300 hover:text-blue-400 hover:bg-slate-700/50"
                          } ${index > 0 ? 'border-t border-slate-700/50' : ''}`
                        }
                      >
                        {label}
                      </NavLink>
                    ))}
                  </div>
                )}

                {!isAuthenticated ? (
                  !isAdminPath && (
                    <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
                      <button
                        onClick={() => {
                          navigate("/login");
                          setIsMenuOpen(false);
                        }}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
                      >
                        Sign In
                      </button>
                    </div>
                  )
                ) : (
                  <div className="border-t border-slate-700/50 bg-slate-900/50">
                    {/* Mobile user info */}
                    <div className="px-4 py-4">
                      <div className="flex items-center space-x-3 mb-4">
                        {userData?.image ? (
                          <img
                            src={userData.image}
                            alt="Profile"
                            className="w-12 h-12 rounded-full object-cover border-2 border-blue-400/50"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <User size={24} className="text-white" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-slate-200 font-semibold">
                            {getUserFullName()}
                          </p>
                          <p className="text-slate-400 text-sm">{userData?.email}</p>
                          {isAdmin() && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 mt-1">
                              Administrator
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Mobile menu items */}
                      <div className="space-y-1">
                        {isAuthenticated && !isAdminPath && (
                          <button
                            onClick={() => {
                              navigate("/admin");
                              setIsMenuOpen(false);
                            }}
                            className="w-full text-left px-3 py-2.5 text-slate-300 hover:text-blue-400 hover:bg-slate-700/50 rounded-lg transition-all duration-200 flex items-center space-x-3"
                          >
                            <Shield size={18} />
                            <span className="font-medium">Admin Panel</span>
                          </button>
                        )}

                        {isAdminPath && (
                          <button
                            onClick={() => {
                              navigate("/");
                              setIsMenuOpen(false);
                            }}
                            className="w-full text-left px-3 py-2.5 text-slate-300 hover:text-blue-400 hover:bg-slate-700/50 rounded-lg transition-all duration-200 flex items-center space-x-3"
                          >
                            <Home size={18} />
                            <span className="font-medium">Back to Home</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            handleLogout();
                            setIsMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 flex items-center space-x-3"
                        >
                          <LogOut size={18} />
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Backdrop for mobile menu */}
      {(isMenuOpen || showProfileMenu) && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => {
            setIsMenuOpen(false);
            setShowProfileMenu(false);
          }}
        />
      )}
    </>
  );
};

export default Nav;