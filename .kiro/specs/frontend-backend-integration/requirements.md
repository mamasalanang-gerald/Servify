# Requirements Document

## Introduction

This document outlines the requirements for integrating the Servify frontend (React/Vite) with the backend API (Express/Node.js) to enable full authentication, authorization, and feature access across all user roles (user, provider, admin).

## Glossary

- **Frontend**: The React-based client application running on Vite dev server (port 5173)
- **Backend**: The Express.js API server (port 3000)
- **API_Client**: A centralized service for making HTTP requests to the Backend
- **Auth_System**: The authentication and authorization mechanism using JWT tokens
- **User_Role**: One of three types: 'user' (customer), 'provider' (service provider), or 'admin' (administrator)
- **Access_Token**: Short-lived JWT token (15 minutes) for API authentication
- **Refresh_Token**: Long-lived JWT token (7 days) stored in httpOnly cookie for token renewal
- **Protected_Route**: A frontend route that requires authentication to access

## Requirements

### Requirement 1: API Client Service

**User Story:** As a developer, I want a centralized API client service, so that all HTTP requests are consistent and include proper authentication headers.

#### Acceptance Criteria

1. THE API_Client SHALL provide methods for GET, POST, PUT, PATCH, and DELETE requests
2. WHEN an Access_Token exists, THE API_Client SHALL include it in the Authorization header as "Bearer {token}"
3. WHEN a request receives a 401 response, THE API_Client SHALL attempt to refresh the Access_Token using the Refresh_Token
4. IF token refresh succeeds, THE API_Client SHALL retry the original request with the new Access_Token
5. IF token refresh fails, THE API_Client SHALL clear authentication state and redirect to login
6. THE API_Client SHALL use the proxy configuration to route requests to the Backend

### Requirement 2: Authentication Flow

**User Story:** As a user, I want to register and login to the application, so that I can access personalized features.

#### Acceptance Criteria

1. WHEN a user submits the registration form with valid data, THE Frontend SHALL send a POST request to /api/v1/auth/register
2. WHEN registration succeeds, THE Frontend SHALL redirect the user to the login page
3. WHEN a user submits the login form with valid credentials, THE Frontend SHALL send a POST request to /api/v1/auth/login
4. WHEN login succeeds, THE Frontend SHALL store the Access_Token and user information in localStorage
5. WHEN login succeeds, THE Frontend SHALL redirect the user based on their User_Role (user → /dashboard, provider → /provider, admin → /admin)
6. WHEN a user clicks logout, THE Frontend SHALL send a POST request to /api/v1/auth/logout and clear all authentication state

### Requirement 3: Token Refresh Mechanism

**User Story:** As a logged-in user, I want my session to remain active without frequent re-logins, so that I have a seamless experience.

#### Acceptance Criteria

1. WHEN the Access_Token expires (15 minutes), THE Frontend SHALL automatically request a new token from /api/v1/auth/refresh
2. WHEN the refresh request succeeds, THE Frontend SHALL update the stored Access_Token
3. WHEN the refresh request fails, THE Frontend SHALL clear authentication state and redirect to login
4. THE Frontend SHALL include credentials (cookies) in all refresh requests

### Requirement 4: Protected Routes

**User Story:** As a system, I want to protect certain routes from unauthorized access, so that only authenticated users can access them.

#### Acceptance Criteria

1. WHEN an unauthenticated user attempts to access a Protected_Route, THE Frontend SHALL redirect them to /login
2. WHEN an authenticated user accesses a Protected_Route, THE Frontend SHALL render the requested component
3. THE Frontend SHALL protect the following routes: /dashboard, /provider, /admin, /services/:id
4. WHEN a user with role 'user' attempts to access /provider or /admin, THE Frontend SHALL redirect them to /dashboard
5. WHEN a user with role 'provider' attempts to access /admin, THE Frontend SHALL redirect them to /provider
6. WHEN a user with role 'admin' accesses any route, THE Frontend SHALL allow access

### Requirement 5: User Dashboard Integration

**User Story:** As a customer, I want to view my bookings and saved services, so that I can manage my service requests.

