import { DataProvider } from './DataProvider';
import { API_CONFIG, getApiBaseUrl, getEndpointForResource, getErrorMessage } from '../config/apiConfig';

/**
 * HTTP data provider that implements the DataProvider interface for real REST API calls.
 * This is a placeholder implementation for future use when connecting to actual backend services.
 */
export class HttpDataProvider extends DataProvider {
  constructor(options = {}) {
    super();
    this.baseUrl = options.baseUrl || getApiBaseUrl();
    this.timeout = options.timeout || API_CONFIG.TIMEOUT;
    this.headers = {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...options.headers
    };
    this.enableLogging = options.enableLogging !== false;
  }

  /**
   * Log messages if logging is enabled
   */
  log(level, message, data = null) {
    if (this.enableLogging) {
      if (data) {
        console[level](`[HttpDataProvider] ${message}`, data);
      } else {
        console[level](`[HttpDataProvider] ${message}`);
      }
    }
  }

  /**
   * Make HTTP request with timeout and error handling
   */
  async makeRequest(endpoint, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: this.headers,
        signal: controller.signal,
        ...options,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        let errorType = 'DEFAULT';
        switch (response.status) {
          case 401:
            errorType = 'UNAUTHORIZED';
            break;
          case 403:
            errorType = 'FORBIDDEN';
            break;
          case 404:
            errorType = 'NOT_FOUND';
            break;
          case 500:
            errorType = 'SERVER_ERROR';
            break;
          default:
            errorType = 'DEFAULT';
        }
        throw new Error(getErrorMessage(errorType));
      }
      
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error(getErrorMessage('TIMEOUT_ERROR'));
      }
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(getErrorMessage('NETWORK_ERROR'));
      }
      
      throw error;
    }
  }

  /**
   * Build query string from options
   */
  buildQueryString(options = {}) {
    const params = new URLSearchParams();
    
    if (options.search) {
      params.append('search', options.search);
    }
    
    if (options.sortField) {
      params.append('sortBy', options.sortField);
      params.append('sortDirection', options.sortDirection || 'asc');
    }
    
    if (options.page) {
      params.append('page', options.page.toString());
    }
    
    if (options.pageSize) {
      params.append('pageSize', options.pageSize.toString());
    }
    
    if (options.searchableFields && options.searchableFields.length > 0) {
      params.append('searchableFields', options.searchableFields.join(','));
    }
    
    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
  }

  /**
   * Filter data based on search term and searchable fields
   */
  filterData(data, searchTerm, searchableFields = []) {
    if (!searchTerm || searchTerm.trim() === '') {
      return data;
    }

    const term = searchTerm.toLowerCase().trim();
    
    return data.filter(item => {
      // If no specific fields are provided, search in all string fields
      const fieldsToSearch = searchableFields.length > 0 
        ? searchableFields 
        : Object.keys(item).filter(key => typeof item[key] === 'string');
      
      return fieldsToSearch.some(field => {
        const value = item[field];
        return value && value.toString().toLowerCase().includes(term);
      });
    });
  }

  /**
   * Sort data by field and direction
   */
  sortData(data, sortField, sortDirection = 'asc') {
    if (!sortField) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortDirection === 'asc' ? -1 : 1;
      if (bValue == null) return sortDirection === 'asc' ? 1 : -1;
      
      // Special handling for date fields (createdAt)
      if (sortField === 'createdAt' && typeof aValue === 'string' && typeof bValue === 'string') {
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        
        const comparison = aDate.getTime() - bDate.getTime();
        return sortDirection === 'asc' ? comparison : -comparison;
      }
      
      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const comparison = aValue - bValue;
        return sortDirection === 'asc' ? comparison : -comparison;
      }
      
      // Default string comparison
      const comparison = String(aValue).localeCompare(String(bValue));
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  /**
   * Get all resources with filtering, sorting, and pagination
   */
  async getResources(resourceType, options = {}) {
    this.log('debug', `Fetching resources for ${resourceType}`, options);
    
    try {
      const endpoint = getEndpointForResource(resourceType);
      
      // For MockAPI.io, we'll fetch all data and do client-side processing
      // since it might not support query parameters
      this.log('debug', `Making request to: ${this.baseUrl}${endpoint}`);
      
      const response = await this.makeRequest(endpoint);
      
      this.log('debug', `Received response for ${resourceType}`, {
        responseType: typeof response,
        isArray: Array.isArray(response),
        length: Array.isArray(response) ? response.length : 'N/A'
      });
      
      // MockAPI.io returns an array directly, so we need to format it
      let data = response;
      let total = 0;
      let page = options.page || 1;
      let pageSize = options.pageSize || 10;
      
      // If response is an array, format it to match our expected structure
      if (Array.isArray(response)) {
        // Start with the full dataset
        data = [...response];
        total = data.length;
        
        // Apply client-side search first
        if (options.search) {
          data = this.filterData(data, options.search, options.searchableFields);
          total = data.length;
          this.log('debug', `After filtering: ${total} items`);
        }
        
        // Apply client-side sorting
        if (options.sortField) {
          data = this.sortData(data, options.sortField, options.sortDirection);
          this.log('debug', `After sorting by ${options.sortField}: ${data.length} items`);
        }
        
        // Apply client-side pagination last
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        data = data.slice(startIndex, endIndex);
        
        this.log('debug', `After pagination (page ${page}, size ${pageSize}): ${data.length} items`);
      }
      
      const result = {
        data: data,
        total: total,
        page: page,
        pageSize: pageSize,
        totalPages: Math.ceil(total / pageSize)
      };
      
      this.log('debug', `Formatted response for ${resourceType}`, {
        dataCount: result.data.length,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages
      });
      
      return result;
    } catch (error) {
      this.log('error', `Failed to fetch ${resourceType}`, error);
      
      // For MockAPI.io, if a resource type doesn't exist, return empty result instead of throwing
      if (error.message.includes('Resource not found') || error.message.includes('404')) {
        this.log('debug', `Resource ${resourceType} not found on MockAPI.io, returning empty result`);
        return {
          data: [],
          total: 0,
          page: options.page || 1,
          pageSize: options.pageSize || 10,
          totalPages: 0
        };
      }
      
      throw error;
    }
  }

  /**
   * Get a single resource by ID
   */
  async getResourceById(resourceType, id) {
    this.log('debug', `Fetching resource ${resourceType} with ID ${id}`);
    
    try {
      const endpoint = getEndpointForResource(resourceType);
      const response = await this.makeRequest(`${endpoint}/${id}`);
      
      this.log('debug', `Received resource`, response);
      return response;
    } catch (error) {
      this.log('error', `Failed to fetch resource ${resourceType} with ID ${id}`, error);
      throw error;
    }
  }

  /**
   * Get the total count of resources for a type
   */
  async getResourceCount(resourceType) {
    this.log('debug', `Getting count for ${resourceType}`);
    
    try {
      const endpoint = getEndpointForResource(resourceType);
      const response = await this.makeRequest(`${endpoint}/count`);
      
      this.log('debug', `Count for ${resourceType}: ${response.count}`);
      return response.count;
    } catch (error) {
      this.log('error', `Failed to get count for ${resourceType}`, error);
      throw error;
    }
  }

  /**
   * Check if the data provider is healthy
   */
  async healthCheck() {
    this.log('debug', 'Performing health check');
    
    try {
      const response = await this.makeRequest('/health');
      
      this.log('debug', 'Health check response', response);
      return response.status === 'ok';
    } catch (error) {
      this.log('error', 'Health check failed', error);
      return false;
    }
  }
} 