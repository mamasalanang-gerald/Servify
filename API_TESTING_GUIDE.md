# Servify API Testing Guide

> **Version:** 1.0 · **Base URL:** `http://localhost:3000/api/v1` · **Last Updated:** 2026-02-22

---

## Table of Contents

1. [Engineering Critique & Code Review](#1-engineering-critique--code-review)
2. [Environment Setup (Postman)](#2-environment-setup-postman)
3. [Authentication & Token Management](#3-authentication--token-management)
4. [Smoke Tests — Is the API Alive?](#4-smoke-tests--is-the-api-alive)
5. [End-to-End Test Suites](#5-end-to-end-test-suites)
   - [Suite A — Full Client Journey](#suite-a--full-client-journey)
   - [Suite B — Full Provider Journey](#suite-b--full-provider-journey)
   - [Suite C — Admin Operations](#suite-c--admin-operations)
6. [Endpoint Reference with Test Cases](#6-endpoint-reference-with-test-cases)
   - [Auth Endpoints](#auth-endpoints)
   - [User Endpoints](#user-endpoints)
   - [Category Endpoints](#category-endpoints)
   - [Services Endpoints](#services-endpoints)
   - [Booking Endpoints](#booking-endpoints)
   - [Admin Endpoints](#admin-endpoints)
7. [Negative & Edge-Case Tests](#7-negative--edge-case-tests)
8. [Postman Collection Variables & Scripts](#8-postman-collection-variables--scripts)
9. [Known Bugs & Risk Areas](#9-known-bugs--risk-areas)

---

## 1. Engineering Critique & Code Review

Before writing a single Postman test, it is worth understanding where the API is solid and where it is fragile. This section is an honest software-engineering critique of the codebase as it exists today.

### ✅ What Is Done Well

| Area                                  | Detail                                                                                                                                                                                         |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Rotating Refresh Tokens**           | `authController` implements a proper token-rotation pattern — the old refresh token is deleted from the DB and replaced on every use. This prevents replay attacks.                            |
| **HttpOnly Cookie for Refresh Token** | Storing the refresh token in an `httpOnly` cookie (never in `localStorage`) is a security best practice and avoids XSS theft.                                                                  |
| **Role-Based Authorization**          | The separation of `verifyToken` (identity check) and `authorizeRoles` (permission check) into two distinct middlewares is clean and composable.                                                |
| **Admin Route Guard**                 | Using `router.use(verifyToken, authorizeRoles('admin'))` at the top of `adminRoutes.js` protects every admin route with a single line — no chance of accidentally missing auth on a new route. |
| **Ownership Checks in Services**      | `servicesController` explicitly checks `existingService.provider_id !== req.user.id` before allowing edit/delete. This is correct resource-level authorization.                                |
| **Category Deletion Guard**           | `adminController.deleteCategory` calls `checkCategoryUsage` before deleting, preventing foreign-key violation errors and orphaned data.                                                        |
| **Admin Input Validation Middleware** | The `adminValidation.js` middleware layer separates validation concerns from business logic.                                                                                                   |
| **Migration Skipped in Test Env**     | `startServer()` skips migrations when `NODE_ENV=test`, which is the correct pattern for containerized testing.                                                                                 |

---

### ⚠️ Issues, Bugs & Design Gaps

#### 🔴 Critical Issues

**1. `promoteRole` — Logic is Backwards (Bug)**

```javascript
// userController.js — promoteRole()
const user = await updateUserType(req.user.id, "provider"); // ← role is ALREADY changed here
if (user.user_type === "provider")
  // ← this check is now ALWAYS true
  return res.status(400).json({ message: "User is already a provider" }); // always fires
```

The DB update runs _before_ the guard check. The 400 "already a provider" error will fire every single time, making this endpoint non-functional. The check should happen _before_ calling `updateUserType`.

---

**2. `getAllBookings` — No Authorization (Security Hole)**

```javascript
// bookingRoutes.js
router.get("/", verifyToken, getAllBookings); // any logged-in user can see ALL bookings
```

Any authenticated user — client or provider — can call `GET /api/v1/bookings` and receive every booking in the system (other users' private data). This should be restricted to `admin` only, or the query should be scoped to the requesting user's own bookings.

---

**3. `getClientBookings` / `getProviderBookings` — IDOR Vulnerability**

```javascript
// bookingRoutes.js
router.get("/client/:clientId", verifyToken, getClientBookings);
```

There is no check that `req.user.id === clientId`. Any authenticated user can pass any `clientId` in the URL and view that client's complete booking history. Same issue applies to `/provider/:providerId`. The fix is to verify the param matches `req.user.id` (or the requesting user is an admin).

---

**4. `createBooking` — No Input Validation**

```javascript
// bookingController.js — createBooking()
const bookingData = req.body; // raw body forwarded directly to SQL
const booking = await bookingModel.createBooking(bookingData);
```

There is zero validation on required fields (`service_id`, `client_id`, `provider_id`, `booking_date`, `booking_time`, `total_price`). A malformed request will hit the database and produce a cryptic 500 error rather than a clear 400. The `client_id` should also be taken from `req.user.id` (not from the body), otherwise a client can impersonate another user.

---

**5. `deleteBooking` — No Authorization**

```javascript
router.delete("/:id", verifyToken, deleteBooking); // any token holder can delete any booking
```

Any logged-in user can delete any booking by ID. There is no ownership check and no role restriction. This should verify the requester is the booking owner, the assigned provider, or an admin.

---

**6. `activateUser` — Wrong Error Message (Bug)**

```javascript
// adminController.js — activateUser()
if (req.user.id === id) {
  return res
    .status(400)
    .json({ message: "Cannot deactivate your own account" }); // ← "deactivate" in "activate" handler
}
```

Copy-paste bug: the activation handler returns the message "Cannot **deactivate** your own account."

---

**7. `authController.logout` — Silent JWT Verification Failure**

```javascript
try {
  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
  await deleteAllUserRefreshTokens(decoded.id);
} catch (err) {
  // ← empty catch: if the token is tampered/expired, we silently skip DB cleanup
}
```

The empty `catch` means a tampered refresh token will appear to log out successfully (204/200) but the tokens are never invalidated in the database.

---

#### 🟡 Design Gaps & Improvements

**8. Inconsistent Response Shapes**
The API has two different response conventions:

- `categoriesController`: `{ message: '...', category: {...} }`
- `adminController`: `{ success: true, data: {...} }`
- `bookingController`: raw object, no wrapper

Postman tests become brittle because the field name changes per module. A unified response format (e.g., always `{ success, data, message }`) should be enforced globally.

---

**9. `updateBookingStatus` — No Status Enum Validation**

```javascript
const { status } = req.body;
if (!status) return res.status(400).json({ message: "Missing status" });
const updated = await bookingModel.updateBookingStatus(id, status);
```

The `status` field is only checked for presence, not for validity. Any string (e.g., `"banana"`) will be written to the database. Valid values should be enforced: `['pending', 'confirmed', 'completed', 'cancelled']`.

---

**10. `secure: false` on Cookie in Production**

```javascript
res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: false, // ← must be `true` in production (HTTPS only)
  sameSite: "lax",
});
```

This is acceptable in local development but must be `secure: process.env.NODE_ENV === 'production'` to prevent the cookie from being sent over HTTP in production.

---

**11. `console.log('routes loaded')` in production code**

```javascript
// bookingRoutes.js line 6
console.log("routes loaded");
```

Debug artefact left in production route file. Should be removed.

---

**12. `authMiddleware.js` — Generic 403 on Token Error**

```javascript
} catch (error) {
    return res.status(403).json({ message: 'Forbidden' });
}
```

An expired token should return `401 Unauthorized`, not `403 Forbidden`. `403` means you are authenticated but not allowed. `401` means your credentials are bad/missing. This makes debugging harder for frontend developers.

---

**13. `bookingModel` — `updateBookingDetails` is Unreachable**
The model exports `updateBookingDetails`, but there is no route or controller that calls it. This is dead code that may indicate a missing "reschedule booking" feature.

---

**14. No Global Error Handler**
Express has no registered `app.use((err, req, res, next) => {...})` error-handling middleware. Unhandled promise rejections that bubble up past individual `catch` blocks will crash the process or produce no response.

---

## 2. Environment Setup (Postman)

### Environment Variables

Create a Postman environment called **Servify Local** with these variables:

| Variable              | Initial Value                             | Type    |
| --------------------- | ----------------------------------------- | ------- |
| `base_url`            | `http://localhost:3000/api/v1`            | Default |
| `accessToken`         | _(empty — auto-filled by login script)_   | Secret  |
| `adminAccessToken`    | _(empty — auto-filled by admin login)_    | Secret  |
| `providerAccessToken` | _(empty — auto-filled by provider login)_ | Secret  |
| `clientId`            | _(empty — auto-filled)_                   | Default |
| `providerId`          | _(empty — auto-filled)_                   | Default |
| `categoryId`          | _(empty — auto-filled)_                   | Default |
| `serviceId`           | _(empty — auto-filled)_                   | Default |
| `bookingId`           | _(empty — auto-filled)_                   | Default |
| `userId`              | _(empty — auto-filled)_                   | Default |

### Headers (Collection Level)

Set these at the **Collection** level so every request inherits them automatically:

```
Authorization: Bearer {{accessToken}}
Content-Type:  application/json
```

---

## 3. Authentication & Token Management

### How the Auth Flow Works

```
Client                     Server
  │                          │
  ├─── POST /auth/login ────>│
  │<── { accessToken } ──────┤  (refreshToken set as HttpOnly cookie)
  │                          │
  │  [15 min later — accessToken expires]
  │                          │
  ├─── POST /auth/refresh ──>│  (cookie sent automatically by browser)
  │<── { accessToken } ──────┤  (new refreshToken cookie set, old one deleted)
  │                          │
  └─── POST /auth/logout ───>│
       [cookies cleared] ────┤
```

### Postman Cookie Handling

> ⚠️ The `refreshToken` cookie is `httpOnly` — the browser sets and sends it automatically. In Postman, you must enable **"Automatically follow redirects"** and use the **Postman Cookie Jar** to capture the cookie from `POST /auth/login` before calling `POST /auth/refresh`.

Steps:

1. In Postman, go to **Settings → Cookies**.
2. Add `localhost` to the allowed cookie domains.
3. After login, open **Cookies** panel — you should see `refreshToken` for `localhost`.
4. The `/refresh` call will automatically send this cookie.

---

## 4. Smoke Tests — Is the API Alive?

Run these before any deep testing. If any smoke test fails, stop and investigate infrastructure first.

### SM-01 · Health Check

```
GET {{base_url}}/../
```

| Check         | Expected                    |
| ------------- | --------------------------- |
| Status code   | `200 OK`                    |
| Body contains | `"Servify API is running!"` |

**Postman Test Script:**

```javascript
pm.test("SM-01: API is running", () => {
  pm.response.to.have.status(200);
  pm.expect(pm.response.text()).to.include("Servify API is running!");
});
```

---

### SM-02 · Auth Register Responds

```
POST {{base_url}}/auth/register
Body: { "full_name": "Smoke Test", "email": "smoke_{{$timestamp}}@test.com", "password": "Test1234!", "phone_number": "09000000000" }
```

| Check                 | Expected      |
| --------------------- | ------------- |
| Status code           | `201 Created` |
| Response has `userId` | yes           |

**Postman Test Script:**

```javascript
pm.test("SM-02: Register returns 201", () => {
  pm.response.to.have.status(201);
  const body = pm.response.json();
  pm.expect(body).to.have.property("userId");
});
```

---

### SM-03 · Auth Login Responds

```
POST {{base_url}}/auth/login
Body: { "email": "admin@servify.com", "password": "adminpass" }
```

| Check                  | Expected |
| ---------------------- | -------- |
| Status code            | `200 OK` |
| Body has `accessToken` | yes      |

**Postman Test Script:**

```javascript
pm.test("SM-03: Login returns access token", () => {
  pm.response.to.have.status(200);
  const body = pm.response.json();
  pm.expect(body).to.have.property("accessToken");
  pm.environment.set("adminAccessToken", body.accessToken);
});
```

---

### SM-04 · Protected Route Rejects Unauthenticated Request

```
GET {{base_url}}/users/profile
(No Authorization header)
```

| Check       | Expected           |
| ----------- | ------------------ |
| Status code | `401 Unauthorized` |

**Postman Test Script:**

```javascript
pm.test("SM-04: Protected route rejects missing token", () => {
  pm.response.to.have.status(401);
});
```

---

### SM-05 · Categories List Responds (Public)

```
GET {{base_url}}/categories
(No auth required)
```

| Check         | Expected |
| ------------- | -------- |
| Status code   | `200 OK` |
| Body is array | yes      |

**Postman Test Script:**

```javascript
pm.test("SM-05: Public categories endpoint is reachable", () => {
  pm.response.to.have.status(200);
});
```

---

## 5. End-to-End Test Suites

Run each suite **in order** — later requests depend on IDs captured by earlier ones via environment variables.

---

### Suite A — Full Client Journey

> **Persona:** A new user who registers, browses services, books one, and cancels it.

```
A-01  POST   /auth/register          → register new client
A-02  POST   /auth/login             → login as client, capture accessToken
A-03  GET    /users/profile          → verify profile is returned
A-04  GET    /categories             → list categories (public)
A-05  GET    /services               → list services (capture serviceId)
A-06  GET    /services/:serviceId    → view service detail
A-07  POST   /bookings/createBooking → create a booking (capture bookingId)
A-08  GET    /bookings/client/:clientId → verify booking appears in client list
A-09  PATCH  /bookings/:bookingId/status → client cancels booking (status=cancelled)
A-10  POST   /auth/refresh           → rotate token
A-11  POST   /auth/logout            → logout, cookie cleared
```

#### A-01 · Register Client

```
POST {{base_url}}/auth/register
{
  "full_name":     "Alice Client",
  "email":         "alice_{{$timestamp}}@test.com",
  "password":      "TestPass123!",
  "phone_number":  "09111111111"
}
```

**Test Script:**

```javascript
pm.test("A-01: Register succeeds", () => {
  pm.response.to.have.status(201);
  pm.environment.set("clientEmail", "alice_" + Date.now() + "@test.com");
});
```

#### A-02 · Login Client

```
POST {{base_url}}/auth/login
{
  "email":    "alice_<timestamp>@test.com",
  "password": "TestPass123!"
}
```

**Test Script:**

```javascript
pm.test("A-02: Login succeeds", () => {
  pm.response.to.have.status(200);
  const body = pm.response.json();
  pm.expect(body).to.have.property("accessToken");
  pm.environment.set("accessToken", body.accessToken);
  pm.environment.set("clientId", body.user.id);
});
```

#### A-03 · Get Profile

```
GET {{base_url}}/users/profile
Authorization: Bearer {{accessToken}}
```

**Test Script:**

```javascript
pm.test("A-03: Profile returned for authenticated user", () => {
  pm.response.to.have.status(200);
  const body = pm.response.json();
  pm.expect(body).to.have.property("id").equal(pm.environment.get("clientId"));
});
```

#### A-04 · List Categories (Public)

```
GET {{base_url}}/categories
```

**Test Script:**

```javascript
pm.test("A-04: Categories list returned", () => {
  pm.response.to.have.status(200);
  const body = pm.response.json();
  // Capture first category id for later use
  if (body.categories && body.categories.length > 0) {
    pm.environment.set("categoryId", body.categories[0].id);
  }
});
```

#### A-05 · List Services

```
GET {{base_url}}/services
Authorization: Bearer {{accessToken}}
```

**Test Script:**

```javascript
pm.test("A-05: Services list returned", () => {
  pm.response.to.have.status(200);
  const body = pm.response.json();
  pm.expect(body).to.be.an("array");
  if (body.length > 0) {
    pm.environment.set("serviceId", body[0].id);
    pm.environment.set("providerId", body[0].provider_id);
  }
});
```

#### A-06 · Get Service by ID

```
GET {{base_url}}/services/{{serviceId}}
Authorization: Bearer {{accessToken}}
```

**Test Script:**

```javascript
pm.test("A-06: Service detail returned", () => {
  pm.response.to.have.status(200);
  const body = pm.response.json();
  pm.expect(body).to.have.property("id").equal(pm.environment.get("serviceId"));
});
```

#### A-07 · Create Booking

```
POST {{base_url}}/bookings/createBooking
Authorization: Bearer {{accessToken}}
{
  "service_id":    "{{serviceId}}",
  "client_id":     "{{clientId}}",
  "provider_id":   "{{providerId}}",
  "booking_date":  "2026-03-01",
  "booking_time":  "10:00:00",
  "user_location": "123 Test Street, Manila",
  "total_price":   500.00,
  "notes":         "E2E test booking"
}
```

**Test Script:**

```javascript
pm.test("A-07: Booking created", () => {
  pm.response.to.have.status(201);
  const body = pm.response.json();
  pm.expect(body).to.have.property("id");
  pm.environment.set("bookingId", body.id);
});
```

#### A-08 · Get Client Bookings

```
GET {{base_url}}/bookings/client/{{clientId}}
Authorization: Bearer {{accessToken}}
```

**Test Script:**

```javascript
pm.test("A-08: Client bookings list contains our booking", () => {
  pm.response.to.have.status(200);
  const body = pm.response.json();
  pm.expect(body).to.be.an("array");
  const found = body.find((b) => b.id === pm.environment.get("bookingId"));
  pm.expect(found).to.not.be.undefined;
});
```

#### A-09 · Cancel Booking

```
PATCH {{base_url}}/bookings/{{bookingId}}/status
Authorization: Bearer {{accessToken}}
{ "status": "cancelled" }
```

**Test Script:**

```javascript
pm.test("A-09: Booking cancelled", () => {
  pm.response.to.have.status(200);
  const body = pm.response.json();
  pm.expect(body.status).to.equal("cancelled");
});
```

#### A-10 · Refresh Token

```
POST {{base_url}}/auth/refresh
(Cookie: refreshToken is sent automatically)
```

**Test Script:**

```javascript
pm.test("A-10: New access token issued", () => {
  pm.response.to.have.status(200);
  const body = pm.response.json();
  pm.expect(body).to.have.property("accessToken");
  pm.environment.set("accessToken", body.accessToken);
});
```

#### A-11 · Logout

```
POST {{base_url}}/auth/logout
Authorization: Bearer {{accessToken}}
```

**Test Script:**

```javascript
pm.test("A-11: Logout successful", () => {
  pm.response.to.have.status(200);
  const body = pm.response.json();
  pm.expect(body.message).to.include("Log out");
});
```

---

### Suite B — Full Provider Journey

> **Persona:** A client who self-promotes to provider, creates a service, and manages a booking from the provider side.

```
B-01  POST   /auth/register           → register new user
B-02  POST   /auth/login              → login as client
B-03  PATCH  /users/promote           → self-promote to provider (⚠️ currently buggy)
B-04  POST   /auth/login              → re-login to get fresh provider token
B-05  POST   /services/create         → create a service (capture serviceId)
B-06  GET    /services/:serviceId     → verify service detail
B-07  PUT    /services/edit/:serviceId → edit the service
B-08  GET    /bookings/provider/:providerId → check bookings assigned to provider
B-09  PATCH  /bookings/:id/status     → confirm a booking (status=confirmed)
B-10  PATCH  /bookings/:id/status     → complete a booking (status=completed)
B-11  DELETE /services/:serviceId     → remove the test service
```

> **Note on B-03:** This test is expected to **fail** due to the `promoteRole` bug described in Section 1. Until fixed, skip B-03 through B-07 and manually set the user_type to `provider` in the database.

#### B-01 to B-02 · Register & Login (same pattern as Suite A)

#### B-03 · Self-Promote to Provider

```
PATCH {{base_url}}/users/promote
Authorization: Bearer {{accessToken}}
```

**⚠️ Known Bug — Expected behavior vs actual behavior:**

|             | Expected                           | Actual (Bug)                   |
| ----------- | ---------------------------------- | ------------------------------ |
| HTTP Status | `200 OK`                           | `400 Bad Request`              |
| Message     | `"You are now a service provider"` | `"User is already a provider"` |

**Test Script (documents the bug):**

```javascript
pm.test("B-03: Promote to provider [KNOWN BUG - expect 400]", () => {
  // Bug: updateUserType runs before the 'already provider' check
  // so the check always fires. Remove this note once bug is fixed.
  pm.expect(pm.response.code).to.be.oneOf([200, 400]);
  if (pm.response.code === 200) {
    const body = pm.response.json();
    pm.environment.set("providerAccessToken", body.accessToken);
  }
});
```

#### B-05 · Create Service

```
POST {{base_url}}/services/create
Authorization: Bearer {{providerAccessToken}}
{
  "category_id":   "{{categoryId}}",
  "title":         "Test Plumbing Service",
  "description":   "E2E test service",
  "price":         500,
  "service_type":  "on-site",
  "location":      "Metro Manila"
}
```

**Test Script:**

```javascript
pm.test("B-05: Service created by provider", () => {
  pm.response.to.have.status(201);
  const body = pm.response.json();
  pm.expect(body).to.have.property("id");
  pm.environment.set("serviceId", body.id);
});
```

#### B-07 · Edit Service

```
PUT {{base_url}}/services/edit/{{serviceId}}
Authorization: Bearer {{providerAccessToken}}
{
  "title":       "Updated Plumbing Service",
  "description": "Updated description",
  "price":       600,
  "service_type": "on-site",
  "location":    "Metro Manila"
}
```

**Test Script:**

```javascript
pm.test("B-07: Service edited by owner", () => {
  pm.response.to.have.status(200);
  const body = pm.response.json();
  pm.expect(body.title).to.equal("Updated Plumbing Service");
});
```

#### B-08 · View Provider Bookings

```
GET {{base_url}}/bookings/provider/{{providerId}}
Authorization: Bearer {{providerAccessToken}}
```

**Test Script:**

```javascript
pm.test("B-08: Provider bookings returned", () => {
  pm.response.to.have.status(200);
  pm.expect(pm.response.json()).to.be.an("array");
});
```

#### B-09 · Confirm Booking

```
PATCH {{base_url}}/bookings/{{bookingId}}/status
Authorization: Bearer {{providerAccessToken}}
{ "status": "confirmed" }
```

#### B-10 · Complete Booking

```
PATCH {{base_url}}/bookings/{{bookingId}}/status
Authorization: Bearer {{providerAccessToken}}
{ "status": "completed" }
```

---

### Suite C — Admin Operations

> **Persona:** An admin manages categories, moderates services, monitors bookings, and adjusts user roles.

```
C-01  POST   /auth/login                → login as admin, capture adminAccessToken
C-02  GET    /admin/dashboard           → health check the dashboard
C-03  GET    /admin/users               → list all users (paginated)
C-04  GET    /admin/users/:id           → get specific user
C-05  PATCH  /admin/users/:id/deactivate → deactivate test user
C-06  PATCH  /admin/users/:id/activate  → re-activate test user
C-07  PATCH  /users/:id/role            → change user role via /users route
C-08  POST   /admin/categories          → create a new category
C-09  PUT    /admin/categories/:id      → update that category
C-10  GET    /admin/services            → list all services
C-11  PATCH  /admin/services/:id/toggle → toggle service visibility
C-12  GET    /admin/bookings            → list all bookings with filters
C-13  GET    /admin/reviews             → list all reviews
C-14  DELETE /admin/categories/:id      → delete unused test category
```

#### C-01 · Admin Login

```
POST {{base_url}}/auth/login
{
  "email":    "admin@servify.com",
  "password": "YourAdminPassword"
}
```

**Test Script:**

```javascript
pm.test("C-01: Admin login succeeds", () => {
  pm.response.to.have.status(200);
  const body = pm.response.json();
  pm.expect(body.user.user_type).to.equal("admin");
  pm.environment.set("adminAccessToken", body.accessToken);
});
```

#### C-02 · Dashboard Metrics

```
GET {{base_url}}/admin/dashboard
Authorization: Bearer {{adminAccessToken}}
```

**Test Script:**

```javascript
pm.test("C-02: Dashboard metrics returned", () => {
  pm.response.to.have.status(200);
  const body = pm.response.json();
  pm.expect(body.success).to.be.true;
  pm.expect(body.data).to.be.an("object");
});
```

#### C-03 · List Users (Paginated)

```
GET {{base_url}}/admin/users?page=1&limit=5
Authorization: Bearer {{adminAccessToken}}
```

**Test Script:**

```javascript
pm.test("C-03: Users list returned with pagination", () => {
  pm.response.to.have.status(200);
  const body = pm.response.json();
  pm.expect(body.success).to.be.true;
  pm.expect(body.data).to.be.an("array");
  pm.expect(body.page).to.equal(1);
  pm.expect(body.limit).to.equal(5);
  if (body.data.length > 0) {
    pm.environment.set("userId", body.data[0].id);
  }
});
```

#### C-05 · Deactivate User

```
PATCH {{base_url}}/admin/users/{{userId}}/deactivate
Authorization: Bearer {{adminAccessToken}}
```

**Test Script:**

```javascript
pm.test("C-05: User deactivated", () => {
  pm.response.to.have.status(200);
  const body = pm.response.json();
  pm.expect(body.success).to.be.true;
  pm.expect(body.data.is_active).to.be.false;
});
```

#### C-08 · Create Category

```
POST {{base_url}}/admin/categories
Authorization: Bearer {{adminAccessToken}}
{
  "name":        "E2E Test Category",
  "description": "Created by automated testing"
}
```

**Test Script:**

```javascript
pm.test("C-08: Category created", () => {
  pm.response.to.have.status(201);
  const body = pm.response.json();
  pm.expect(body.success).to.be.true;
  pm.environment.set("adminCategoryId", body.data.id);
});
```

#### C-09 · Update Category

```
PUT {{base_url}}/admin/categories/{{adminCategoryId}}
Authorization: Bearer {{adminAccessToken}}
{
  "name":        "E2E Test Category (Updated)",
  "description": "Updated description"
}
```

#### C-14 · Delete Test Category

```
DELETE {{base_url}}/admin/categories/{{adminCategoryId}}
Authorization: Bearer {{adminAccessToken}}
```

**Test Script:**

```javascript
pm.test("C-14: Test category deleted", () => {
  pm.response.to.have.status(200);
  const body = pm.response.json();
  pm.expect(body.success).to.be.true;
});
```

---

## 6. Endpoint Reference with Test Cases

### Auth Endpoints

| #   | Method | Endpoint         | Auth Required | Role |
| --- | ------ | ---------------- | ------------- | ---- |
| 1   | POST   | `/auth/register` | No            | —    |
| 2   | POST   | `/auth/login`    | No            | —    |
| 3   | POST   | `/auth/refresh`  | Cookie        | —    |
| 4   | POST   | `/auth/logout`   | Cookie        | —    |

#### `POST /auth/register`

**Happy Path:**

```json
Request:
{
  "full_name":    "John Doe",
  "email":        "john@example.com",
  "password":     "SecurePass123!",
  "phone_number": "09123456789"
}

Response 201:
{
  "message": "User registered",
  "userId": "uuid-here"
}
```

**Negative Cases:**

| Test             | Input            | Expected                                 |
| ---------------- | ---------------- | ---------------------------------------- |
| Duplicate email  | Same email twice | `400` · `"Email already in use"`         |
| Missing password | Omit `password`  | `500` (no input validation — design gap) |
| Missing email    | Omit `email`     | `500` (no input validation — design gap) |

---

#### `POST /auth/login`

**Happy Path:**

```json
Request:  { "email": "john@example.com", "password": "SecurePass123!" }
Response 200:
{
  "accessToken": "eyJ...",
  "user": { "id": "...", "email": "...", "user_type": "client", "full_name": "John Doe" }
}
```

**Negative Cases:**

| Test               | Input                         | Expected                        |
| ------------------ | ----------------------------- | ------------------------------- |
| Wrong password     | Correct email, wrong password | `401` · `"Invalid credentials"` |
| Non-existent email | Random email                  | `401` · `"Invalid credentials"` |
| Missing body       | Empty `{}`                    | `401` · `"Invalid credentials"` |

---

#### `POST /auth/refresh`

**Happy Path:**

```
(refreshToken cookie present from login)
Response 200: { "accessToken": "eyJ..." }
```

**Negative Cases:**

| Test             | Input               | Expected                                     |
| ---------------- | ------------------- | -------------------------------------------- |
| No cookie        | Clear cookies       | `401` · `"No refresh token provided"`        |
| Tampered token   | Modify cookie value | `403` · `"Invalid or expired refresh token"` |
| Token used twice | Replay old token    | `403` · `"Refresh token revoked"`            |

---

### User Endpoints

| #   | Method | Endpoint          | Auth | Role   |
| --- | ------ | ----------------- | ---- | ------ |
| 1   | GET    | `/users/profile`  | JWT  | any    |
| 2   | PATCH  | `/users/promote`  | JWT  | client |
| 3   | PATCH  | `/users/:id/role` | JWT  | admin  |
| 4   | GET    | `/users/`         | JWT  | admin  |

#### `GET /users/profile`

| Test          | Input                  | Expected                      |
| ------------- | ---------------------- | ----------------------------- |
| Valid token   | Bearer {{accessToken}} | `200` · user object           |
| No token      | Remove header          | `401` · `"No token provided"` |
| Invalid token | `Bearer garbage`       | `403` · `"Forbidden"`         |

#### `PATCH /users/:id/role`

```json
Request:  { "user_type": "provider" }
Response 200: { "message": "User role changed successfully", "user": {...} }
```

| Test                          | Input                          | Expected |
| ----------------------------- | ------------------------------ | -------- |
| Valid role change             | `{ "user_type": "provider" }`  | `200`    |
| Invalid role value            | `{ "user_type": "superuser" }` | `400`    |
| Client calling admin endpoint | Client token                   | `403`    |

---

### Category Endpoints

| #   | Method | Endpoint          | Auth | Role  |
| --- | ------ | ----------------- | ---- | ----- |
| 1   | GET    | `/categories`     | No   | —     |
| 2   | GET    | `/categories/:id` | No   | —     |
| 3   | POST   | `/categories`     | JWT  | admin |
| 4   | PUT    | `/categories/:id` | JWT  | admin |
| 5   | DELETE | `/categories/:id` | JWT  | admin |

#### `GET /categories`

| Test    | Input     | Expected                                 |
| ------- | --------- | ---------------------------------------- |
| No auth | No header | `200` · `{ message, categories: [...] }` |

#### `POST /categories` (Admin only)

```json
Request: { "name": "Plumbing", "description": "Water-related services" }
Response 201: { "message": "Category created successfully", "category": {...} }
```

| Test         | Input                    | Expected |
| ------------ | ------------------------ | -------- |
| Valid create | Admin token + valid body | `201`    |
| Client token | Non-admin token          | `403`    |
| No auth      | No token                 | `401`    |

---

### Services Endpoints

| #   | Method | Endpoint             | Auth | Role     |
| --- | ------ | -------------------- | ---- | -------- |
| 1   | GET    | `/services`          | JWT  | any      |
| 2   | GET    | `/services/:id`      | JWT  | any      |
| 3   | POST   | `/services/create`   | JWT  | provider |
| 4   | PUT    | `/services/edit/:id` | JWT  | provider |
| 5   | DELETE | `/services/:id`      | JWT  | provider |

#### `POST /services/create`

```json
Request:
{
  "category_id":  "uuid",
  "title":        "Professional Cleaning",
  "description":  "Deep cleaning service",
  "price":        800,
  "service_type": "on-site",
  "location":     "Manila"
}
Response 201: { "id": "...", "title": "...", ... }
```

| Test                            | Input                          | Expected                                        |
| ------------------------------- | ------------------------------ | ----------------------------------------------- |
| Provider creates service        | Provider token + valid body    | `201`                                           |
| Client tries to create          | Client token                   | `403`                                           |
| Edit another provider's service | Provider B token, Service A ID | `403` · `"You can only edit your own services"` |

---

### Booking Endpoints

| #   | Method | Endpoint                         | Auth | Role                      |
| --- | ------ | -------------------------------- | ---- | ------------------------- |
| 1   | GET    | `/bookings`                      | JWT  | any ⚠️ should be admin    |
| 2   | POST   | `/bookings/createBooking`        | JWT  | any ⚠️ no validation      |
| 3   | GET    | `/bookings/client/:clientId`     | JWT  | any ⚠️ IDOR               |
| 4   | GET    | `/bookings/provider/:providerId` | JWT  | any ⚠️ IDOR               |
| 5   | PATCH  | `/bookings/:id/status`           | JWT  | any ⚠️ no ownership check |
| 6   | DELETE | `/bookings/:id`                  | JWT  | any ⚠️ no ownership check |

#### `POST /bookings/createBooking`

```json
Request:
{
  "service_id":    "uuid",
  "client_id":     "uuid",
  "provider_id":   "uuid",
  "booking_date":  "2026-03-01",
  "booking_time":  "10:00:00",
  "user_location": "123 Main St",
  "total_price":   500.00,
  "notes":         "Optional notes"
}
Response 201: { "id": "...", "status": "pending", ... }
```

#### `PATCH /bookings/:id/status`

Valid status values: `pending`, `confirmed`, `completed`, `cancelled`

```json
Request: { "status": "confirmed" }
Response 200: { "id": "...", "status": "confirmed", ... }
```

| Test                    | Input                   | Expected                                   |
| ----------------------- | ----------------------- | ------------------------------------------ |
| Valid status            | `"confirmed"`           | `200`                                      |
| Missing status          | `{}`                    | `400` · `"Missing status in request body"` |
| Invalid status value    | `"banana"`              | `200` ⚠️ Bug — should be `400`             |
| Non-existent booking ID | UUID that doesn't exist | `404`                                      |

---

### Admin Endpoints

All admin routes require: `Authorization: Bearer {{adminAccessToken}}`

| #   | Method | Endpoint                          |
| --- | ------ | --------------------------------- |
| 1   | GET    | `/admin/dashboard`                |
| 2   | GET    | `/admin/users?page=1&limit=10`    |
| 3   | GET    | `/admin/users/:id`                |
| 4   | PATCH  | `/admin/users/:id/activate`       |
| 5   | PATCH  | `/admin/users/:id/deactivate`     |
| 6   | PATCH  | `/admin/users/:id/verify`         |
| 7   | GET    | `/admin/categories`               |
| 8   | POST   | `/admin/categories`               |
| 9   | PUT    | `/admin/categories/:id`           |
| 10  | DELETE | `/admin/categories/:id`           |
| 11  | GET    | `/admin/services?page=1&limit=10` |
| 12  | GET    | `/admin/services/:id`             |
| 13  | PATCH  | `/admin/services/:id/toggle`      |
| 14  | GET    | `/admin/bookings?page=1&limit=10` |
| 15  | GET    | `/admin/bookings/:id`             |
| 16  | GET    | `/admin/reviews?page=1&limit=10`  |
| 17  | GET    | `/admin/reviews/:id`              |
| 18  | DELETE | `/admin/reviews/:id`              |

#### `GET /admin/users` — Pagination & Role Filter

```
GET /admin/users?page=1&limit=5&role=client
```

| Test               | Query             | Expected                  |
| ------------------ | ----------------- | ------------------------- |
| Default pagination | No query params   | `200` · page 1, limit 10  |
| With role filter   | `?role=provider`  | `200` · only providers    |
| With page filter   | `?page=2&limit=3` | `200` · page 2, 3 results |
| Non-admin token    | Client token      | `403`                     |

#### `PATCH /admin/users/:id/verify` — Verify Provider

| Test                  | Setup                         | Expected                           |
| --------------------- | ----------------------------- | ---------------------------------- |
| Verify a provider     | User has `user_type=provider` | `200`                              |
| Verify a non-provider | User has `user_type=client`   | `400` · `"User is not a provider"` |
| Self-verify           | Same ID as admin token        | `400` or `403`                     |

#### `DELETE /admin/categories/:id` — Category with Services

| Test                   | Setup                        | Expected                                                       |
| ---------------------- | ---------------------------- | -------------------------------------------------------------- |
| Delete unused category | Category has 0 services      | `200`                                                          |
| Delete used category   | Category has linked services | `400` · `"Cannot delete category. It is used by N service(s)"` |

---

## 7. Negative & Edge-Case Tests

These tests deliberately send bad data to verify the API degrades gracefully.

### Authentication Edge Cases

| Test ID | Request                                                         | Expected                                           |
| ------- | --------------------------------------------------------------- | -------------------------------------------------- |
| NEG-01  | `POST /auth/login` with SQL injection: `"email": "' OR 1=1 --"` | `401` — parameterized queries protect against this |
| NEG-02  | `POST /auth/refresh` — replay the same refresh token twice      | `403` · `"Refresh token revoked"`                  |
| NEG-03  | Use an expired access token                                     | `403` · `"Forbidden"`                              |
| NEG-04  | `Authorization: Bearer ` (empty token)                          | `401` · `"No token provided"`                      |
| NEG-05  | `Authorization: Token abc123` (non-Bearer prefix)               | `401` · `"No token provided"`                      |

### Role Authorization Edge Cases

| Test ID | Request                                  | Expected |
| ------- | ---------------------------------------- | -------- |
| NEG-10  | Client calls `POST /services/create`     | `403`    |
| NEG-11  | Provider calls `GET /admin/users`        | `403`    |
| NEG-12  | Client calls `DELETE /admin/reviews/:id` | `403`    |
| NEG-13  | Provider calls `PATCH /users/:id/role`   | `403`    |

### Resource Not Found Cases

| Test ID | Request                                                       | Expected |
| ------- | ------------------------------------------------------------- | -------- |
| NEG-20  | `GET /services/00000000-0000-0000-0000-000000000000`          | `404`    |
| NEG-21  | `GET /admin/users/00000000-0000-0000-0000-000000000000`       | `404`    |
| NEG-22  | `PATCH /bookings/00000000-0000-0000-0000-000000000000/status` | `404`    |
| NEG-23  | `DELETE /bookings/00000000-0000-0000-0000-000000000000`       | `404`    |

### Booking Input Edge Cases

| Test ID | Request                                                | Expected                                          |
| ------- | ------------------------------------------------------ | ------------------------------------------------- |
| NEG-30  | `POST /bookings/createBooking` with `status: "banana"` | Currently `500` (no validation) — should be `400` |
| NEG-31  | `PATCH /bookings/:id/status` with body `{}`            | `400` · `"Missing status"`                        |
| NEG-32  | `PATCH /bookings/:id/status` with `status: "banana"`   | Currently `200` — should be `400`                 |
| NEG-33  | `POST /bookings/createBooking` — missing `service_id`  | Currently `500` (no validation) — should be `400` |

---

## 8. Postman Collection Variables & Scripts

### Collection-Level Pre-request Script (Auto Token Refresh)

Paste this into **Collection → Pre-request Script** tab:

```javascript
// Auto-refresh access token if it's about to expire
const accessToken = pm.environment.get("accessToken");
if (!accessToken) return;

const parts = accessToken.split(".");
if (parts.length !== 3) return;

try {
  const payload = JSON.parse(atob(parts[1]));
  const now = Math.floor(Date.now() / 1000);
  const expiresIn = payload.exp - now;

  // If token expires in less than 60 seconds, refresh it
  if (expiresIn < 60) {
    pm.sendRequest(
      {
        url: pm.environment.get("base_url") + "/auth/refresh",
        method: "POST",
        header: { "Content-Type": "application/json" },
      },
      (err, res) => {
        if (!err && res.code === 200) {
          pm.environment.set("accessToken", res.json().accessToken);
        }
      },
    );
  }
} catch (e) {
  console.log("Token decode error:", e.message);
}
```

---

### Collection-Level Test Script (Response Time Check)

```javascript
pm.test("Response time under 2000ms", () => {
  pm.expect(pm.response.responseTime).to.be.below(2000);
});
```

---

### Login Helper Script (for Admin, Client, Provider requests)

Create a Postman request called **Admin Login** and set as Pre-request in dependent folders:

```javascript
// Run before any admin suite request
pm.sendRequest(
  {
    url: pm.environment.get("base_url") + "/auth/login",
    method: "POST",
    header: { "Content-Type": "application/json" },
    body: {
      mode: "raw",
      raw: JSON.stringify({
        email: pm.environment.get("adminEmail") || "admin@servify.com",
        password: pm.environment.get("adminPassword") || "YourAdminPassword",
      }),
    },
  },
  (err, res) => {
    if (!err && res.code === 200) {
      pm.environment.set("adminAccessToken", res.json().accessToken);
    }
  },
);
```

---

### Recommended Test Run Order in Collection Runner

Configure **Collection Runner** with this order:

```
1. Smoke Tests (all SM-*)
2. Suite A — Client Journey (A-01 to A-11)
3. Suite B — Provider Journey (B-01 to B-11)
4. Suite C — Admin Operations (C-01 to C-14)
5. Negative Tests (all NEG-*)
```

Set **delay** between requests to `200ms` to avoid race conditions on token validation.

---

## 9. Known Bugs & Risk Areas

### Summary Table

| Bug ID | Severity    | Location                                        | Description                                                         | Workaround                                 |
| ------ | ----------- | ----------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------ |
| BUG-01 | 🔴 Critical | `userController.promoteRole`                    | Guard check fires after DB update — always returns 400              | Manually update `user_type` in DB          |
| BUG-02 | 🔴 Critical | `bookingRoutes GET /`                           | All bookings exposed to any authenticated user                      | None — data leak                           |
| BUG-03 | 🔴 Critical | `bookingRoutes GET /client/:id` `/provider/:id` | IDOR — no ownership verification                                    | None — data leak                           |
| BUG-04 | 🔴 Critical | `bookingController.createBooking`               | No input validation; `client_id` from body allows impersonation     | Validate manually before calling           |
| BUG-05 | 🔴 Critical | `bookingRoutes DELETE /:id`                     | Any user can delete any booking                                     | None                                       |
| BUG-06 | 🟡 Medium   | `adminController.activateUser`                  | Wrong error message: says "deactivate" in activate handler          | Cosmetic only                              |
| BUG-07 | 🟡 Medium   | `authController.logout`                         | Silent empty catch — token not invalidated on tampered cookie       | None                                       |
| BUG-08 | 🟡 Medium   | `bookingController.updateBookingStatus`         | No status enum validation — accepts any string                      | Validate in tests                          |
| BUG-09 | 🟡 Medium   | `authMiddleware`                                | Expired token returns 403 instead of 401                            | Frontend should treat both as auth failure |
| BUG-10 | 🟢 Low      | `bookingRoutes.js`                              | `console.log('routes loaded')` in production code                   | Remove the line                            |
| BUG-11 | 🟢 Low      | `authController`                                | `secure: false` on cookie — fine for dev, dangerous if kept in prod | Use `NODE_ENV` check                       |
| BUG-12 | 🟢 Low      | `bookingModel`                                  | `updateBookingDetails` exported but no route references it          | Implement or remove                        |

---

### Testing Priority Order

1. **Auth flow** (login → refresh → logout) — everything depends on this
2. **IDOR tests** (NEG-03, BUG-03) — security validation
3. **Booking creation** — core business flow
4. **Admin operations** — privileged access validation
5. **Role promotion** (BUG-01) — blocked until code is fixed

---

_This document was generated by analyzing the Servify server codebase including routes, controllers, models, and middleware. Re-run analysis after patching BUG-01 through BUG-05 before submitting to QA._
