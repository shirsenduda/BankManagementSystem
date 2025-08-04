// Updated AdminDashboard.jsx (keeping original simple structure)
import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="transition-all duration-300 ease-in-out">
      <h1 className="text-2xl font-bold text-white mb-4">Dashboard</h1>
      <div className="bg-slate-800 rounded-lg p-6">
        <p className="text-gray-300">Welcome to the admin dashboard. Content will smoothly adjust as the sidebar expands and collapses.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;