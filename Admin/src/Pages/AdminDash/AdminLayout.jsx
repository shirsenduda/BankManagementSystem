import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AdminContext } from '../../Context/AppContext';

const AdminLayout = ({ children }) => {
  const { adminLogout, adminData, loading } = useContext(AdminContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await adminLogout();
    }
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: '📊',
    },
    {
      name: 'Clients',
      href: '/admin/clients',
      icon: '👥',
    },
    {
      name: 'Accounts',
      href: '/admin/accounts',
      icon: '🏦',
    },
    {
      name: 'Transactions',
      href: '/admin/transactions',
      icon: '💳',
    },
    {
      name: 'Fixed Deposits',
      href: '/admin/fixed-deposits',
      icon: '💰',
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-center h-16 bg-blue-600 text-white">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        
        <nav className="mt-5 px-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md mb-1 ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:pl-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-500 focus:outline-none focus:text-gray-700 lg:hidden"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  A
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {adminData?.name || 'Admin'}
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                disabled={loading}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;