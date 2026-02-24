# Servify — Frontend Component Refactors

> Companion to `IMPLEMENTATION_PLAN.md`. All snippets assume backend Phase 1-2 are done.

---

## 1. `PopularCategories.jsx` — Fetch categories from API

**Current:** Hardcoded `const categories = [{ label: "Home Cleaning", count: "234 services" }, ...]`

**Replace lines 1–83** (the `categories` const) with a `useState` + `useEffect`:

```jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { categoryService } from "../services/categoryService";

// Map category names to SVG icons (icons are UI, not data)
const categoryIcons = {
  "Home Cleaning": (
    <svg
      width="28"
      height="28"
      fill="none"
      stroke="#2c3fd1"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path
        d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"
        strokeLinejoin="round"
      />
      <path d="M9 21V12h6v9" strokeLinejoin="round" />
    </svg>
  ),
  // ... add your other icons here, keyed by category name
};

const defaultIcon = (
  <svg
    width="28"
    height="28"
    fill="none"
    stroke="#2c3fd1"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4l3 3" strokeLinecap="round" />
  </svg>
);

export default function PopularCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryService
      .getCategoriesWithCounts()
      .then((res) => setCategories(res.categories || []))
      .catch(console.error);
  }, []);

  return (
    <section className="py-20 px-12 bg-[#f0f2f8] dark:bg-[#131929] transition-colors">
      {/* ... keep existing heading JSX ... */}
      <div className="grid grid-cols-4 gap-5 max-w-[1100px] mx-auto md:grid-cols-2 sm:grid-cols-1">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="/* ... keep existing classes ... */"
            onClick={() =>
              navigate("/services", { state: { category: cat.name } })
            }
          >
            <div className="category-icon-wrap w-14 h-14 bg-[#eef1fb] dark:bg-[#222a40] rounded-full flex items-center justify-center mb-3 transition-colors">
              {categoryIcons[cat.name] || defaultIcon}
            </div>
            <span className="font-heading font-semibold text-base text-app-text dark:text-[#f1f5f9]">
              {cat.name}
            </span>
            <span className="font-sans text-[0.85rem] text-[#94a3b8] dark:text-[#64748b]">
              {cat.service_count} services
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
```

---

## 2. `ServicesFilter.jsx` — Fetch categories from API

**Replace the hardcoded `categories` array with a fetch:**

```jsx
import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { categoryService } from '../services/categoryService';

const ratings = ['4.5+ Stars', '4+ Stars', '3.5+ Stars', '3& below'];

const ServicesFilter = ({ filters, onFilterChange }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryService.getCategoriesWithCounts()
      .then(res => setCategories(res.categories || []))
      .catch(console.error);
  }, []);

  // ... rest of the component stays exactly the same,
  // just use cat.name and cat.service_count instead of cat.count
```

In the JSX, change the category label rendering:

```jsx
<span>
  {cat.name}{" "}
  <span className="text-slate-500 text-xs">({cat.service_count})</span>
</span>
```

---

## 3. `ServicesGrid.jsx` — Fetch from `GET /services` API

This is the **biggest change**. Delete the entire hardcoded `allServices` array and image imports.

```jsx
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
      <p className="text-sm text-slate-500 font-medium">
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
          <div className="col-span-full text-center py-16 text-slate-500 text-base">
            <p>No services match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesGrid;
```

---

## 4. `ServiceDetailPage.jsx` — Dynamic packages & reviews

Replace the hardcoded `packages` fallback and `reviews` array (lines 23–33) with:

```jsx
const [packages, setPackages] = useState([]);
const [reviews, setReviews] = useState([]);

useEffect(() => {
  // Use packages from the service object (JSONB column)
  if (service?.packages && service.packages.length > 0) {
    setPackages(service.packages);
  } else {
    // Fallback to price-based single package
    setPackages([
      {
        name: service?.title || "Standard",
        price: service?.price || service?.priceNum || 0,
        description: service?.description || "",
        features: [],
      },
    ]);
  }

  // Fetch real reviews from API
  if (service?.id) {
    serviceService
      .getServiceReviews(service.id)
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]));
  }
}, [service]);
```

In the reviews rendering section, update field names:

```jsx
{
  reviews.map((r, i) => (
    <Card key={r.id || i} className="p-5">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-900 to-blue-600 text-white flex items-center justify-center text-sm font-bold">
          {(r.reviewer_name || r.name || "?")[0]}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-slate-900">
            {r.reviewer_name || r.name}
          </div>
          <div className="text-xs text-slate-500">
            {new Date(r.review_date || r.date).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
        <div className="text-amber-500">
          {"★".repeat(r.rating)}
          {"☆".repeat(5 - r.rating)}
        </div>
      </div>
      <p className="text-sm text-slate-600">{r.comment || r.text}</p>
    </Card>
  ));
}
```

Add import at top: `import { serviceService } from '../services/serviceService';`

---

## 5. `SavedServices.jsx` — Fetch from saved services API

Replace the hardcoded `savedServices` array with:

```jsx
import { useState, useEffect } from 'react';
import { savedServiceService } from '../services/savedServiceService';

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

  // ... rest of rendering, mapping API fields:
  // service.title, service.average_rating, service.price, service.image_url, etc.
```

---

## 6. `ProviderServices.jsx` — CRUD via API

Replace the hardcoded `initialServices` and categories:

