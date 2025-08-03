import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  FileText, 
  Settings, 
  BarChart3, 
  Shield, 
  Bell,
  DollarSign,
  Building,
  UserCheck,
  Activity,
  Archive,
  ChevronDown,
  ChevronRight,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

const AdminSidebar = () => {
  const [expandedSections, setExpandedSections] = useState({
    dashboard: true // Dashboard expanded by default
  });

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const sidebarItems = [
    {
      title: 'Overview',
      icon: LayoutDashboard,
      path: '/admin',
      exact: true,
      badge: { text: 'Live', color: 'bg-green-500' }
    },
    {
      title: 'Quick Actions',
      icon: Zap,
      isSection: true,
      key: 'quick',
      children: [
        { title: 'Pending Approvals', path: '/admin/approvals', icon: Clock, badge: { text: '3', color: 'bg-orange-500' } },
        { title: 'Security Alerts', path: '/admin/alerts', icon: AlertTriangle, badge: { text: '!', color: 'bg-red-500' } },
        { title: 'System Health', path: '/admin/health', icon: CheckCircle, badge: { text: '✓', color: 'bg-green-500' } }
      ]
    },
    {
      title: 'User Management',
      icon: Users,
      isSection: true,
      key: 'users',
      children: [
        { title: 'All Users', path: '/admin/users', icon: Users, count: '2.1k' },
        { title: 'User Verification', path: '/admin/users/verification', icon: UserCheck, badge: { text: '12', color: 'bg-blue-500' } },
        { title: 'Blocked Users', path: '/admin/users/blocked', icon: Shield, count: '23' }
      ]
    },
    {
      title: 'Account Management',
      icon: CreditCard,
      isSection: true,
      key: 'accounts',
      children: [
        { title: 'All Accounts', path: '/admin/accounts', icon: CreditCard, count: '1.8k' },
        { title: 'Account Verification', path: '/admin/accounts/verification', icon: UserCheck, badge: { text: '7', color: 'bg-blue-500' } },
        { title: 'Closed Accounts', path: '/admin/accounts/closed', icon: Archive, count: '156' }
      ]
    },
    {
      title: 'Financial Operations',
      icon: DollarSign,
      isSection: true,
      key: 'transactions',
      children: [
        { title: 'All Transactions', path: '/admin/transactions', icon: Activity, count: '15.2k' },
        { title: 'Pending Review', path: '/admin/transactions/pending', icon: Clock, badge: { text: '28', color: 'bg-orange-500' } },
        { title: 'Failed Transactions', path: '/admin/transactions/failed', icon: AlertTriangle, count: '45' },
        { title: 'Large Transfers', path: '/admin/transactions/large', icon: TrendingUp, badge: { text: '5', color: 'bg-purple-500' } }
      ]
    },
    {
      title: 'Analytics & Reports',
      icon: BarChart3,
      isSection: true,
      key: 'analytics',
      children: [
        { title: 'Financial Reports', path: '/admin/reports/financial', icon: BarChart3 },
        { title: 'User Analytics', path: '/admin/reports/users', icon: Users },
        { title: 'Transaction Analytics', path: '/admin/reports/transactions', icon: Activity },
        { title: 'Risk Assessment', path: '/admin/reports/risk', icon: Shield }
      ]
    },
    {
      title: 'Infrastructure',
      icon: Building,
      isSection: true,
      key: 'infrastructure',
      children: [
        { title: 'Branch Network', path: '/admin/branches', icon: Building, count: '47' },
        { title: 'ATM Management', path: '/admin/atms', icon: CreditCard, count: '234' },
        { title: 'Service Status', path: '/admin/services', icon: Zap }
      ]
    },
    {
      title: 'Communications',
      icon: Bell,
      path: '/admin/notifications',
      badge: { text: '8', color: 'bg-blue-500' }
    },
    {
      title: 'Security & Compliance',
      icon: Shield,
      isSection: true,
      key: 'security',
      children: [
        { title: 'Security Dashboard', path: '/admin/security', icon: Shield },
        { title: 'Audit Logs', path: '/admin/security/logs', icon: FileText },
        { title: 'Fraud Detection', path: '/admin/security/fraud', icon: AlertTriangle, badge: { text: '2', color: 'bg-red-500' } },
        { title: 'Access Control', path: '/admin/security/access', icon: UserCheck }
      ]
    },
    {
      title: 'System Configuration',
      icon: Settings,
      path: '/admin/settings'
    }
  ];

  const renderMenuItem = (item, index) => {
    if (item.isSection) {
      const isExpanded = expandedSections[item.key];
      
      return (
        <div key={index} className="mb-1">
          <button
            onClick={() => toggleSection(item.key)}
            className="w-full flex items-center justify-between px-3 py-2.5 text-gray-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3">
              <div className="text-gray-400 group-hover:text-white transition-colors duration-200">
                <item.icon size={18} />
              </div>
              <span className="font-medium text-sm">{item.title}</span>
            </div>
            <div className="flex items-center space-x-2">
              {item.badge && (
                <span className={`${item.badge.color} text-white text-xs px-1.5 py-0.5 rounded-full font-medium`}>
                  {item.badge.text}
                </span>
              )}
              {isExpanded ? (
                <ChevronDown size={16} className="text-gray-400 transition-transform duration-200" />
              ) : (
                <ChevronRight size={16} className="text-gray-400 transition-transform duration-200" />
              )}
            </div>
          </button>
          
          {/* Submenu */}
          {isExpanded && (
            <div className="ml-6 mt-1 space-y-0.5 border-l border-slate-700/50 pl-4">
              {item.children.map((child, childIndex) => (
                <NavLink
                  key={childIndex}
                  to={child.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-md transition-all duration-200 group ${
                      isActive
                        ? 'bg-slate-700 text-white border-l-2 border-blue-500'
                        : 'text-gray-400 hover:text-white hover:bg-slate-800/30'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-gray-500 group-hover:text-gray-300 transition-colors duration-200">
                      <child.icon size={16} />
                    </div>
                    <span className="text-sm">{child.title}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {child.badge && (
                      <span className={`${child.badge.color} text-white text-xs px-1.5 py-0.5 rounded-full font-medium`}>
                        {child.badge.text}
                      </span>
                    )}
                    {child.count && (
                      <span className="text-xs text-gray-500 bg-slate-800/30 px-1.5 py-0.5 rounded-full">
                        {child.count}
                      </span>
                    )}
                  </div>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={index}
        to={item.path}
        end={item.exact}
        className={({ isActive }) =>
          `flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 mb-1 group ${
            isActive
              ? 'bg-slate-700 text-white border-l-2 border-blue-500'
              : 'text-gray-300 hover:text-white hover:bg-slate-800/50'
          }`
        }
      >
        <div className="flex items-center space-x-3">
          <div className="text-gray-400 group-hover:text-white transition-colors duration-200">
            <item.icon size={18} />
          </div>
          <span className="font-medium text-sm">{item.title}</span>
        </div>
        {item.badge && (
          <span className={`${item.badge.color} text-white text-xs px-1.5 py-0.5 rounded-full font-medium`}>
            {item.badge.text}
          </span>
        )}
      </NavLink>
    );
  };

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-slate-900 border-r border-slate-700/50 overflow-hidden flex flex-col">
      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
      {/* Header Section */}
      <div className="p-4 border-b border-slate-700/50">
        <h2 className="text-white font-semibold text-sm">Admin Panel</h2>
        <p className="text-gray-400 text-xs mt-1">Banking Management System</p>
      </div>

      {/* Scrollable Navigation */}
      <div className="flex-1 overflow-y-auto custom-scrollbar" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#475569 transparent'
      }}>
        <nav className="p-4 space-y-1">
          {sidebarItems.map((item, index) => renderMenuItem(item, index))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50">
        {/* <div className="flex items-center space-x-2 text-xs text-gray-400">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>System Online</span>
        </div> */}
      </div>
    </div>
  );
};

export default AdminSidebar;