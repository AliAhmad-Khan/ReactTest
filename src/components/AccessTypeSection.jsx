import React from 'react';
import { subAccessTypes } from '../data/accessTypes';
import useDropdown from '../hooks/useDropdown';

const AccessTypeSection = ({ accessSubType, setAccessSubType }) => {
  const { isOpen, dropdownRef, toggle, close } = useDropdown();

  const handleOptionSelect = (value) => {
    setAccessSubType(value);
    close();
  };

  return (
    <div className="bg-white rounded-lg shadow p-2 sm:p-4 mb-4 w-full max-w-xs mx-auto">
      <div className="font-rubik font-semibold text-gray-700 mb-2 text-base">Access Type</div>
      <div className="font-rubik font-medium text-gray-700 mb-2 text-sm sm:text-base">Select Access Type</div>
      <div className="relative" ref={dropdownRef}>
        <button
          className="w-full border border-gray-300 rounded px-2 sm:px-3 py-2 text-left bg-white flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary-main text-xs sm:text-base"
          onClick={toggle}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label="Select access type"
        >
          <span className="text-gray-700">{subAccessTypes.find(opt => opt.value === accessSubType)?.label || 'All'}</span>
          <svg className="w-4 h-4 ml-2 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && (
          <div 
            className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow z-10"
            role="listbox"
            aria-label="Access type options"
          >
            {subAccessTypes.map(opt => (
              <div
                key={opt.value}
                className={`px-4 py-2 flex items-center justify-between hover:bg-primary-main hover:text-white cursor-pointer text-gray-700 transition-colors ${accessSubType === opt.value ? 'font-semibold bg-gray-100' : ''}`}
                onClick={() => handleOptionSelect(opt.value)}
                role="option"
                aria-selected={accessSubType === opt.value}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOptionSelect(opt.value);
                  }
                }}
              >
                <span>{opt.label}</span>
                {accessSubType === opt.value && (
                  <svg className="w-4 h-4 text-primary-main ml-2" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessTypeSection;
