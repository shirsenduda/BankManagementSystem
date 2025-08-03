import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../Componets/UserDashboardComponets/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-dark-900">      
      {/* Main Layout with Sidebar */}
      <div className="flex pt-16"> {/* pt-16 to account for fixed nav height */}
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Main Content Area - Fixed margin to match sidebar width */}
        <div className="flex-1 ml-72 min-h-[calc(100vh-4rem)]"> {/* ml-72 to match sidebar w-72 (288px) */}
          {/* Content Container */}
          <div className="bg-dark-900 min-h-full">
            {/* Main Content with proper padding and background */}
            <div className="p-6 bg-dark-900">
              <Outlet />
            </div>
            
            {/* Professional Footer for Admin Panel */}
            {/* <div className="border-t border-dark-700 bg-dark-800 px-6 py-4 mt-auto">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center space-x-6">
                  <span>© 2025 GreenBank Admin Panel</span>
                  <span className="text-primary-400">Version 1.0.0</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    <span>System Online</span>
                  </span>
                  <span>Last Updated: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;