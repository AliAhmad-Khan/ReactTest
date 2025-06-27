import React from 'react';
import { PAGINATION } from '../constants';

const Pagination = ({ page, totalPages, setPage, total = 0, pageSize = 10 }) => {
  const maxPagesToShow = PAGINATION.MAX_PAGES_TO_SHOW;
  const items = [];

  // If there's only one page, show a simple info display
  if (totalPages <= 1) {
    return (
      <nav className="flex justify-center items-center gap-2 py-3 text-xs sm:text-sm text-gray-600" aria-label="Pagination">
        <span>
          {total === 0 ? 'No items' : `Showing ${total} item${total !== 1 ? 's' : ''}`}
        </span>
      </nav>
    );
  }

  if (totalPages <= maxPagesToShow) {
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`px-2 sm:px-3 py-1 rounded ${page === i ? 'bg-primary-main text-white' : 'bg-white border border-primary-main text-primary-main hover:bg-primary-main hover:text-white'} transition`}
          aria-label={`Go to page ${i}`}
          aria-current={page === i ? 'page' : undefined}
        >
          {i}
        </button>
      );
    }
  } else {
    items.push(
      <button
        key={1}
        onClick={() => setPage(1)}
        className={`px-2 sm:px-3 py-1 rounded ${page === 1 ? 'bg-primary-main text-white' : 'bg-white border border-primary-main text-primary-main hover:bg-primary-main hover:text-white'} transition`}
        aria-label="Go to page 1"
        aria-current={page === 1 ? 'page' : undefined}
      >
        1
      </button>
    );
    if (page > 4) {
      items.push(
        <span key="start-ellipsis" className="px-2" aria-hidden="true">
          ...
        </span>
      );
    }
    for (let i = Math.max(2, page - 2); i <= Math.min(totalPages - 1, page + 2); i++) {
      items.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`px-2 sm:px-3 py-1 rounded ${page === i ? 'bg-primary-main text-white' : 'bg-white border border-primary-main text-primary-main hover:bg-primary-main hover:text-white'} transition`}
          aria-label={`Go to page ${i}`}
          aria-current={page === i ? 'page' : undefined}
        >
          {i}
        </button>
      );
    }
    if (page < totalPages - 3) {
      items.push(
        <span key="end-ellipsis" className="px-2" aria-hidden="true">
          ...
        </span>
      );
    }
    items.push(
      <button
        key={totalPages}
        onClick={() => setPage(totalPages)}
        className={`px-2 sm:px-3 py-1 rounded ${page === totalPages ? 'bg-primary-main text-white' : 'bg-white border border-primary-main text-primary-main hover:bg-primary-main hover:text-white'} transition`}
        aria-label={`Go to page ${totalPages}`}
        aria-current={page === totalPages ? 'page' : undefined}
      >
        {totalPages}
      </button>
    );
  }

  return (
    <nav className="flex flex-col sm:flex-row justify-center items-center gap-2 py-3 text-xs sm:text-sm" aria-label="Pagination">
      {/* Summary info */}
      <div className="text-gray-600 mb-2 sm:mb-0">
        <span>
          {total === 0 ? 'No items' : `Showing ${((page - 1) * pageSize) + 1} to ${Math.min(page * pageSize, total)} of ${total} items`}
        </span>
      </div>
      
      {/* Pagination controls */}
      <div className="flex flex-wrap justify-center items-center gap-1">
        <button 
          onClick={() => setPage(page - 1)} 
          disabled={page === 1} 
          className={`px-2 sm:px-3 py-1 rounded ${page === 1 ? 'bg-gray-200 text-gray-400' : 'bg-white border border-primary-main text-primary-main hover:bg-primary-main hover:text-white'} transition`}
          aria-label="Go to previous page"
        >
          &lt;
        </button>
        {items}
        <button 
          onClick={() => setPage(page + 1)} 
          disabled={page === totalPages} 
          className={`px-2 sm:px-3 py-1 rounded ${page === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-white border border-primary-main text-primary-main hover:bg-primary-main hover:text-white'} transition`}
          aria-label="Go to next page"
        >
          &gt;
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
