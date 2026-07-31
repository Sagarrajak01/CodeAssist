import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Bot, Trash2, LogOut, Wrench } from 'lucide-react';

const SettingsPage = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account preferences and profile.</p>
      </div>

      {/* Profile Information */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-colors">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Profile Information</h3>
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h4 className="text-xl font-semibold text-slate-800 dark:text-white">{user?.name}</h4>
            <p className="text-slate-500 dark:text-slate-400 capitalize">{user?.role || 'Standard User'}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input 
              type="text" 
              readOnly 
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 cursor-not-allowed" 
              value={user?.name || ''} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
            <input 
              type="email" 
              readOnly 
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 cursor-not-allowed" 
              value={user?.email || ''} 
            />
          </div>
        </div>
      </div>

      {/* AI Preferences - In Development */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-colors">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          AI Preferences  
        </h3>
        
        <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50/50 dark:bg-slate-950/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mb-3">
            <Wrench className="w-6 h-6 text-blue-500" />
          </div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-1">Under Development</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            We are currently building the ability for you to select custom AI models and provide your own API keys. Check back soon!
          </p>
        </div>
      </div>

      {/* Account Actions / Danger Zone */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-red-200 dark:border-red-900/30 shadow-sm transition-colors">
        <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4">Account Actions</h3>
        
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800/60">
            <div>
              <h4 className="font-medium text-slate-800 dark:text-white">Sign Out</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">Securely log out of your CodeAssist account on this device.</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-medium text-slate-800 dark:text-white">Delete Account</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">Permanently remove your account and delete all indexed repositories.</p>
            </div>
            <button
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 font-medium rounded-xl transition-colors shrink-0"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;