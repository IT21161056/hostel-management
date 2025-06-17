import { ReactNode, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Users, DoorOpen, AlertTriangle, UserCheck, LogOut, Menu as MenuIcon } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 flex md:hidden ${sidebarOpen ? 'visible' : 'invisible'}`} role="dialog">
        <div 
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${sidebarOpen ? 'opacity-100 ease-out duration-300' : 'opacity-0 ease-in duration-200'}`}
          onClick={() => setSidebarOpen(false)}
        ></div>
        
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-blue-800 transform transition ${sidebarOpen ? 'translate-x-0 ease-out duration-300' : '-translate-x-full ease-in duration-200'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <Home className="h-8 w-8 text-white" />
              <span className="ml-2 text-white font-semibold text-xl">HMS Admin</span>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              <NavLink 
                to="/admin/dashboard"
                className={({ isActive }) => 
                  `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <Home className="mr-3 h-5 w-5" />
                Dashboard
              </NavLink>
              <NavLink 
                to="/admin/students"
                className={({ isActive }) => 
                  `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <Users className="mr-3 h-5 w-5" />
                Students
              </NavLink>
              <NavLink 
                to="/admin/rooms"
                className={({ isActive }) => 
                  `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <DoorOpen className="mr-3 h-5 w-5" />
                Rooms
              </NavLink>
              <NavLink 
                to="/admin/complaints"
                className={({ isActive }) => 
                  `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <AlertTriangle className="mr-3 h-5 w-5" />
                Complaints
              </NavLink>
              <NavLink 
                to="/admin/visitors"
                className={({ isActive }) => 
                  `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <UserCheck className="mr-3 h-5 w-5" />
                Visitors
              </NavLink>
            </nav>
          </div>
          
          <div className="flex-shrink-0 flex border-t border-blue-700 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                  {user?.name.charAt(0)}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-base font-medium text-white">{user?.name}</p>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-blue-200 hover:text-white flex items-center"
                >
                  <LogOut className="mr-1 h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-shrink-0 w-14">
          {/* Force sidebar to shrink to fit close icon */}
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-blue-800">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <Home className="h-8 w-8 text-white" />
                <span className="ml-2 text-white font-semibold text-xl">HMS Admin</span>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                <NavLink 
                  to="/admin/dashboard"
                  className={({ isActive }) => 
                    `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
                  }
                >
                  <Home className="mr-3 h-5 w-5" />
                  Dashboard
                </NavLink>
                <NavLink 
                  to="/admin/students"
                  className={({ isActive }) => 
                    `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
                  }
                >
                  <Users className="mr-3 h-5 w-5" />
                  Students
                </NavLink>
                <NavLink 
                  to="/admin/rooms"
                  className={({ isActive }) => 
                    `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
                  }
                >
                  <DoorOpen className="mr-3 h-5 w-5" />
                  Rooms
                </NavLink>
                <NavLink 
                  to="/admin/complaints"
                  className={({ isActive }) => 
                    `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
                  }
                >
                  <AlertTriangle className="mr-3 h-5 w-5" />
                  Complaints
                </NavLink>
                <NavLink 
                  to="/admin/visitors"
                  className={({ isActive }) => 
                    `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
                  }
                >
                  <UserCheck className="mr-3 h-5 w-5" />
                  Visitors
                </NavLink>
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-blue-700 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                    {user?.name.charAt(0)}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-base font-medium text-white">{user?.name}</p>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-blue-200 hover:text-white flex items-center"
                  >
                    <LogOut className="mr-1 h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
        
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-4">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;