import React, { useContext, useState, useRef, useEffect } from 'react';
import { Bell, User, X, Moon, Sun } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const TopNav = () => {
  const { user } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  // Example placeholder notifications
  const notifications = [
    { id: 1, title: 'New Application', message: 'Alice Johnson applied for Frontend Developer.', time: '10m ago', unread: true },
    { id: 2, title: 'Offer Accepted', message: 'Charlie Brown has accepted the Product Manager offer.', time: '2h ago', unread: true },
    { id: 3, title: 'System Alert', message: 'Weekly recruitment report is ready to download.', time: '1d ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 relative z-10 transition-colors duration-200">
      <div className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        Welcome back, {user?.full_name?.split(' ')[0] || 'User'}!
      </div>
      <div className="flex items-center gap-4">
        
        {/* Dark Mode Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          title="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-full transition-colors relative ${showNotifications ? 'bg-blue-50 text-primary dark:bg-blue-900/30' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">{unreadCount} New</span>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {notifications.map(notif => (
                      <div key={notif.id} className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${notif.unread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                        <div className="flex justify-between items-start mb-1">
                          <p className={`text-sm font-medium ${notif.unread ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>{notif.title}</p>
                          <span className="text-xs text-gray-400 dark:text-gray-500">{notif.time}</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                    No new notifications
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-gray-100 dark:border-gray-700 text-center">
                <button className="text-sm font-medium text-primary hover:text-blue-700 dark:hover:text-blue-400">Mark all as read</button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 border-l border-gray-200 dark:border-gray-700 pl-4">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary dark:bg-primary/20">
            <User className="w-6 h-6" />
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.full_name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{user?.role === 'HR_ADMIN' ? 'HR Administrator' : 'Manager'}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
