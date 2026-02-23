# Servify — Implementation Plan: Hardcoded → Dynamic

> **Date:** February 23, 2026  
> **Approach:** Use existing `services` table from server + JSONB column for packages  
> **Order:** Database → Backend → Frontend (phase by phase)

---

## Phase 1 — Database Migration

Create `server/migrations/002_extend_tables.sql`. Your `migrate.js` auto-runs new `.sql` files on startup.

```sql
-- ============================================================
-- 1. Add packages (JSONB) + image_url to services table
-- ============================================================
ALTER TABLE services ADD COLUMN IF NOT EXISTS packages JSONB DEFAULT '[]';
ALTER TABLE services ADD COLUMN IF NOT EXISTS image_url TEXT NULL;

-- ============================================================
-- 2. Saved Services (User Favorites)
-- ============================================================
CREATE TABLE IF NOT EXISTS saved_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, service_id)
);
CREATE INDEX IF NOT EXISTS idx_saved_services_user ON saved_services(user_id);

-- ============================================================
-- 3. Extend users for provider profiles
-- ============================================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS address VARCHAR(255) NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS experience VARCHAR(50) NULL;
```

> **How to apply:** Just restart your Docker containers (`docker compose down && docker compose up`). The `migrate.js` will detect `002_extend_tables.sql` as a new file and run it automatically.

---

## Phase 2 — Backend Changes

### 2.1 Update `server/models/servicesModel.js`

Replace the entire file with:

```js
const pool = require("../config/DB");

// Get all services with provider name, category name, and review stats
const getServices = async (filters = {}) => {
  let query = `
        SELECT s.*,
               c.name AS category_name,
               u.full_name AS provider_name,
               COALESCE(AVG(r.rating), 0) AS average_rating,
               COUNT(DISTINCT r.id) AS review_count,
               (SELECT COUNT(*) FROM bookings b 
                WHERE b.provider_id = s.provider_id 
                  AND b.status = 'completed') AS jobs_completed
        FROM services s
        JOIN categories c ON s.category_id = c.id
        JOIN users u ON s.provider_id = u.id
        LEFT JOIN bookings bk ON bk.service_id = s.id
        LEFT JOIN reviews r ON r.booking_id = bk.id
        WHERE s.is_active = true
    `;
  const values = [];
  let p = 0;

  if (filters.category_id) {
    p++;
    query += ` AND s.category_id = $${p}`;
    values.push(filters.category_id);
  }
  if (filters.max_price) {
    p++;
    query += ` AND s.price <= $${p}`;
    values.push(filters.max_price);
  }
  if (filters.search) {
    p++;
    query += ` AND (s.title ILIKE $${p} OR s.description ILIKE $${p})`;
    values.push(`%${filters.search}%`);
  }
  if (filters.category_name) {
    p++;
    query += ` AND c.name = $${p}`;
    values.push(filters.category_name);
  }

  query += ` GROUP BY s.id, c.name, u.full_name ORDER BY s.created_at DESC`;

  const result = await pool.query(query, values);
  return result.rows;
};

const getServicesbyId = async (id) => {
  const result = await pool.query(
    `
        SELECT s.*,
               c.name AS category_name,
               u.full_name AS provider_name,
               u.bio AS provider_bio,
               COALESCE(AVG(r.rating), 0) AS average_rating,
               COUNT(DISTINCT r.id) AS review_count,
               (SELECT COUNT(*) FROM bookings b 
                WHERE b.provider_id = s.provider_id 
                  AND b.status = 'completed') AS jobs_completed
        FROM services s
        JOIN categories c ON s.category_id = c.id
        JOIN users u ON s.provider_id = u.id
        LEFT JOIN bookings bk ON bk.service_id = s.id
        LEFT JOIN reviews r ON r.booking_id = bk.id
        WHERE s.id = $1
        GROUP BY s.id, c.name, u.full_name, u.bio
    `,
    [id],
  );
  return result.rows[0];
};

const getServicesByProvider = async (provider_id) => {
  const result = await pool.query(
    `
        SELECT s.*, c.name AS category_name,
               COALESCE(AVG(r.rating), 0) AS average_rating,
               COUNT(DISTINCT bk.id) AS total_bookings
        FROM services s
        JOIN categories c ON s.category_id = c.id
        LEFT JOIN bookings bk ON bk.service_id = s.id
        LEFT JOIN reviews r ON r.booking_id = bk.id
        WHERE s.provider_id = $1
        GROUP BY s.id, c.name
        ORDER BY s.created_at DESC
    `,
    [provider_id],
  );
  return result.rows;
};

const createServices = async (
  provider_id,
  category_id,
  title,
  description,
  price,
  service_type,
  location,
  packages = [],
) => {
  const result = await pool.query(
    `INSERT INTO services (provider_id, category_id, title, description, price, service_type, location, packages)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [
      provider_id,
      category_id,
      title,
      description,
      price,
      service_type,
      location,
      JSON.stringify(packages),
    ],
  );
  return result.rows[0];
};

