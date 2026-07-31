import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../utils/api';
import { 
  Plus, 
  Database, 
  FileCode2, 
  Activity, 
  FolderGit2, 
  MessageSquare, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Server
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [health, setHealth] = useState('Checking...');
  const [isHealthOk, setIsHealthOk] = useState(false);
  const [repos, setRepos] = useState([]);
  const [recentChats, setRecentChats] = useState([]);

  useEffect(() => {
    api.get('/health')
      .then(() => {
        setHealth('Online & Connected');
        setIsHealthOk(true);
      })
      .catch(() => {
        setHealth('Offline');
        setIsHealthOk(false);
      });

    api.get('/repos')
      .then(res => {
        const fetchedRepos = res.data.data;
        setRepos(fetchedRepos);

        let chats = [];
        fetchedRepos.forEach(repo => {
          if (repo.chatHistory && repo.chatHistory.length > 0) {
            const lastMsg = repo.chatHistory[repo.chatHistory.length - 1];
            chats.push({
              repoId: repo._id,
              repoName: repo.name,
              message: lastMsg.content,
              timestamp: lastMsg.timestamp
            });
          }
        });
        
        chats.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setRecentChats(chats.slice(0, 4));
      })
      .catch(err => console.error("Failed to fetch dashboard data:", err));
  }, []);

  const totalFiles = repos.reduce((acc, r) => acc + r.fileCount, 0);
  const totalCompleted = repos.filter(r => r.status === 'completed').length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 transition-all duration-300 group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/5 rounded-full filter blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 dark:bg-purple-500/5 rounded-full filter blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
        
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome Back  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">{user?.name.split(' ')[0]}</span> 
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">
            Here is what's happening in your AI workspace today.
          </p>
        </div>
        
        <Link 
          to="/repositories" 
          className="relative z-10 group/btn flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/25 transition-all duration-200 hover:-translate-y-0.5 w-full sm:w-auto"
        >
          <Plus className="w-5 h-5 group-hover/btn:rotate-90 transition-transform duration-300" />
          <span>New Repository</span>
        </Link>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex items-center gap-5 transition-all hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/50">
          <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400 shadow-inner">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Indexed Repos</h3>
            <p className="text-3xl font-bold text-slate-900 dark:text-white leading-none">{totalCompleted}</p>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex items-center gap-5 transition-all hover:shadow-md hover:border-purple-200 dark:hover:border-purple-900/50">
          <div className="p-4 bg-purple-50 dark:bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400 shadow-inner">
            <FileCode2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total Files</h3>
            <p className="text-3xl font-bold text-slate-900 dark:text-white leading-none">{totalFiles}</p>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex items-center gap-5 transition-all hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-900/50">
          <div className={`p-4 rounded-xl shadow-inner ${isHealthOk ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'}`}>
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">System Health</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-bold text-slate-900 dark:text-white">{health}</span>
              {isHealthOk && (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Lists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Repositories */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex flex-col h-[26rem] transition-all">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/60 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 rounded-t-2xl">
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-blue-500" />
              Recent Repositories
            </h2>
            <Link to="/repositories" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1 group">
              View All <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {repos.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/20">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 mb-3"><FolderGit2 className="w-6 h-6" /></div>
                <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">No repositories yet</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Upload your first codebase to get started.</p>
              </div>
            ) : (
              repos.slice(0, 4).map(repo => (
                <Link to={`/chat?repo=${repo._id}`} key={repo._id} className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/20 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:border-blue-100 dark:hover:border-blue-900/50 transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 text-blue-500 group-hover:scale-110 transition-transform">
                      <FileCode2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{repo.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{repo.fileCount} files indexed</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide border ${
                      repo.status === 'completed' 
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' 
                        : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                    }`}>
                      {repo.status === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      {repo.status}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent AI Chats */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex flex-col h-[26rem] transition-all">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/60 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 rounded-t-2xl">
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-500" />
              Recent AI Chats
            </h2>
            <Link to="/chat" className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors flex items-center gap-1 group">
              New Chat <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {recentChats.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/20">
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500 mb-3"><MessageSquare className="w-6 h-6" /></div>
                <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">No recent chats</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Ask your codebase a question to see history.</p>
              </div>
            ) : (
              recentChats.map((chat, idx) => (
                <Link to={`/chat?repo=${chat.repoId}`} key={idx} className="group block p-4 rounded-xl border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/20 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:border-purple-100 dark:hover:border-purple-900/50 transition-all duration-200">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <h4 className="font-semibold text-xs text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{chat.repoName}</h4>
                    </div>
                    <span className="text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      {new Date(chat.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 pl-4 border-l-2 border-slate-200 dark:border-slate-700/50 group-hover:border-purple-300 dark:group-hover:border-purple-500/50 transition-colors">
                    "{chat.message}"
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;