#### Acceptance Criteria

1. WHEN a user accesses /dashboard, THE Frontend SHALL fetch user profile data from /api/v1/users/profile
2. WHEN a user views their bookings, THE Frontend SHALL fetch bookings from /api/v1/bookings
3. WHEN a user views saved services, THE Frontend SHALL fetch saved services from /api/v1/users/saved-services
4. WHEN a user updates their profile, THE Frontend SHALL send a PUT request to /api/v1/users/profile
5. THE Frontend SHALL display appropriate error messages when API requests fail

### Requirement 6: Provider Dashboard Integration

**User Story:** As a service provider, I want to manage my services and bookings, so that I can run my business effectively.

#### Acceptance Criteria

1. WHEN a provider accesses /provider, THE Frontend SHALL fetch provider statistics from /api/v1/users/provider/stats
2. WHEN a provider views their services, THE Frontend SHALL fetch services from /api/v1/services/provider
3. WHEN a provider creates a new service, THE Frontend SHALL send a POST request to /api/v1/services
4. WHEN a provider updates a service, THE Frontend SHALL send a PUT request to /api/v1/services/:id
5. WHEN a provider views bookings, THE Frontend SHALL fetch bookings from /api/v1/bookings/provider
6. WHEN a provider updates booking status, THE Frontend SHALL send a PATCH request to /api/v1/bookings/:id/status

### Requirement 7: Admin Dashboard Integration

**User Story:** As an administrator, I want to manage users, services, and content, so that I can maintain platform quality.

#### Acceptance Criteria

1. WHEN an admin accesses /admin, THE Frontend SHALL fetch admin statistics from /api/v1/admin/stats
2. WHEN an admin views users, THE Frontend SHALL fetch users from /api/v1/admin/users
3. WHEN an admin moderates services, THE Frontend SHALL fetch pending services from /api/v1/admin/services/pending
4. WHEN an admin approves a service, THE Frontend SHALL send a PATCH request to /api/v1/admin/services/:id/approve
5. WHEN an admin manages categories, THE Frontend SHALL fetch categories from /api/v1/categories
6. WHEN an admin creates a category, THE Frontend SHALL send a POST request to /api/v1/categories

### Requirement 8: Services Browsing Integration

**User Story:** As a user, I want to browse and search for services, so that I can find providers that meet my needs.

#### Acceptance Criteria

1. WHEN a user accesses /services, THE Frontend SHALL fetch services from /api/v1/services with pagination
2. WHEN a user applies filters, THE Frontend SHALL send query parameters (category, location, price_min, price_max) to /api/v1/services
3. WHEN a user searches, THE Frontend SHALL send the search query parameter to /api/v1/services
4. WHEN a user views service details, THE Frontend SHALL fetch service data from /api/v1/services/:id
5. WHEN a user books a service, THE Frontend SHALL send a POST request to /api/v1/bookings

### Requirement 9: Error Handling

**User Story:** As a user, I want to see clear error messages when something goes wrong, so that I understand what happened and what to do next.

#### Acceptance Criteria

1. WHEN an API request fails with a network error, THE Frontend SHALL display "Unable to connect to server. Please check your connection."
2. WHEN an API request fails with a 400 error, THE Frontend SHALL display the error message from the response body
3. WHEN an API request fails with a 401 error, THE Frontend SHALL attempt token refresh before showing an error
4. WHEN an API request fails with a 403 error, THE Frontend SHALL display "You don't have permission to perform this action."
5. WHEN an API request fails with a 500 error, THE Frontend SHALL display "Server error. Please try again later."

### Requirement 10: Loading States

**User Story:** As a user, I want to see loading indicators during data fetches, so that I know the application is working.

#### Acceptance Criteria

1. WHEN the Frontend initiates an API request, THE Frontend SHALL display a loading indicator
2. WHEN the API request completes, THE Frontend SHALL hide the loading indicator
3. WHEN the API request fails, THE Frontend SHALL hide the loading indicator and display an error message
4. THE Frontend SHALL prevent duplicate requests while a request is in progress
5. THE Frontend SHALL provide skeleton loaders for list views during initial data fetch
