import React from 'react';

const AppHeader = () => (
  <header className="bg-white shadow-sm px-2 sm:px-4 md:px-6 py-2 sm:py-3 flex items-center justify-between border-b border-gray-100 w-full">
    <div className="flex items-center gap-2 sm:gap-3 w-full max-w-[350px] min-w-0">
      <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded bg-primary-main flex-shrink-0">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <rect width="24" height="24" rx="6" fill="#fff"/>
          <rect x="4" y="4" width="16" height="16" rx="4" fill="#0096D6"/>
          <rect x="7" y="7" width="10" height="10" rx="2" fill="#fff"/>
        </svg>
      </div>
      {/* Vertical divider */}
      <div className="h-8 w-px bg-gray-200 mx-1 sm:mx-2 hidden sm:block" />
      {/* Cart icon */}
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-primary-main flex-shrink-0">
        <path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7.2 16h9.45c.9 0 1.7-.6 1.9-1.5l2.1-7.6c.2-.7-.3-1.4-1-1.4H6.21l-.94-3.1A1 1 0 0 0 4.32 2H2v2h1.32l3.6 11.59c.17.53.66.91 1.23.91zM6.16 6h13.31l-1.71 6.2c-.13.47-.56.8-1.05.8H8.53l-2.37-7z" fill="currentColor"/>
      </svg>
      <span className="truncate text-base sm:text-lg font-rubik font-medium text-primary-main tracking-wide ml-1 sm:ml-2">IAM SHOP</span>
    </div>
    <div className="flex items-center gap-2 sm:gap-3">
      <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-gray-200" />
      <span className="text-gray-400 font-medium text-sm sm:text-base whitespace-nowrap">Patrick Parker</span>
    </div>
  </header>
);

export default AppHeader;
