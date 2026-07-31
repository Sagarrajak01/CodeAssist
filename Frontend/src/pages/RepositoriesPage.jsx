import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FolderGit2, FolderPlus } from 'lucide-react';
import ZipUploadCard from '../components/repositories/ZipUploadCard';
import GitCloneCard from '../components/repositories/GitCloneCard';
import RepositoryCard from '../components/repositories/RepositoryCard';

const RepositoriesPage = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRepos = async () => {
    try {
      const res = await api.get('/repos');
      setRepos(res.data.data);
    } catch (err) {
      console.error("Failed to fetch repos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const handleDeleteRepo = async (repoId) => {
    if (!window.confirm("Are you sure you want to delete this repository and its vector index?")) return;
    
    setRepos(prev => prev.filter(r => r._id !== repoId));

    try {
      await api.delete(`/repos/${repoId}`);
    } catch (err) {
      alert("Failed to delete repository from server. Please refresh.");
      fetchRepos();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Page Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <FolderPlus className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          Repository Manager
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">
          Upload local codebases or clone directly from Git to begin AI indexing.
        </p>
      </div>

      {/* Upload & Clone Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <ZipUploadCard onSuccess={fetchRepos} />
        <GitCloneCard onSuccess={fetchRepos} />
      </div>

      {/* Your Codebases Section */}
      <div className="pt-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <FolderGit2 className="w-5 h-5 text-slate-500" />
          Your Indexed Codebases
        </h3>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 rounded-2xl bg-slate-100 dark:bg-slate-800/50 animate-pulse"></div>
            ))}
          </div>
        ) : repos.length === 0 ? (
          <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-12 text-center flex flex-col items-center justify-center transition-colors">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-4">
              <FolderPlus className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No repositories added yet</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              Upload a ZIP file or clone a codebase from a Git URL above to start exploring your code with AI.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {repos.map(repo => (
              <RepositoryCard 
                key={repo._id} 
                repo={repo} 
                onDelete={handleDeleteRepo} 
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default RepositoriesPage;