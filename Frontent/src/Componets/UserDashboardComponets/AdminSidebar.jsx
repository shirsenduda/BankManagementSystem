import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CiDollar } from "react-icons/ci";
import { IoReceipt } from "react-icons/io5";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { IoIosCard } from "react-icons/io";
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
  Clock,
  Menu,
  X
} from 'lucide-react';

const AdminSidebar = () => {
  const [expandedSections, setExpandedSections] = useState({
    dashboard: true // Dashboard expanded by default
  });
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Update CSS custom property when sidebar state changes
  React.useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', isCollapsed ? '64px' : '288px');
  }, [isCollapsed]);
  const toggleSection = (sectionKey) => {
    if (!isCollapsed) {
      setExpandedSections(prev => ({
        ...prev,
        [sectionKey]: !prev[sectionKey]
      }));
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
    // Close all expanded sections when collapsing
    if (!isCollapsed) {
      setExpandedSections({});
    } else {
      setExpandedSections({ dashboard: true });
    }
  };

  // Fixed sidebar navigation structure
  const sidebarItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin',
      exact: true,
    },
    {
      title: 'My Banks',
      icon: CiDollar,
      path: '/admin/banks',
      exact: true,
    },
    {
      title: 'Transactions History',
      icon: IoReceipt,
      path: '/admin/transactions',
      exact: true,
    },
    {
      title: 'Transfer Funds',
      icon: FaMoneyBillTransfer,
      path: '/admin/transfer',
      exact: true,
    },
    {
      title: 'Connect Bank',
      icon: IoIosCard,
      path: '/admin/connect-bank',
      exact: true,
    },
    {
      title: 'Profile',
      icon: Users,
      path: '/admin/users',
      exact: false,
    },
  ];

  const renderMenuItem = (item, index) => {
    if (item.isSection) {
      const isExpanded = expandedSections[item.key];
      
      return (
        <div key={index} className="mb-1">
          <button
            onClick={() => toggleSection(item.key)}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 text-gray-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200 group`}
            title={isCollapsed ? item.title : ''}
          >
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
              <div className="text-gray-400 group-hover:text-white transition-colors duration-200">
                <item.icon size={18} />
              </div>
              {!isCollapsed && <span className="font-medium text-sm">{item.title}</span>}
            </div>
            {!isCollapsed && (
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
            )}
          </button>
          
          {/* Submenu - only show when not collapsed */}
          {!isCollapsed && isExpanded && (
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
          `flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 rounded-lg transition-all duration-200 mb-1 group ${
            isActive
              ? 'bg-slate-700 text-white border-l-2 border-blue-500'
              : 'text-gray-300 hover:text-white hover:bg-slate-800/50'
          }`
        }
        title={isCollapsed ? item.title : ''}
      >
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="text-gray-400 group-hover:text-white transition-colors duration-200">
            <item.icon size={18} />
          </div>
          {!isCollapsed && <span className="font-medium text-sm">{item.title}</span>}
        </div>
        {!isCollapsed && item.badge && (
          <span className={`${item.badge.color} text-white text-xs px-1.5 py-0.5 rounded-full font-medium`}>
            {item.badge.text}
          </span>
        )}
      </NavLink>
    );
  };

  return (
    <div className={`fixed left-0 top-16 h-[calc(100vh-4rem)] ${isCollapsed ? 'w-16' : 'w-72'} bg-slate-900 border-r border-slate-700/50 overflow-hidden flex flex-col transition-all duration-300 ease-in-out`}>
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
      <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
        <div className={`${isCollapsed ? 'hidden' : 'block'}`}>
          <h2 className="text-white font-semibold text-sm">Admin Panel</h2>
          <p className="text-gray-400 text-xs mt-1">Banking Management System</p>
        </div>
        <button
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-white transition-colors duration-200 p-1 rounded-md hover:bg-slate-800/50"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>

      {/* Scrollable Navigation */}
      <div className="flex-1 overflow-y-auto custom-scrollbar" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#475569 transparent'
      }}>
        <nav className={`${isCollapsed ? 'p-2' : 'p-4'} space-y-1`}>
          {sidebarItems.map((item, index) => renderMenuItem(item, index))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} text-xs text-gray-400`}>
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          {!isCollapsed && <span>System Online</span>}
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;