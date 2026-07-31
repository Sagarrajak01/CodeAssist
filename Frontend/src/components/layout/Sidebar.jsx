import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Icons from '../icons/Icons';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Icons.Home },
    { name: 'Repositories', path: '/repositories', icon: Icons.FolderTree },
    { name: 'AI Chat', path: '/chat', icon: Icons.MessageSquare },
    { name: 'Settings', path: '/settings', icon: Icons.Settings },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-colors`}>
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 transition-colors">
        <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Code<span className="text-blue-600 dark:text-blue-500">Assist</span></h1>
      </div>
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname.includes(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => { if (window.innerWidth < 1024) toggleSidebar(); }}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-blue-50 dark:bg-blue-600/20 text-blue-700 dark:text-blue-400 font-medium' 
                  : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-slate-200'
              }`}
            >
              <item.icon />
              <span className="ml-3">{item.name}</span>
            </Link>
          );
        })}
        
        <button
          onClick={logout}
          className="w-full flex items-center px-4 py-3 mt-4 rounded-lg transition-colors duration-200 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium"
        >
          <Icons.LogOut />
          <span className="ml-3">Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;