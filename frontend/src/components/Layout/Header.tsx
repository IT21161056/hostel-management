import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
  sidebarCollapsed?: boolean;
}

export default function Header({ title, onMenuClick, sidebarCollapsed }: HeaderProps) {
  return (
    <header className={`bg-white border-b border-gray-200 px-6 py-4 transition-all duration-300 ${
      sidebarCollapsed ? 'ml-16' : 'ml-0'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors duration-200"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="ml-2 lg:ml-0 text-2xl font-bold text-gray-900">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden sm:block relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            />
          </div>
          
          <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <Bell className="h-6 w-6" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
}