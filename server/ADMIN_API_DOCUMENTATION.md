# Admin Backend API Documentation

## Overview

The Admin Backend API provides comprehensive administrative capabilities for the Servify marketplace. All endpoints require JWT authentication and admin role authorization.

## Base URL

```
http://localhost:3000/api/v1/admin
```

## Authentication

All requests must include a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ },
  "page": 1,
  "limit": 10
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "error_details"
}
```

## HTTP Status Codes

- `200 OK` - Successful GET/PATCH/DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Validation error or business logic violation
- `401 Unauthorized` - Missing or invalid JWT
- `403 Forbidden` - Insufficient permissions (non-admin)
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate resource
- `500 Internal Server Error` - Server error

---

## User Management

### Get All Users

**Endpoint:** `GET /users`

**Query Parameters:**
- `page` (optional, default: 1) - Page number for pagination
- `limit` (optional, default: 10) - Records per page (max: 100)
- `role` (optional) - Filter by role: `client`, `provider`, `admin`

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/v1/admin/users?page=1&limit=10&role=provider" \
  -H "Authorization: Bearer <token>"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "full_name": "John Doe",
      "email": "john@example.com",
      "user_type": "provider",
      "is_verified": true,
      "is_active": true,
      "phone_number": "+1234567890",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "page": 1,
  "limit": 10
}
```

---

### Get User by ID

**Endpoint:** `GET /users/:id`

**Path Parameters:**
- `id` (required) - User UUID

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/v1/admin/users/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer <token>"
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "full_name": "John Doe",
    "email": "john@example.com",
    "user_type": "provider",
    "is_verified": true,
    "is_active": true,
    "phone_number": "+1234567890",
    "bio": "Professional service provider",
    "profile_image": "https://example.com/image.jpg",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

---

### Activate User

**Endpoint:** `PATCH /users/:id/activate`

**Path Parameters:**
- `id` (required) - User UUID

**Example Request:**
```bash
curl -X PATCH "http://localhost:3000/api/v1/admin/users/550e8400-e29b-41d4-a716-446655440000/activate" \
  -H "Authorization: Bearer <token>"
```

**Example Response:**
```json
{
  "success": true,
  "message": "User activated",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "full_name": "John Doe",
    "email": "john@example.com",
    "user_type": "provider",
    "is_verified": true,
    "is_active": true,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T11:00:00Z"
  }
}
```

---

### Deactivate User

**Endpoint:** `PATCH /users/:id/deactivate`

**Path Parameters:**
- `id` (required) - User UUID

**Note:** Admin cannot deactivate their own account.

**Example Request:**
```bash
curl -X PATCH "http://localhost:3000/api/v1/admin/users/550e8400-e29b-41d4-a716-446655440000/deactivate" \
  -H "Authorization: Bearer <token>"
```

---

### Verify Provider

**Endpoint:** `PATCH /users/:id/verify`

**Path Parameters:**
- `id` (required) - User UUID (must be a provider)

**Example Request:**
```bash
curl -X PATCH "http://localhost:3000/api/v1/admin/users/550e8400-e29b-41d4-a716-446655440000/verify" \
  -H "Authorization: Bearer <token>"
```

**Example Response:**
```json
{
  "success": true,
  "message": "Provider verified",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "full_name": "John Doe",
    "email": "john@example.com",
    "user_type": "provider",
    "is_verified": true,
    "is_active": true,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T11:00:00Z"
  }
}
```

---

## Category Management

### Get All Categories

**Endpoint:** `GET /categories`

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/v1/admin/categories" \
  -H "Authorization: Bearer <token>"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Web Development",
      "description": "Web development services",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### Create Category

**Endpoint:** `POST /categories`

**Request Body:**
```json
{
  "name": "Mobile Development",
  "description": "Mobile app development services"
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:3000/api/v1/admin/categories" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mobile Development",
    "description": "Mobile app development services"
  }'
```

