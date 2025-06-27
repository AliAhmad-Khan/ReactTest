import React from 'react';

const DataSourceToggle = ({ useMockAPI, onToggle }) => {
  const handleToggle = () => {
    onToggle(!useMockAPI); // Pass the new state (opposite of current)
  };

  return (
    <div className="flex items-center gap-3 bg-white rounded-lg shadow p-3 mb-4">
      <div className="flex items-center">
        <span className="text-sm font-medium text-gray-700 mr-2">Data Source:</span>
        <div className="flex items-center">
          <span className={`text-xs ${!useMockAPI ? 'text-primary-main font-semibold' : 'text-gray-500'}`}>
            Local Files
          </span>
          <button
            onClick={handleToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors mx-2 ${
              useMockAPI ? 'bg-primary-main' : 'bg-gray-300'
            }`}
            type="button"
            aria-label="Toggle data source"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                useMockAPI ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-xs ${useMockAPI ? 'text-primary-main font-semibold' : 'text-gray-500'}`}>
            MockAPI.io
          </span>
        </div>
      </div>
      <div className="text-xs text-gray-500">
        {useMockAPI ? 'Using external API data' : 'Using local file data'}
      </div>
    </div>
  );
};

export default DataSourceToggle; 