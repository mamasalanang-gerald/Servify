/**
 * Integration tests for SavedServices component
 * 
 * Note: These tests require a testing framework like Vitest or Jest to be configured.
 * To run these tests, install and configure a testing framework:
 * npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SavedServices from '../SavedServices';
import { useSavedServices } from '../../contexts/SavedServicesContext';
import { savedServiceService } from '../../services/savedServiceService';
import { toast } from '../../hooks/use-toast';

// Mock dependencies
vi.mock('../../contexts/SavedServicesContext');
vi.mock('../../services/savedServiceService');
vi.mock('../../hooks/use-toast');

describe('SavedServices Integration Tests', () => {
  const mockUnsaveService = vi.fn();
  const mockRefreshSavedServices = vi.fn();

  const mockSavedServices = [
    {
      id: '1',
      service_id: 'service-1',
      title: 'House Cleaning',
      image_url: '/images/cleaning.jpg',
      rating: 4.5,
      price: 500,
      provider_name: 'John Doe',
      category: 'Cleaning',
    },
    {
      id: '2',
      service_id: 'service-2',
      title: 'Plumbing Repair',
      image_url: '/images/plumbing.jpg',
      rating: 4.8,
      price: 800,
      provider_name: 'Jane Smith',
      category: 'Repair',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    useSavedServices.mockReturnValue({
      unsaveService: mockUnsaveService,
      refreshSavedServices: mockRefreshSavedServices,
    });

    toast.mockReturnValue({ id: '1', dismiss: vi.fn(), update: vi.fn() });
  });

  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should display saved services from API', async () => {
    savedServiceService.getSaved.mockResolvedValue(mockSavedServices);

    renderWithRouter(<SavedServices />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/loading saved services/i)).not.toBeInTheDocument();
    });

    // Check that services are displayed
    expect(screen.getByText('House Cleaning')).toBeInTheDocument();
    expect(screen.getByText('Plumbing Repair')).toBeInTheDocument();
  });

  it('should remove service from list when remove button is clicked', async () => {
    savedServiceService.getSaved.mockResolvedValue(mockSavedServices);
    mockUnsaveService.mockResolvedValue();

    renderWithRouter(<SavedServices />);

    await waitFor(() => {
      expect(screen.getByText('House Cleaning')).toBeInTheDocument();
    });

    // Find and click the first remove button
    const removeButtons = screen.getAllByLabelText(/remove from saved/i);
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(mockUnsaveService).toHaveBeenCalledWith('service-1');
    });

    // Check that success toast was shown
    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Service Removed',
      })
    );

    // Check that refresh was called
    expect(mockRefreshSavedServices).toHaveBeenCalled();
  });

  it('should display empty state when no services are saved', async () => {
    savedServiceService.getSaved.mockResolvedValue([]);

    renderWithRouter(<SavedServices />);

    await waitFor(() => {
      expect(screen.getByText(/no saved services yet/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/start exploring services/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /browse services/i })).toBeInTheDocument();
  });

  it('should display error message when API fails', async () => {
    savedServiceService.getSaved.mockRejectedValue(new Error('Network error'));

    renderWithRouter(<SavedServices />);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Error',
          description: 'Failed to load saved services. Please try again.',
          variant: 'destructive',
        })
      );
    });

    // Should show empty state after error
    expect(screen.getByText(/no saved services yet/i)).toBeInTheDocument();
  });

  it('should display loading state while fetching services', () => {
    savedServiceService.getSaved.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    renderWithRouter(<SavedServices />);

    expect(screen.getByText(/loading saved services/i)).toBeInTheDocument();
  });

  it('should handle unsave failure gracefully', async () => {
    savedServiceService.getSaved.mockResolvedValue(mockSavedServices);
    mockUnsaveService.mockRejectedValue(new Error('Failed to unsave'));

    renderWithRouter(<SavedServices />);

    await waitFor(() => {
      expect(screen.getByText('House Cleaning')).toBeInTheDocument();
    });

    const removeButtons = screen.getAllByLabelText(/remove from saved/i);
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Error',
          description: 'Failed to remove service. Please try again.',
          variant: 'destructive',
        })
      );
    });

    // Service should still be in the list
    expect(screen.getByText('House Cleaning')).toBeInTheDocument();
  });

  it('should navigate to service detail when View Service is clicked', async () => {
    savedServiceService.getSaved.mockResolvedValue(mockSavedServices);

    renderWithRouter(<SavedServices />);

    await waitFor(() => {
      expect(screen.getByText('House Cleaning')).toBeInTheDocument();
    });

    const viewButtons = screen.getAllByRole('button', { name: /view service/i });
    fireEvent.click(viewButtons[0]);

    // Should render ViewService component (checking for back button)
    await waitFor(() => {
      expect(screen.queryByText('Saved Services')).not.toBeInTheDocument();
    });
  });
});
