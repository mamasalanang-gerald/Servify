import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSavedServices } from '../contexts/SavedServicesContext';
import useAuth from '../hooks/useAuth';
import { toast } from '../hooks/use-toast';
import { Button } from './ui/button';

const SaveButton = ({ serviceId, variant = 'icon', size = 'md', className = '' }) => {
  const { isSaved, saveService, unsaveService } = useSavedServices();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const saved = isSaved(serviceId);

  const handleClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    // Check authentication
    if (!isLoggedIn) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to save services',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    setIsLoading(true);

    try {
      if (saved) {
        await unsaveService(serviceId);
        toast({
          title: 'Service Removed',
          description: 'Service removed from your saved list',
        });
      } else {
        await saveService(serviceId);
        toast({
          title: 'Service Saved',
          description: 'Service added to your saved list',
        });
      }
    } catch (error) {
      console.error('Failed to toggle save state:', error);
      toast({
        title: 'Error',
        description: saved 
          ? 'Failed to remove service. Please try again.' 
          : 'Failed to save service. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-11 w-11',
  };

  const iconSizes = {
    sm: '14',
    md: '18',
    lg: '22',
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`flex ${sizeClasses[size]} items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-all hover:bg-white hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        aria-label={saved ? 'Remove from saved' : 'Save service'}
      >
        {isLoading ? (
          <svg
            className="animate-spin"
            width={iconSizes[size]}
            height={iconSizes[size]}
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <svg
            width={iconSizes[size]}
            height={iconSizes[size]}
            viewBox="0 0 24 24"
            fill={saved ? '#ef4444' : 'none'}
            stroke={saved ? '#ef4444' : '#64748b'}
            strokeWidth="2"
            className="transition-all"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        )}
      </button>
    );
  }

  // Button variant
  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      variant={saved ? 'default' : 'outline'}
      className={`gap-2 ${className}`}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>{saved ? 'Removing...' : 'Saving...'}</span>
        </>
      ) : (
        <>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={saved ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span>{saved ? 'Saved' : 'Save'}</span>
        </>
      )}
    </Button>
  );
};

export default SaveButton;
