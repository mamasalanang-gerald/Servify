import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import ServiceDetailPage from './ServiceDetailPage.jsx';
import { useSavedServices } from '../contexts/SavedServicesContext';
import { savedServiceService } from '../services/savedServiceService.js';
import { toast } from '../hooks/use-toast';

const SavedServices = ({ onNavigate }) => {
  const [savedServices, setSavedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingService, setViewingService] = useState(null);
  const { refreshSavedServices } = useSavedServices();

  useEffect(() => {
    loadSavedServices();
  }, []);

  const loadSavedServices = async () => {
    try {
      setLoading(true);
      const data = await savedServiceService.getSaved();
      const normalized = Array.isArray(data)
        ? data.map((service) => ({
            ...service,
            providerImage: service.provider_image || null,
          }))
        : [];
      setSavedServices(normalized);
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
      await savedServiceService.unsave(serviceId);
      setSavedServices(prev => prev.filter(s => (s.service_id || s.id) !== serviceId));
      
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

  // Transform saved service data to match ServiceDetailPage format
  const transformServiceData = (savedService) => {
    try {
      const parsedRating = Number(savedService.average_rating ?? savedService.rating ?? 0);
      const rating = Number.isFinite(parsedRating) ? parsedRating : 0;
      const category = savedService.category_name || savedService.category || 'Service';

      return {
        id: savedService.service_id || savedService.id,
        title: savedService.title,
        img: savedService.image_url || savedService.img,
        category,
        rating,
        reviewCount: savedService.review_count || 0,
        price: savedService.price,
        priceNum: parseFloat(savedService.price) || 0,
        providerName: savedService.provider_name,
        provider: savedService.provider_name,
        providerImage: savedService.providerImage || savedService.provider_image || null,
        provider_id: savedService.provider_id,
        providerId: savedService.provider_id,
        description: savedService.description,
        location: savedService.location,
        packages: savedService.packages,
        reviews: savedService.reviews,
        jobs: savedService.jobs_completed || 0,
      };
    } catch (error) {
      console.error('Error transforming service:', error);
      return null;
    }
  };

  // Handle viewing a service
  const handleViewService = (savedService) => {
    try {
      const transformedService = transformServiceData(savedService);
      if (transformedService) {
        setViewingService(transformedService);
      }
    } catch (error) {
      console.error('Failed to view service:', error);
      toast({
        title: 'Error',
        description: 'Failed to load service details.',
        variant: 'destructive',
      });
    }
  };

  // Show ServiceDetailPage when viewing a saved service
  if (viewingService) {
    return (
      <ServiceDetailPage 
        service={viewingService} 
        onBack={() => {
          setViewingService(null);
          loadSavedServices();
        }}
        onNavigate={(tab) => {
          setViewingService(null);
          onNavigate(tab);
        }}
        backButtonText="Back to Saved Services"
      />
    );
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
            onClick={() => onNavigate ? onNavigate('Services') : window.location.href = '/services'}
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
      <p className="text-muted-foreground">Your favorite services for quick access.</p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {savedServices.map((service) => {
          const serviceId = service.service_id || service.id;
          const parsedRating = Number(service.average_rating ?? service.rating ?? 0);
          const listRating = Number.isFinite(parsedRating) ? parsedRating : 0;
          const listCategory = service.category_name || service.category || 'Service';
          
          return (
            <Card 
              key={serviceId}
              className="overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-500/40 cursor-pointer"
              onClick={() => handleViewService(service)}
            >
              <div className="relative h-[200px] overflow-hidden">
                <img 
                  src={service.image_url || service.img} 
                  alt={service.title} 
                  className="w-full h-full object-cover transition-transform duration-400 hover:scale-105" 
                />
                <div className="absolute top-3 right-3 bg-white dark:bg-slate-100 rounded-full px-2.5 py-1 text-xs font-bold text-slate-900 flex items-center gap-1 shadow-md">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  {listRating > 0 ? listRating.toFixed(1) : '—'}
                </div>
                <div className="absolute top-3 left-3">
                  <button
                    onClick={(e) => handleUnsave(serviceId, e)}
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-red-500 hover:bg-white dark:hover:bg-slate-900 transition-colors"
                    aria-label="Remove from saved"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>
                <div className="absolute bottom-3 left-3">
                  <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-slate-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {listCategory}
                  </div>
                </div>
              </div>

              <div className="p-5 flex flex-col gap-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">{service.title}</h3>

                <div className="flex items-center gap-2.5">
                  {service.providerImage ? (
                    <img src={service.providerImage} alt={service.provider_name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-900 to-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {service.provider_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'SP'}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                      {service.provider_name || 'Service Provider'}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#2b52cc" opacity="0.15" />
                        <polyline points="9 12 11 14 15 10" stroke="#2b52cc" strokeWidth="2" fill="none" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{service.jobs_completed || 0} jobs completed</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700 mt-1">
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-0.5">Starting at</div>
                    <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">₱{service.price || 0}</div>
                  </div>
                  <Button 
                    className="bg-gradient-to-br from-blue-900 to-blue-600 text-white hover:opacity-90 shadow-md hover:shadow-lg transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewService(service);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SavedServices;
