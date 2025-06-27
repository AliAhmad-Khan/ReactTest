import { useState, useEffect, useCallback } from 'react';
import { dataService } from '../services/DataService';

/**
 * Custom hook that provides a clean interface to the data service layer.
 * This hook manages loading states, errors, and data fetching for components.
 */
export const useDataService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [useMockAPI, setUseMockAPI] = useState(false);

  /**
   * Clear any existing error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Toggle between MockAPI and local file data
   */
  const toggleDataSource = useCallback((useMockAPI) => {
    setUseMockAPI(useMockAPI);
    dataService.toggleDataSource(useMockAPI);
    // Clear current data when switching sources
    setData(null);
    setPagination(null);
    setError(null);
  }, []);

  /**
   * Fetch resources with optional filtering, sorting, and pagination
   */
  const fetchResources = useCallback(async (resourceType, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await dataService.getResources(resourceType, options);
      setData(result.data || []);
      setPagination({
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        totalPages: result.totalPages
      });
      return result;
    } catch (err) {
      setError(err.message);
      setData([]);
      setPagination(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch a single resource by ID
   */
  const fetchResourceById = useCallback(async (resourceType, id) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await dataService.getResourceById(resourceType, id);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      setData(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get resource count
   */
  const getResourceCount = useCallback(async (resourceType) => {
    try {
      return await dataService.getResourceCount(resourceType);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Search resources
   */
  const searchResources = useCallback(async (resourceType, searchTerm, searchableFields = []) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await dataService.searchResources(resourceType, searchTerm, searchableFields);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      setData([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get a simple list of resources (for backward compatibility)
   */
  const getResourceList = useCallback(async (resourceType, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await dataService.getResourceList(resourceType, options);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      setData([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Check service health
   */
  const checkHealth = useCallback(async () => {
    try {
      return await dataService.healthCheck();
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, []);

  /**
   * Get current provider type
   */
  const getProviderType = useCallback(() => {
    return dataService.getProviderType();
  }, []);

  return {
    // State
    loading,
    error,
    data,
    pagination,
    useMockAPI,
    
    // Actions
    fetchResources,
    fetchResourceById,
    getResourceCount,
    searchResources,
    getResourceList,
    checkHealth,
    getProviderType,
    clearError,
    toggleDataSource,
    
    // Utility
    hasData: data && data.length > 0,
    isEmpty: data && data.length === 0,
    isError: !!error
  };
};

export default useDataService; 