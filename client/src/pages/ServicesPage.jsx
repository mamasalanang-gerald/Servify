import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ServicesFilter from '../components/ServicesFilter';
import ServicesGrid from '../components/ServicesGrid';
import ServiceDetailPage from '../components/ServiceDetailPage';
import { Input } from '../components/ui/input';

const ServicesPage = () => {
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState(null);

  // Filter state — pre-check category if coming from Popular Categories
  const [filters, setFilters] = useState({
    priceRange: 25000,
    selectedRating: '',
    selectedCategories: location.state?.category ? [location.state.category] : [],
  });

  const handleFilterChange = (updated) => setFilters(updated);

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col">
      <Navbar activePage="services" />

      {selectedService ? (
        <ServiceDetailPage
          service={selectedService}
          onBack={() => setSelectedService(null)}
        />
      ) : (
        <div className="flex-1 max-w-[1280px] w-full mx-auto px-6 py-7 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-3 bg-white border-[1.5px] border-slate-200 rounded-xl px-4 py-3 shadow-sm transition-all focus-within:border-blue-600 focus-within:shadow-[0_0_0_3px_rgba(43,82,204,0.10)]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <Input
                type="text"
                placeholder="Search services..."
                className="flex-1 border-none outline-none text-sm text-slate-900 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="w-[280px] flex-shrink-0">
              <ServicesFilter
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
            <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-bottom-5 duration-500 delay-100">
              <div className="mb-5">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {filters.selectedCategories.length === 1
                    ? filters.selectedCategories[0]
                    : 'Browse Services'}
                </h1>
              </div>
              <ServicesGrid
                searchQuery={searchQuery}
                filters={filters}
                onSelectService={setSelectedService}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;