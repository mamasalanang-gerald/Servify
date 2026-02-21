# Admin Backend System - Requirements

## Introduction

The Admin Backend System provides a secure, role-protected module for marketplace administrators to manage users, categories, services, bookings, reviews, and view dashboard metrics. This system enforces strict access control and maintains audit trails for all administrative actions.

## Glossary

- **Admin**: User with administrative privileges (role = 'admin')
- **Provider**: Service provider user (role = 'provider')
- **Client**: Regular user (role = 'client')
- **JWT**: JSON Web Token for stateless authentication
- **Soft Delete**: Marking records as inactive rather than removing them
- **Parameterized Query**: SQL query with placeholders to prevent injection
- **Role-Based Access Control (RBAC)**: Permission system based on user roles

## Requirements

### Requirement 1: Admin Authentication & Authorization

**User Story:** As an admin, I want secure access to admin endpoints, so that only authorized administrators can manage the platform.

#### Acceptance Criteria

1. WHEN an admin sends a request with a valid JWT token, THE System SHALL verify the token and attach user data to the request
2. WHEN a non-admin user attempts to access admin endpoints, THE System SHALL return 403 Forbidden
3. WHEN a request lacks a JWT token, THE System SHALL return 401 Unauthorized
4. WHEN an admin token expires, THE System SHALL return 403 Forbidden and require re-authentication
5. WHEN an admin attempts to deactivate their own account, THE System SHALL prevent the action and return 400 Bad Request

### Requirement 2: User Management

**User Story:** As an admin, I want to view and manage user accounts, so that I can maintain platform integrity and verify providers.

#### Acceptance Criteria

1. WHEN an admin requests all users, THE System SHALL return paginated list with id, full_name, email, user_type, is_verified, is_active, created_at
2. WHEN an admin filters users by role, THE System SHALL return only users matching that role
3. WHEN an admin requests a specific user by ID, THE System SHALL return complete user details excluding password_hash
4. WHEN an admin activates a user account, THE System SHALL update is_active to TRUE and set updated_at to NOW()
5. WHEN an admin deactivates a user account, THE System SHALL update is_active to FALSE and set updated_at to NOW()
6. WHEN an admin verifies a provider, THE System SHALL update is_verified to TRUE only if user_type is 'provider'
7. WHEN an admin attempts to verify a non-provider user, THE System SHALL return 400 Bad Request

### Requirement 3: Category Management

**User Story:** As an admin, I want full control over service categories, so that I can organize the marketplace effectively.

#### Acceptance Criteria

1. WHEN an admin requests all categories, THE System SHALL return list with id, name, description, created_at
2. WHEN an admin creates a category with unique name, THE System SHALL insert it and return 201 Created
3. WHEN an admin attempts to create a category with duplicate name, THE System SHALL return 409 Conflict
4. WHEN an admin updates a category, THE System SHALL modify name and description and set updated_at to NOW()
5. WHEN an admin deletes a category not used by any service, THE System SHALL remove it and return 200 OK
6. WHEN an admin attempts to delete a category used by services, THE System SHALL return 400 Bad Request with message indicating usage

### Requirement 4: Service Moderation

**User Story:** As an admin, I want to moderate services on the platform, so that I can maintain quality and remove inappropriate listings.

#### Acceptance Criteria

1. WHEN an admin requests all services, THE System SHALL return paginated list with service details including provider name
2. WHEN an admin filters services by provider_id, THE System SHALL return only services from that provider
3. WHEN an admin filters services by category_id, THE System SHALL return only services in that category
4. WHEN an admin searches services by title, THE System SHALL return matching services using case-insensitive search
5. WHEN an admin toggles a service active status, THE System SHALL flip is_active and set updated_at to NOW()
6. WHEN an admin requests a specific service, THE System SHALL return complete service details with provider information

### Requirement 5: Booking Monitoring

**User Story:** As an admin, I want to monitor all bookings on the platform, so that I can track transactions and resolve disputes.

#### Acceptance Criteria

1. WHEN an admin requests all bookings, THE System SHALL return paginated list with booking details including client and provider names
2. WHEN an admin filters bookings by status, THE System SHALL return only bookings with that status
3. WHEN an admin filters bookings by date range, THE System SHALL return bookings within the specified dates
4. WHEN an admin requests a specific booking, THE System SHALL return complete booking details with all related information
5. WHEN an admin views bookings, THE System SHALL include service title, client name, provider name, and booking status

### Requirement 6: Review Moderation

**User Story:** As an admin, I want to moderate reviews, so that I can remove inappropriate or fraudulent reviews.

#### Acceptance Criteria

1. WHEN an admin requests all reviews, THE System SHALL return paginated list with review details including provider and client names
2. WHEN an admin filters reviews by rating, THE System SHALL return only reviews with that rating
3. WHEN an admin filters reviews by provider_id, THE System SHALL return only reviews for that provider
4. WHEN an admin deletes a review, THE System SHALL remove it from the database and return 200 OK
5. WHEN an admin requests a specific review, THE System SHALL return complete review details with related user information

### Requirement 7: Dashboard Metrics

**User Story:** As an admin, I want to view key platform metrics, so that I can monitor platform health and growth.

#### Acceptance Criteria

1. WHEN an admin requests dashboard metrics, THE System SHALL return total user count
2. WHEN an admin requests dashboard metrics, THE System SHALL return total provider count
3. WHEN an admin requests dashboard metrics, THE System SHALL return active service count
4. WHEN an admin requests dashboard metrics, THE System SHALL return pending booking count
5. WHEN an admin requests dashboard metrics, THE System SHALL return completed booking count
6. WHEN an admin requests dashboard metrics, THE System SHALL return total transaction amount (if available)
7. WHEN an admin requests dashboard metrics, THE System SHALL return all metrics in single JSON response

### Requirement 8: Pagination & Filtering

**User Story:** As an admin, I want to efficiently browse large datasets, so that I can manage platform data without performance issues.

#### Acceptance Criteria

1. WHEN an admin requests data with page and limit parameters, THE System SHALL return paginated results
2. WHEN an admin requests page 1 with limit 10, THE System SHALL return first 10 records
3. WHEN an admin requests page 2 with limit 10, THE System SHALL return records 11-20
4. WHEN an admin omits pagination parameters, THE System SHALL use default page=1 and limit=10
5. WHEN an admin requests invalid page number, THE System SHALL return empty array or 400 Bad Request

### Requirement 9: Input Validation

**User Story:** As a developer, I want validated inputs, so that the system rejects malformed requests early.

#### Acceptance Criteria

1. WHEN an admin sends invalid UUID in path parameter, THE System SHALL return 400 Bad Request
2. WHEN an admin sends non-boolean value for activation toggle, THE System SHALL return 400 Bad Request
3. WHEN an admin sends empty category name, THE System SHALL return 400 Bad Request
4. WHEN an admin sends invalid role filter, THE System SHALL return 400 Bad Request
5. WHEN an admin sends invalid status filter, THE System SHALL return 400 Bad Request

### Requirement 10: Error Handling

**User Story:** As an API consumer, I want consistent error responses, so that I can handle errors predictably.

#### Acceptance Criteria

1. WHEN an error occurs, THE System SHALL return consistent error format with message and error code
2. WHEN a resource is not found, THE System SHALL return 404 Not Found
3. WHEN a validation fails, THE System SHALL return 400 Bad Request with field-level errors
4. WHEN an unauthorized action occurs, THE System SHALL return 403 Forbidden
5. WHEN a server error occurs, THE System SHALL return 500 Internal Server Error with generic message
