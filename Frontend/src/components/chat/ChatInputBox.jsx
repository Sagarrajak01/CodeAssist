import React from 'react';

const ChatInputBox = ({ input, setInput, handleSend, isLoading, hasRepos }) => (
  <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 transition-colors">
    <form onSubmit={handleSend} className="flex gap-4">
      <input 
        type="text" 
        className="flex-1 px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors"
        placeholder={!hasRepos ? "Upload a repository first..." : "Ask anything about this codebase..."}
        value={input}
        onChange={e => setInput(e.target.value)}
        disabled={isLoading || !hasRepos}
      />
      <button 
        type="submit" 
        disabled={isLoading || !input.trim() || !hasRepos}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        Send
      </button>
    </form>
  </div>
);

export default ChatInputBox;