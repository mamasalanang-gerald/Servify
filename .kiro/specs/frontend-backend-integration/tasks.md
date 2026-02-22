# Implementation Plan: Frontend-Backend Integration

## Overview

This plan outlines the implementation steps for integrating the Servify React frontend with the Express.js backend API. The implementation follows a bottom-up approach, starting with core infrastructure (API client, auth service) and building up to feature-specific integrations.

## Tasks

- [x] 1. Create Core API Client Service
  - Create `client/src/services/api.js` with APIClient class
  - Implement request method with automatic token refresh logic
  - Implement HTTP method helpers (get, post, put, patch, delete)
  - Implement token management methods (getAccessToken, setAccessToken, refreshToken)
  - Implement handleAuthFailure method for clearing state and redirecting
  - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6_

- [ ]* 1.1 Write property test for API client token inclusion
  - **Property 1: Authentication Token Inclusion**
  - **Validates: Requirements 1.2**

- [ ]* 1.2 Write property test for token refresh on 401
  - **Property 2: Token Refresh on 401**
  - **Validates: Requirements 1.3, 3.1, 9.3**

- [ ]* 1.3 Write property test for successful token refresh retry
  - **Property 3: Successful Token Refresh Retry**
  - **Validates: Requirements 1.4, 3.2**

- [ ]* 1.4 Write property test for authentication failure redirect
  - **Property 4: Authentication Failure Redirect**
  - **Validates: Requirements 1.5, 3.3**

- [x] 2. Create Authentication Service
  - Create `client/src/services/authService.js`
  - Implement register method with error handling
  - Implement login method with token and user data storage
  - Implement logout method with state clearing
  - Implement getUser and isAuthenticated helper methods
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [ ]* 2.1 Write property test for login success storage
  - **Property 6: Login Success Storage**
  - **Validates: Requirements 2.4**

- [ ]* 2.2 Write property test for role-based login redirect
  - **Property 7: Role-Based Login Redirect**
  - **Validates: Requirements 2.5**

- [ ]* 2.3 Write property test for logout state clearing
  - **Property 8: Logout State Clearing**
  - **Validates: Requirements 2.6**

- [x] 3. Create Protected Route Component
  - Create `client/src/components/ProtectedRoute.jsx`
  - Implement authentication check with redirect to /login
  - Implement role-based access control with role hierarchy
  - Implement role-specific redirect logic
  - _Requirements: 4.1, 4.2, 4.4, 4.5, 4.6_

- [ ]* 3.1 Write property test for unauthenticated route protection
  - **Property 9: Unauthenticated Route Protection**
  - **Validates: Requirements 4.1**

- [ ]* 3.2 Write property test for authenticated route access
  - **Property 10: Authenticated Route Access**
  - **Validates: Requirements 4.2**

- [ ]* 3.3 Write property test for user role route restriction
  - **Property 11: User Role Route Restriction**
  - **Validates: Requirements 4.4**

- [ ]* 3.4 Write property test for provider role route restriction
  - **Property 12: Provider Role Route Restriction**
  - **Validates: Requirements 4.5**

- [ ]* 3.5 Write property test for admin unrestricted access
  - **Property 13: Admin Unrestricted Access**
  - **Validates: Requirements 4.6**

