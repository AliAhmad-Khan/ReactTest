# Service Layer Architecture

This directory contains the refactored service layer that provides a clean abstraction for data retrieval operations. The architecture is designed to be easily extensible and allows for seamless switching between different data providers.

## Architecture Overview

The service layer follows a clean architecture pattern with the following components:

```
DataProvider (Interface)
├── FileDataProvider (File-based implementation)
├── HttpDataProvider (HTTP-based implementation)
└── DataService (Facade/Manager)

useDataService (React Hook)
└── Provides React-friendly interface
```

## Components

### DataProvider (Abstract Interface)

The base interface that defines the contract for all data providers:

```javascript
class DataProvider {
  async getResources(resourceType, options) { }
  async getResourceById(resourceType, id) { }
  async getResourceCount(resourceType) { }
  async healthCheck() { }
}
```

### FileDataProvider

A file-based implementation that simulates REST API behavior using local JSON files:

- **Features:**
  - Simulates network delays for realistic behavior
  - Supports filtering, sorting, and pagination
  - Configurable logging
  - Error handling and validation

- **Usage:**
```javascript
import { FileDataProvider } from './services/FileDataProvider';

const provider = new FileDataProvider({
  delay: 300, // Simulate 300ms network delay
  enableLogging: true
});

const result = await provider.getResources('computers', {
  search: 'alpha',
  sortField: 'name',
  sortDirection: 'asc',
  page: 1,
  pageSize: 10
});
```

### HttpDataProvider

An HTTP-based implementation for real REST API calls:

- **Features:**
  - Real HTTP requests with timeout handling
  - Query string building for filters
  - Error handling for network issues
  - Configurable headers and base URL

- **Usage:**
```javascript
import { HttpDataProvider } from './services/HttpDataProvider';

const provider = new HttpDataProvider({
  baseUrl: 'https://api.example.com',
  timeout: 10000,
  headers: { 'Authorization': 'Bearer token' }
});
```

### DataService (Facade)

The main service class that manages provider instances and provides a unified interface:

- **Features:**
  - Automatic provider selection based on configuration
  - Provider switching at runtime
  - Singleton pattern for global access
  - Backward compatibility methods

- **Usage:**
```javascript
import { dataService } from './services/DataService';

// Get resources with full pagination support
const result = await dataService.getResources('computers', {
  search: 'alpha',
  page: 1,
  pageSize: 20
});

// Switch providers at runtime
dataService.setProvider('http', { baseUrl: 'https://api.example.com' });
```

### useDataService (React Hook)

A React hook that provides a clean interface for components:

- **Features:**
  - Loading states management
  - Error handling
  - Data caching
  - Pagination state
  - Utility methods

- **Usage:**
```javascript
import { useDataService } from './hooks/useDataService';

const MyComponent = () => {
  const {
    loading,
    error,
    data,
    pagination,
    fetchResources,
    clearError
  } = useDataService();

  useEffect(() => {
    fetchResources('computers', { pageSize: 20 });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  );
};
```

## Configuration

The service layer uses the existing `apiConfig.js` for configuration:

```javascript
// Environment variables
REACT_APP_USE_STATIC_DATA=true  // Use file provider
REACT_APP_API_BASE_URL=https://api.example.com  // HTTP provider base URL
REACT_APP_API_TIMEOUT=10000  // Request timeout

// Environment-specific settings
development: {
  USE_STATIC_DATA: true,
  LOG_LEVEL: 'debug',
  ENABLE_MOCK_DELAY: true,
}
```

## Migration Guide

### From Direct JSON Imports

**Before:**
```javascript
import computers from '../data/computers.json';
import users from '../data/users.json';

const getDataForAccessType = () => {
  switch (accessType) {
    case 'computers': return computers;
    case 'users': return users;
    default: return [];
  }
};
```

**After:**
```javascript
import { useDataService } from '../hooks/useDataService';

const { data, loading, error, fetchResources } = useDataService();

useEffect(() => {
  fetchResources(accessType);
}, [accessType]);
```

### From Old API Service

**Before:**
```javascript
import ApiService from '../services/api';

const apiService = new ApiService();
const result = await apiService.getResources('computers', options);
```

**After:**
```javascript
import { dataService } from '../services/DataService';

const result = await dataService.getResources('computers', options);
```

## Benefits

1. **Clean Separation of Concerns:** Data access logic is separated from UI components
2. **Easy Testing:** Mock providers can be easily created for testing
3. **Flexible Configuration:** Switch between providers without code changes
4. **Consistent Interface:** All providers implement the same interface
5. **Error Handling:** Centralized error handling and loading states
6. **Future-Proof:** Easy to add new providers (GraphQL, WebSocket, etc.)

## Adding New Data Sources

To add a new data source:

1. **Add JSON file** to `src/data/`
2. **Update FileDataProvider** data sources mapping
3. **Update API config** endpoints mapping
4. **Use in components** via the service layer

```javascript
// 1. Add to FileDataProvider
this.dataSources = {
  'computers': computers,
  'users': users,
  'new-resource': newResourceData, // Add here
};

// 2. Add to apiConfig.js
ENDPOINTS: {
  'computers': '/computers',
  'users': '/users',
  'new-resource': '/new-resource', // Add here
}
```

## Testing

The service layer is designed to be easily testable:

```javascript
// Mock provider for testing
class MockDataProvider extends DataProvider {
  async getResources(resourceType, options) {
    return {
      data: [{ id: 1, name: 'Test' }],
      total: 1,
      page: 1,
      pageSize: 10,
      totalPages: 1
    };
  }
}

// Use in tests
const testService = new DataService();
testService.setProvider('mock', new MockDataProvider());
``` 