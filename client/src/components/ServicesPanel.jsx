import { useEffect, useState } from 'react';
import ServicesFilter from './ServicesFilter';
import ServicesGrid from './ServicesGrid';
import ServiceDetailPage from './ServiceDetailPage';
import { Input } from './ui/input';

const ServicesPanel = ({ initialCategory = null }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState(null);

  const [filters, setFilters] = useState({
    priceRange: 25000,
    selectedRating: '',
    selectedCategories: initialCategory ? [initialCategory] : [],
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      selectedCategories: initialCategory ? [initialCategory] : [],
    }));
  }, [initialCategory]);

  const handleFilterChange = (updated) => setFilters(updated);

  if (selectedService) {
    return (
      <ServiceDetailPage
        service={selectedService}
        onBack={() => setSelectedService(null)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Search bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-3 bg-white dark:bg-slate-900/70 border-[1.5px] border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 shadow-sm transition-all focus-within:border-blue-600 focus-within:shadow-[0_0_0_3px_rgba(43,82,204,0.10)]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-slate-400 dark:text-slate-500" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <Input
            type="text"
            placeholder="Search services..."
            className="flex-1 border-none outline-none text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filter + Grid */}
      <div className="flex gap-6 items-start">
        <div className="w-[280px] flex-shrink-0">
          <ServicesFilter
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>
        <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-bottom-5 duration-500 delay-100">
          <div className="mb-5">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
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
  );
};

export default ServicesPanel;
