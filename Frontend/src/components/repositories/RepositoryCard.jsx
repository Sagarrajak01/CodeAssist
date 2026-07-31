import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Trash2, CheckCircle2, Loader2, FileText, MessageSquare } from 'lucide-react';

const RepositoryCard = ({ repo, onDelete }) => (
  <div className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700/50 hover:-translate-y-1">
    <div>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 pr-3">
          <h4 className="font-bold text-slate-900 dark:text-white text-lg truncate" title={repo.name}>
            {repo.name}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Added {new Date(repo.createdAt).toLocaleDateString()}
          </p>
        </div>
        <button 
          onClick={() => onDelete(repo._id)}
          className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
          title="Delete Repository"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex items-center gap-2 mb-6">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide border ${
          repo.status === 'completed' 
            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' 
            : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
        }`}>
          {repo.status === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {repo.status}
        </span>
      </div>
    </div>
    
    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/60">
      <div className="flex items-center text-slate-600 dark:text-slate-400 text-sm bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
        <FileText className="w-4 h-4 mr-2 text-slate-400" />
        <span className="font-semibold">{repo.fileCount}</span> <span className="ml-1 hidden sm:inline">files</span>
      </div>
      <Link 
        to={`/chat?repo=${repo._id}`} 
        className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg font-medium transition-colors text-sm"
      >
        <MessageSquare className="w-4 h-4" />
        Chat AI
      </Link>
    </div>
  </div>
);

export default RepositoryCard;