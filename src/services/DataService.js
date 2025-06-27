import { FileDataProvider } from './FileDataProvider';
import { HttpDataProvider } from './HttpDataProvider';
import { shouldUseStaticData, getEnvConfig } from '../config/apiConfig';

/**
 * Main DataService class that acts as a facade for data operations.
 * This service manages the data provider instances and provides a clean interface
 * for the application to interact with data sources.
 */
export class DataService {
  constructor(options = {}) {
    this.options = options;
    this.fileProvider = null;
    this.httpProvider = null;
    this.currentProvider = null;
    this.useMockAPI = options.useMockAPI || false;
    
    // Initialize providers
    this.initializeProviders();
  }

  /**
   * Initialize both data providers
   */
  initializeProviders() {
    const envConfig = getEnvConfig();
    
    // Initialize file provider
    this.fileProvider = new FileDataProvider({
      delay: envConfig.ENABLE_MOCK_DELAY ? 300 : 0,
      enableLogging: envConfig.LOG_LEVEL === 'debug'
    });
    
    // Initialize HTTP provider
    this.httpProvider = new HttpDataProvider({
      enableLogging: envConfig.LOG_LEVEL === 'debug'
    });
    
    // Set current provider based on useMockAPI flag
    this.setCurrentProvider();
  }

  /**
   * Set the current provider based on useMockAPI flag
   */
  setCurrentProvider() {
    this.currentProvider = this.useMockAPI ? this.httpProvider : this.fileProvider;
    console.log(`[DataService] Switched to ${this.useMockAPI ? 'HTTP' : 'File'} provider`);
  }

  /**
   * Toggle between MockAPI and local file data
   */
  toggleDataSource(useMockAPI) {
    this.useMockAPI = useMockAPI;
    this.setCurrentProvider();
  }

  /**
   * Get the current provider type
   */
  getProviderType() {
    return this.useMockAPI ? 'http' : 'file';
  }

  /**
   * Get all resources with filtering, sorting, and pagination
   * @param {string} resourceType - The type of resource to fetch
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Promise resolving to paginated data with metadata
   */
  async getResources(resourceType, options = {}) {
    if (!this.currentProvider) {
      throw new Error('No data provider configured');
    }
    
    return this.currentProvider.getResources(resourceType, options);
  }

  /**
   * Get a single resource by ID
   * @param {string} resourceType - The type of resource
   * @param {string|number} id - The resource ID
   * @returns {Promise<Object>} Promise resolving to the resource
   */
  async getResourceById(resourceType, id) {
    if (!this.currentProvider) {
      throw new Error('No data provider configured');
    }
    
    return this.currentProvider.getResourceById(resourceType, id);
  }

  /**
   * Get the total count of resources for a type
   * @param {string} resourceType - The type of resource
   * @returns {Promise<number>} Promise resolving to the count
   */
  async getResourceCount(resourceType) {
    if (!this.currentProvider) {
      throw new Error('No data provider configured');
    }
    
    return this.currentProvider.getResourceCount(resourceType);
  }

  /**
   * Check if the data service is healthy
   * @returns {Promise<boolean>} Promise resolving to health status
   */
  async healthCheck() {
    if (!this.currentProvider) {
      return false;
    }
    
    return this.currentProvider.healthCheck();
  }

  /**
   * Get a simple list of resources (for backward compatibility)
   * @param {string} resourceType - The type of resource
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Promise resolving to array of resources
   */
  async getResourceList(resourceType, options = {}) {
    const result = await this.getResources(resourceType, options);
    return result.data || [];
  }

  /**
   * Get resources with search functionality
   * @param {string} resourceType - The type of resource
   * @param {string} searchTerm - Search term
   * @param {string[]} searchableFields - Fields to search in
   * @returns {Promise<Array>} Promise resolving to filtered resources
   */
  async searchResources(resourceType, searchTerm, searchableFields = []) {
    const result = await this.getResources(resourceType, {
      search: searchTerm,
      searchableFields
    });
    return result.data || [];
  }
}

// Create and export a singleton instance
export const dataService = new DataService();

// Export the class for testing or custom instances
export default DataService; 