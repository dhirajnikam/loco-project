import React from 'react';
import './Loading.css';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Loading...', fullScreen = false }) => {
  const className = fullScreen ? 'loading-container fullscreen' : 'loading-container';

  return (
    <div className={className}>
      <div className="loading-spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default Loading;
