import React, { useState } from 'react';
import api from '../../utils/api';
import { GitBranch, AlertCircle, Link as LinkIcon, FileText, Loader2 } from 'lucide-react';

const GitCloneCard = ({ onSuccess }) => {
  const [githubUrl, setGithubUrl] = useState('');
  const [gitName, setGitName] = useState('');
  const [gitLoading, setGitLoading] = useState(false);
  const [gitError, setGitError] = useState('');

  const handleGithubClone = async (e) => {
    e.preventDefault();
    if (!githubUrl) return setGitError("Please enter a GitHub URL");
    
    setGitLoading(true);
    setGitError('');

    try {
      await api.post('/repos/clone', { 
        repoUrl: githubUrl, 
        name: gitName || githubUrl.split('/').pop().replace('.git', '')
      });
      setGithubUrl('');
      setGitName('');
      onSuccess();
    } catch (err) {
      setGitError(err.response?.data?.message || 'Cloning failed');
    } finally {
      setGitLoading(false);
    }
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all hover:shadow-md flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl shadow-inner border border-slate-200/50 dark:border-slate-700/50">
          <GitBranch className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Clone Repository</h3>
      </div>
      
      <form onSubmit={handleGithubClone} className="space-y-5 flex-1 flex flex-col">
        {gitError && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-red-800 dark:text-red-400">{gitError}</p>
          </div>
        )}
        
        <div className="space-y-1.5 flex-1 flex flex-col justify-center">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Repository URL <span className="text-red-500">*</span></label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-slate-900 dark:group-focus-within:text-white text-slate-400">
              <LinkIcon className="h-5 w-5" />
            </div>
            <input 
              type="url" 
              required 
              placeholder="https://github.com/user/repo" 
              value={githubUrl} 
              onChange={(e) => setGithubUrl(e.target.value)} 
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all shadow-sm" 
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Custom Project Name</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-slate-900 dark:group-focus-within:text-white text-slate-400">
              <FileText className="h-5 w-5" />
            </div>
            <input 
              type="text" 
              placeholder="Leave empty to use repo name" 
              value={gitName} 
              onChange={(e) => setGitName(e.target.value)} 
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all shadow-sm" 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={gitLoading || !githubUrl} 
          className="group flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl shadow-lg font-semibold transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-auto"
        >
          {gitLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GitBranch className="w-5 h-5" />}
          {gitLoading ? 'Cloning & Indexing...' : 'Clone Repository'}
        </button>
      </form>
    </div>
  );
};

export default GitCloneCard;