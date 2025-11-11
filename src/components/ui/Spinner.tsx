import React from 'react';

const Spinner: React.FC<{ size?: number }> = ({ size = 24 }) => {
  return (
    <div 
      style={{ width: size, height: size }}
      className="border-2 border-dashed rounded-full animate-spin border-primary"
    ></div>
  );
};

export default Spinner;
