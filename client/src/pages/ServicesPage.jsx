import { useState } from "react";
import Navbar from "../components/Navbar";
import ServicesFilter from "../components/ServicesFilter";
import ServicesGrid from "../components/ServicesGrid";
import ServiceDetailPage from "../components/ServiceDetailPage";
import "./ServicesPage.css";

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  return (
    <div className="services-page">
      <Navbar />

      {selectedService ? (
        /* ── Detail view: full width, no sidebar ── */
        <ServiceDetailPage
          service={selectedService}
          onBack={() => setSelectedService(null)}
        />
      ) : (
        /* ── Grid view ── */
        <div className="services-layout">
          {/* Search Bar */}
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
            <button
              className="services-search-bar__filter-btn"
              onClick={() => setShowMobileFilter(!showMobileFilter)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="11" y1="18" x2="13" y2="18" />
              </svg>
              Filters
            </button>
          </div>

          {/* Content */}
          <div className="services-content">
            <div className={`services-filter-wrapper ${showMobileFilter ? "show" : ""}`}>
              <ServicesFilter />
            </div>
            <div className="services-main">
              <div className="services-main__header">
                <h1 className="services-main__title">Browse Services</h1>
              </div>
              <ServicesGrid
                searchQuery={searchQuery}
                onSelectService={setSelectedService}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}