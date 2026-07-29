import React, { useState } from 'react';
import api from '../../utils/api';
import { UploadCloud, AlertCircle, FileArchive, FileText, Loader2 } from 'lucide-react';

const ZipUploadCard = ({ onSuccess }) => {
  const [zipFile, setZipFile] = useState(null);
  const [zipName, setZipName] = useState('');
  const [zipLoading, setZipLoading] = useState(false);
  const [zipError, setZipError] = useState('');

  const handleZipUpload = async (e) => {
    e.preventDefault();
    if (!zipFile) return setZipError("Please select a ZIP file");
    
    setZipLoading(true);
    setZipError('');
    
    const formData = new FormData();
    formData.append('repoZip', zipFile);
    formData.append('name', zipName || zipFile.name.replace('.zip', ''));

    try {
      await api.post('/repos/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setZipFile(null);
      setZipName('');
      onSuccess();
    } catch (err) {
      setZipError(err.response?.data?.message || 'Upload failed');
    } finally {
      setZipLoading(false);
    }
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all hover:shadow-md flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl shadow-inner border border-blue-100/50 dark:border-blue-900/30">
          <UploadCloud className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Upload ZIP</h3>
      </div>
      
      <form onSubmit={handleZipUpload} className="space-y-5 flex-1 flex flex-col">
        {zipError && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-red-800 dark:text-red-400">{zipError}</p>
          </div>
        )}
        
        <div className="relative group/dropzone border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500/70 rounded-2xl flex-1 flex flex-col items-center justify-center min-h-[140px] p-6 text-center transition-all bg-slate-50/50 dark:bg-slate-950/50 overflow-hidden">
          <input 
            type="file" 
            accept=".zip" 
            onChange={(e) => setZipFile(e.target.files[0])} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
          />
          <div className="flex flex-col items-center justify-center space-y-1 relative z-0">
            {zipFile ? (
              <>
                <FileArchive className="w-8 h-8 text-blue-500 mb-1" />
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">{zipFile.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{(zipFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </>
            ) : (
              <>
                <UploadCloud className="w-8 h-8 text-slate-400 dark:text-slate-500 group-hover/dropzone:text-blue-500 transition-colors mb-1 group-hover/dropzone:-translate-y-1 duration-300" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Click or drag a ZIP file here</p>
                <p className="text-xs text-slate-500 dark:text-slate-500">Maximum file size: 50MB</p>
              </>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Custom Project Name</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500 text-slate-400">
              <FileText className="h-5 w-5" />
            </div>
            <input 
              type="text" 
              placeholder="Leave empty to use zip name" 
              value={zipName} 
              onChange={(e) => setZipName(e.target.value)} 
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all shadow-sm" 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={zipLoading || !zipFile} 
          className="group flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-blue-500/25 font-semibold transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-auto"
        >
          {zipLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
          {zipLoading ? 'Uploading & Indexing...' : 'Upload & Extract'}
        </button>
      </form>
    </div>
  );
};

export default ZipUploadCard;