- [ ] 4. Checkpoint - Test Core Infrastructure
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Create Service-Specific API Modules
  - [x] 5.1 Create User Service (`client/src/services/userService.js`)
    - Implement getProfile, updateProfile, promoteToProvider methods
    - _Requirements: 5.1, 5.4_

  - [x] 5.2 Create Service Service (`client/src/services/serviceService.js`)
    - Implement getServices, getServiceById, createService, updateService, deleteService methods
    - _Requirements: 6.2, 6.3, 6.4, 8.1, 8.2, 8.3, 8.4_

  - [x] 5.3 Create Booking Service (`client/src/services/bookingService.js`)
    - Implement getAllBookings, createBooking, getClientBookings, getProviderBookings, updateBookingStatus, deleteBooking methods
    - _Requirements: 5.2, 6.5, 6.6, 8.5_

  - [x] 5.4 Create Category Service (`client/src/services/categoryService.js`)
    - Implement getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory methods
    - _Requirements: 7.5, 7.6_

  - [x] 5.5 Update Admin Service (`client/src/services/adminService.js`)
    - Update to use new API client
    - Implement getStats, getUsers, updateUserStatus, getPendingServices, approveService, rejectService, getReviews, moderateReview methods
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ]* 5.6 Write unit tests for service modules
  - Test each service method with mock responses
  - Test error handling in service methods
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 6. Update Login Component Integration
  - Update `client/src/components/LoginBox.jsx` to use authService
  - Replace direct fetch calls with authService.login
  - Update error handling to use consistent error messages
  - Update success flow to use authService for storage and redirect
  - _Requirements: 2.3, 2.4, 2.5_

- [ ]* 6.1 Write property test for error message display
  - **Property 15: Validation Error Message Display**
  - **Property 16: Forbidden Error Message Display**
  - **Property 17: Server Error Message Display**
  - **Validates: Requirements 9.2, 9.4, 9.5**

- [x] 7. Update Register Component Integration
  - Update `client/src/components/RegisterBox.jsx` to use authService
  - Replace simulated API call with authService.register
  - Update error handling to display API error messages
  - Update success flow to redirect to login page
  - _Requirements: 2.1, 2.2_

- [ ]* 7.1 Write property test for registration success redirect
  - **Property 5: Registration Success Redirect**
  - **Validates: Requirements 2.2**

- [x] 8. Update Logout Component Integration
  - Update `client/src/components/LogoutButton.jsx` to use authService
  - Replace direct localStorage clearing with authService.logout
  - Add API call to backend logout endpoint
  - _Requirements: 2.6_

- [x] 9. Update Route Configuration
  - Update `client/src/App.jsx` to use ProtectedRoute component
  - Wrap /dashboard, /services, /provider, /admin routes with ProtectedRoute
  - Configure role requirements for each protected route
  - Update catch-all route to use authService for redirect logic
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ] 10. Checkpoint - Test Authentication Flow
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Integrate User Dashboard Components
  - [x] 11.1 Update DashboardStats component
    - Use userService.getProfile to fetch user data
    - Add loading state management
    - Add error handling with appropriate messages
    - _Requirements: 5.1, 10.1, 10.2, 10.3_

  - [x] 11.2 Update BookingList component
    - Use bookingService.getClientBookings to fetch bookings
    - Add loading state with skeleton loaders
    - Add error handling
    - _Requirements: 5.2, 10.1, 10.2, 10.3_

  - [x] 11.3 Update SavedServices component
    - Use serviceService.getServices to fetch saved services
    - Add loading state management
    - Add error handling
    - _Requirements: 5.3, 10.1, 10.2, 10.3_

  - [x] 11.4 Update ProfileSettings component
    - Use userService.getProfile to fetch current profile
    - Use userService.updateProfile to save changes
    - Add loading state for save operation
    - Add error handling with validation messages
    - _Requirements: 5.1, 5.4, 10.1, 10.2, 10.3_

- [ ]* 11.5 Write property test for loading state management
  - **Property 18: Loading State Management**
  - **Validates: Requirements 10.1, 10.2, 10.3**

- [-] 12. Integrate Provider Dashboard Components
  - [x] 12.1 Update ProviderOverview component
    - Use serviceService.getServices with provider filter
    - Use bookingService.getProviderBookings for statistics
    - Add loading state management
    - Add error handling
    - _Requirements: 6.1, 6.2, 6.5, 10.1, 10.2, 10.3_

  - [x] 12.2 Update ProviderServices component
    - Use serviceService.getServices to fetch provider services
    - Use serviceService.createService for new services
    - Use serviceService.updateService for edits
    - Use serviceService.deleteService for deletions
    - Add loading states for all operations
    - Add error handling
    - _Requirements: 6.2, 6.3, 6.4, 10.1, 10.2, 10.3_

  - [x] 12.3 Update ProviderBookings component
    - Use bookingService.getProviderBookings to fetch bookings
    - Use bookingService.updateBookingStatus to change status
    - Add loading state management
    - Add error handling
    - _Requirements: 6.5, 6.6, 10.1, 10.2, 10.3_

  - [x] 12.4 Update ProviderReviews component
    - Use API client to fetch provider reviews
    - Add loading state management
    - Add error handling
    - _Requirements: 10.1, 10.2, 10.3_

  - [x] 12.5 Update ProviderEarnings component
    - Use API client to fetch earnings data
    - Add loading state management
    - Add error handling
    - _Requirements: 10.1, 10.2, 10.3_

