// API Configuration
export const API_CONFIG = {
  // Set to false to use actual API calls, true to use static data
  USE_STATIC_DATA: process.env.REACT_APP_USE_STATIC_DATA !== 'false',
  
  // API Base URL (used when USE_STATIC_DATA is false)
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://685eca617b57aebd2afa9bc9.mockapi.io/api/v1',
  
  // Request timeout in milliseconds
  TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // API endpoints mapping
  ENDPOINTS: {
    'business-roles': '/business-roles',
    'application-roles': '/application-roles',
    'azure-licenses': '/azure-licenses',
    'azure-admin-roles': '/azure-admin-roles',
    'azure-rbac-roles': '/azure-rbac-roles',
    'management-roles': '/management-roles',
    'mailboxes': '/mailboxes',
    'computers': '/computers',
    'users': '/users',
    'shared-folders': '/shared-folders',
  },
  
  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },
  
  // Search configuration
  SEARCH: {
    DEBOUNCE_MS: 300,
    MIN_SEARCH_LENGTH: 1,
  },
  
  // Error handling
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    TIMEOUT_ERROR: 'Request timed out. Please try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
    NOT_FOUND: 'Resource not found.',
    UNAUTHORIZED: 'Unauthorized access.',
    FORBIDDEN: 'Access forbidden.',
    DEFAULT: 'An unexpected error occurred.',
  }
};

// Environment-specific configurations
export const ENV_CONFIG = {
  development: {
    USE_STATIC_DATA: false,
    LOG_LEVEL: 'debug',
    ENABLE_MOCK_DELAY: false,
  },
  production: {
    USE_STATIC_DATA: false,
    LOG_LEVEL: 'error',
    ENABLE_MOCK_DELAY: false,
  },
  test: {
    USE_STATIC_DATA: true,
    LOG_LEVEL: 'warn',
    ENABLE_MOCK_DELAY: false,
  }
};

// Get current environment
export const getCurrentEnv = () => {
  return process.env.NODE_ENV || 'development';
};

// Get environment-specific config
export const getEnvConfig = () => {
  const env = getCurrentEnv();
  return ENV_CONFIG[env] || ENV_CONFIG.development;
};

// Helper function to check if static data should be used
export const shouldUseStaticData = () => {
  const envConfig = getEnvConfig();
  return API_CONFIG.USE_STATIC_DATA && envConfig.USE_STATIC_DATA;
};

// Helper function to get API base URL
export const getApiBaseUrl = () => {
  return API_CONFIG.BASE_URL;
};

// Helper function to get endpoint for resource type
export const getEndpointForResource = (resourceType) => {
  return API_CONFIG.ENDPOINTS[resourceType] || `/${resourceType}`;
};

// Helper function to get error message
export const getErrorMessage = (errorType = 'DEFAULT') => {
  return API_CONFIG.ERROR_MESSAGES[errorType] || API_CONFIG.ERROR_MESSAGES.DEFAULT;
}; 