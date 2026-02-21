# Admin Backend System - Implementation Tasks

## Overview

This implementation plan breaks down the admin backend system into discrete, manageable coding tasks. Each task builds on previous steps, with testing integrated throughout. Tasks marked with `*` are optional and can be skipped for faster MVP delivery.

## Tasks

- [x] 1. Set up admin module structure and middleware
  - Create directory structure: routes, controllers, services, middleware, validations
  - Implement verifyToken middleware to validate JWT and attach user to request
  - Implement requireAdmin middleware to check admin role
  - Set up error handling middleware
  - _Requirements: 1.1, 1.3, 1.4_

- [ ]* 1.1 Write unit tests for authentication middleware
  - Test verifyToken with valid/invalid/expired tokens
  - Test requireAdmin with admin/non-admin users
  - _Requirements: 1.1, 1.3, 1.4_

- [x] 2. Implement user management endpoints
  - [x] 2.1 Create getUsers controller and service
    - Implement pagination (page, limit parameters)
    - Implement role filtering
    - Return user list excluding password_hash
    - _Requirements: 2.1, 8.1, 8.2_

  - [ ]* 2.2 Write property test for pagination consistency
    - **Property 7: Pagination Consistency**
    - **Validates: Requirements 8.2**

  - [x] 2.3 Create getUserById controller and service
    - Validate UUID format
    - Return single user details
    - _Requirements: 2.3_

  - [x] 2.4 Create activateUser controller and service
    - Validate user exists
    - Prevent self-deactivation
    - Update is_active to TRUE
    - _Requirements: 2.4, 1.5_

  - [ ]* 2.5 Write property test for activation idempotence
    - **Property 2: User Activation Idempotence**
    - **Validates: Requirements 2.4**

  - [x] 2.6 Create deactivateUser controller and service
    - Validate user exists
    - Prevent admin self-deactivation
    - Update is_active to FALSE
    - _Requirements: 2.5, 1.5_

  - [ ]* 2.7 Write property test for self-deactivation prevention
    - **Property 8: Self-Deactivation Prevention**
    - **Validates: Requirements 1.5**

  - [x] 2.8 Create verifyProvider controller and service
    - Validate user exists
    - Check user_type is 'provider'
    - Update is_verified to TRUE
    - _Requirements: 2.6, 2.7_

  - [ ]* 2.9 Write property test for provider verification constraint
    - **Property 3: Provider Verification Constraint**
    - **Validates: Requirements 2.7**

- [x] 3. Implement category management endpoints
  - [x] 3.1 Create getCategories controller and service
    - Return all categories with id, name, description, created_at
    - _Requirements: 3.1_

  - [x] 3.2 Create createCategory controller and service
    - Validate category name is not empty
    - Check for duplicate category names
    - Insert new category
    - _Requirements: 3.2, 3.3_

  - [ ]* 3.3 Write property test for category uniqueness
    - **Property 4: Category Uniqueness**
    - **Validates: Requirements 3.3**

  - [x] 3.4 Create updateCategory controller and service
    - Validate category exists
    - Update name and description
    - _Requirements: 3.4_

  - [x] 3.5 Create deleteCategory controller and service
    - Check if category is used by any services
    - Return 400 if in use
    - Delete category if not in use
    - _Requirements: 3.5, 3.6_

  - [ ]* 3.6 Write property test for category deletion safety
    - **Property 5: Category Deletion Safety**
    - **Validates: Requirements 3.6**

- [x] 4. Implement service moderation endpoints
  - [x] 4.1 Create getServices controller and service
    - Implement pagination
    - Implement filtering by provider_id, category_id
    - Implement search by title (case-insensitive)
    - Include provider name in response
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 8.1_

  - [x] 4.2 Create getServiceById controller and service
    - Validate service exists
    - Return complete service details with provider info
    - _Requirements: 4.6_

  - [x] 4.3 Create toggleServiceStatus controller and service
    - Validate service exists
    - Toggle is_active status
    - Update updated_at timestamp
    - _Requirements: 4.5_

  - [ ]* 4.4 Write property test for service toggle idempotence
    - **Property 6: Service Toggle Idempotence**
    - **Validates: Requirements 4.5**

