import React from 'react';

const Card = ({ children, className = '', onClick }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className} mb-5 ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick ? onClick : undefined} 
    >
      {children}
    </div>
  );
};

export default Card;
