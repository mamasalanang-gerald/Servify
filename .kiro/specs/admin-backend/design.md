# Admin Backend System - Design

## Overview

The Admin Backend System is a secure, role-protected module built on Express.js and PostgreSQL that provides comprehensive administrative capabilities for the Servify marketplace. It implements strict RBAC (Role-Based Access Control) with JWT authentication, parameterized queries for SQL injection prevention, and comprehensive error handling.

## Architecture

### Layered Architecture Pattern

```
HTTP Request
    ↓
Routes (admin.routes.js)
    ↓
Middleware (auth, role validation)
    ↓
Controllers (admin.controller.js)
    ↓
Services (admin.service.js)
    ↓
Database (PostgreSQL)
```

### Middleware Stack

1. **verifyToken**: Validates JWT and attaches user to request
2. **requireAdmin**: Checks if user.role === 'admin'
3. **validateInput**: Validates request parameters and body
4. **errorHandler**: Catches and formats errors

## Components and Interfaces

### 1. Authentication Middleware (auth.middleware.js)

```javascript
verifyToken(req, res, next)
  - Extracts JWT from Authorization header
  - Verifies token signature
  - Attaches decoded user to req.user
  - Returns 401 if missing/invalid
  - Returns 403 if expired
```

### 2. Role Middleware (role.middleware.js)

```javascript
requireAdmin(req, res, next)
  - Checks req.user.role === 'admin'
  - Returns 403 if not admin
  - Calls next() if authorized
```

### 3. Admin Controller (admin.controller.js)

Handles HTTP request/response logic:

**User Management**
- getUsers(req, res) - List users with pagination/filtering
- getUserById(req, res) - Get single user
- activateUser(req, res) - Activate user account
- deactivateUser(req, res) - Deactivate user account
- verifyProvider(req, res) - Verify provider account

**Category Management**
- getCategories(req, res) - List categories
- createCategory(req, res) - Create new category
- updateCategory(req, res) - Update category
- deleteCategory(req, res) - Delete category

**Service Moderation**
- getServices(req, res) - List services with filtering
- getServiceById(req, res) - Get service details
- toggleServiceStatus(req, res) - Activate/deactivate service

**Booking Monitoring**
- getBookings(req, res) - List bookings with filtering
- getBookingById(req, res) - Get booking details

**Review Moderation**
- getReviews(req, res) - List reviews with filtering
- getReviewById(req, res) - Get review details
- deleteReview(req, res) - Delete review

**Dashboard**
- getDashboardMetrics(req, res) - Get platform metrics

### 4. Admin Service (admin.service.js)

Database query layer using parameterized queries:

**User Queries**
- fetchUsers(page, limit, role) - Get paginated users
- fetchUserById(id) - Get user by ID
- updateUserStatus(id, isActive) - Toggle user active status
- verifyProviderAccount(id) - Mark provider as verified

**Category Queries**
- fetchCategories() - Get all categories
- createNewCategory(name, description) - Insert category
- updateCategoryData(id, name, description) - Update category
- deleteCategoryById(id) - Delete category
- checkCategoryUsage(id) - Check if category used by services

**Service Queries**
- fetchServices(page, limit, filters) - Get paginated services
- fetchServiceById(id) - Get service details
- toggleServiceActive(id) - Toggle service status

**Booking Queries**
- fetchBookings(page, limit, filters) - Get paginated bookings
- fetchBookingById(id) - Get booking details

**Review Queries**
- fetchReviews(page, limit, filters) - Get paginated reviews
- fetchReviewById(id) - Get review details
- deleteReviewById(id) - Delete review

**Dashboard Queries**
- getTotalUsers() - Count all users
- getTotalProviders() - Count providers
- getActiveServices() - Count active services
- getPendingBookings() - Count pending bookings
- getCompletedBookings() - Count completed bookings
- getTotalTransactions() - Sum transaction amounts

### 5. Routes (admin.routes.js)

```
Base: /api/v1/admin

User Management
  GET    /users
  GET    /users/:id
  PATCH  /users/:id/activate
  PATCH  /users/:id/deactivate
  PATCH  /users/:id/verify

Category Management
  GET    /categories
  POST   /categories
  PUT    /categories/:id
  DELETE /categories/:id

Service Moderation
  GET    /services
  GET    /services/:id
  PATCH  /services/:id/toggle

Booking Monitoring
  GET    /bookings
  GET    /bookings/:id

Review Moderation
  GET    /reviews
  GET    /reviews/:id
  DELETE /reviews/:id

Dashboard
  GET    /dashboard
```

## Data Models

### User Response Model
```javascript
{
  id: UUID,
  full_name: string,
  email: string,
  user_type: 'client' | 'provider' | 'admin',
  is_verified: boolean,
  is_active: boolean,
  phone_number: string,
  created_at: timestamp,
  updated_at: timestamp
}
```

