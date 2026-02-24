/**
 * Unit tests for SaveButton component
 * 
 * Note: These tests require a testing framework like Vitest or Jest to be configured.
 * To run these tests, install and configure a testing framework:
 * npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SaveButton from '../SaveButton';
import { useSavedServices } from '../../contexts/SavedServicesContext';
import useAuth from '../../hooks/useAuth';
import { toast } from '../../hooks/use-toast';

// Mock dependencies
vi.mock('../../contexts/SavedServicesContext');
vi.mock('../../hooks/useAuth');
vi.mock('../../hooks/use-toast');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('SaveButton', () => {
  const mockSaveService = vi.fn();
  const mockUnsaveService = vi.fn();
  const mockIsSaved = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    useSavedServices.mockReturnValue({
      isSaved: mockIsSaved,
      saveService: mockSaveService,
      unsaveService: mockUnsaveService,
    });

    toast.mockReturnValue({ id: '1', dismiss: vi.fn(), update: vi.fn() });
  });

  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render empty heart for unsaved service', () => {
    useAuth.mockReturnValue({ isLoggedIn: true });
    mockIsSaved.mockReturnValue(false);

    renderWithRouter(<SaveButton serviceId="service-123" variant="icon" />);

    const button = screen.getByRole('button', { name: /save service/i });
    expect(button).toBeInTheDocument();
    
    // Check that the heart is not filled (stroke only)
    const svg = button.querySelector('svg path');
    expect(svg).toHaveAttribute('fill', 'none');
  });

  it('should render filled heart for saved service', () => {
    useAuth.mockReturnValue({ isLoggedIn: true });
    mockIsSaved.mockReturnValue(true);

    renderWithRouter(<SaveButton serviceId="service-123" variant="icon" />);

    const button = screen.getByRole('button', { name: /remove from saved/i });
    expect(button).toBeInTheDocument();
    
    // Check that the heart is filled
    const svg = button.querySelector('svg path');
    expect(svg).toHaveAttribute('fill', '#ef4444');
  });

  it('should call saveService when clicking unsaved service', async () => {
    useAuth.mockReturnValue({ isLoggedIn: true });
    mockIsSaved.mockReturnValue(false);
    mockSaveService.mockResolvedValue();

    renderWithRouter(<SaveButton serviceId="service-123" variant="icon" />);

    const button = screen.getByRole('button', { name: /save service/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockSaveService).toHaveBeenCalledWith('service-123');
    });

    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Service Saved',
      })
    );
  });

  it('should call unsaveService when clicking saved service', async () => {
    useAuth.mockReturnValue({ isLoggedIn: true });
    mockIsSaved.mockReturnValue(true);
    mockUnsaveService.mockResolvedValue();

    renderWithRouter(<SaveButton serviceId="service-123" variant="icon" />);

    const button = screen.getByRole('button', { name: /remove from saved/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockUnsaveService).toHaveBeenCalledWith('service-123');
    });

    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Service Removed',
      })
    );
  });

  it('should prevent action and redirect to login when not authenticated', async () => {
    useAuth.mockReturnValue({ isLoggedIn: false });
    mockIsSaved.mockReturnValue(false);

    renderWithRouter(<SaveButton serviceId="service-123" variant="icon" />);

    const button = screen.getByRole('button', { name: /save service/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Authentication Required',
          description: 'Please log in to save services',
        })
      );
    });

    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(mockSaveService).not.toHaveBeenCalled();
  });

  it('should show error toast on save failure', async () => {
    useAuth.mockReturnValue({ isLoggedIn: true });
    mockIsSaved.mockReturnValue(false);
    mockSaveService.mockRejectedValue(new Error('Network error'));

    renderWithRouter(<SaveButton serviceId="service-123" variant="icon" />);

    const button = screen.getByRole('button', { name: /save service/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Error',
          description: 'Failed to save service. Please try again.',
          variant: 'destructive',
        })
      );
    });
  });

  it('should render button variant with text', () => {
    useAuth.mockReturnValue({ isLoggedIn: true });
    mockIsSaved.mockReturnValue(false);

    renderWithRouter(<SaveButton serviceId="service-123" variant="button" />);

    const button = screen.getByRole('button', { name: /save/i });
    expect(button).toHaveTextContent('Save');
  });

  it('should show loading state during save operation', async () => {
    useAuth.mockReturnValue({ isLoggedIn: true });
    mockIsSaved.mockReturnValue(false);
    
    // Make saveService hang to test loading state
    let resolvePromise;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockSaveService.mockReturnValue(promise);

    renderWithRouter(<SaveButton serviceId="service-123" variant="button" />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Check loading state
    await waitFor(() => {
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent('Saving...');
    });

    // Resolve the promise
    resolvePromise();
  });
});
