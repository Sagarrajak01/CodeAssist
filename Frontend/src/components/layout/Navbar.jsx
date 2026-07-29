import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import Icons from '../icons/Icons';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-40 sticky top-0 shadow-sm transition-colors">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none lg:hidden mr-4"
        >
          <Icons.Menu />
        </button>
        <div className="hidden sm:block text-sm text-gray-500 dark:text-gray-400 font-medium">
          Workspace / Overview
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleTheme} 
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Theme"
        >
          {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
        </button>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block">{user?.name}</span>
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md cursor-pointer">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
      </div>
    </header>
  );
};

export default Navbar;