import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import houseCleaningImg from '../assets/images/house_cleaning.jpg';
import plumbingImg from '../assets/images/plumbing_repair.jpg';
import spaImg from '../assets/images/spa_massage.jpg';
import mathImg from '../assets/images/math_physics.jpg';
import ViewService from './ViewService.jsx';

import { savedServiceService } from '../services/savedServiceService.js';

const SavedServices = () => {
  const [savedServices, setSavedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingService, setViewingService] = useState(null);

  useEffect(() => {
    savedServiceService.getSaved()
      .then(data => setSavedServices(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleUnsave = async (serviceId) => {
    await savedServiceService.unsave(serviceId);
    setSavedServices(prev => prev.filter(s => s.id !== serviceId));
  };

  if (viewingService) {
    return <ViewService service={viewingService} onBack={() => setViewingService(null)} />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Saved Services</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {savedServices.map((service) => (
          <Card key={service.id} className="overflow-hidden transition-shadow hover:shadow-lg">
            <div className="relative">
              <img src={service.img} alt={service.title} className="h-48 w-full object-cover" />
              <button className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-colors hover:bg-white" aria-label="Remove from saved">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-3">
              <h3 className="font-semibold text-foreground">{service.title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  {service.rating}
                </span>
                <span>•</span>
                <span>From {service.price}</span>
              </div>
              <Button className="w-full" onClick={() => setViewingService(service)}>
                View Service
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SavedServices;