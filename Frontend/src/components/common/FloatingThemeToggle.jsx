import React, { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import Icons from '../icons/Icons';

const FloatingThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <button 
      onClick={toggleTheme} 
      className="absolute top-6 right-6 md:top-8 md:right-8 z-50 p-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm transition-colors"
      title="Toggle Theme"
    >
      {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
    </button>
  );
};

export default FloatingThemeToggle;