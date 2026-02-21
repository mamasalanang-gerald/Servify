import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ServicesFilter from '../components/ServicesFilter';
import ServicesGrid from '../components/ServicesGrid';
import ServiceDetailPage from '../components/ServiceDetailPage';
import './styles/services.css';

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
    <div className="services-page">
      <Navbar activePage="services" />

      {selectedService ? (
        <ServiceDetailPage
          service={selectedService}
          onBack={() => setSelectedService(null)}
        />
      ) : (
        <div className="services-layout">
          <div className="services-search-bar">
            <div className="services-search-bar__input-wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search services..."
                className="services-search-bar__input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="services-content">
            <div className="services-filter-wrapper">
              <ServicesFilter
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
            <div className="services-main">
              <div className="services-main__header">
                <h1 className="services-main__title">
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