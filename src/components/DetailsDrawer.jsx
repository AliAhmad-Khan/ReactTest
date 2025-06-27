import React from 'react';
import DetailsDrawerHeader from './DetailsDrawerHeader';
import DetailsDrawerContent from './DetailsDrawerContent';

const DetailsDrawer = ({ isOpen, onClose, data, showDescription }) => {
  const generateTitle = () => {
    if (!data) return 'Item Details';
    
    const titleField = data.name || data.title || data.friendlyName || data.label;
    if (titleField) return titleField;
    
    const firstStringField = Object.keys(data).find(key => 
      key !== 'id' && typeof data[key] === 'string'
    );
    if (firstStringField) return data[firstStringField];
    
    return 'Item Details';
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end transition-all duration-300 ${isOpen ? '' : 'pointer-events-none'}`}
      aria-modal="true"
      role="dialog"
      style={{ background: isOpen ? 'rgba(0,0,0,0.15)' : 'transparent' }}
    >
      <div
        className={`bg-white shadow-xl w-full max-w-2xl h-full flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        tabIndex={-1}
      >
        <DetailsDrawerHeader title={generateTitle()} onClose={onClose} />
        <DetailsDrawerContent data={data} showDescription={typeof showDescription === 'boolean' ? showDescription : false} />
        <div className="flex justify-start pl-8 py-6">
          <button
            className="bg-primary-main text-white px-6 py-2 rounded transition"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsDrawer;