```jsx
const [services, setServices] = useState([]);
const [categories, setCategories] = useState([]);

useEffect(() => {
  serviceService
    .getMyServices()
    .then((data) => setServices(data))
    .catch(console.error);
  categoryService
    .getAllCategories()
    .then((res) => setCategories(res.categories || []))
    .catch(console.error);
}, []);

const handleSave = async () => {
  if (!form.title || !form.price) return;
  try {
    if (editTarget) {
      await serviceService.updateService(editTarget, {
        title: form.title,
        category_id: form.category_id,
        price: Number(form.price),
        description: form.description,
        service_type: form.service_type || "onsite",
        location: form.location || "",
        packages: form.packages || [],
      });
    } else {
      await serviceService.createService({
        title: form.title,
        category_id: form.category_id,
        price: Number(form.price),
        description: form.description,
        service_type: form.service_type || "onsite",
        location: form.location || "",
        packages: form.packages || [],
      });
    }
    // Re-fetch
    const updated = await serviceService.getMyServices();
    setServices(updated);
    setShowModal(false);
  } catch (err) {
    console.error(err);
  }
};

const handleDelete = async (id) => {
  await serviceService.deleteService(id);
  const updated = await serviceService.getMyServices();
  setServices(updated);
  setDeleteConfirm(null);
};
```

---

## 7. `ProviderBookings.jsx` — Use existing booking API

Replace the hardcoded `allBookings` array:

```jsx
const [bookings, setBookings] = useState([]);

useEffect(() => {
  const user = authService.getUser();
  if (user?.id) {
    bookingService
      .getProviderBookings(user.id)
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch(console.error);
  }
}, []);
```

Map API fields → component fields:

- `booking.client_name` → display name
- `booking.service_name` → service title
- `booking.booking_date` → format with `new Date().toLocaleDateString()`
- `booking.total_price` → `₱${booking.total_price}`

---

## 8. `ProviderReviews.jsx` — Fetch from reviews API

```jsx
import { serviceService } from "../services/serviceService";

// Replace initialReviews with:
const [reviewList, setReviewList] = useState([]);

useEffect(() => {
  // Fetch reviews for this provider's services
  const user = authService.getUser();
  if (user?.id) {
    // You can use the provider bookings endpoint or add a /provider/reviews route
    api.get(`/services/mine`).then(async (res) => {
      const data = await res.json();
      // Fetch reviews for each service
      const allReviews = [];
      for (const svc of data) {
        const reviews = await serviceService.getServiceReviews(svc.id);
        allReviews.push(...reviews.map((r) => ({ ...r, service: svc.title })));
      }
      setReviewList(allReviews);
    });
  }
}, []);
```

---

## 9. `ProviderOverview.jsx` — Compute from real data

Replace hardcoded `stats`, `recentBookings`, and `weeklyData` with API calls:

```jsx
const [stats, setStats] = useState({
  totalEarnings: 0,
  totalBookings: 0,
  pendingRequests: 0,
  avgRating: 0,
});
const [recentBookings, setRecentBookings] = useState([]);

useEffect(() => {
  const user = authService.getUser();
  if (!user?.id) return;

  bookingService.getProviderBookings(user.id).then((bookings) => {
    const arr = Array.isArray(bookings) ? bookings : [];
    const completed = arr.filter((b) => b.status === "completed");
    const pending = arr.filter((b) => b.status === "pending");

    setStats({
      totalEarnings: `₱${completed.reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0).toLocaleString()}`,
      totalBookings: arr.length.toString(),
      pendingRequests: pending.length.toString(),
      avgRating: "—", // Compute from reviews if needed
    });

    setRecentBookings(
      arr.slice(0, 3).map((b) => ({
        id: b.id,
        client: b.client_name,
        service: b.service_name,
        date: new Date(b.booking_date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        amount: `₱${b.total_price}`,
        status: b.status,
      })),
    );
  });
}, []);
```

---

## 10. `ProviderProfile.jsx` — Load real user data

Replace hardcoded `useState` defaults:

```jsx
useEffect(() => {
  userService
    .getProfile()
    .then((user) => {
      setForm({
        name: user.full_name || "",
        bio: user.bio || "",
        phone: user.phone_number || "",
        email: user.email || "",
        address: user.address || "",
        experience: user.experience || "",
      });
    })
    .catch(console.error);
}, []);

const handleSave = async () => {
  try {
    await userService.updateProfile({
      full_name: form.name,
      email: form.email,
      phone_number: form.phone,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  } catch (err) {
    console.error(err);
  }
};
```

---

## Quick Reference: API Field Mapping

| Frontend Field            | API Response Field                                         |
| ------------------------- | ---------------------------------------------------------- |
| `service.img`             | `service.image_url`                                        |
| `service.category`        | `service.category_name`                                    |
| `service.providerName`    | `service.provider_name`                                    |
| `service.providerInitial` | Derive: `provider_name.split(' ').map(n => n[0]).join('')` |
| `service.rating`          | `parseFloat(service.average_rating)`                       |
| `service.jobs`            | `parseInt(service.jobs_completed)`                         |
| `service.price` (display) | `₱${Number(service.price).toLocaleString()}`               |
| `service.priceNum`        | `parseFloat(service.price)`                                |
| `service.packages`        | `service.packages` (JSONB, already an array)               |
| `booking.client`          | `booking.client_name`                                      |
| `booking.service`         | `booking.service_name`                                     |
| `review.name`             | `review.reviewer_name`                                     |
| `review.text`             | `review.comment`                                           |
| `review.date`             | `review.review_date`                                       |
