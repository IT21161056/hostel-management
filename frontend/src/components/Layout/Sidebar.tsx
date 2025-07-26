import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  ClipboardCheck, 
  UtensilsCrossed, 
  CreditCard, 
  BarChart3, 
  Settings,
  Building2,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: Home, 
    permission: 'view_dashboard'
  },
  { 
    name: 'Students', 
    href: '/students', 
    icon: Users, 
    permission: 'view_students'
  },
  { 
    name: 'Attendance', 
    href: '/attendance', 
    icon: ClipboardCheck, 
    permission: 'view_attendance'
  },
  { 
    name: 'Meal Planning', 
    href: '/meals', 
    icon: UtensilsCrossed, 
    permission: 'view_meals'
  },
  { 
    name: 'Finance', 
    href: '/finance', 
    icon: CreditCard, 
    permission: 'view_finance'
  },
  { 
    name: 'Reports', 
    href: '/reports', 
    icon: BarChart3, 
    permission: 'view_reports'
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: Settings, 
    permission: 'manage_settings'
  },
];

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const { user, logout, hasPermission } = useAuth();

  const filteredNavigation = navigation.filter(item => 
    hasPermission(item.permission)
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-600';
      case 'warden': return 'bg-blue-600';
      case 'accountant': return 'bg-green-600';
      case 'kitchen': return 'bg-orange-600';
      default: return 'bg-gray-600';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'warden': return 'Warden';
      case 'accountant': return 'Accountant';
      case 'kitchen': return 'Kitchen Staff';
      default: return role;
    }
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-50 bg-gray-900 text-white transform transition-all duration-300 ease-in-out flex flex-col ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center h-16 px-4 border-b border-gray-700 flex-shrink-0 relative">
        {/* Logo and Title */}
        <div className={`flex items-center transition-opacity duration-300 min-w-0 ${
          isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}>
          <Building2 className="h-8 w-8 text-blue-400 flex-shrink-0" />
          <span className="ml-2 text-xl font-bold truncate">Ananda Hostels</span>
        </div>
        
        {/* Collapsed Logo - Centered */}
        {isCollapsed && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Building2 className="h-8 w-8 text-blue-400" />
          </div>
        )}
        
        {/* Toggle Button - Always positioned on the right */}
        <button
          onClick={onToggle}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 z-10 ${
            isCollapsed ? 'bg-gray-800' : ''
          }`}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-2 py-6 space-y-1 overflow-y-auto overflow-x-hidden">
        {filteredNavigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative min-w-0 ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
            title={isCollapsed ? item.name : ''}
          >
            <item.icon className={`h-5 w-5 flex-shrink-0 ${
              isCollapsed ? 'mx-auto' : 'mr-3'
            }`} />
            
            {!isCollapsed && (
              <span className="truncate">
                {item.name}
              </span>
            )}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {item.name}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-700 flex-shrink-0">
        <div className={`flex items-center transition-all duration-300 min-w-0 ${
          isCollapsed ? 'justify-center' : 'mb-4'
        }`}>
          <div className={`${getRoleColor(user?.role || '')} rounded-full flex items-center justify-center flex-shrink-0 ${
            isCollapsed ? 'h-8 w-8' : 'h-10 w-10'
          }`}>
            <span className="text-sm font-medium">
              {user?.avatar || user?.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          
          {!isCollapsed && (
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{getRoleLabel(user?.role || '')}</p>
            </div>
          )}
        </div>
        
        <button
          onClick={logout}
          className={`flex items-center w-full text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all duration-200 group relative min-w-0 ${
            isCollapsed ? 'justify-center p-2' : 'px-4 py-2'
          }`}
          title={isCollapsed ? 'Sign Out' : ''}
        >
          <LogOut className={`h-4 w-4 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`} />
          
          {!isCollapsed && (
            <span className="truncate">Sign Out</span>
          )}
          
          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Sign Out
            </div>
          )}
        </button>
      </div>
    </div>
  );
}