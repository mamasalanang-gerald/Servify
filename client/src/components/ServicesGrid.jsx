import { useState, useEffect } from "react";
import ServiceCard from "./ServiceCard";
import { serviceService } from "../services/serviceService";

const ratingThresholds = {
  "4.5+ Stars": (r) => r >= 4.5,
  "4+ Stars": (r) => r >= 4,
  "3.5+ Stars": (r) => r >= 3.5,
  "3& below": (r) => r <= 3,
};

const ServicesGrid = ({ searchQuery, filters, onSelectService }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const params = {};
        if (searchQuery) params.search = searchQuery;
        if (filters.priceRange < 25000) params.max_price = filters.priceRange;
        // Send first selected category as filter
        if (filters.selectedCategories?.length === 1) {
          params.category_name = filters.selectedCategories[0];
        }
        const data = await serviceService.getServices(params);
        setServices(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch services:", err);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [searchQuery, filters.priceRange, filters.selectedCategories]);

  // Client-side filter for multi-category and rating (since server handles search + price)
  const filtered = services.filter((s) => {
    if (
      filters.selectedCategories?.length > 1 &&
      !filters.selectedCategories.includes(s.category_name)
    )
      return false;
    const rating = parseFloat(s.average_rating) || 0;
    if (
      filters.selectedRating &&
      ratingThresholds[filters.selectedRating] &&
      !ratingThresholds[filters.selectedRating](rating)
    )
      return false;
    return true;
  });

  // Map API data shape into what ServiceCard expects
  const mappedServices = filtered.map((s) => ({
    ...s,
    category: s.category_name,
    rating: parseFloat(s.average_rating) || 0,
    providerName: s.provider_name,
    providerImage: s.provider_image || null,
    providerInitial:
      s.provider_name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2) || "??",
    jobs: parseInt(s.jobs_completed) || 0,
    priceNum: parseFloat(s.price),
    price: `₱${Number(s.price).toLocaleString()}`,
    img: s.image_url || "/placeholder-service.jpg",
  }));

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
        {mappedServices.length} services available
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {mappedServices.length > 0 ? (
          mappedServices.map((service) => (
            <div
              key={service.id}
              className="cursor-pointer"
              onClick={() => onSelectService(service)}
            >
              <ServiceCard service={service} />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16 text-slate-500 dark:text-slate-400 text-base">
            <p>No services match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesGrid;