const editServices = async (
  id,
  title,
  description,
  price,
  service_type,
  location,
  packages,
) => {
  const result = await pool.query(
    `UPDATE services SET title = $1, description = $2, price = $3, service_type = $4, 
         location = $5, packages = $6, updated_at = NOW()
         WHERE id = $7 RETURNING *`,
    [
      title,
      description,
      price,
      service_type,
      location,
      JSON.stringify(packages || []),
      id,
    ],
  );
  return result.rows[0];
};

const removeService = async (id) => {
  const result = await pool.query(
    "DELETE FROM services WHERE id = $1 RETURNING *",
    [id],
  );
  return result.rows[0];
};

module.exports = {
  getServices,
  getServicesbyId,
  getServicesByProvider,
  createServices,
  editServices,
  removeService,
};
```

---

### 2.2 Update `server/models/categoriesModel.js`

Add this function at the bottom (before `module.exports`):

```js
const getAllCategoriesWithCount = async () => {
  const result = await pool.query(`
        SELECT c.*, COUNT(s.id)::int AS service_count
        FROM categories c
        LEFT JOIN services s ON s.category_id = c.id AND s.is_active = true
        GROUP BY c.id
        ORDER BY c.name
    `);
  return result.rows;
};
```

Add `getAllCategoriesWithCount` to the `module.exports`.

---

### 2.3 Create `server/models/savedServiceModel.js`

```js
const pool = require("../config/DB");

const saveService = async (user_id, service_id) => {
  const result = await pool.query(
    `INSERT INTO saved_services (user_id, service_id)
         VALUES ($1, $2)
         ON CONFLICT (user_id, service_id) DO NOTHING
         RETURNING *`,
    [user_id, service_id],
  );
  return result.rows[0];
};

const unsaveService = async (user_id, service_id) => {
  const result = await pool.query(
    "DELETE FROM saved_services WHERE user_id = $1 AND service_id = $2 RETURNING *",
    [user_id, service_id],
  );
  return result.rows[0];
};

const getSavedByUser = async (user_id) => {
  const result = await pool.query(
    `
        SELECT s.*, c.name AS category_name, u.full_name AS provider_name,
               COALESCE(AVG(r.rating), 0) AS average_rating,
               sv.created_at AS saved_at
        FROM saved_services sv
        JOIN services s ON sv.service_id = s.id
        JOIN categories c ON s.category_id = c.id
        JOIN users u ON s.provider_id = u.id
        LEFT JOIN bookings bk ON bk.service_id = s.id
        LEFT JOIN reviews r ON r.booking_id = bk.id
        WHERE sv.user_id = $1
        GROUP BY s.id, c.name, u.full_name, sv.created_at
        ORDER BY sv.created_at DESC
    `,
    [user_id],
  );
  return result.rows;
};

const isSaved = async (user_id, service_id) => {
  const result = await pool.query(
    "SELECT id FROM saved_services WHERE user_id = $1 AND service_id = $2",
    [user_id, service_id],
  );
  return result.rows.length > 0;
};

module.exports = { saveService, unsaveService, getSavedByUser, isSaved };
```

---

### 2.4 Create `server/models/reviewModel.js`

```js
const pool = require("../config/DB");

