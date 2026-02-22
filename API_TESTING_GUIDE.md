# Servify API — Postman Testing Guide

> **Last Updated:** February 22, 2026
> **Base URL:** `http://localhost:<PORT>` (set in `.env`)
> **Content-Type:** `application/json` for all request bodies

---

## Table of Contents

1. [Authentication Overview](#1-authentication-overview)
2. [Postman Setup](#2-postman-setup)
3. [Auth Routes — `/api/v1/auth`](#3-auth-routes--apiv1auth)
4. [User Routes — `/api/v1/users`](#4-user-routes--apiv1users)
5. [Category Routes — `/api/v1/categories`](#5-category-routes--apiv1categories)
6. [Service Routes — `/api/v1/services`](#6-service-routes--apiv1services)
7. [Booking Routes — `/api/v1/bookings`](#7-booking-routes--apiv1bookings)
8. [Recommended Testing Order](#8-recommended-testing-order)
9. [Known Issues & Notes](#9-known-issues--notes)

---

## 1. Authentication Overview

The API uses a **dual-token JWT system**:

| Token             | Where It Lives                                      | Lifetime | Purpose                                                                        |
| ----------------- | --------------------------------------------------- | -------- | ------------------------------------------------------------------------------ |
| **Access Token**  | JSON response body                                  | 15 min   | Sent as `Bearer` token in the `Authorization` header for every protected route |
| **Refresh Token** | `HttpOnly` cookie (set by the server automatically) | 7 days   | Used to silently get a new access token without re-logging in                  |

### JWT Payload Structure

```json
{
  "id": "uuid-of-the-user",
  "email": "user@example.com",
  "role": "client | provider | admin"
}
```

### Middleware Summary

| Middleware                 | File                            | Purpose                                                                                                                |
| -------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `verifyToken`              | `middlewares/authMiddleware.js` | Extracts and verifies the JWT from the `Authorization: Bearer <token>` header. Attaches decoded payload to `req.user`. |
| `authorizeRoles(...roles)` | `middlewares/roleMiddleware.js` | Checks if `req.user.role` is in the allowed roles list. Returns `403 Forbidden` if not.                                |

---

## 2. Postman Setup

### Collection Variables

Create these variables at the Collection level:

| Variable      | Initial Value                 | Usage                        |
| ------------- | ----------------------------- | ---------------------------- |
| `baseUrl`     | `http://localhost:5000`       | Used in every request URL    |
| `accessToken` | _(empty — paste after login)_ | Used in Authorization header |

### Authorization Header (for protected routes)

In Postman, go to the **Authorization** tab of each protected request, select **Bearer Token**, and enter:

```
{{accessToken}}
```

Or manually set the header:

```
Authorization: Bearer {{accessToken}}
```

### Cookie Handling

Enable **"Automatically follow cookies"** in your Postman settings. The server sets `refreshToken` as an `HttpOnly` cookie — Postman will automatically store and resend it on subsequent requests to the same domain.

---

## 3. Auth Routes — `/api/v1/auth`

> 🔓 **No authentication required** for any of these routes.

---

### 3.1 Register

|            |                                    |
| ---------- | ---------------------------------- |
| **Method** | `POST`                             |
| **URL**    | `{{baseUrl}}/api/v1/auth/register` |
| **Auth**   | None                               |

**Request Body:**

```json
{
  "full_name": "Juan Dela Cruz",
  "email": "juan@example.com",
  "password": "securePassword123",
  "phone_number": "09171234567"
}
```

**Responses:**

| Status | Body                                                 | Condition                 |
| ------ | ---------------------------------------------------- | ------------------------- |
| `201`  | `{ "message": "User registered", "userId": "uuid" }` | Success                   |
| `400`  | `{ "message": "Email already in use" }`              | Duplicate email           |
| `500`  | `{ "message": "Server error", "error": "..." }`      | Missing fields / DB error |

**Test Scenarios:**

- [x] Register with all valid fields → `201`
- [x] Register with the same email again → `400`
- [x] Register with missing `full_name` or `email` → `500`
- [x] Register with missing `password` → `500` (bcrypt will fail)

---

### 3.2 Login

|            |                                 |
| ---------- | ------------------------------- |
| **Method** | `POST`                          |
| **URL**    | `{{baseUrl}}/api/v1/auth/login` |
| **Auth**   | None                            |

**Request Body:**

```json
{
  "email": "juan@example.com",
  "password": "securePassword123"
}
```

**Responses:**

| Status | Body                                            | Condition               |
| ------ | ----------------------------------------------- | ----------------------- |
| `200`  | `{ "accessToken": "eyJ..." }`                   | Valid credentials       |
| `401`  | `{ "message": "Invalid credentials" }`          | Wrong email or password |
| `500`  | `{ "message": "Server error", "error": "..." }` | DB error                |

> ⚙️ **After login:** Copy the `accessToken` value and paste it into your `{{accessToken}}` Collection Variable. A `refreshToken` cookie is also set automatically.

**Test Scenarios:**

- [x] Login with correct credentials → `200` + check `Set-Cookie` header has `refreshToken`
- [x] Login with wrong password → `401`
- [x] Login with non-existent email → `401`
- [x] Login with empty body → `500`

---

### 3.3 Refresh Token

|            |                                   |
| ---------- | --------------------------------- |
| **Method** | `POST`                            |
| **URL**    | `{{baseUrl}}/api/v1/auth/refresh` |
| **Auth**   | None (uses cookie)                |

**Request Body:** _(none)_

> The `refreshToken` cookie is sent automatically by Postman.

**Responses:**

| Status | Body                                                | Condition                                 |
| ------ | --------------------------------------------------- | ----------------------------------------- |
| `200`  | `{ "accessToken": "eyJ..." }`                       | Valid refresh token                       |
| `401`  | `{ "message": "No refresh token provided" }`        | No cookie present                         |
| `403`  | `{ "message": "Invalid or expired refresh token" }` | Tampered or expired token                 |
| `403`  | `{ "message": "Refresh token revoked" }`            | Token reuse detected (all sessions wiped) |
| `500`  | `{ "message": "Server error", "error": "..." }`     | DB error                                  |

**Test Scenarios:**

- [x] Refresh with valid cookie → `200` + new `accessToken` + new cookie set
- [x] Refresh without any cookie → `401`
- [x] Refresh with same cookie twice (reuse) → `403` (token rotation security)
- [x] Refresh with tampered cookie → `403`

---

### 3.4 Logout

|            |                                  |
| ---------- | -------------------------------- |
| **Method** | `POST`                           |
| **URL**    | `{{baseUrl}}/api/v1/auth/logout` |
| **Auth**   | None (uses cookie)               |

**Request Body:** _(none)_

**Responses:**

| Status | Body                                     | Condition                    |
| ------ | ---------------------------------------- | ---------------------------- |
| `200`  | `{ "message": "Log out successfully!" }` | Always (even without cookie) |

**Test Scenarios:**

- [x] Logout with valid cookie → `200` + cookie cleared
- [x] Logout without cookie → `200` (graceful)
- [x] Try to refresh after logout → `401` or `403`

---

## 4. User Routes — `/api/v1/users`

> 🔒 **All routes require** `Authorization: Bearer {{accessToken}}`

---

### 4.1 Get Profile

|            |                                    |
| ---------- | ---------------------------------- |
| **Method** | `GET`                              |
| **URL**    | `{{baseUrl}}/api/v1/users/profile` |
| **Auth**   | Bearer Token                       |
| **Role**   | Any authenticated user             |

**Request Body:** _(none)_

**Responses:**

| Status | Body                                                                               | Condition                          |
| ------ | ---------------------------------------------------------------------------------- | ---------------------------------- |
| `200`  | `{ "id": "uuid", "full_name": "...", "email": "...", "user_type": "client", ... }` | Success                            |
| `401`  | `{ "message": "No token provided" }`                                               | Missing token                      |
| `403`  | `{ "message": "Forbidden" }`                                                       | Expired or invalid token           |
| `404`  | `{ "message": "User not found" }`                                                  | User deleted but token still valid |

**Test Scenarios:**

- [x] Valid token → `200` with user data (no `password_hash` returned)
- [x] No token → `401`
- [x] Expired token → `403`

---

### 4.2 List All Users

|            |                             |
| ---------- | --------------------------- |
| **Method** | `GET`                       |
| **URL**    | `{{baseUrl}}/api/v1/users/` |
| **Auth**   | Bearer Token                |
| **Role**   | `admin` only                |

**Request Body:** _(none)_

**Responses:**

| Status | Body                                                               | Condition      |
| ------ | ------------------------------------------------------------------ | -------------- |
| `200`  | `[ { "id": "...", "full_name": "...", "user_type": "..." }, ... ]` | Success        |
| `403`  | `{ "message": "Forbidden" }`                                       | Non-admin user |
| `404`  | `{ "message": "Users not found" }`                                 | No users exist |

**Test Scenarios:**

- [x] Admin token → `200` with array of users
- [x] Client or provider token → `403`
- [x] No token → `401`

---

### 4.3 Promote to Provider

|            |                                    |
| ---------- | ---------------------------------- |
| **Method** | `PATCH`                            |
| **URL**    | `{{baseUrl}}/api/v1/users/promote` |
| **Auth**   | Bearer Token                       |
| **Role**   | `client` only                      |

**Request Body:** _(none)_

**Responses:**

| Status | Body                                                                                              | Condition                                       |
| ------ | ------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `200`  | `{ "message": "You are now a service provider", "user": { ... }, "accessToken": "new_token..." }` | Success                                         |
| `403`  | `{ "message": "Forbidden" }`                                                                      | User is not a `client` (already provider/admin) |

> ⚠️ **Important:** After a successful promote, **update your `{{accessToken}}`** variable with the new `accessToken` from the response. The old one still has `role: "client"`.

**Test Scenarios:**

- [x] Client user promotes → `200` + new tokens issued with `provider` role
- [x] Already a provider tries to promote → `403`
- [x] Admin tries to promote → `403`
- [x] After promotion, old token fails on provider routes → verify with `/services/create`

---

### 4.4 Change User Role (Admin)

|            |                                     |
| ---------- | ----------------------------------- |
| **Method** | `PATCH`                             |
| **URL**    | `{{baseUrl}}/api/v1/users/:id/role` |
| **Auth**   | Bearer Token                        |
| **Role**   | `admin` only                        |

**URL Params:**

| Param | Type | Description      |
| ----- | ---- | ---------------- |
| `id`  | UUID | Target user's ID |

**Request Body:**

```json
{
  "user_type": "provider"
}
```

> Valid values: `"client"`, `"provider"`, `"admin"`

**Responses:**

| Status | Body                                                                     | Condition           |
| ------ | ------------------------------------------------------------------------ | ------------------- |
| `200`  | `{ "message": "User role changed successfully", "user": { ... } }`       | Success             |
| `400`  | `{ "message": "Invalid role. Must be one of: client, provider, admin" }` | Invalid `user_type` |
| `403`  | `{ "message": "Forbidden" }`                                             | Non-admin user      |
| `404`  | `{ "message": "User not found" }`                                        | Invalid UUID        |

**Test Scenarios:**

- [x] Admin changes client to provider → `200`
- [x] Admin changes client to admin → `200`
- [x] Admin sends invalid role like `"superuser"` → `400`
- [x] Non-admin tries this → `403`
- [x] Non-existent user UUID → `404`

---

## 5. Category Routes — `/api/v1/categories`

> 🔓 `GET` routes are **public** (no auth needed).
> 🔒 `POST`, `PUT`, `DELETE` routes require `admin` role.

---

### 5.1 Get All Categories

|            |                                  |
| ---------- | -------------------------------- |
| **Method** | `GET`                            |
| **URL**    | `{{baseUrl}}/api/v1/categories/` |
| **Auth**   | None                             |

**Request Body:** _(none)_

**Responses:**

| Status | Body                                                             | Condition |
| ------ | ---------------------------------------------------------------- | --------- |
| `200`  | `[ { "id": 1, "name": "Cleaning", "description": "..." }, ... ]` | Success   |
| `500`  | `{ "message": "Error fetching categories", "error": "..." }`     | DB error  |

**Test Scenarios:**

- [x] No auth needed → `200` with array
- [x] Empty DB → `200` with `[]`

---

### 5.2 Get Category by ID

|            |                                     |
| ---------- | ----------------------------------- |
| **Method** | `GET`                               |
| **URL**    | `{{baseUrl}}/api/v1/categories/:id` |
| **Auth**   | None                                |

**URL Params:**

| Param | Type    | Description                           |
| ----- | ------- | ------------------------------------- |
| `id`  | Integer | Category ID (auto-incremented SERIAL) |

**Responses:**

| Status | Body                                                    | Condition                          |
| ------ | ------------------------------------------------------- | ---------------------------------- |
| `200`  | `{ "id": 1, "name": "Cleaning", "description": "..." }` | Found                              |
| `200`  | _(empty or null)_                                       | ID not found (no 404 handling yet) |

**Test Scenarios:**

- [x] Valid ID → `200` with category object
- [x] Non-existent ID → `200` with empty/null (note: no `404` error handling currently)

---

### 5.3 Create Category

|            |                                  |
| ---------- | -------------------------------- |
| **Method** | `POST`                           |
| **URL**    | `{{baseUrl}}/api/v1/categories/` |
| **Auth**   | Bearer Token                     |
| **Role**   | `admin` only                     |

**Request Body:**

```json
{
  "name": "Cleaning",
  "description": "Home and office cleaning services"
}
```

**Responses:**

| Status | Body                                                                         | Condition                 |
| ------ | ---------------------------------------------------------------------------- | ------------------------- |
| `201`  | `{ "id": 1, "name": "Cleaning", "description": "...", "created_at": "..." }` | Success                   |
| `403`  | `{ "message": "Forbidden" }`                                                 | Non-admin user            |
| `500`  | `{ "message": "Error creating category", "error": "..." }`                   | DB error / duplicate name |

**Test Scenarios:**

- [x] Admin creates a category → `201`
- [x] Duplicate category name → `500` (DB unique constraint)
- [x] Non-admin tries → `403`
- [x] No token → `401`
- [x] Missing `name` → `500`

---

### 5.4 Update Category

|            |                                     |
| ---------- | ----------------------------------- |
| **Method** | `PUT`                               |
| **URL**    | `{{baseUrl}}/api/v1/categories/:id` |
| **Auth**   | Bearer Token                        |
| **Role**   | `admin` only                        |

**URL Params:**

| Param | Type    | Description |
| ----- | ------- | ----------- |
| `id`  | Integer | Category ID |

**Request Body:**

```json
{
  "name": "Deep Cleaning",
  "description": "Updated description"
}
```

**Responses:**

| Status | Body                                                         | Condition                      |
| ------ | ------------------------------------------------------------ | ------------------------------ |
| `200`  | `{ "id": 1, "name": "Deep Cleaning", "description": "..." }` | Success                        |
| `200`  | _(empty or null)_                                            | ID not found (no 404 handling) |
| `403`  | `{ "message": "Forbidden" }`                                 | Non-admin                      |
| `500`  | `{ "message": "Error updating category", "error": "..." }`   | DB error                       |

**Test Scenarios:**

- [x] Admin updates valid category → `200`
- [x] Non-admin → `403`
- [x] Non-existent ID → `200` empty (no 404)

---

### 5.5 Delete Category

|            |                                     |
| ---------- | ----------------------------------- |
| **Method** | `DELETE`                            |
| **URL**    | `{{baseUrl}}/api/v1/categories/:id` |
| **Auth**   | Bearer Token                        |
| **Role**   | `admin` only                        |

**Responses:**

| Status | Body                                                       | Condition                                 |
| ------ | ---------------------------------------------------------- | ----------------------------------------- |
| `200`  | `{ "id": 1, "name": "...", ... }`                          | Deleted successfully                      |
| `200`  | _(empty or null)_                                          | ID not found (no 404 handling)            |
| `403`  | `{ "message": "Forbidden" }`                               | Non-admin                                 |
| `500`  | `{ "message": "Error deleting category", "error": "..." }` | FK constraint (category used by services) |

**Test Scenarios:**

- [x] Admin deletes unused category → `200`
- [x] Admin deletes category that has services linked → `500` (FK violation)
- [x] Non-admin → `403`

---

## 6. Service Routes — `/api/v1/services`

> 🔒 **All routes require** `Authorization: Bearer {{accessToken}}`
> 🔒 `POST`, `PUT`, `DELETE` additionally require `provider` role.

---

### 6.1 Get All Services

|            |                                |
| ---------- | ------------------------------ |
| **Method** | `GET`                          |
| **URL**    | `{{baseUrl}}/api/v1/services/` |
| **Auth**   | Bearer Token                   |
| **Role**   | Any authenticated user         |

**Request Body:** _(none)_

**Responses:**

| Status | Body                                                           | Condition         |
| ------ | -------------------------------------------------------------- | ----------------- |
| `200`  | `[ { "id": "uuid", "title": "...", "price": 500, ... }, ... ]` | Success           |
| `404`  | `{ "message": "Services not found" }`                          | No services exist |

---

### 6.2 Get Service by ID

|            |                                   |
| ---------- | --------------------------------- |
| **Method** | `GET`                             |
| **URL**    | `{{baseUrl}}/api/v1/services/:id` |
| **Auth**   | Bearer Token                      |
| **Role**   | Any authenticated user            |

**URL Params:**

| Param | Type | Description |
| ----- | ---- | ----------- |
| `id`  | UUID | Service ID  |

**Responses:**

| Status | Body                                                           | Condition    |
| ------ | -------------------------------------------------------------- | ------------ |
| `200`  | `{ "id": "uuid", "provider_id": "uuid", "title": "...", ... }` | Found        |
| `404`  | `{ "message": "Service does not exist" }`                      | Invalid UUID |

---

### 6.3 Create Service

|            |                                      |
| ---------- | ------------------------------------ |
| **Method** | `POST`                               |
| **URL**    | `{{baseUrl}}/api/v1/services/create` |
| **Auth**   | Bearer Token                         |
| **Role**   | `provider` only                      |

> ⚙️ **Note:** The `provider_id` is automatically pulled from the JWT token (`req.user.id`). Do NOT include it in the body.

**Request Body:**

```json
{
  "category_id": 1,
  "title": "Home Cleaning",
  "description": "Full apartment deep cleaning",
  "price": 1500,
  "service_type": "onsite",
  "location": "Makati, Metro Manila"
}
```

> ⚠️ `service_type` must be exactly `"online"` or `"onsite"` — the DB has a `CHECK` constraint. (Not `"on-site"`!)

**Responses:**

| Status | Body                                                           | Condition                                                      |
| ------ | -------------------------------------------------------------- | -------------------------------------------------------------- |
| `201`  | `{ "id": "uuid", "provider_id": "uuid", "title": "...", ... }` | Success                                                        |
| `403`  | `{ "message": "Forbidden" }`                                   | Non-provider user                                              |
| `500`  | `{ "message": "Internal server error" }`                       | Missing fields, invalid `category_id`, or constraint violation |

**Test Scenarios:**

- [x] Provider creates a service → `201`
- [x] Client tries → `403`
- [x] Invalid `service_type` (e.g., `"on-site"`) → `500` (DB check constraint violation)
- [x] Non-existent `category_id` → `500` (FK violation)
- [x] Missing required fields → `500`
- [x] Negative price → `500` (DB check constraint)

---

### 6.4 Edit Service

|            |                                        |
| ---------- | -------------------------------------- |
| **Method** | `PUT`                                  |
| **URL**    | `{{baseUrl}}/api/v1/services/edit/:id` |
| **Auth**   | Bearer Token                           |
| **Role**   | `provider` only                        |

**URL Params:**

| Param | Type | Description        |
| ----- | ---- | ------------------ |
| `id`  | UUID | Service ID to edit |

**Request Body:**

```json
{
  "title": "Premium Home Cleaning",
  "description": "Updated deep cleaning service",
  "price": 2000,
  "service_type": "onsite",
  "location": "BGC, Taguig"
}
```

**Responses:**

| Status | Body                                                      | Condition    |
| ------ | --------------------------------------------------------- | ------------ |
| `200`  | `{ "id": "uuid", "title": "Premium Home Cleaning", ... }` | Success      |
| `403`  | `{ "message": "Forbidden" }`                              | Non-provider |
| `404`  | `{ "message": "There are no services to edit" }`          | Invalid UUID |

**Test Scenarios:**

- [x] Provider edits own service → `200`
- [x] Non-existent service ID → `404`
- [x] Client tries → `403`
- [x] Provider edits another provider's service → `200` _(note: no ownership check — see Known Issues)_

---

### 6.5 Delete Service

|            |                                   |
| ---------- | --------------------------------- |
| **Method** | `DELETE`                          |
| **URL**    | `{{baseUrl}}/api/v1/services/:id` |
| **Auth**   | Bearer Token                      |
| **Role**   | `provider` only                   |

**Responses:**

| Status | Body                                      | Condition                            |
| ------ | ----------------------------------------- | ------------------------------------ |
| `200`  | `{ "id": "uuid", "title": "...", ... }`   | Deleted successfully                 |
| `403`  | `{ "message": "Forbidden" }`              | Non-provider                         |
| `404`  | `{ "message": "Service does not exist" }` | Invalid UUID                         |
| `500`  | `{ "message": "Internal server error" }`  | FK constraint (service has bookings) |

**Test Scenarios:**

- [x] Provider deletes own service → `200`
- [x] Delete service with existing bookings → `500` (FK constraint)
- [x] Client tries → `403`

---

## 7. Booking Routes — `/api/v1/bookings`

> 🔒 **All routes require** `Authorization: Bearer {{accessToken}}`
> No additional role restrictions — any authenticated user can access.

---

### 7.1 Get All Bookings

|            |                                |
| ---------- | ------------------------------ |
| **Method** | `GET`                          |
| **URL**    | `{{baseUrl}}/api/v1/bookings/` |
| **Auth**   | Bearer Token                   |

**Optional Query Params:**

| Param    | Type   | Description                                                                           |
| -------- | ------ | ------------------------------------------------------------------------------------- |
| `status` | String | Filter by booking status: `pending`, `accepted`, `rejected`, `completed`, `cancelled` |

**Examples:**

```
GET {{baseUrl}}/api/v1/bookings/
GET {{baseUrl}}/api/v1/bookings/?status=pending
```

**Responses:**

| Status | Body                                                  | Condition         |
| ------ | ----------------------------------------------------- | ----------------- |
| `200`  | `[ { "id": "uuid", "status": "pending", ... }, ... ]` | Success           |
| `200`  | `[]`                                                  | No bookings found |

---

### 7.2 Create Booking

|            |                                             |
| ---------- | ------------------------------------------- |
| **Method** | `POST`                                      |
| **URL**    | `{{baseUrl}}/api/v1/bookings/createBooking` |
| **Auth**   | Bearer Token                                |

**Request Body:**

```json
{
  "service_id": "uuid-of-service",
  "client_id": "uuid-of-client",
  "provider_id": "uuid-of-provider",
  "booking_date": "2026-03-15",
  "booking_time": "14:00",
  "user_location": "123 Main St, Makati City",
  "total_price": 1500,
  "notes": "Please bring cleaning supplies"
}
```

> ⚠️ All of `service_id`, `client_id`, `provider_id`, `booking_date`, `booking_time`, `user_location`, and `total_price` are **required** by the DB schema. `notes` is optional.

**Responses:**

| Status | Body                                                                | Condition              |
| ------ | ------------------------------------------------------------------- | ---------------------- |
| `201`  | `{ "id": "uuid", "status": "pending", "booking_date": "...", ... }` | Success                |
| `500`  | `{ "message": "Error creating booking", "error": "..." }`           | Missing/invalid fields |

**Test Scenarios:**

- [x] All valid fields → `201` with status `"pending"`
- [x] Invalid `service_id` UUID → `500` (FK violation)
- [x] Invalid `client_id` or `provider_id` UUID → `500`
- [x] Missing `booking_time` → `500`
- [x] Missing `user_location` → `500`
- [x] Negative `total_price` → `500` (check constraint)
- [x] Invalid status enum in booking → DB default is `"pending"`, so this is fine on creation

---

### 7.3 Get Client Bookings

|            |                                                |
| ---------- | ---------------------------------------------- |
| **Method** | `GET`                                          |
| **URL**    | `{{baseUrl}}/api/v1/bookings/client/:clientId` |
| **Auth**   | Bearer Token                                   |

**URL Params:**

| Param      | Type | Description          |
| ---------- | ---- | -------------------- |
| `clientId` | UUID | The client's user ID |

> Returns bookings with JOINed `service_name` and `service_description`.

**Responses:**

| Status | Body                                                                              | Condition         |
| ------ | --------------------------------------------------------------------------------- | ----------------- |
| `200`  | `[ { ..., "service_name": "Home Cleaning", "service_description": "..." }, ... ]` | Success           |
| `200`  | `[]`                                                                              | No bookings found |

---

### 7.4 Get Provider Bookings

|            |                                                    |
| ---------- | -------------------------------------------------- |
| **Method** | `GET`                                              |
| **URL**    | `{{baseUrl}}/api/v1/bookings/provider/:providerId` |
| **Auth**   | Bearer Token                                       |

**URL Params:**

| Param        | Type | Description            |
| ------------ | ---- | ---------------------- |
| `providerId` | UUID | The provider's user ID |

> Returns bookings with JOINed `service_name`, `client_name`, and `client_phone`.

**Responses:**

| Status | Body                                                                                        | Condition         |
| ------ | ------------------------------------------------------------------------------------------- | ----------------- |
| `200`  | `[ { ..., "service_name": "...", "client_name": "Juan", "client_phone": "0917..." }, ... ]` | Success           |
| `200`  | `[]`                                                                                        | No bookings found |

---

### 7.5 Update Booking Status

|            |                                          |
| ---------- | ---------------------------------------- |
| **Method** | `PATCH`                                  |
| **URL**    | `{{baseUrl}}/api/v1/bookings/:id/status` |
| **Auth**   | Bearer Token                             |

**URL Params:**

| Param | Type | Description |
| ----- | ---- | ----------- |
| `id`  | UUID | Booking ID  |

**Request Body:**

```json
{
  "status": "accepted"
}
```

> Valid values: `"pending"`, `"accepted"`, `"rejected"`, `"completed"`, `"cancelled"`

**Responses:**

| Status | Body                                                             | Condition                               |
| ------ | ---------------------------------------------------------------- | --------------------------------------- |
| `200`  | `{ "id": "uuid", "status": "accepted", ... }`                    | Success                                 |
| `400`  | `{ "message": "Missing status in request body" }`                | No `status` field                       |
| `404`  | `{ "message": "Booking not found" }`                             | Invalid UUID                            |
| `500`  | `{ "message": "Error updating booking status", "error": "..." }` | Invalid status value (check constraint) |

**Test Scenarios:**

- [x] Update to `"accepted"` → `200`
- [x] Update to `"completed"` → `200`
- [x] Missing `status` in body → `400`
- [x] Invalid status like `"in-progress"` → `500` (DB check constraint)
- [x] Non-existent booking ID → `404`

---

### 7.6 Delete Booking

|            |                                   |
| ---------- | --------------------------------- |
| **Method** | `DELETE`                          |
| **URL**    | `{{baseUrl}}/api/v1/bookings/:id` |
| **Auth**   | Bearer Token                      |

**URL Params:**

| Param | Type | Description |
| ----- | ---- | ----------- |
| `id`  | UUID | Booking ID  |

**Responses:**

| Status | Body                                                   | Condition    |
| ------ | ------------------------------------------------------ | ------------ |
| `200`  | `{ "message": "Booking deleted", "booking": { ... } }` | Success      |
| `404`  | `{ "message": "Booking not found" }`                   | Invalid UUID |

**Test Scenarios:**

- [x] Delete existing booking → `200`
- [x] Delete non-existent booking → `404`
- [x] Delete booking that has a review → `500` (FK constraint from `reviews` table)

---

## 8. Recommended Testing Order

Follow this step-by-step flow to simulate a real end-to-end user journey. This order ensures dependencies are met (e.g., categories exist before creating services).

```
PHASE 1: SETUP — Admin & Categories
──────────────────────────────────────
 1.  POST   /auth/register         → Register admin user
 2.  POST   /auth/login            → Login as admin (save accessToken)
 3.  PATCH  /users/:id/role        → Change own role to "admin" (requires manual DB update first time)
 4.  POST   /categories/           → Create category: "Cleaning"
 5.  POST   /categories/           → Create category: "Plumbing"
 6.  GET    /categories/           → Verify categories exist
 7.  GET    /categories/1          → Verify single category

PHASE 2: PROVIDER — Service Management
──────────────────────────────────────
 8.  POST   /auth/register         → Register provider user
 9.  POST   /auth/login            → Login as provider (save accessToken)
10.  PATCH  /users/promote         → Promote client → provider (update accessToken!)
11.  POST   /services/create       → Create "Home Cleaning" service (category_id: 1)
12.  POST   /services/create       → Create "Pipe Repair" service (category_id: 2)
13.  GET    /services/             → Verify services listed
14.  GET    /services/:id          → Verify single service
15.  PUT    /services/edit/:id     → Edit service title/price
16.  GET    /users/profile         → Verify profile shows "provider"

PHASE 3: CLIENT — Booking Flow
──────────────────────────────────────
17.  POST   /auth/register         → Register client user
18.  POST   /auth/login            → Login as client (save accessToken)
19.  GET    /services/             → Browse available services
20.  POST   /bookings/createBooking → Book "Home Cleaning"
21.  GET    /bookings/client/:id   → View client's bookings
22.  GET    /bookings/             → View all bookings

PHASE 4: PROVIDER — Handle Bookings
──────────────────────────────────────
23.  POST   /auth/login            → Login back as provider
24.  GET    /bookings/provider/:id → View incoming bookings
25.  PATCH  /bookings/:id/status   → Accept booking (status: "accepted")
26.  PATCH  /bookings/:id/status   → Complete booking (status: "completed")

PHASE 5: TOKEN LIFECYCLE
──────────────────────────────────────
27.  POST   /auth/refresh          → Get new access token via cookie
28.  POST   /auth/refresh          → Try same cookie again (should fail — rotation)
29.  POST   /auth/logout           → Logout
30.  POST   /auth/refresh          → Try refresh after logout → 401/403

PHASE 6: NEGATIVE / EDGE CASES
──────────────────────────────────────
31.  GET    /users/profile         → No token → 401
32.  GET    /users/profile         → Expired token → 403
33.  POST   /services/create       → Client tries to create service → 403
34.  PATCH  /users/:id/role        → Non-admin tries to change role → 403
35.  DELETE /services/:id          → Delete service with bookings → 500
36.  DELETE /categories/1          → Delete category with services → 500

PHASE 7: CLEANUP
──────────────────────────────────────
37.  DELETE /bookings/:id          → Delete test booking
38.  DELETE /services/:id          → Delete test service
39.  DELETE /categories/1          → Delete test category (now safe)
```

---

## 9. Known Issues & Notes

These are things to be aware of while testing, and areas for future improvement.

### 🐛 Bug: Category Controller Name Collision

In `controllers/categoriesController.js`, the controller functions have the **same names** as the imported model functions:

```javascript
const { createCategory, getAllCategories, ... } = require('../models/categoriesModel');

const createCategory = async (req, res) => {   // ❌ Redeclares the import!
    const category = await createCategory(...);  // Calls itself → infinite recursion
```

This will cause a **stack overflow** at runtime. The controller functions need unique names or the imports need to be aliased (e.g., `createCategory: createCategoryInDB`).

### 🐛 Bug: Category Routes Import Path

In `routes/categoryRoutes.js`, line 4:

```javascript
const { authorizeRoles } = require("../middleware/roleMiddleware");
//                                     ^^^^^^^^^^
// Should be: '../middlewares/roleMiddleware'
```

And `authorizeRoles` is exported as a **default export** (`module.exports = authorizeRoles`), not a named export, so the destructuring `{ authorizeRoles }` won't work either. It should be:

```javascript
const authorizeRoles = require("../middlewares/roleMiddleware");
```

### ⚠️ No Ownership Checks on Services

Any `provider` can edit or delete **any** service, not just their own. Consider adding:

```javascript
if (service.provider_id !== req.user.id) return res.status(403).json(...)
```

### ⚠️ No Ownership Checks on Bookings

Any authenticated user can view, update, or delete **any** booking. Consider restricting access to only the client or provider involved in that booking.

### ⚠️ No Input Validation Layer

The API relies entirely on DB constraints for validation. Missing fields return generic `500` errors instead of clear `400` messages. Consider adding a validation library like **Joi** or **express-validator** for better error messages.

### ⚠️ `service_type` Constraint

The database `CHECK` constraint only allows `'online'` or `'onsite'`. If you send `'on-site'` (with a hyphen), it will fail with a `500`. Keep this in mind during Postman testing.

### 📌 First Admin Setup

There is no self-registration as admin. To create the first admin, you need to either:

1. Register a normal user, then manually update in the DB:
   ```sql
   UPDATE users SET user_type = 'admin' WHERE email = 'admin@example.com';
   ```
2. Or use an existing admin to promote via `PATCH /users/:id/role`.