**Example Response:**
```json
{
  "success": true,
  "message": "Category created",
  "data": {
    "id": 2,
    "name": "Mobile Development",
    "description": "Mobile app development services",
    "created_at": "2024-01-15T11:00:00Z"
  }
}
```

---

### Update Category

**Endpoint:** `PUT /categories/:id`

**Path Parameters:**
- `id` (required) - Category ID

**Request Body:**
```json
{
  "name": "Mobile Development",
  "description": "Updated description"
}
```

**Example Request:**
```bash
curl -X PUT "http://localhost:3000/api/v1/admin/categories/2" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mobile Development",
    "description": "Updated description"
  }'
```

---

### Delete Category

**Endpoint:** `DELETE /categories/:id`

**Path Parameters:**
- `id` (required) - Category ID

**Note:** Cannot delete category if it's used by services.

**Example Request:**
```bash
curl -X DELETE "http://localhost:3000/api/v1/admin/categories/2" \
  -H "Authorization: Bearer <token>"
```

---

## Service Moderation

### Get All Services

**Endpoint:** `GET /services`

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Records per page
- `provider_id` (optional) - Filter by provider UUID
- `category_id` (optional) - Filter by category ID
- `search` (optional) - Search by service title (case-insensitive)

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/v1/admin/services?page=1&limit=10&search=web" \
  -H "Authorization: Bearer <token>"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "provider_id": "550e8400-e29b-41d4-a716-446655440001",
      "provider_name": "John Doe",
      "category_id": 1,
      "title": "Web Development",
      "description": "Professional web development",
      "price": "5000.00",
      "service_type": "online",
      "location": "New York",
      "is_active": true,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "page": 1,
  "limit": 10
}
```

---

### Get Service by ID

**Endpoint:** `GET /services/:id`

**Path Parameters:**
- `id` (required) - Service UUID

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/v1/admin/services/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer <token>"
```

---

### Toggle Service Status

**Endpoint:** `PATCH /services/:id/toggle`

**Path Parameters:**
- `id` (required) - Service UUID

**Example Request:**
```bash
curl -X PATCH "http://localhost:3000/api/v1/admin/services/550e8400-e29b-41d4-a716-446655440000/toggle" \
  -H "Authorization: Bearer <token>"
```

**Example Response:**
```json
{
  "success": true,
  "message": "Service status toggled",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "provider_id": "550e8400-e29b-41d4-a716-446655440001",
    "category_id": 1,
    "title": "Web Development",
    "is_active": false,
    "updated_at": "2024-01-15T11:00:00Z"
  }
}
```

---

## Booking Monitoring

### Get All Bookings

**Endpoint:** `GET /bookings`

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Records per page
- `status` (optional) - Filter by status: `pending`, `accepted`, `rejected`, `completed`, `cancelled`
- `startDate` (optional) - Filter by start date (YYYY-MM-DD)
- `endDate` (optional) - Filter by end date (YYYY-MM-DD)

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/v1/admin/bookings?page=1&limit=10&status=pending" \
  -H "Authorization: Bearer <token>"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "service_id": "550e8400-e29b-41d4-a716-446655440001",
      "service_title": "Web Development",
      "client_id": "550e8400-e29b-41d4-a716-446655440002",
      "client_name": "Jane Smith",
      "provider_id": "550e8400-e29b-41d4-a716-446655440003",
      "provider_name": "John Doe",
      "booking_date": "2024-02-15",
      "booking_time": "10:00:00",
      "user_location": "New York",
      "status": "pending",
      "total_price": "5000.00",
      "notes": "Urgent project",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "page": 1,
  "limit": 10
}
```

---

### Get Booking by ID

**Endpoint:** `GET /bookings/:id`

**Path Parameters:**
- `id` (required) - Booking UUID

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/v1/admin/bookings/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer <token>"
```

---

## Review Moderation

### Get All Reviews

