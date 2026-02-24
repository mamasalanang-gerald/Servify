# Servify — Hardcoded Data → Dynamic (DB-Driven) Migration Guide

> **Author:** Codebase Analysis  
> **Date:** February 23, 2026  
> **Scope:** Full-stack audit of every hardcoded data occurrence and a step-by-step plan to make each one dynamic.
>
> ### 📎 Implementation Plans (with copy-paste code snippets)
>
> - **[IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)** — DB migration, backend models/controllers/routes
> - **[IMPLEMENTATION_PLAN_FRONTEND.md](./IMPLEMENTATION_PLAN_FRONTEND.md)** — Frontend component refactors
>
> **Key design decision:** Service packages use a `JSONB` column on the existing `services` table (no separate table needed).

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Hardcoded Data Inventory](#2-hardcoded-data-inventory)
   - [🔴 Critical (Core Feature Data)](#-critical--core-feature-data)
   - [🟡 Medium (Dashboard / Provider Data)](#-medium--dashboard--provider-data)
   - [🟢 Low (UI / Static Content)](#-low--ui--static-content)
3. [Database Schema Changes Required](#3-database-schema-changes-required)
4. [Backend Implementation Plan](#4-backend-implementation-plan)
5. [Frontend Refactor Plan](#5-frontend-refactor-plan)
6. [Migration Order (Recommended)](#6-migration-order-recommended)
7. [Summary Checklist](#7-summary-checklist)

---

## 1. Executive Summary

The Servify codebase has **two distinct patterns**:

| Pattern                | Where                                                                                                                                                                                                             | Status                                                                  |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| ✅ **Already dynamic** | Admin panel (`UserManagement`, `CategoryManagement`, `BookingMonitoring`, `ReviewModeration`, `ServiceModeration`, `ProviderManagement`), `BookingList`, `DashboardStats`                                         | These fetch from the API via the `adminService`, `bookingService`, etc. |
| ❌ **Fully hardcoded** | `ServicesGrid`, `ServicesFilter`, `PopularCategories`, `SavedServices`, `ServiceDetailPage`, `ProviderOverview`, `ProviderBookings`, `ProviderEarnings`, `ProviderReviews`, `ProviderServices`, `ProviderProfile` | Data is defined as `const` arrays directly inside these files.          |

The hardcoded components display **fake/mock** data (service listings, bookings, reviews, earnings, provider profile info) that never touches your PostgreSQL database. Below is the complete plan to fix this.

---

## 2. Hardcoded Data Inventory

### 🔴 Critical — Core Feature Data

These are user-facing features whose data **must** come from the database.

#### 2.1 `ServicesGrid.jsx` — Line 12–117

**What's hardcoded:**

```js
const allServices = [
  {
    id: 1,
    img: houseCleaningImg,
    category: "Home Cleaning",
    title: "Deep House Cleaning",
    rating: 4.9,
    providerName: "Chris Izeq Delos Santos",
    providerInitial: "CI",
    jobs: 342,
    priceNum: 2800,
    price: "₱2,800",
    description: "...",
  },
  // ... 7 more hardcoded services
];
```

**Impact:** The entire services marketplace is fake. Filtering, searching, and browsing all operate on this static array instead of real services from the `services` table.

---

#### 2.2 `PopularCategories.jsx` — Line 3–83

**What's hardcoded:**

```js
const categories = [
  { label: "Home Cleaning", count: "234 services", icon: (...) },
  { label: "Plumbing",      count: "156 services", icon: (...) },
  // ... 6 more
];
```

**Impact:** Category names and service counts are completely fabricated. The `categories` table exists in the DB, but this landing page component never queries it.

---

#### 2.3 `ServicesFilter.jsx` — Line 1–10

**What's hardcoded:**

```js
const categories = [
  { name: "Home Cleaning", count: 234 },
  { name: "Plumbing", count: 156 },
  // ... 6 more
];
```

**Impact:** The filter sidebar is a duplicate of the fake categories. Any categories added via the Admin panel won't appear here.

---

#### 2.4 `SavedServices.jsx` — Line 10–112

**What's hardcoded:**

```js
const savedServices = [
  { id: 1, img: houseCleaningImg, title: 'Deep House Cleaning',
    rating: 4.9, price: '₱89', includes: [...], packages: [...], reviews: [...] },
  // ... 3 more
];
```

**Impact:** There's no `saved_services` or favorites table in the DB. The entire "Saved Services" feature is a static illusion.

---

#### 2.5 `ServiceDetailPage.jsx` — Line 23–33

**What's hardcoded:**

```js
const packages = service?.packages || [
  { name: "Basic Clean", price: "4,999", ... },
  // ... 2 more fallback packages
];
const reviews = [
  { name: "Anna L.", rating: 5, date: "Jan 2026", comment: "..." },
  // ... 2 more
];
```

**Impact:** Service packages and reviews on the detail page are hardcoded fallbacks. The `reviews` table exists in the DB but is never queried here.

---

### 🟡 Medium — Dashboard / Provider Data

#### 2.6 `ProviderOverview.jsx` — Lines 15–86

**What's hardcoded:**

- `recentBookings` (3 fake bookings) — Line 15
- `weeklyData` (earnings bar chart) — Line 21
- `stats` array (₱12,480 total earnings, 84 bookings, etc.) — Line 42
- `quickActions` — Line 81

**Impact:** The provider dashboard shows fabricated performance metrics.

---

#### 2.7 `ProviderBookings.jsx` — Line 7–17

**What's hardcoded:**

```js
const allBookings = [
  { id: 1, client: 'Maria Santos', service: 'Deep House Cleaning', ... },
  // ... 8 more fake bookings
];
```

**Impact:** Provider can't see real bookings. The `getBookingsByProviderId` model function exists but isn't used.

---

#### 2.8 `ProviderEarnings.jsx` — Lines 5–28

**What's hardcoded:**

- `transactions` (7 fake transaction rows) — Line 5
- `payouts` (3 fake payout rows) — Line 15
- `monthlyData` (6 months of fake earnings) — Line 21
- `summaryStats` (₱12,480 total, ₱920 this month, etc.) — Line 34

**Impact:** Entire earnings dashboard is fictional.

---

#### 2.9 `ProviderReviews.jsx` — Line 6–13

**What's hardcoded:**

```js
const initialReviews = [
  { id: 1, client: "Maria Santos", rating: 5, text: "..." },
  // ... 5 more fake reviews
];
```

**Impact:** Reviews exist in the DB (`reviews` table) but aren't fetched for the provider dashboard.

---

#### 2.10 `ProviderServices.jsx` — Lines 10–16

**What's hardcoded:**

```js
const initialServices = [
  { id: 1, title: 'Deep House Cleaning', category: 'Cleaning', price: 89, ... },
  // ... 2 more
];
const categories = ['Cleaning', 'Plumbing', 'Electrical', 'Gardening', ...];
```

**Impact:** Provider can't manage real services. CRUD operations only modify local React state.

---

#### 2.11 `ProviderProfile.jsx` — Lines 13–31, 161–166

**What's hardcoded:**

```js
const [form, setForm] = useState({
  name: 'Juan dela Cruz',
  bio: 'Professional cleaner with 5+ years...',
  phone: '+63 912 345 6789',
  email: 'juan.delacruz@email.com',
  // ...
});
// Profile Stats
{ label: 'Completed Jobs', value: '84' },
{ label: 'Response Rate',  value: '98%' },
```

**Impact:** The provider profile form starts with fake data and "saves" only to local state. The real user data from the `users` table is never loaded.

---

### 🟢 Low — UI / Static Content

#### 2.12 `Hero.jsx` — Trust badges

```
"Verified Providers" / "Secure Payments" / "24/7 Support"
```

**Assessment:** These are static marketing copy — acceptable to keep hardcoded. If you want CMS-driven content later, that's a separate concern.

#### 2.13 `Footer.jsx` — Links & Copyright

**Assessment:** Static navigation links (About, Careers, Press, etc.) and copyright text. Acceptable as hardcoded. Could be driven by a CMS later.

#### 2.14 `Navbar.jsx` — Navigation items

**Assessment:** Static nav structure. Acceptable to keep hardcoded.

#### 2.15 `DashboardSidebar.jsx` — Navigation items

**Assessment:** Static sidebar nav items (Bookings, Saved Services, Profile, Settings). Structural UI — fine as hardcoded.

---

## 3. Database Schema Changes Required

Create a new migration file `server/migrations/002_extend_tables.sql`:

```sql
-- ============================================================
-- 1. SAVED SERVICES (User Favorites)
-- ============================================================
CREATE TABLE IF NOT EXISTS saved_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, service_id)   -- prevent duplicate saves
);

CREATE INDEX IF NOT EXISTS idx_saved_services_user ON saved_services(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_services_service ON saved_services(service_id);


-- ============================================================
-- 2. SERVICE PACKAGES (tiered pricing per service)
-- ============================================================
CREATE TABLE IF NOT EXISTS service_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,        -- e.g. "Basic", "Standard", "Premium"
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    duration VARCHAR(50) NULL,         -- e.g. "3 hrs", "5 hrs"
    description TEXT NULL,
    features TEXT[] NULL,              -- PostgreSQL array of feature strings
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_packages_service ON service_packages(service_id);


-- ============================================================
-- 3. SERVICE IMAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS service_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_images_service ON service_images(service_id);


-- ============================================================
-- 4. PROVIDER AVAILABILITY
-- ============================================================
CREATE TABLE IF NOT EXISTS provider_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),  -- 0=Sunday
    is_open BOOLEAN DEFAULT TRUE,
    start_time TIME NULL,
    end_time TIME NULL,
    UNIQUE(provider_id, day_of_week)
);

CREATE INDEX IF NOT EXISTS idx_provider_avail_provider ON provider_availability(provider_id);


-- ============================================================
-- 5. PROVIDER SKILLS
-- ============================================================
CREATE TABLE IF NOT EXISTS provider_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    UNIQUE(provider_id, skill_name)
);

CREATE INDEX IF NOT EXISTS idx_provider_skills_provider ON provider_skills(provider_id);


-- ============================================================
-- 6. EARNINGS / PAYOUTS (Optional — for provider earnings dashboard)
-- ============================================================
CREATE TABLE IF NOT EXISTS payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
    method VARCHAR(50) NOT NULL,       -- e.g. "GCash", "BDO Bank"
    status VARCHAR(20) DEFAULT 'completed',
    payout_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payouts_provider ON payouts(provider_id);


-- ============================================================
-- 7. Extend existing tables
-- ============================================================

-- Add image_url to services for primary image
ALTER TABLE services ADD COLUMN IF NOT EXISTS image_url TEXT NULL;

-- Add average_rating cache (denormalized for performance)
ALTER TABLE services ADD COLUMN IF NOT EXISTS average_rating NUMERIC(3,2) DEFAULT 0;
ALTER TABLE services ADD COLUMN IF NOT EXISTS total_reviews INT DEFAULT 0;

-- Add provider fields for richer profiles
ALTER TABLE users ADD COLUMN IF NOT EXISTS address VARCHAR(255) NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS experience VARCHAR(50) NULL;

-- Add platform fee info to bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS platform_fee NUMERIC(10,2) DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS net_amount NUMERIC(10,2) DEFAULT 0;
```

---

## 4. Backend Implementation Plan

### 4.1 New Models Required

| Model File                     | Functions Needed                                                                                                  | DB Table                |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `savedServiceModel.js`         | `saveService(user_id, service_id)`, `unsaveService(user_id, service_id)`, `getSavedByUser(user_id)`               | `saved_services`        |
| `servicePackageModel.js`       | `getPackagesByService(service_id)`, `createPackage(...)`, `updatePackage(...)`, `deletePackage(...)`              | `service_packages`      |
| `providerAvailabilityModel.js` | `getAvailability(provider_id)`, `setAvailability(provider_id, dayData[])`                                         | `provider_availability` |
| `providerSkillModel.js`        | `getSkills(provider_id)`, `addSkill(provider_id, name)`, `removeSkill(provider_id, name)`                         | `provider_skills`       |
| `payoutModel.js`               | `getPayoutsByProvider(provider_id)`, `createPayout(...)`                                                          | `payouts`               |
| `reviewModel.js` _(new)_       | `getReviewsByProvider(provider_id)`, `getReviewsByService(service_id)`, `createReview(...)`, `replyToReview(...)` | `reviews`               |

### 4.2 Extend Existing Models

#### `servicesModel.js` — Enrich the `getServices()` query

**Current:**

```js
const getServices = async () => {
  const result = await pool.query("SELECT * FROM services");
  return result.rows;
};
```

**Required (JOIN to get provider name, category name, images, rating):**

```js
const getServices = async (filters = {}) => {
  let query = `
        SELECT s.*,
               c.name AS category_name,
               u.full_name AS provider_name,
               COALESCE(
                   (SELECT image_url FROM service_images si
                    WHERE si.service_id = s.id AND si.is_primary = true LIMIT 1),
                   s.image_url
               ) AS primary_image,
               COALESCE(s.average_rating, 0) AS rating,
               s.total_reviews AS review_count,
               (SELECT COUNT(*) FROM bookings b
                WHERE b.provider_id = s.provider_id
                  AND b.status = 'completed') AS jobs_completed
        FROM services s
        JOIN categories c ON s.category_id = c.id
        JOIN users u ON s.provider_id = u.id
        WHERE s.is_active = true
    `;
  const values = [];
  let paramCount = 0;

  if (filters.category_id) {
    paramCount++;
    query += ` AND s.category_id = $${paramCount}`;
    values.push(filters.category_id);
  }
  if (filters.max_price) {
    paramCount++;
    query += ` AND s.price <= $${paramCount}`;
    values.push(filters.max_price);
  }
  if (filters.search) {
    paramCount++;
    query += ` AND (s.title ILIKE $${paramCount} OR s.description ILIKE $${paramCount})`;
    values.push(`%${filters.search}%`);
  }

  query += " ORDER BY s.created_at DESC";

  const result = await pool.query(query, values);
  return result.rows;
};
```

#### `categoriesModel.js` — Add service count

```js
const getAllCategoriesWithCount = async () => {
  const result = await pool.query(`
        SELECT c.*, COUNT(s.id) AS service_count
        FROM categories c
        LEFT JOIN services s ON s.category_id = c.id AND s.is_active = true
        GROUP BY c.id
        ORDER BY c.name
    `);
  return result.rows;
};
```

### 4.3 New Controllers

| Controller File                  | Actions                                                            |
| -------------------------------- | ------------------------------------------------------------------ |
| `savedServiceController.js`      | `save`, `unsave`, `getMySaved`                                     |
| `providerDashboardController.js` | `getOverviewStats`, `getEarnings`, `getTransactions`, `getPayouts` |

### 4.4 New Routes

```
# Saved Services
POST   /api/v1/saved-services/:serviceId     → save a service
DELETE /api/v1/saved-services/:serviceId     → unsave a service
GET    /api/v1/saved-services                → list user's saved services

# Service Packages
GET    /api/v1/services/:id/packages         → get packages for a service

# Reviews (per service)
GET    /api/v1/services/:id/reviews          → get reviews for a service

# Provider Dashboard
GET    /api/v1/provider/stats                → overview stats (earnings, bookings, rating)
GET    /api/v1/provider/bookings             → provider's bookings
GET    /api/v1/provider/services             → provider's own services
GET    /api/v1/provider/reviews              → reviews on provider's services
GET    /api/v1/provider/earnings             → earnings breakdown
GET    /api/v1/provider/earnings/transactions → individual transactions
GET    /api/v1/provider/earnings/payouts     → payout history
GET    /api/v1/provider/profile              → get profile + skills + availability
PUT    /api/v1/provider/profile              → update profile
PUT    /api/v1/provider/availability         → update availability
POST   /api/v1/provider/skills              → add skill
DELETE /api/v1/provider/skills/:name        → remove skill

# Categories (public, with counts)
GET    /api/v1/categories/with-counts        → categories + service_count
```

### 4.5 Extend Existing Controllers

#### `servicesController.js` — Accept filter query params

```js
const getAllServices = async (req, res) => {
  try {
    const filters = {
      category_id: req.query.category_id || null,
      max_price: req.query.max_price || null,
      search: req.query.search || null,
      min_rating: req.query.min_rating || null,
    };
    const services = await servicesModel.getServices(filters);
    res.json({ data: services });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

---

## 5. Frontend Refactor Plan

### 5.1 `PopularCategories.jsx` — Fetch from API

```jsx
// BEFORE: const categories = [ { label: "Home Cleaning", count: "234 services", ... }, ... ];
// AFTER:
import { useState, useEffect } from "react";
import { categoryService } from "../services/categoryService";

export default function PopularCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await categoryService.getAllCategoriesWithCounts();
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Keep the same JSX rendering, but use dynamic data:
  // cat.name, `${cat.service_count} services`, getCategoryIcon(cat.name)
}
```

> **Icon mapping:** Create a utility `getCategoryIcon(categoryName)` that maps category names to SVG icons. This keeps icons in the frontend (which is appropriate — icons are UI concerns, not data).

---

### 5.2 `ServicesFilter.jsx` — Fetch categories from API

```jsx
// BEFORE: const categories = [{ name: 'Home Cleaning', count: 234 }, ...];
// AFTER:
const [categories, setCategories] = useState([]);

useEffect(() => {
  categoryService
    .getAllCategoriesWithCounts()
    .then((res) => setCategories(res.data || []))
    .catch(console.error);
}, []);
```

---

### 5.3 `ServicesGrid.jsx` — Full API integration

This is the **biggest refactor**. Replace the entire `allServices` const array with an API call.

```jsx
// BEFORE: const allServices = [ ... 8 hardcoded services ... ];
// AFTER:
import { useState, useEffect } from "react";
import { serviceService } from "../services/serviceService";

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
        if (filters.selectedCategories?.length > 0) {
          params.categories = filters.selectedCategories.join(",");
        }
        if (filters.selectedRating)
          params.min_rating = parseRating(filters.selectedRating);

        const res = await serviceService.getServices(params);
        setServices(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [searchQuery, filters]);

  // Render services from API response
};
```

**Key data mapping from API → component:**

| Component Field           | API Response Field                                                 |
| ------------------------- | ------------------------------------------------------------------ |
| `service.img`             | `service.primary_image` or `service.image_url`                     |
| `service.category`        | `service.category_name`                                            |
| `service.providerName`    | `service.provider_name`                                            |
| `service.providerInitial` | Derive: `service.provider_name.split(' ').map(n => n[0]).join('')` |
| `service.rating`          | `service.average_rating`                                           |
| `service.jobs`            | `service.jobs_completed`                                           |
| `service.price`           | Format: `₱${Number(service.price).toLocaleString()}`               |
| `service.priceNum`        | `Number(service.price)`                                            |

---

### 5.4 `SavedServices.jsx` — New saved services API

```jsx
// Create a new frontend service:
// services/savedServiceService.js

import api from "./api";

export const savedServiceService = {
  async getSaved() {
    const res = await api.get("/saved-services");
    if (!res.ok) throw new Error("Failed to fetch saved services");
    return await res.json();
  },
  async save(serviceId) {
    const res = await api.post(`/saved-services/${serviceId}`);
    if (!res.ok) throw new Error("Failed to save service");
    return await res.json();
  },
  async unsave(serviceId) {
    const res = await api.delete(`/saved-services/${serviceId}`);
    if (!res.ok) throw new Error("Failed to unsave service");
    return await res.json();
  },
};
```

Then refactor `SavedServices.jsx` to use this service instead of the hardcoded array.

---

### 5.5 `ServiceDetailPage.jsx` — Fetch packages & reviews

```jsx
// Instead of hardcoded fallback packages and reviews:
const [packages, setPackages] = useState([]);
const [reviews, setReviews] = useState([]);

useEffect(() => {
  if (service?.id) {
    serviceService
      .getServicePackages(service.id)
      .then((res) => setPackages(res.data || []));
    serviceService
      .getServiceReviews(service.id)
      .then((res) => setReviews(res.data || []));
  }
}, [service?.id]);
```

---

### 5.6 `ProviderOverview.jsx` — Provider dashboard API

```jsx
// Create: services/providerService.js
import api from "./api";

export const providerService = {
  async getStats() {
    const res = await api.get("/provider/stats");
    if (!res.ok) throw new Error("Failed to fetch provider stats");
    return await res.json();
  },
  async getBookings() {
    const res = await api.get("/provider/bookings");
    if (!res.ok) throw new Error("Failed to fetch bookings");
    return await res.json();
  },
  async getEarnings() {
    const res = await api.get("/provider/earnings");
    if (!res.ok) throw new Error("Failed to fetch earnings");
    return await res.json();
  },
  // ... etc
};
```

Then replace all hardcoded `stats`, `recentBookings`, and `weeklyData` with API calls.

---

### 5.7 `ProviderBookings.jsx` — Use `bookingService`

```jsx
// BEFORE: const allBookings = [ ... 9 hardcoded bookings ... ];
// AFTER:
const [bookings, setBookings] = useState([]);

useEffect(() => {
  const user = authService.getUser();
  if (user?.id) {
    bookingService
      .getProviderBookings(user.id)
      .then((data) => setBookings(data))
      .catch(console.error);
  }
}, []);
```

> Note: `getBookingsByProviderId` already exists in the backend model — you just need a controller + route + frontend service method for it.

---

### 5.8 `ProviderEarnings.jsx` — Earnings API

Replace all three hardcoded arrays (`transactions`, `payouts`, `monthlyData`) with:

```jsx
useEffect(() => {
  providerService.getTransactions().then((res) => setTransactions(res.data));
  providerService.getPayouts().then((res) => setPayouts(res.data));
  providerService.getMonthlyEarnings().then((res) => setMonthlyData(res.data));
}, []);
```

The backend would compute transactions from completed bookings with platform fee deduction.

---

### 5.9 `ProviderReviews.jsx` — Reviews API

```jsx
// BEFORE: const initialReviews = [ ... 6 hardcoded reviews ... ];
// AFTER:
useEffect(() => {
  providerService.getReviews().then((res) => setReviewList(res.data));
}, []);
```

---

### 5.10 `ProviderServices.jsx` — CRUD via API

```jsx
// BEFORE: const initialServices = [ ... local state only ... ];
// AFTER:
useEffect(() => {
  serviceService.getMyServices().then((res) => setServices(res.data));
}, []);

const handleSave = async () => {
  if (editTarget) {
    await serviceService.updateService(editTarget, form);
  } else {
    await serviceService.createService(form);
  }
  // Re-fetch list
};

const handleDelete = async (id) => {
  await serviceService.deleteService(id);
  // Re-fetch list
};
```

Also fetch the categories list from the API for the dropdown:

```jsx
useEffect(() => {
  categoryService.getAllCategories().then((res) => setCategories(res.data));
}, []);
```

---

### 5.11 `ProviderProfile.jsx` — Load real user data

```jsx
// BEFORE: useState({ name: 'Juan dela Cruz', bio: '...', ... })
// AFTER:
useEffect(() => {
  const user = authService.getUser();
  if (user?.id) {
    userService.getProfile(user.id).then((profile) => {
      setForm({
        name: profile.full_name,
        bio: profile.bio || "",
        phone: profile.phone_number || "",
        email: profile.email,
        address: profile.address || "",
        experience: profile.experience || "",
      });
    });
    providerService.getSkills(user.id).then((res) => setSkills(res.data));
    providerService
      .getAvailability(user.id)
      .then((res) => setAvailability(res.data));
  }
}, []);

const handleSave = async () => {
  await userService.updateProfile(user.id, form);
  // Show success toast
};
```

---

## 6. Migration Order (Recommended)

Implementing in this order minimizes broken states and builds on prior work:

### Phase 1 — Foundation (DB + Core API)

| #   | Task                                                         | Files                 |
| --- | ------------------------------------------------------------ | --------------------- |
| 1   | Run new migration `002_extend_tables.sql`                    | `server/migrations/`  |
| 2   | Extend `servicesModel.js` with JOINs and filters             | `server/models/`      |
| 3   | Extend `categoriesModel.js` with `getAllCategoriesWithCount` | `server/models/`      |
| 4   | Update `servicesController.js` to accept query params        | `server/controllers/` |
| 5   | Add `GET /categories/with-counts` endpoint                   | `server/routes/`      |

### Phase 2 — Public Pages (Services Marketplace)

| #   | Task                                               | Files                    |
| --- | -------------------------------------------------- | ------------------------ |
| 6   | Refactor `PopularCategories.jsx` → API             | `client/src/components/` |
| 7   | Refactor `ServicesFilter.jsx` → API                | `client/src/components/` |
| 8   | Refactor `ServicesGrid.jsx` → API (biggest change) | `client/src/components/` |
| 9   | Seed DB with real services and categories          | `server/scripts/`        |

### Phase 3 — Service Detail & Saved

| #   | Task                                                     | Files                  |
| --- | -------------------------------------------------------- | ---------------------- |
| 10  | Create `service_packages` model + controller + routes    | Backend                |
| 11  | Create `reviewModel.js` + routes for per-service reviews | Backend                |
| 12  | Refactor `ServiceDetailPage.jsx` → API                   | Frontend               |
| 13  | Create `saved_services` model + controller + routes      | Backend                |
| 14  | Create `savedServiceService.js`                          | `client/src/services/` |
| 15  | Refactor `SavedServices.jsx` → API                       | Frontend               |

### Phase 4 — Provider Dashboard

| #   | Task                                                            | Files                  |
| --- | --------------------------------------------------------------- | ---------------------- |
| 16  | Create `providerService.js` frontend service                    | `client/src/services/` |
| 17  | Add provider dashboard routes to server                         | Backend                |
| 18  | Refactor `ProviderOverview.jsx` → API                           | Frontend               |
| 19  | Refactor `ProviderBookings.jsx` → use `getBookingsByProviderId` | Frontend               |
| 20  | Refactor `ProviderServices.jsx` → CRUD via API                  | Frontend               |
| 21  | Refactor `ProviderReviews.jsx` → API                            | Frontend               |
| 22  | Refactor `ProviderEarnings.jsx` → API                           | Frontend               |

### Phase 5 — Provider Profile

| #   | Task                                              | Files    |
| --- | ------------------------------------------------- | -------- |
| 23  | Add provider profile, skills, availability models | Backend  |
| 24  | Add provider profile routes                       | Backend  |
| 25  | Refactor `ProviderProfile.jsx` → API              | Frontend |

---

## 7. Summary Checklist

| Component               | Current State                    | Target State                                        | Priority    |
| ----------------------- | -------------------------------- | --------------------------------------------------- | ----------- |
| `ServicesGrid.jsx`      | ❌ 8 hardcoded services          | ✅ Fetch from `GET /services`                       | 🔴 Critical |
| `PopularCategories.jsx` | ❌ 8 hardcoded categories        | ✅ Fetch from `GET /categories/with-counts`         | 🔴 Critical |
| `ServicesFilter.jsx`    | ❌ 8 hardcoded categories        | ✅ Fetch from same endpoint                         | 🔴 Critical |
| `SavedServices.jsx`     | ❌ 4 hardcoded saved services    | ✅ Fetch from `GET /saved-services`                 | 🔴 Critical |
| `ServiceDetailPage.jsx` | ❌ Hardcoded packages + reviews  | ✅ Fetch from `/services/:id/packages` + `/reviews` | 🔴 Critical |
| `ProviderOverview.jsx`  | ❌ Fake stats + bookings + chart | ✅ Fetch from `GET /provider/stats`                 | 🟡 Medium   |
| `ProviderBookings.jsx`  | ❌ 9 hardcoded bookings          | ✅ Use existing `getBookingsByProviderId`           | 🟡 Medium   |
| `ProviderEarnings.jsx`  | ❌ Fake transactions + payouts   | ✅ Compute from completed bookings                  | 🟡 Medium   |
| `ProviderReviews.jsx`   | ❌ 6 hardcoded reviews           | ✅ Fetch from `reviews` table                       | 🟡 Medium   |
| `ProviderServices.jsx`  | ❌ 3 hardcoded + local CRUD      | ✅ API CRUD via `serviceService`                    | 🟡 Medium   |
| `ProviderProfile.jsx`   | ❌ Hardcoded profile data        | ✅ Load from `users` table                          | 🟡 Medium   |
| `Hero.jsx`              | ⚪ Marketing copy                | ⚪ Keep as-is                                       | 🟢 Low      |
| `Footer.jsx`            | ⚪ Static links                  | ⚪ Keep as-is                                       | 🟢 Low      |
| `Navbar.jsx`            | ⚪ Static nav                    | ⚪ Keep as-is                                       | 🟢 Low      |
| `DashboardSidebar.jsx`  | ⚪ Static nav items              | ⚪ Keep as-is                                       | 🟢 Low      |

---

### Key Principle

> **Your backend already has the right tables** (`services`, `categories`, `bookings`, `reviews`, `users`) and **working models** for most CRUD operations. The primary gap is:
>
> 1. **Richer queries** (JOINs that return provider name, category name, ratings, service counts)
> 2. **New API routes** for provider-specific dashboards and saved services
> 3. **Frontend refactors** to replace `const hardcodedData = [...]` with `useEffect + fetch`
>
> The admin panel is already well-implemented as a reference pattern. Follow the same `service → useEffect → useState → render` pattern used in `UserManagement.jsx`, `CategoryManagement.jsx`, etc.
