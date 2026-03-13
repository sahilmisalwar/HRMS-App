import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, FileText, Settings, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Candidates', path: '/candidates', icon: Users },
    { name: 'Add Candidate', path: '/candidates/add', icon: UserPlus },
    // { name: 'Documents', path: '/documents', icon: FileText },
  ];

  if (user?.role === 'HR_ADMIN') {
    navItems.push({ name: 'Settings', path: '/settings', icon: Settings });
  }

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen flex flex-col justify-between hidden md:block transition-colors duration-200">
      <div>
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
          <span className="text-2xl font-bold text-primary dark:text-blue-400">HRMS</span>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-primary dark:text-blue-400 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