const getReviewsByService = async (service_id) => {
  const result = await pool.query(
    `
        SELECT r.*, u.full_name AS reviewer_name
        FROM reviews r
        JOIN users u ON r.client_id = u.id
        JOIN bookings b ON r.booking_id = b.id
        WHERE b.service_id = $1
        ORDER BY r.review_date DESC
    `,
    [service_id],
  );
  return result.rows;
};

const getReviewsByProvider = async (provider_id) => {
  const result = await pool.query(
    `
        SELECT r.*, u.full_name AS reviewer_name, 
               b.service_id, s.title AS service_name
        FROM reviews r
        JOIN users u ON r.client_id = u.id
        JOIN bookings b ON r.booking_id = b.id
        JOIN services s ON b.service_id = s.id
        WHERE r.provider_id = $1
        ORDER BY r.review_date DESC
    `,
    [provider_id],
  );
  return result.rows;
};

const createReview = async ({
  booking_id,
  client_id,
  provider_id,
  rating,
  comment,
}) => {
  const result = await pool.query(
    `INSERT INTO reviews (booking_id, client_id, provider_id, rating, comment)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [booking_id, client_id, provider_id, rating, comment],
  );
  return result.rows[0];
};

module.exports = { getReviewsByService, getReviewsByProvider, createReview };
```

---

### 2.5 Update `server/controllers/servicesController.js`

Replace the entire file with:

```js
const {
  getServices: getAllServicesFromDB,
  getServicesbyId: getServiceByIdFromDB,
  getServicesByProvider,
  createServices: createServiceInDB,
  removeService: removeServiceFromDB,
  editServices: editServiceInDB,
} = require("../models/servicesModel");
const { getReviewsByService } = require("../models/reviewModel");

const getServices = async (req, res) => {
  try {
    const filters = {
      category_id: req.query.category_id || null,
      category_name: req.query.category_name || null,
      max_price: req.query.max_price || null,
      search: req.query.search || null,
    };
    const services = await getAllServicesFromDB(filters);
    res.status(200).json(services);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const getServicesbyId = async (req, res) => {
  try {
    const service = await getServiceByIdFromDB(req.params.id);
    if (!service)
      return res.status(404).json({ message: "Service does not exist" });
    res.status(200).json(service);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMyServices = async (req, res) => {
  try {
    const services = await getServicesByProvider(req.user.id);
    res.status(200).json(services);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const getServiceReviews = async (req, res) => {
  try {
    const reviews = await getReviewsByService(req.params.id);
    res.status(200).json(reviews);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const createServices = async (req, res) => {
  try {
    const provider_id = req.user.id;
    const {
      category_id,
      title,
      description,
      price,
      service_type,
      location,
      packages,
    } = req.body;
    const service = await createServiceInDB(
      provider_id,
      category_id,
      title,
      description,
      price,
      service_type,
      location,
      packages,
    );
    res.status(201).json(service);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const editServices = async (req, res) => {
  try {
    const existingService = await getServiceByIdFromDB(req.params.id);
    if (!existingService)
      return res.status(404).json({ message: "Service does not exist" });
    if (existingService.provider_id !== req.user.id)
      return res
        .status(403)
        .json({ message: "You can only edit your own services" });
    const { title, description, price, service_type, location, packages } =
      req.body;
    const service = await editServiceInDB(
      req.params.id,
      title,
      description,
      price,
      service_type,
      location,
      packages,
    );
    if (!service)
      return res.status(404).json({ message: "There are no services to edit" });
    res.status(200).json(service);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const removeService = async (req, res) => {
  try {
    const existingService = await getServiceByIdFromDB(req.params.id);
    if (!existingService)
      return res.status(404).json({ message: "Service does not exist" });
    if (existingService.provider_id !== req.user.id)
      return res
        .status(403)
        .json({ message: "You can only delete your own services" });
    const service = await removeServiceFromDB(req.params.id);
    if (!service)
      return res.status(404).json({ message: "Service does not exist" });
    res.status(200).json(service);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getServices,
  getServicesbyId,
  getMyServices,
  getServiceReviews,
  createServices,
  editServices,
  removeService,
};
```

---

### 2.6 Create `server/controllers/savedServiceController.js`

```js
const savedServiceModel = require("../models/savedServiceModel");

const saveService = async (req, res) => {
  try {
    const saved = await savedServiceModel.saveService(
      req.user.id,
      req.params.serviceId,
    );
    res.status(201).json({ message: "Service saved", saved });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error saving service", error: err.message });
  }
};

const unsaveService = async (req, res) => {
  try {
    await savedServiceModel.unsaveService(req.user.id, req.params.serviceId);
    res.status(200).json({ message: "Service unsaved" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error unsaving service", error: err.message });
  }
};

const getMySaved = async (req, res) => {
  try {
    const saved = await savedServiceModel.getSavedByUser(req.user.id);
    res.status(200).json(saved);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching saved services", error: err.message });
  }
};

module.exports = { saveService, unsaveService, getMySaved };
```

---

### 2.7 Update `server/controllers/categoriesController.js`

Add this new function (after the existing exports, before `module.exports`):

```js
const getCategoriesWithCount = async (req, res) => {
  try {
    const categories = await retrieveAllCategoriesWithCount();
    res.status(200).json({ categories });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching categories", error: err.message });
  }
};
```

Update the require at the top to include the new model function:

```js
const { ..., getAllCategoriesWithCount: retrieveAllCategoriesWithCount } = require('../models/categoriesModel');
```

Add `getCategoriesWithCount` to `module.exports`.

---

### 2.8 Update `server/routes/servicesRoutes.js`

Replace with:

```js
const express = require("express");
const router = express.Router();
const {
  getServices,
  getServicesbyId,
  getMyServices,
  getServiceReviews,
  createServices,
  editServices,
  removeService,
} = require("../controllers/servicesController");
const authorizeRoles = require("../middlewares/roleMiddleware");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/", getServices); // PUBLIC — no auth needed for browsing
router.get("/mine", verifyToken, authorizeRoles("provider"), getMyServices); // Provider's own services
router.get("/:id", getServicesbyId); // PUBLIC
router.get("/:id/reviews", getServiceReviews); // PUBLIC

router.post("/create", verifyToken, authorizeRoles("provider"), createServices);
router.put("/edit/:id", verifyToken, authorizeRoles("provider"), editServices);
router.delete("/:id", verifyToken, authorizeRoles("provider"), removeService);

module.exports = router;
```

> **Important change:** `GET /services` and `GET /services/:id` are now **public** (no `verifyToken`). Users must browse services without logging in.

---

### 2.9 Create `server/routes/savedServiceRoutes.js`

```js
const express = require("express");
const router = express.Router();
const {
  saveService,
  unsaveService,
  getMySaved,
} = require("../controllers/savedServiceController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/", verifyToken, getMySaved);
router.post("/:serviceId", verifyToken, saveService);
router.delete("/:serviceId", verifyToken, unsaveService);

module.exports = router;
```

---

### 2.10 Update `server/routes/categoryRoutes.js`

Add the new route (add before the `/:id` route):

```js
router.get("/with-counts", getCategoriesWithCount);
```

Update the require to include `getCategoriesWithCount`.

---

### 2.11 Update `server/index.js`

Add the new route import and mount:

```js
const savedServiceRoutes = require("./routes/savedServiceRoutes");
// ... after existing app.use lines:
app.use("/api/v1/saved-services", savedServiceRoutes);
```

---

## Phase 3 — Frontend Service Layer

### 3.1 Update `client/src/services/serviceService.js`

Replace with:

```js
import api from "./api";

export const serviceService = {
  async getServices(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/services?${queryString}` : "/services";
    const response = await api.get(endpoint);
    if (!response.ok) throw new Error("Failed to fetch services");
    return await response.json();
  },

  async getServiceById(id) {
    const response = await api.get(`/services/${id}`);
    if (!response.ok) throw new Error("Failed to fetch service");
    return await response.json();
  },

  async getServiceReviews(id) {
    const response = await api.get(`/services/${id}/reviews`);
    if (!response.ok) throw new Error("Failed to fetch reviews");
    return await response.json();
  },

  async getMyServices() {
    const response = await api.get("/services/mine");
    if (!response.ok) throw new Error("Failed to fetch my services");
    return await response.json();
  },

  async createService(serviceData) {
    const response = await api.post("/services/create", serviceData);
    if (!response.ok) throw new Error("Failed to create service");
    return await response.json();
  },

  async updateService(id, serviceData) {
    const response = await api.put(`/services/edit/${id}`, serviceData);
    if (!response.ok) throw new Error("Failed to update service");
    return await response.json();
  },

  async deleteService(id) {
    const response = await api.delete(`/services/${id}`);
    if (!response.ok) throw new Error("Failed to delete service");
    return await response.json();
  },
};
```

---

### 3.2 Create `client/src/services/savedServiceService.js`

```js
import api from "./api";