### Category Model
```javascript
{
  id: number,
  name: string,
  description: string,
  created_at: timestamp,
  updated_at: timestamp
}
```

### Service Model
```javascript
{
  id: UUID,
  provider_id: UUID,
  provider_name: string,
  category_id: number,
  title: string,
  description: string,
  price: decimal,
  service_type: 'online' | 'onsite',
  location: string,
  is_active: boolean,
  created_at: timestamp,
  updated_at: timestamp
}
```

### Booking Model
```javascript
{
  id: UUID,
  service_id: UUID,
  service_title: string,
  client_id: UUID,
  client_name: string,
  provider_id: UUID,
  provider_name: string,
  booking_date: date,
  booking_time: time,
  user_location: string,
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled',
  total_price: decimal,
  notes: string,
  created_at: timestamp,
  updated_at: timestamp
}
```

### Review Model
```javascript
{
  id: UUID,
  booking_id: UUID,
  client_id: UUID,
  client_name: string,
  provider_id: UUID,
  provider_name: string,
  rating: 1-5,
  comment: string,
  review_date: timestamp
}
```

### Dashboard Metrics Model
```javascript
{
  totalUsers: number,
  totalProviders: number,
  activeServices: number,
  pendingBookings: number,
  completedBookings: number,
  totalTransactions: decimal,
  timestamp: timestamp
}
```

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Admin Access Control
**For any** non-admin user attempting to access admin endpoints, the system SHALL return 403 Forbidden status code.
**Validates: Requirements 1.2**

### Property 2: User Activation Idempotence
**For any** user account, activating an already-active account SHALL result in the same state (idempotent operation).
**Validates: Requirements 2.4**

### Property 3: Provider Verification Constraint
**For any** user with role != 'provider', attempting to verify SHALL return 400 Bad Request.
**Validates: Requirements 2.7**

### Property 4: Category Uniqueness
**For any** category name, creating a second category with identical name SHALL return 409 Conflict.
**Validates: Requirements 3.3**

### Property 5: Category Deletion Safety
**For any** category used by one or more services, attempting deletion SHALL return 400 Bad Request.
**Validates: Requirements 3.6**

### Property 6: Service Toggle Idempotence
**For any** service, toggling active status twice SHALL return to original state.
**Validates: Requirements 4.5**

### Property 7: Pagination Consistency
**For any** paginated request with page=N and limit=L, the number of returned records SHALL be ≤ L.
**Validates: Requirements 8.2**

### Property 8: Self-Deactivation Prevention
**For any** admin user, attempting to deactivate their own account SHALL return 400 Bad Request.
**Validates: Requirements 1.5**

### Property 9: Dashboard Metrics Non-Negative
**For any** dashboard metrics response, all count fields SHALL be ≥ 0.
**Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**

### Property 10: Parameterized Query Safety
**For any** SQL query executed by the system, user input SHALL be passed as parameters, not concatenated into query string.
**Validates: Requirements 9.1**

## Error Handling

### Error Response Format
```javascript
{
  success: false,
  message: string,
  error: {
    code: string,
    details: object (optional)
  },
  timestamp: ISO8601
}
```

### HTTP Status Codes
- 200 OK - Successful GET/PATCH/DELETE
- 201 Created - Successful POST
- 400 Bad Request - Validation error, business logic violation
- 401 Unauthorized - Missing/invalid JWT
- 403 Forbidden - Insufficient permissions
- 404 Not Found - Resource not found
- 409 Conflict - Duplicate resource
- 500 Internal Server Error - Unexpected server error

### Error Scenarios
1. Missing JWT → 401 Unauthorized
2. Invalid JWT → 403 Forbidden
3. Non-admin accessing admin route → 403 Forbidden
4. Invalid UUID format → 400 Bad Request
5. Resource not found → 404 Not Found
6. Duplicate category name → 409 Conflict
7. Category in use → 400 Bad Request
8. Self-deactivation attempt → 400 Bad Request
9. Verify non-provider → 400 Bad Request
10. Database error → 500 Internal Server Error

## Testing Strategy

### Unit Tests
- Test each controller function with mocked service layer
- Test each service function with mocked database
- Test middleware functions with mock req/res
- Test validation functions with various inputs
- Test error handling for each endpoint

### Property-Based Tests
- Property 1: Admin access control across all endpoints
- Property 2: Idempotence of activation operations
- Property 3: Provider verification constraints
- Property 4: Category uniqueness enforcement
- Property 5: Category deletion safety checks
- Property 6: Service toggle idempotence
- Property 7: Pagination consistency
- Property 8: Self-deactivation prevention
- Property 9: Dashboard metrics non-negativity
- Property 10: Parameterized query usage

### Integration Tests
- Test complete request/response cycle
- Test database transactions
- Test error handling end-to-end
- Test pagination with real data
- Test filtering combinations

### Test Configuration
- Minimum 100 iterations per property test
- Use test database separate from production
- Mock external dependencies
- Clear test data between runs