- [ ] 5. Implement booking monitoring endpoints
  - [x] 5.1 Create getBookings controller and service
    - Implement pagination
    - Implement filtering by status, date range
    - Join with services, users tables for names
    - _Requirements: 5.1, 5.2, 5.3, 5.5, 8.1_

  - [x] 5.2 Create getBookingById controller and service
    - Validate booking exists
    - Return complete booking details with all related info
    - _Requirements: 5.4, 5.5_

- [x] 6. Implement review moderation endpoints
  - [x] 6.1 Create getReviews controller and service
    - Implement pagination
    - Implement filtering by rating, provider_id
    - Include provider and client names
    - _Requirements: 6.1, 6.2, 6.3, 8.1_

  - [x] 6.2 Create getReviewById controller and service
    - Validate review exists
    - Return complete review details with user info
    - _Requirements: 6.4_

  - [x] 6.3 Create deleteReview controller and service
    - Validate review exists
    - Delete review from database
    - _Requirements: 6.4_

- [x] 7. Implement dashboard metrics endpoint
  - [x] 7.1 Create getDashboardMetrics controller and service
    - Query total user count
    - Query total provider count
    - Query active service count
    - Query pending booking count
    - Query completed booking count
    - Query total transaction amount
    - Return all metrics in single JSON response
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

  - [ ]* 7.2 Write property test for dashboard metrics non-negativity
    - **Property 9: Dashboard Metrics Non-Negative**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**

- [x] 8. Implement input validation
  - [x] 8.1 Create validation middleware/functions
    - Validate UUID format for path parameters
    - Validate boolean values for toggles
    - Validate category names (non-empty, unique)
    - Validate role filters (client, provider, admin)
    - Validate status filters (pending, accepted, rejected, completed, cancelled)
    - Validate pagination parameters (page ≥ 1, limit > 0)
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [ ]* 8.2 Write unit tests for validation functions
    - Test UUID validation
    - Test boolean validation
    - Test category name validation
    - Test role validation
    - Test status validation
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 9. Implement error handling
  - [x] 9.1 Create error handling middleware
    - Catch all errors and format consistently
    - Return appropriate HTTP status codes
    - Include error messages and codes
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ]* 9.2 Write unit tests for error scenarios
    - Test 401 Unauthorized (missing JWT)
    - Test 403 Forbidden (invalid JWT, non-admin)
    - Test 404 Not Found (resource not found)
    - Test 400 Bad Request (validation errors)
    - Test 409 Conflict (duplicate category)
    - Test 500 Internal Server Error
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 10. Set up admin routes
  - [x] 10.1 Create admin.routes.js with all endpoints
    - User management routes (GET, PATCH)
    - Category management routes (GET, POST, PUT, DELETE)
    - Service moderation routes (GET, PATCH)
    - Booking monitoring routes (GET)
    - Review moderation routes (GET, DELETE)
    - Dashboard route (GET)
    - Apply verifyToken and requireAdmin middleware to all routes
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ]* 10.2 Write integration tests for all routes
    - Test complete request/response cycle
    - Test with valid and invalid inputs
    - Test error scenarios
    - _Requirements: All_

- [ ] 11. Checkpoint - Ensure all tests pass
  - Run all unit tests
  - Run all property-based tests
  - Run all integration tests
  - Verify no console errors
  - Ask the user if questions arise

- [ ] 12. Security hardening
  - [ ] 12.1 Verify parameterized queries used throughout
    - Audit all database queries
    - Ensure no string concatenation with user input
    - _Requirements: 9.1, 10.1_

  - [ ]* 12.2 Write property test for parameterized query safety
    - **Property 10: Parameterized Query Safety**
    - **Validates: Requirements 9.1**

  - [ ] 12.3 Add rate limiting to admin routes
    - Implement rate limiting middleware
    - Limit requests per IP/user
    - _Requirements: Security hardening_

  - [ ] 12.4 Add request logging
    - Log all admin actions with timestamp, user, action
    - _Requirements: Security hardening_

- [ ] 13. Final checkpoint - Ensure all tests pass
  - Run complete test suite
  - Verify security measures
  - Check error handling
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- All database queries must use parameterized queries to prevent SQL injection
- All admin routes must be protected with verifyToken and requireAdmin middleware
