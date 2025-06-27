import React, { useState, useCallback } from 'react';
import ResourceCard from './ResourceCard';
import Pagination from './Pagination';
import DetailsDrawer from './DetailsDrawer';
import { DEFAULTS } from '../constants';

const ResourceCardView = ({ 
  data = [], 
  search = '', 
  searchableFields = [],
  showDescription = true,
  pagination = {},
  onPageChange = () => {}
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

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
      <div className="bg-white rounded-lg shadow border border-gray-100 w-full p-8 text-center text-gray-500">
        {DEFAULTS.NO_DATA_MESSAGE}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {data.map((card, index) => (
          <ResourceCard key={card.id || index} {...card} onDetails={() => handleDetails(card)} />
        ))}
      </div>
      
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
    </>
  );
};

export default ResourceCardView;
