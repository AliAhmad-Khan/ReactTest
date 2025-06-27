import React from 'react';

const DetailsDrawerHeader = ({ title, onClose }) => (
  <div className="relative flex items-center justify-between px-8 py-6 rounded-t-lg" style={{
    background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)'
  }}>
    <h2 className="text-2xl font-bold text-white">{title}</h2>
    <button
      onClick={onClose}
      className="absolute top-6 right-8 text-white text-2xl hover:text-gray-200 focus:outline-none"
      aria-label="Close"
    >
      &times;
    </button>
  </div>
);

export default DetailsDrawerHeader;
