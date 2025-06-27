import React, { useState, useMemo, useCallback } from 'react';
import Button from './Button';
import Pagination from './Pagination';
import DetailsDrawer from './DetailsDrawer';
import { parseDateString } from './util';
import { DEFAULTS, CSS_CLASSES } from '../constants';

// Utility function to parse and format date fields
const formatDateTime = (dateStr) => {
  if (!dateStr) return { date: '', time: '' };
  
  // Handle ISO date format (createdAt from MockAPI.io)
  if (dateStr.includes('T')) {
    try {
      const date = new Date(dateStr);
      const dateFormatted = date.toLocaleDateString('en-GB'); // DD/MM/YYYY
      const timeFormatted = date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }); // HH:MM AM/PM
      
      return { date: dateFormatted, time: timeFormatted };
    } catch (error) {
      return { date: dateStr, time: '' };
    }
  }
  
  // Parse date in format "DD/MM/YYYY, HH:MM a.m./p.m." (local data)
  const match = dateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4}),\s*(\d{1,2}):(\d{2})\s*(a\.m\.|p\.m\.)/);
  if (!match) return { date: dateStr, time: '' };
  
  const [, day, month, year, hour, minute, period] = match;
  
  // Format date as DD/MM/YYYY
  const date = `${day}/${month}/${year}`;
  
  // Format time as HH:MM AM/PM
  const time = `${hour}:${minute} ${period.toUpperCase()}`;
  
  return { date, time };
};

const ResourceListView = ({ 
  data = [], 
  search = '', 
  columns = [],
  searchableFields = [],
  sortableFields = [],
  showDescription = false,
  pagination = {},
  onPageChange = () => {},
  onSort = () => {},
  currentSortField = '',
  currentSortDir = 'asc'
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Auto-generate columns if not provided - limit to 4 columns maximum
  const autoColumns = useMemo(() => {
    if (columns.length > 0) return columns.slice(0, 4);
    
    if (data.length === 0) return [];
    
    const firstItem = data[0];
    const allColumns = Object.keys(firstItem)
      .filter(key => key !== 'id' && key !== 'description')
      .map(key => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
        sortable: true,
        searchable: true
      }));
    
    // Limit to 4 columns maximum
    return allColumns.slice(0, 4);
  }, [data, columns]);

  const handleSort = useCallback((field) => {
    if (currentSortField === field) {
      const newSortDir = currentSortDir === 'asc' ? 'desc' : 'asc';
      onSort(field, newSortDir);
    } else {
      onSort(field, 'asc');
    }
  }, [currentSortField, currentSortDir, onSort]);

  const handleDetails = useCallback((item) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
    setSelectedItem(null);
  }, []);

  const handlePageChange = useCallback((page) => {
    onPageChange(page);
  }, [onPageChange]);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-100 w-full p-8 text-center text-gray-500 font-rubik">
        {DEFAULTS.NO_DATA_MESSAGE}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-100 w-full font-rubik">
      <table className="w-full">
        <thead className="bg-[#FBFBFD]">
          <tr>
            {autoColumns.map(column => (
              <th 
                key={column.key}
                className={`${CSS_CLASSES.TABLE_HEADER} ${column.sortable ? 'cursor-pointer' : ''}`}
                onClick={() => column.sortable && handleSort(column.key)}
                role={column.sortable ? 'button' : undefined}
                tabIndex={column.sortable ? 0 : undefined}
                onKeyDown={column.sortable ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSort(column.key);
                  }
                } : undefined}
              >
                <div className="flex items-center space-x-1">
                  <span className="truncate">{column.label}</span>
                  <span className={`text-xs ${currentSortField === column.key ? 'text-[#0081C7]' : 'text-[#D6D6DE]'}`}>
                    {currentSortField === column.key ? (currentSortDir === 'asc' ? '↑' : '↓') : '↕'}
                  </span>
                </div>
              </th>
            ))}
            <th className={`${CSS_CLASSES.TABLE_HEADER} w-20`}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={row.id || index} className="hover:bg-gray-50">
              {autoColumns.map(column => (
                <td 
                  key={column.key}
                  className={CSS_CLASSES.TABLE_CELL}
                >
                  {(column.key === 'endDate' || column.key === 'hireDate' || column.key === 'createdAt') ? (
                    <div className="flex flex-col">
                      {(() => {
                        const { date, time } = formatDateTime(row[column.key]);
                        return (
                          <>
                            <div className="font-medium text-gray-900">{date}</div>
                            <div className="text-sm text-gray-500">{time}</div>
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="truncate">
                      {row[column.key] || ''}
                    </div>
                  )}
                </td>
              ))}
              <td className={CSS_CLASSES.TABLE_CELL}>
                <Button 
                  className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 bg-[#00B18D] text-white hover:bg-[#009B7A] transition-colors" 
                  onClick={() => handleDetails(row)}
                >
                  Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Pagination */}
      {pagination && (
        <Pagination 
          page={pagination.page || 1} 
          totalPages={pagination.totalPages || 1} 
          setPage={handlePageChange}
          total={pagination.total || 0}
          pageSize={pagination.pageSize || 10}
        />
      )}
      
      <DetailsDrawer 
        isOpen={drawerOpen} 
        onClose={handleCloseDrawer} 
        data={selectedItem} 
        showDescription={showDescription} 
      />
    </div>
  );
};

export default ResourceListView;
