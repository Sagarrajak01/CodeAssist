import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import AnimatedBackground from '../components/common/AnimatedBackground';
import FloatingThemeToggle from '../components/common/FloatingThemeToggle';
import api from '../utils/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    setIsLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setStatus({ 
        type: 'success', 
        message: 'If an account exists with that email, we have sent password reset instructions.' 
      });
      setEmail('');
    } catch (err) {
      if (err.response?.status === 404) {
        setStatus({ 
          type: 'error', 
          message: 'The password reset feature is currently under development. Please check back later or contact support.' 
        });
      } else {
        setStatus({ 
          type: 'error', 
          message: err.response?.data?.message || 'Something went wrong. Please try again.' 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">
      
      <AnimatedBackground />
      <FloatingThemeToggle />

      {/* Back to Home Button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 md:top-8 md:left-8 z-20 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors bg-white/50 dark:bg-slate-900/50 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="relative z-10 w-full max-w-md mt-10 sm:mt-0">
        <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-3xl blur opacity-20 transition duration-1000"></div>
        
        <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow-2xl rounded-3xl p-8 sm:p-10">
          
          <div className="text-center mb-8">
            {/* Clickable Logo */}
            <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 shadow-sm mb-4 overflow-hidden hover:scale-105 transition-transform">
              <img src="/favicon.svg" alt="CodeAssist Logo" className="w-6 h-6 object-contain" />
            </Link>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
              Reset Password
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Enter your email and we'll send you reset instructions.
            </p>
          </div>

          {status.message && (
            <div className={`mb-6 p-4 rounded-xl border flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${
              status.type === 'success' 
                ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20' 
                : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20'
            }`}>
              {status.type === 'success' 
                ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                : <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              }
              <p className={`text-sm font-medium ${
                status.type === 'success' ? 'text-emerald-800 dark:text-emerald-400' : 'text-red-800 dark:text-red-400'
              }`}>
                {status.message}
              </p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500 text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all shadow-sm"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="group relative flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-blue-500/25 font-semibold transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-6"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;