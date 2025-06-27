import React, { memo, useMemo } from 'react';
import Button from './Button';
import { CSS_CLASSES } from '../constants';

const ResourceCard = memo(({ onDetails, ...item }) => {
  // Get all fields except 'id' and 'onDetails'
  const fields = useMemo(() => 
    Object.keys(item).filter(key => key !== 'id'), 
    [item]
  );
  
  // Use the first field as the title, or 'name' if available
  const title = useMemo(() => 
    item.name || item.title || item[fields[0]] || 'Untitled', 
    [item, fields]
  );
  
  // Get displayable fields (exclude functions and complex objects)
  const displayFields = useMemo(() => 
    fields.filter(field => {
      const value = item[field];
      return value !== null && 
             value !== undefined && 
             typeof value !== 'function' && 
             typeof value !== 'object';
    }), 
    [fields, item]
  );

  return (
    <div className={CSS_CLASSES.CARD_BASE}>
      {/* Top gradient header */}
      <div className="h-12 w-full bg-gradient-to-r from-[#6C3EF5] via-[#1CB5E0] to-[#1CB5E0] flex items-center px-3 sm:px-5">
        <span className="text-white font-rubik font-medium text-base sm:text-lg leading-none truncate">{title}</span>
      </div>
      {/* Card content */}
      <div className="flex-1 flex flex-col px-3 sm:px-5 pt-3 sm:pt-4 pb-2">
        {displayFields.slice(0, 4).map((field, index) => (
          <div key={field}>
            <div className="text-[10px] sm:text-[11px] text-gray-400 font-medium mb-1">
              {field.toUpperCase().replace(/([A-Z])/g, ' $1').trim()}
            </div>
            <div className="text-[13px] sm:text-[15px] text-gray-700 font-medium mb-2 truncate">
              {item[field]}
            </div>
          </div>
        ))}
      </div>
      {/* Details button */}
      <div className="px-3 sm:px-5 pb-3 sm:pb-4 pt-0">
        <Button 
          className="w-full bg-[#00B18D] text-white rounded-md py-2 text-[14px] sm:text-[15px] font-medium shadow-none" 
          onClick={onDetails}
        >
          Details
        </Button>
      </div>
    </div>
  );
});

ResourceCard.displayName = 'ResourceCard';

export default ResourceCard;