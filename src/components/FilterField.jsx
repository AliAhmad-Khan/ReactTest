import React from 'react';
import iconMap from './IconMap';
import { DEFAULTS } from '../constants';

const FilterField = ({ 
  value, 
  onChange, 
  placeholder = DEFAULTS.SEARCH_PLACEHOLDER, 
  className = '' 
}) => (
  <div className={`relative w-full sm:w-72 ${className}`}>
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true">
      {iconMap.microscope}
    </span>
    <input
      type="text"
      placeholder={placeholder}
      className="pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-main w-full text-sm"
      value={value}
      onChange={onChange}
      aria-label={placeholder}
    />
  </div>
);

export default FilterField;
