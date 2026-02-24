import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import ViewService from './ViewService.jsx';
import { useSavedServices } from '../contexts/SavedServicesContext';
import { savedServiceService } from '../services/savedServiceService.js';
import { toast } from '../hooks/use-toast';

const SavedServices = () => {
  const [savedServices, setSavedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingService, setViewingService] = useState(null);
  const { unsaveService, refreshSavedServices } = useSavedServices();

  useEffect(() => {
    loadSavedServices();
  }, []);

  const loadSavedServices = async () => {
    try {
      setLoading(true);
      const data = await savedServiceService.getSaved();
      setSavedServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load saved services:', error);
      toast({
        title: 'Error',
        description: 'Failed to load saved services. Please try again.',
        variant: 'destructive',
      });
      setSavedServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (serviceId, event) => {
    event.stopPropagation();
    
    try {
      await unsaveService(serviceId);
      setSavedServices(prev => prev.filter(s => s.service_id !== serviceId && s.id !== serviceId));
      toast({
        title: 'Service Removed',
        description: 'Service removed from your saved list',
      });
      await refreshSavedServices();
    } catch (error) {
      console.error('Failed to unsave service:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove service. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (viewingService) {
    return <ViewService service={viewingService} onBack={() => setViewingService(null)} />;
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Saved Services</h2>
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <svg
              className="animate-spin h-10 w-10 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
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
            <p className="text-sm text-muted-foreground">Loading saved services...</p>
          </div>
        </div>
      </div>
    );
  }

  if (savedServices.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Saved Services</h2>
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-slate-400"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No Saved Services Yet</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Start exploring services and save your favorites to easily find them later.
          </p>
          <Button
            onClick={() => window.location.href = '/services'}
            className="bg-gradient-to-br from-blue-900 to-blue-600 text-white"
          >
            Browse Services
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Saved Services</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {savedServices.map((service) => {
          const serviceId = service.service_id || service.id;
          const displayService = {
            id: serviceId,
            title: service.title,
            img: service.image_url || service.img,
            rating: service.rating || 0,
            price: service.price ? `₱${service.price}` : 'Contact for price',
            providerName: service.provider_name,
            category: service.category,
          };

          return (
            <Card key={serviceId} className="overflow-hidden transition-shadow hover:shadow-lg cursor-pointer" onClick={() => setViewingService(displayService)}>
              <div className="relative">
                <img src={displayService.img} alt={displayService.title} className="h-48 w-full object-cover" />
                <button 
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-colors hover:bg-white" 
                  aria-label="Remove from saved"
                  onClick={(e) => handleUnsave(serviceId, e)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>
              <div className="p-4 space-y-3">
                <h3 className="font-semibold text-foreground">{displayService.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    {displayService.rating}
                  </span>
                  <span>•</span>
                  <span>{displayService.price}</span>
                </div>
                <Button className="w-full" onClick={(e) => {
                  e.stopPropagation();
                  setViewingService(displayService);
                }}>
                  View Service
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SavedServices;