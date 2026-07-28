import React from 'react';
import Icons from '../icons/Icons';

const ChatHeader = ({ repos, selectedRepo, onSelectRepo }) => (
  <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 transition-colors">
    <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
      <Icons.Code /> AI Code Assistant
    </h2>
    <select 
      className="px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
      value={selectedRepo}
      onChange={(e) => onSelectRepo(e.target.value)}
    >
      {repos.length === 0 && <option value="">No indexed repos available</option>}
      {repos.map(repo => (
        <option key={repo._id} value={repo._id}>{repo.name}</option>
      ))}
    </select>
  </div>
);

export default ChatHeader;