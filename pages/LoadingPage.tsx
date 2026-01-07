
import React from 'react';
import Spinner from '../components/ui/Spinner.tsx';

const LoadingPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner />
    </div>
  );
};

export default LoadingPage;
