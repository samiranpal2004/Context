
import React from 'react';

const LoadingSpinner: React.FC<{ fullPage?: boolean }> = ({ fullPage }) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <span className="text-sm font-medium text-slate-600">Syncing with your brain...</span>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-[9999] flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
