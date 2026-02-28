/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { savedServiceService } from '../services/savedServiceService';
import useAuth from '../hooks/useAuth';

const SavedServicesContext = createContext(null);

export const SavedServicesProvider = ({ children }) => {
  const [savedServiceIds, setSavedServiceIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const { isLoggedIn } = useAuth();

  const fetchSavedServices = useCallback(async () => {
    if (!isLoggedIn) {
      setSavedServiceIds(new Set());
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const savedServices = await savedServiceService.getSaved();
      const ids = new Set(savedServices.map(service => service.service_id || service.id));
      setSavedServiceIds(ids);
    } catch (error) {
      console.error('Failed to fetch saved services:', error);
      setSavedServiceIds(new Set());
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchSavedServices();
  }, [fetchSavedServices]);

  const saveService = useCallback(async (serviceId) => {
    if (!isLoggedIn) {
      throw new Error('User must be logged in to save services');
    }

    // Optimistic update
    setSavedServiceIds(prev => new Set([...prev, serviceId]));

    try {
      await savedServiceService.save(serviceId);
    } catch (error) {
      // Revert on failure
      setSavedServiceIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(serviceId);
        return newSet;
      });
      throw error;
    }
  }, [isLoggedIn]);

  const unsaveService = useCallback(async (serviceId) => {
    if (!isLoggedIn) {
      throw new Error('User must be logged in to unsave services');
    }

    // Optimistic update
    setSavedServiceIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(serviceId);
      return newSet;
    });

    try {
      await savedServiceService.unsave(serviceId);
    } catch (error) {
      // Revert on failure
      setSavedServiceIds(prev => new Set([...prev, serviceId]));
      throw error;
    }
  }, [isLoggedIn]);

  const isSaved = useCallback((serviceId) => {
    return savedServiceIds.has(serviceId);
  }, [savedServiceIds]);

  const refreshSavedServices = useCallback(async () => {
    await fetchSavedServices();
  }, [fetchSavedServices]);

  const value = {
    savedServiceIds,
    isLoading,
    saveService,
    unsaveService,
    isSaved,
    refreshSavedServices,
  };

  return (
    <SavedServicesContext.Provider value={value}>
      {children}
    </SavedServicesContext.Provider>
  );
};

export function useSavedServices() {
  const context = useContext(SavedServicesContext);
  if (!context) {
    throw new Error('useSavedServices must be used within SavedServicesProvider');
  }
  return context;
}
