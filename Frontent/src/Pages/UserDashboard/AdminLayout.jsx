import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../Componets/UserDashboardComponets/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-dark-900">      
      {/* Main Layout with Sidebar */}
      <div className="flex pt-16"> {/* pt-16 to account for fixed nav height */}
        {/* Sidebar - Only show on desktop */}
        <AdminSidebar />
        
        {/* Main Content Area - Responsive margin based on sidebar state */}
        <div className="flex-1 transition-all duration-300 ease-in-out min-h-[calc(100vh-4rem)]" style={{
          // On mobile (below md), no margin. On desktop, use sidebar width
          marginLeft: 'var(--sidebar-width, 0px)'
        }}>
          {/* Add responsive styles */}
          <style jsx>{`
            @media (max-width: 768px) {
              .flex-1 {
                margin-left: 0 !important;
              }
            }
          `}</style>
          
          {/* Content Container */}
          <div className="bg-dark-900 min-h-full">
            {/* Main Content with responsive padding */}
            <div className="p-3 sm:p-6 bg-dark-900">
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