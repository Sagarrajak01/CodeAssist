import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Code2, Terminal, User, X, Search, GitFork, Bug, ShieldCheck } from 'lucide-react';
import AnimatedBackground from '../components/common/AnimatedBackground';
import FloatingThemeToggle from '../components/common/FloatingThemeToggle';

const HomePage = () => {
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);

  const features = [
    {
      icon: <Search className="w-5 h-5 text-blue-500" />,
      title: 'RAG Code Search',
      description: 'Query your entire repository using semantic vector search instead of fragile keyword search.'
    },
    {
      icon: <GitFork className="w-5 h-5 text-purple-500" />,
      title: 'Architecture Mapping',
      description: 'Understand relationships, data flows, and dependencies across services before making big changes.'
    },
    {
      icon: <Bug className="w-5 h-5 text-red-500" />,
      title: 'Contextual Debugging',
      description: 'Feed error stack traces to immediately pinpoint root causes and suggested code fixes.'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
      title: 'Private & Secure Embeddings',
      description: 'Your codebase indexes remain local and secure with zero third-party training usage.'
    }
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans transition-colors duration-300">
      
      <AnimatedBackground />
      <FloatingThemeToggle />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Column: Hero Content */}
        <div className="flex-1 text-center lg:text-left space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md text-sm font-medium text-slate-700 dark:text-slate-300 transition-transform hover:scale-105 cursor-default">
            <img 
              src="/favicon.svg" 
              alt="CodeAssist Logo" 
              className="w-4 h-4 object-contain" 
            />
            <span>AI-Powered Developer Assistant</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Understand your <br className="hidden lg:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              entire codebase.
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            CodeAssist uses Retrieval-Augmented Generation to help you chat with your codebase, understand architecture, and debug efficiently.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <Link
              to="/dashboard"
              className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-blue-500/25 font-semibold transition-all duration-200 hover:-translate-y-0.5"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            {/* View Features Button */}
            <button 
              onClick={() => setIsFeaturesOpen(true)}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-xl font-semibold backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
            >
              <Code2 className="w-5 h-5" />
              View Features
            </button>
          </div>
        </div>

        {/* Right Column: Mock Dashboard Illustration */}
        <div className="flex-1 w-full max-w-2xl lg:max-w-none relative group perspective-1000">
          <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow-2xl rounded-2xl overflow-hidden flex flex-col transform transition-transform duration-500 hover:rotate-y-2 hover:scale-[1.01]">
            
            {/* Window Controls */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border-b border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
              <div className="w-3 h-3 rounded-full bg-red-400/90 shadow-inner"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400/90 shadow-inner"></div>
              <div className="w-3 h-3 rounded-full bg-green-400/90 shadow-inner"></div>
              <div className="mx-auto text-xs font-mono font-medium text-slate-400 dark:text-slate-500">codeassist-workspace</div>
            </div>

            {/* Chat Interface Mockup */}
            <div className="p-5 sm:p-6 flex flex-col gap-5 font-mono text-sm h-full">
              
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-300 dark:border-slate-700">
                  <User className="w-4 h-4 text-slate-500" />
                </div>
                <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-sm">
                  Can you explain the authentication flow in <span className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">auth.ts</span>?
                </div>
              </div>

              <div className="flex gap-4 items-start mt-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="w-full space-y-3">
                  <div className="bg-gradient-to-br from-white to-blue-50/30 dark:from-slate-900/80 dark:to-blue-900/10 p-4 rounded-2xl rounded-tl-none border border-blue-100 dark:border-blue-900/50 text-slate-700 dark:text-slate-300 shadow-sm space-y-4">
                    <p className="leading-relaxed font-sans">
                      Based on the repository context, here is how the JWT authentication is implemented:
                    </p>
                    
                    <div className="bg-[#0d1117] rounded-xl p-4 overflow-hidden border border-slate-800 shadow-inner">
                      <div className="flex items-center gap-2 mb-3 text-slate-400 text-xs border-b border-slate-800/80 pb-2">
                        <Terminal className="w-3 h-3" /> TypeScript
                      </div>
                      <div className="space-y-2 opacity-90">
                        <div className="flex items-center gap-4">
                          <div className="w-1/2 h-2.5 bg-purple-400/40 rounded-sm"></div>
                          <div className="w-1/4 h-2.5 bg-blue-400/40 rounded-sm"></div>
                        </div>
                        <div className="w-3/4 h-2.5 bg-green-400/40 rounded-sm ml-4"></div>
                        <div className="w-5/6 h-2.5 bg-slate-400/40 rounded-sm ml-4"></div>
                        <div className="w-1/3 h-2.5 bg-orange-400/40 rounded-sm ml-4"></div>
                        <div className="w-1/4 h-2.5 bg-purple-400/40 rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Features Modal (Now scrolls safely on mobile!) */}
      {isFeaturesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md transition-opacity">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 custom-scrollbar">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <img 
                  src="/favicon.svg" 
                  alt="CodeAssist Logo" 
                  className="w-5 h-5 object-contain" 
                />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Core Features</h3>
              </div>
              <button 
                onClick={() => setIsFeaturesOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 space-y-2">
                  <div className="p-2 w-fit rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                    {feature.icon}
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">{feature.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsFeaturesOpen(false)}
                className="px-5 py-2.5 text-sm font-medium bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default HomePage;