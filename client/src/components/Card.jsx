import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className} mb-5`}>
      {children}
    </div>
  );
};

export default Card;