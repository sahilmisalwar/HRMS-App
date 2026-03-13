import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { KeyRound, Shield, UserCog, Mail, Bell } from 'lucide-react';

const Settings = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">System Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage global HRMS preferences and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation / Tabs Sidebar */}
        <div className="md:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center justify-between px-4 py-3 font-medium rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
          >
            <span className="flex items-center gap-3"><UserCog className="w-5 h-5" /> Profile Settings</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center justify-between px-4 py-3 font-medium rounded-lg transition-colors ${activeTab === 'security' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
          >
            <span className="flex items-center gap-3"><Shield className="w-5 h-5" /> Security</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center justify-between px-4 py-3 font-medium rounded-lg transition-colors ${activeTab === 'notifications' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
          >
            <span className="flex items-center gap-3"><Mail className="w-5 h-5" /> Notifications</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Profile Tab */}
          {activeTab === 'profile' && (
             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Your Profile</h2>
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                   <input type="text" disabled value={user?.full_name || ''} className="mt-1 block w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg py-2 px-3 text-gray-500 dark:text-gray-400 sm:text-sm" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                   <input type="email" disabled value={user?.email || ''} className="mt-1 block w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg py-2 px-3 text-gray-500 dark:text-gray-400 sm:text-sm" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                   <input type="text" disabled value={user?.role === 'HR_ADMIN' ? 'Administrator' : 'Manager'} className="mt-1 block w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg py-2 px-3 text-gray-500 dark:text-gray-400 sm:text-sm" />
                 </div>
               </div>
             </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">Change Password</h2>
               <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Update your password associated with this account.</p>
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                   <div className="mt-1 relative rounded-md shadow-sm">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <KeyRound className="h-4 w-4 text-gray-400" />
                     </div>
                     <input type="password" placeholder="••••••••" className="block w-full pl-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg py-2 focus:ring-primary focus:border-primary sm:text-sm" />
                   </div>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                   <div className="mt-1 relative rounded-md shadow-sm">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <KeyRound className="h-4 w-4 text-gray-400" />
                     </div>
                     <input type="password" placeholder="••••••••" className="block w-full pl-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg py-2 focus:ring-primary focus:border-primary sm:text-sm" />
                   </div>
                 </div>
                 <div className="pt-2">
                   <button className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition" onClick={() => alert('Password update functionality is a placeholder.')}>
                     Update Password
                   </button>
                 </div>
               </div>
             </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">Notification Preferences</h2>
               <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Choose what updates you want to receive via email.</p>
               
               <div className="space-y-5">
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-sm font-medium text-gray-900 dark:text-gray-100">New Candidate Applications</p>
                     <p className="text-xs text-gray-500 dark:text-gray-400">Get notified when a candidate applies via the career portal.</p>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                     <input type="checkbox" defaultChecked className="sr-only peer" />
                     <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                   </label>
                 </div>
                 
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Interview Reminders</p>
                     <p className="text-xs text-gray-500 dark:text-gray-400">Daily morning digest of upcoming scheduled interviews.</p>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                     <input type="checkbox" defaultChecked className="sr-only peer" />
                     <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                   </label>
                 </div>

                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Offer Acceptances</p>
                     <p className="text-xs text-gray-500 dark:text-gray-400">Alerts when a candidate signs and accepts their offer letter.</p>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                     <input type="checkbox" className="sr-only peer" />
                     <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                   </label>
                 </div>
               </div>
               
               <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition" onClick={() => alert('Preferences saved!')}>
                    Save Preferences
                  </button>
               </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
