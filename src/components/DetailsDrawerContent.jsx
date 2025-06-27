import React from 'react';

const labelClass = 'text-xs text-gray-400 font-medium uppercase tracking-wide';
const valueClass = 'text-sm text-gray-900';

const DetailsDrawerContent = ({ data, showDescription }) => {
  if (!data) {
    return (
      <div className="px-8 py-8 bg-white shadow-sm">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const fields = Object.keys(data).filter(key => key !== 'id');
  
  const displayFields = showDescription 
    ? fields 
    : fields.filter(field => field !== 'description');

  return (
    <div className="px-8 py-8 bg-white shadow-sm">
      <table className="w-full">
        <tbody>
          {displayFields.map(field => {
            const value = data[field];
            const label = field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1');
            
            return (
              <tr key={field}>
                <td className={labelClass + ' pr-8 py-2'}>{label}</td>
                <td className={valueClass + ' py-2'}>
                  {value !== null && value !== undefined ? value : '-'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DetailsDrawerContent;
