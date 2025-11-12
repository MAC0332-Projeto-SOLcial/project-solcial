import React from 'react';

const LoadingSpinner = ({ className = 'h-12 w-12' }) => {
  return (
    <div className={`animate-spin rounded-full border-b-2 border-green-600 ${className}`}></div>
  );
};

export { LoadingSpinner };