- [x] 13. Integrate Admin Dashboard Components
  - [x] 13.1 Update AdminDashboardPage component
    - Use adminService.getStats to fetch statistics
    - Add loading state management
    - Add error handling
    - _Requirements: 7.1, 10.1, 10.2, 10.3_

  - [x] 13.2 Update UserManagement component
    - Use adminService.getUsers to fetch users
    - Use adminService.updateUserStatus to change user status
    - Add loading state management
    - Add error handling
    - _Requirements: 7.2, 10.1, 10.2, 10.3_

  - [x] 13.3 Update ServiceModeration component
    - Use adminService.getPendingServices to fetch pending services
    - Use adminService.approveService to approve services
    - Use adminService.rejectService to reject services
    - Add loading state management
    - Add error handling
    - _Requirements: 7.3, 7.4, 10.1, 10.2, 10.3_

  - [x] 13.4 Update CategoryManagement component
    - Use categoryService.getAllCategories to fetch categories
    - Use categoryService.createCategory to create categories
    - Use categoryService.updateCategory to update categories
    - Use categoryService.deleteCategory to delete categories
    - Add loading state management
    - Add error handling
    - _Requirements: 7.5, 7.6, 10.1, 10.2, 10.3_

  - [x] 13.5 Update ReviewModeration component
    - Use adminService.getReviews to fetch reviews
    - Use adminService.moderateReview to moderate reviews
    - Add loading state management
    - Add error handling
    - _Requirements: 10.1, 10.2, 10.3_

- [-] 14. Integrate Services Browsing Components
  - [x] 14.1 Update ServicesPage component
    - Use serviceService.getServices with pagination
    - Add loading state with skeleton loaders
    - Add error handling
    - _Requirements: 8.1, 10.1, 10.2, 10.3_

  - [x] 14.2 Update ServicesFilter component
    - Build query parameters from filter state
    - Pass parameters to ServicesPage for API call
    - _Requirements: 8.2, 8.3_

  - [x] 14.3 Update ServiceDetailPage component
    - Use serviceService.getServiceById to fetch service details
    - Use bookingService.createBooking for booking creation
    - Add loading state management
    - Add error handling
    - _Requirements: 8.4, 8.5, 10.1, 10.2, 10.3_

- [ ]* 14.4 Write property test for network error message display
  - **Property 14: Network Error Message Display**
  - **Validates: Requirements 9.1**

- [x] 15. Implement Duplicate Request Prevention
  - Add request tracking to API client
  - Implement request deduplication logic
  - Add cleanup on request completion
  - _Requirements: 10.4_

- [ ]* 15.1 Write property test for duplicate request prevention
  - **Property 19: Duplicate Request Prevention**
  - **Validates: Requirements 10.4**

- [x] 16. Update Navbar Component
  - Update authentication state checks to use authService
  - Update user display to use authService.getUser
  - Update logout button to use authService.logout
  - _Requirements: 2.6_

- [ ] 17. Final Checkpoint - Integration Testing
  - Test complete authentication flow (register → login → access features → logout)
  - Test role-based access control (user, provider, admin)
  - Test token refresh on expired token
  - Test error handling for all error types
  - Test loading states across all components
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The implementation follows a bottom-up approach: infrastructure → services → components
- All API calls should use the centralized API client for consistency
- All components should implement proper loading and error states
