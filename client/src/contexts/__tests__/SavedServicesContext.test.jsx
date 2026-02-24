/**
 * Unit tests for SavedServicesContext
 * 
 * Note: These tests require a testing framework like Vitest or Jest to be configured.
 * To run these tests, install and configure a testing framework:
 * npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { SavedServicesProvider, useSavedServices } from '../SavedServicesContext';
import { savedServiceService } from '../../services/savedServiceService';

// Mock the services
vi.mock('../../services/savedServiceService');
vi.mock('../../hooks/useAuth', () => ({
  default: () => ({ isLoggedIn: true }),
}));

describe('SavedServicesContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should add service ID to set when saveService is called', async () => {
    // Mock getSaved to return empty array initially
    savedServiceService.getSaved.mockResolvedValue([]);
    savedServiceService.save.mockResolvedValue({ success: true });

    const wrapper = ({ children }) => (
      <SavedServicesProvider>{children}</SavedServicesProvider>
    );

    const { result } = renderHook(() => useSavedServices(), { wrapper });

    // Wait for initial load
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Save a service
    await act(async () => {
      await result.current.saveService('service-123');
    });

    // Check that the service is now saved
    expect(result.current.isSaved('service-123')).toBe(true);
    expect(savedServiceService.save).toHaveBeenCalledWith('service-123');
  });

  it('should remove service ID from set when unsaveService is called', async () => {
    // Mock getSaved to return a service
    savedServiceService.getSaved.mockResolvedValue([
      { service_id: 'service-123' },
    ]);
    savedServiceService.unsave.mockResolvedValue({ success: true });

    const wrapper = ({ children }) => (
      <SavedServicesProvider>{children}</SavedServicesProvider>
    );

    const { result } = renderHook(() => useSavedServices(), { wrapper });

    // Wait for initial load
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Verify service is initially saved
    expect(result.current.isSaved('service-123')).toBe(true);

    // Unsave the service
    await act(async () => {
      await result.current.unsaveService('service-123');
    });

    // Check that the service is no longer saved
    expect(result.current.isSaved('service-123')).toBe(false);
    expect(savedServiceService.unsave).toHaveBeenCalledWith('service-123');
  });

  it('should return correct boolean from isSaved', async () => {
    // Mock getSaved to return some services
    savedServiceService.getSaved.mockResolvedValue([
      { service_id: 'service-1' },
      { service_id: 'service-2' },
    ]);

    const wrapper = ({ children }) => (
      <SavedServicesProvider>{children}</SavedServicesProvider>
    );

    const { result } = renderHook(() => useSavedServices(), { wrapper });

    // Wait for initial load
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Check saved services
    expect(result.current.isSaved('service-1')).toBe(true);
    expect(result.current.isSaved('service-2')).toBe(true);
    expect(result.current.isSaved('service-3')).toBe(false);
  });

  it('should revert optimistic update on save failure', async () => {
    savedServiceService.getSaved.mockResolvedValue([]);
    savedServiceService.save.mockRejectedValue(new Error('Network error'));

    const wrapper = ({ children }) => (
      <SavedServicesProvider>{children}</SavedServicesProvider>
    );

    const { result } = renderHook(() => useSavedServices(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Try to save a service (should fail)
    await act(async () => {
      try {
        await result.current.saveService('service-123');
      } catch (error) {
        // Expected to fail
      }
    });

    // Service should not be saved after failure
    expect(result.current.isSaved('service-123')).toBe(false);
  });

  it('should revert optimistic update on unsave failure', async () => {
    savedServiceService.getSaved.mockResolvedValue([
      { service_id: 'service-123' },
    ]);
    savedServiceService.unsave.mockRejectedValue(new Error('Network error'));

    const wrapper = ({ children }) => (
      <SavedServicesProvider>{children}</SavedServicesProvider>
    );

    const { result } = renderHook(() => useSavedServices(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Try to unsave a service (should fail)
    await act(async () => {
      try {
        await result.current.unsaveService('service-123');
      } catch (error) {
        // Expected to fail
      }
    });

    // Service should still be saved after failure
    expect(result.current.isSaved('service-123')).toBe(true);
  });
});
