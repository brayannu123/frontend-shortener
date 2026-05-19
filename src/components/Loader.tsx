import React from 'react';

interface LoaderProps {
  label?: string;
}

const Loader: React.FC<LoaderProps> = ({ label = 'Acortando tu enlace...' }) => {
  return (
    <div className="animate-rise flex flex-col items-center justify-center space-y-3 py-6">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-4 border-sky-600/20"></div>
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-b-transparent border-l-transparent border-r-transparent border-t-sky-600"></div>
      </div>
      <p className="animate-pulse text-sm font-medium text-sky-700">{label}</p>
    </div>
  );
};

export default Loader;