export const savedServiceService = {
  async getSaved() {
    const response = await api.get("/saved-services");
    if (!response.ok) throw new Error("Failed to fetch saved services");
    return await response.json();
  },

  async save(serviceId) {
    const response = await api.post(`/saved-services/${serviceId}`);
    if (!response.ok) throw new Error("Failed to save service");
    return await response.json();
  },

  async unsave(serviceId) {
    const response = await api.delete(`/saved-services/${serviceId}`);
    if (!response.ok) throw new Error("Failed to unsave service");
    return await response.json();
  },
};
```

---

### 3.3 Update `client/src/services/categoryService.js`

Add this method:

```js
async getCategoriesWithCounts() {
    const response = await api.get('/categories/with-counts');
    if (!response.ok) throw new Error('Failed to fetch categories');
    return await response.json();
},
```

---

## Phase 4 — Frontend Component Refactors

> See **IMPLEMENTATION_PLAN_FRONTEND.md** for the complete frontend component refactors.

---

## Implementation Order Checklist

| #   | Task                                                  | Type     |
| --- | ----------------------------------------------------- | -------- |
| 1   | Create `server/migrations/002_extend_tables.sql`      | DB       |
| 2   | Update `server/models/servicesModel.js`               | Backend  |
| 3   | Update `server/models/categoriesModel.js`             | Backend  |
| 4   | Create `server/models/savedServiceModel.js`           | Backend  |
| 5   | Create `server/models/reviewModel.js`                 | Backend  |
| 6   | Update `server/controllers/servicesController.js`     | Backend  |
| 7   | Update `server/controllers/categoriesController.js`   | Backend  |
| 8   | Create `server/controllers/savedServiceController.js` | Backend  |
| 9   | Update `server/routes/servicesRoutes.js`              | Backend  |
| 10  | Update `server/routes/categoryRoutes.js`              | Backend  |
| 11  | Create `server/routes/savedServiceRoutes.js`          | Backend  |
| 12  | Update `server/index.js`                              | Backend  |
| 13  | Restart Docker → migration runs automatically         | DB       |
| 14  | Update `client/src/services/serviceService.js`        | Frontend |
| 15  | Create `client/src/services/savedServiceService.js`   | Frontend |
| 16  | Update `client/src/services/categoryService.js`       | Frontend |
| 17  | Refactor `PopularCategories.jsx`                      | Frontend |
| 18  | Refactor `ServicesFilter.jsx`                         | Frontend |
| 19  | Refactor `ServicesGrid.jsx`                           | Frontend |
| 20  | Refactor `ServiceDetailPage.jsx`                      | Frontend |
| 21  | Refactor `SavedServices.jsx`                          | Frontend |
| 22  | Refactor `ProviderServices.jsx`                       | Frontend |
| 23  | Refactor `ProviderBookings.jsx`                       | Frontend |
| 24  | Refactor `ProviderReviews.jsx`                        | Frontend |
| 25  | Refactor `ProviderOverview.jsx`                       | Frontend |
| 26  | Refactor `ProviderEarnings.jsx`                       | Frontend |
| 27  | Refactor `ProviderProfile.jsx`                        | Frontend |
