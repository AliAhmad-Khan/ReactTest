import { DataProvider } from './DataProvider';
import computers from '../data/computers.json';
import users from '../data/users.json';

/**
 * File-based data provider that simulates REST API behavior using local JSON files.
 * This implementation provides realistic API-like responses with delays and proper error handling.
 */
export class FileDataProvider extends DataProvider {
  constructor(options = {}) {
    super();
    this.delay = options.delay || 300; // Simulate network delay
    this.enableLogging = options.enableLogging !== false;
    
    // Map resource types to their data sources
    this.dataSources = {
      'computers': computers,
      'users': users,
      // Add more data sources as needed
      'business-roles': [],
      'application-roles': [],
      'azure-licenses': [],
      'azure-admin-roles': [],
      'azure-rbac-roles': [],
      'management-roles': [],
      'mailboxes': [],
      'shared-folders': [],
    };
  }

  /**
   * Simulate API delay for realistic behavior
   */
  async simulateDelay() {
    if (this.delay > 0) {
      await new Promise(resolve => setTimeout(resolve, this.delay));
    }
  }

  /**
   * Log messages if logging is enabled
   */
  log(level, message, data = null) {
    if (this.enableLogging) {
      if (data) {
        console[level](`[FileDataProvider] ${message}`, data);
      } else {
        console[level](`[FileDataProvider] ${message}`);
      }
    }
  }

  /**
   * Get data source for a resource type
   */
  getDataSource(resourceType) {
    const data = this.dataSources[resourceType];
    if (!data) {
      throw new Error(`Unknown resource type: ${resourceType}`);
    }
    return data;
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
      
      // Special handling for date fields (endDate, hireDate, createdAt)
      if ((sortField === 'endDate' || sortField === 'hireDate' || sortField === 'createdAt') && typeof aValue === 'string' && typeof bValue === 'string') {
        const parseDate = (dateStr) => {
          // Handle ISO date format (createdAt from MockAPI.io)
          if (dateStr.includes('T')) {
            return new Date(dateStr);
          }
          
          // Parse date in format "DD/MM/YYYY, HH:MM a.m./p.m."
          const match = dateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4}),\s*(\d{1,2}):(\d{2})\s*(a\.m\.|p\.m\.)/);
          if (!match) return new Date(0); // Invalid date
          
          const [, day, month, year, hour, minute, period] = match;
          let hour24 = parseInt(hour);
          
          // Convert to 24-hour format
          if (period === 'p.m.' && hour24 !== 12) hour24 += 12;
          if (period === 'a.m.' && hour24 === 12) hour24 = 0;
          
          return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), hour24, parseInt(minute));
        };
        
        const aDate = parseDate(aValue);
        const bDate = parseDate(bValue);
        
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
   * Apply pagination to data
   */
  paginateData(data, page = 1, pageSize = 10) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return {
      data: data.slice(startIndex, endIndex),
      total: data.length,
      page,
      pageSize,
      totalPages: Math.ceil(data.length / pageSize)
    };
  }

  /**
   * Get all resources with filtering, sorting, and pagination
   */
  async getResources(resourceType, options = {}) {
    this.log('debug', `Fetching resources for ${resourceType}`, options);
    
    try {
      await this.simulateDelay();
      
      const data = this.getDataSource(resourceType);
      let processedData = [...data];
      
      // Apply search filtering
      if (options.search) {
        processedData = this.filterData(processedData, options.search, options.searchableFields);
        this.log('debug', `Filtered data for search: "${options.search}"`, {
          original: data.length,
          filtered: processedData.length
        });
      }
      
      // Apply sorting
      if (options.sortField) {
        processedData = this.sortData(processedData, options.sortField, options.sortDirection);
      }
      
      // Apply pagination
      const result = this.paginateData(
        processedData,
        options.page,
        options.pageSize
      );
      
      this.log('debug', `Returning paginated data`, {
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
        totalPages: result.totalPages
      });
      
      return result;
    } catch (error) {
      this.log('error', `Failed to fetch ${resourceType}`, error);
      throw error;
    }
  }

  /**
   * Get a single resource by ID
   */
  async getResourceById(resourceType, id) {
    this.log('debug', `Fetching resource ${resourceType} with ID ${id}`);
    
    try {
      await this.simulateDelay();
      
      const data = this.getDataSource(resourceType);
      const resource = data.find(item => item.id == id); // Use == for type coercion
      
      if (!resource) {
        throw new Error(`Resource not found: ${resourceType} with ID ${id}`);
      }
      
      this.log('debug', `Found resource`, resource);
      return resource;
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
      await this.simulateDelay();
      
      const data = this.getDataSource(resourceType);
      const count = data.length;
      
      this.log('debug', `Count for ${resourceType}: ${count}`);
      return count;
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
      await this.simulateDelay();
      
      // Check if all data sources are accessible
      const checks = Object.keys(this.dataSources).map(async (resourceType) => {
        try {
          const data = this.getDataSource(resourceType);
          return { resourceType, status: 'ok', count: data.length };
        } catch (error) {
          return { resourceType, status: 'error', error: error.message };
        }
      });
      
      const results = await Promise.all(checks);
      const hasErrors = results.some(result => result.status === 'error');
      
      this.log('debug', 'Health check results', results);
      
      return !hasErrors;
    } catch (error) {
      this.log('error', 'Health check failed', error);
      return false;
    }
  }
} 