**Endpoint:** `GET /reviews`

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Records per page
- `rating` (optional) - Filter by rating (1-5)
- `provider_id` (optional) - Filter by provider UUID

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/v1/admin/reviews?page=1&limit=10&rating=5" \
  -H "Authorization: Bearer <token>"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "booking_id": "550e8400-e29b-41d4-a716-446655440001",
      "client_id": "550e8400-e29b-41d4-a716-446655440002",
      "client_name": "Jane Smith",
      "provider_id": "550e8400-e29b-41d4-a716-446655440003",
      "provider_name": "John Doe",
      "rating": 5,
      "comment": "Excellent service!",
      "review_date": "2024-01-15T10:30:00Z"
    }
  ],
  "page": 1,
  "limit": 10
}
```

---

### Get Review by ID

**Endpoint:** `GET /reviews/:id`

**Path Parameters:**
- `id` (required) - Review UUID

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/v1/admin/reviews/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer <token>"
```

---

### Delete Review

**Endpoint:** `DELETE /reviews/:id`

**Path Parameters:**
- `id` (required) - Review UUID

**Example Request:**
```bash
curl -X DELETE "http://localhost:3000/api/v1/admin/reviews/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer <token>"
```

**Example Response:**
```json
{
  "success": true,
  "message": "Review deleted",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "booking_id": "550e8400-e29b-41d4-a716-446655440001",
    "rating": 5,
    "comment": "Excellent service!"
  }
}
```

---

## Dashboard Metrics

### Get Dashboard Metrics

**Endpoint:** `GET /dashboard`

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/v1/admin/dashboard" \
  -H "Authorization: Bearer <token>"
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalProviders": 45,
    "activeServices": 320,
    "pendingBookings": 12,
    "completedBookings": 287,
    "totalTransactions": 125000.50,
    "timestamp": "2024-01-15T11:00:00Z"
  }
}
```

---

## Error Examples

### 401 Unauthorized (Missing Token)
```json
{
  "success": false,
  "message": "No token provided"
}
```

### 403 Forbidden (Non-Admin)
```json
{
  "success": false,
  "message": "Forbidden"
}
```

### 400 Bad Request (Validation Error)
```json
{
  "success": false,
  "message": "Invalid user ID format"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

### 409 Conflict (Duplicate Category)
```json
{
  "success": false,
  "message": "Category name already exists"
}
```

---

## Setup Instructions

### 1. Seed Admin User

```bash
node server/scripts/seedAdmin.js
```

**Default Admin Credentials:**
- Email: `admin@servify.com`
- Password: `Admin@123456`

### 2. Login to Get JWT Token

```bash
curl -X POST "http://localhost:3000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@servify.com",
    "password": "Admin@123456"
  }'
```

### 3. Use Token in Admin Requests

```bash
curl -X GET "http://localhost:3000/api/v1/admin/users" \
  -H "Authorization: Bearer <your_jwt_token>"
```

---

## Security Notes

- All admin routes require valid JWT authentication
- Only users with `admin` role can access admin endpoints
- Admins cannot deactivate their own accounts
- All database queries use parameterized statements to prevent SQL injection
- Passwords are never returned in API responses
- All timestamps are in ISO 8601 format with timezone information

---

## Rate Limiting (Future Enhancement)

Admin endpoints will be rate-limited to prevent abuse:
- 100 requests per minute per IP address
- 1000 requests per hour per admin user

---

## Pagination Best Practices

- Default page size is 10 records
- Maximum page size is 100 records
- Always include `page` and `limit` in response for consistency
- Use `page=1` to start from the beginning
- Empty results return empty array, not null

---

## Filtering Best Practices

- Filters are optional and can be combined
- Date filters use YYYY-MM-DD format
- Search is case-insensitive
- Invalid filter values return 400 Bad Request
- Multiple filters use AND logic

---

## Support

For issues or questions, contact the development team or refer to the main API documentation.
