import React from 'react';

const PlaceholderPage = ({ title }) => (
  <div className="max-w-6xl mx-auto">
    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">{title}</h2>
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-12 text-center text-gray-500 dark:text-slate-400 transition-colors">
      This module is under construction.
    </div>
  </div>
);

export default PlaceholderPage;