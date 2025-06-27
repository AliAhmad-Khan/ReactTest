import React, { cloneElement } from 'react';
import useDropdown from '../hooks/useDropdown';

const ResourceType = ({ accessType, setAccessType, accessTypes, iconMap }) => {
  const { isOpen, dropdownRef, toggle, close } = useDropdown();

  const handleOptionSelect = (value) => {
    setAccessType(value);
    close();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="ml-2 p-1 rounded hover:bg-gray-100 focus:outline-none"
        onClick={toggle}
        aria-label="Select Access Type"
        type="button"
        id="main-access-type-arrow"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          // Down arrow
          <svg className="w-4 h-4 text-primary-main" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          // Right arrow
          <svg className="w-4 h-4 text-primary-main" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        )}
      </button>
      {isOpen && (
        <div 
          className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-20 w-56 bg-white border border-gray-200 rounded-xl shadow-lg" 
          style={{ minWidth: '14rem' }}
          role="listbox"
          aria-label="Access type options"
        >
          {accessTypes.map((opt) => {
            const isActive = accessType === opt.value;
            return (
              <div
                key={opt.value}
                className={`px-4 py-2 flex items-center cursor-pointer transition-colors 
                  ${isActive ? 'font-semibold text-primary-main bg-gray-100' : 'text-gray-700'}
                  group hover:text-primary-main hover:bg-blue-50`}
                onClick={() => handleOptionSelect(opt.value)}
                role="option"
                aria-selected={isActive}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOptionSelect(opt.value);
                  }
                }}
              >
                <span className="mr-2">
                  {cloneElement(
                    iconMap[opt.icon],
                    {
                      className: `w-5 h-5 ${isActive ? 'text-primary-main' : 'text-gray-400'} group-hover:text-primary-main`,
                    }
                  )}
                </span>
                <span>{opt.label}</span>
                {isActive && (
                  <svg
                    className="w-4 h-4 text-primary-main ml-auto"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ResourceType;
