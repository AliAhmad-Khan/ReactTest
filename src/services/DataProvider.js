/**
 * Abstract DataProvider interface that defines the contract for data retrieval operations.
 * This allows for easy swapping between different implementations (file-based, HTTP, etc.).
 */
export class DataProvider {
  /**
   * Get all resources of a specific type with optional filtering, sorting, and pagination
   * @param {string} resourceType - The type of resource to fetch
   * @param {Object} options - Query options
   * @param {string} options.search - Search term to filter results
   * @param {string[]} options.searchableFields - Fields to search in
   * @param {string} options.sortField - Field to sort by
   * @param {string} options.sortDirection - Sort direction ('asc' or 'desc')
   * @param {number} options.page - Page number for pagination
   * @param {number} options.pageSize - Number of items per page
   * @returns {Promise<Object>} Promise resolving to paginated data with metadata
   */
  async getResources(resourceType, options = {}) {
    throw new Error('getResources method must be implemented by subclass');
  }

  /**
   * Get a single resource by ID
   * @param {string} resourceType - The type of resource
   * @param {string|number} id - The resource ID
   * @returns {Promise<Object>} Promise resolving to the resource
   */
  async getResourceById(resourceType, id) {
    throw new Error('getResourceById method must be implemented by subclass');
  }

  /**
   * Get the total count of resources for a type
   * @param {string} resourceType - The type of resource
   * @returns {Promise<number>} Promise resolving to the count
   */
  async getResourceCount(resourceType) {
    throw new Error('getResourceCount method must be implemented by subclass');
  }

  /**
   * Check if the data provider is healthy/available
   * @returns {Promise<boolean>} Promise resolving to health status
   */
  async healthCheck() {
    throw new Error('healthCheck method must be implemented by subclass');
  }
} 