# Implementation Plan: Admin Frontend

## Overview

This implementation plan breaks down the admin frontend into discrete, manageable tasks. Each task builds on previous work, starting with shadcn/ui setup and core components, then implementing each admin section, and finally integrating everything together. The implementation uses React with shadcn/ui components and Tailwind CSS for styling.

## Tasks

- [x] 1. Set up shadcn/ui and project configuration
  - Install shadcn/ui and Tailwind CSS dependencies
  - Configure Tailwind CSS in the project
  - Install required shadcn components (Button, Input, Dialog, Table, Pagination, Badge, Card, Select, Toast, Toaster)
  - Create admin components directory structure
  - Create adminService.js for API calls
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [x] 2. Implement AdminSidebar and AdminTopbar
  - [x] 2.1 Create AdminSidebar component with navigation
    - Implement fixed sidebar with dark background
    - Add brand section with logo and admin tag
    - Add admin user info display
    - Add navigation items with active state using shadcn Button
    - Add logout button
    - Style with Tailwind CSS to match existing theme
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [ ]* 2.2 Write property test for sidebar navigation state
    - **Property 1: Navigation state consistency**
    - **Validates: Requirements 8.4**

  - [x] 2.3 Create AdminTopbar component
    - Implement sticky topbar with title and date
    - Add context-dependent action buttons using shadcn Button
    - Style with Tailwind CSS
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [x] 3. Implement UserManagement component
  - [x] 3.1 Create UserManagement component with shadcn Table
    - Fetch users from `/admin/users` endpoint
    - Display paginated user list using shadcn Table with columns: Name, Email, Role, Joined, Status, Actions
    - Implement activate/deactivate buttons using shadcn Button
    - Use shadcn Badge for role and status indicators
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ]* 3.2 Write property test for user list consistency
    - **Property 1: User list consistency**
    - **Validates: Requirements 2.1, 2.2**

  - [x] 3.3 Implement user detail modal using shadcn Dialog
    - Create modal for viewing full user information
    - Add activate/deactivate actions in modal using shadcn Button
    - _Requirements: 2.4, 2.5, 2.6_

  - [ ]* 3.4 Write property test for user action persistence
    - **Property 2: User action persistence**
    - **Validates: Requirements 2.5, 2.6, 2.7**

  - [x] 3.5 Add search and filter to user list
    - Implement role filter using shadcn Select
    - Implement search by name/email using shadcn Input
    - _Requirements: 2.1, 2.2_

- [x] 4. Implement ProviderManagement component
  - [x] 4.1 Create ProviderManagement component with shadcn Table
    - Fetch providers from `/admin/users?role=provider` endpoint
    - Display provider list using shadcn Table with columns: Name, Email, Services, Rating, Verification Status, Actions
    - Implement verify button using shadcn Button
    - Use shadcn Badge for verification status
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ]* 4.2 Write property test for provider verification state
    - **Property 3: Provider verification state**
    - **Validates: Requirements 3.4, 3.5**

  - [x] 4.3 Implement provider detail modal using shadcn Dialog
    - Create modal for viewing provider information
    - Add verification action in modal using shadcn Button
    - _Requirements: 3.4, 3.5_

- [x] 5. Implement ServiceModeration component
  - [x] 5.1 Create ServiceModeration component with shadcn Table
    - Fetch services from `/admin/services` endpoint
    - Display paginated service list using shadcn Table with columns: Name, Provider, Category, Price, Status, Actions
    - Implement toggle service status button using shadcn Button
    - Use shadcn Badge for status indicators
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ]* 5.2 Write property test for service toggle idempotence
    - **Property 4: Service toggle idempotence**
    - **Validates: Requirements 4.4**

  - [x] 5.3 Implement service detail modal using shadcn Dialog
    - Create modal for viewing service information
    - Add toggle action in modal using shadcn Button
    - _Requirements: 4.4_

- [x] 6. Implement BookingMonitoring component
  - [x] 6.1 Create BookingMonitoring component with shadcn Table
    - Fetch bookings from `/admin/bookings` endpoint
    - Display paginated booking list using shadcn Table with columns: ID, Client, Provider, Service, Date, Status, Actions
    - Implement status filter using shadcn Select (pending, confirmed, completed, cancelled)
    - Use shadcn Badge for status indicators
    - _Requirements: 5.1, 5.2, 5.3, 5.5_

  - [ ]* 6.2 Write property test for booking filter accuracy
    - **Property 5: Booking filter accuracy**
    - **Validates: Requirements 5.5**

  - [x] 6.3 Implement booking detail modal using shadcn Dialog
    - Create modal for viewing booking information
    - _Requirements: 5.4_

- [-] 7. Implement ReviewModeration component
  - [ ] 7.1 Create ReviewModeration component with shadcn Table
    - Fetch reviews from `/admin/reviews` endpoint
    - Display paginated review list using shadcn Table with columns: Reviewer, Provider, Rating, Comment, Date, Actions
    - Implement delete button using shadcn Button
    - Implement rating filter using shadcn Select
    - _Requirements: 6.1, 6.2, 6.3_

  - [ ]* 7.2 Write property test for review deletion finality
    - **Property 6: Review deletion finality**
    - **Validates: Requirements 6.4, 6.5**

  - [ ] 7.3 Implement review detail modal using shadcn Dialog
    - Create modal for viewing review information
    - Add delete action in modal using shadcn Button
    - _Requirements: 6.4_

- [x] 8. Implement CategoryManagement component
  - [x] 8.1 Create CategoryManagement component with shadcn Card
    - Fetch categories from `/admin/categories` endpoint
    - Display category list using shadcn Card with columns: Name, Description, Actions
    - Implement create, edit, and delete buttons using shadcn Button
    - _Requirements: 7.1, 7.2, 7.3_

  - [ ]* 8.2 Write property test for category CRUD round trip
    - **Property 7: Category CRUD round trip**
    - **Validates: Requirements 7.4, 7.5, 7.6**

  - [x] 8.3 Implement category form modal using shadcn Dialog
    - Create modal for creating and editing categories
    - Add form validation using shadcn Input
    - _Requirements: 7.4, 7.5_

  - [ ]* 8.4 Write property test for modal form validation
    - **Property 9: Modal form validation**
    - **Validates: Requirements 7.4, 7.5**

- [x] 9. Implement pagination and filtering utilities
  - [x] 9.1 Enhance AdminPagination component using shadcn Pagination
    - Implement page navigation logic
    - Add items per page selector using shadcn Select
    - _Requirements: 2.1, 4.1, 5.1, 6.1_

  - [ ]* 9.2 Write property test for pagination bounds
    - **Property 8: Pagination bounds**
    - **Validates: Requirements 2.1, 4.1, 5.1, 6.1**

- [x] 10. Implement notification system using shadcn Toast
  - [x] 10.1 Set up Toaster component
    - Add shadcn Toaster to AdminDashboardPage
    - Implement toast notifications with auto-dismiss
    - Add success, error, warning, info types
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ]* 10.2 Write property test for notification lifecycle
    - **Property 10: Notification lifecycle**
    - **Validates: Requirements 9.1, 9.2**

- [x] 11. Integrate all components into AdminDashboardPage
  - [x] 11.1 Update AdminDashboardPage to use new components
    - Import all new components
    - Implement section switching logic
    - Wire up navigation
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [x] 11.2 Implement dashboard metrics display
    - Fetch metrics from `/admin/dashboard` endpoint
    - Display stats cards with key metrics
    - _Requirements: 1.1, 1.2_

  - [x] 11.3 Implement recent users table on dashboard
    - Display recent users with status indicators
    - _Requirements: 1.3, 1.4, 1.5_

- [x] 12. Add responsive design and mobile support
  - [x] 12.1 Implement responsive layout with Tailwind CSS
    - Add responsive breakpoints for tablet screens
    - Add responsive breakpoints for mobile screens
    - Implement mobile menu for sidebar
    - Use Tailwind's responsive utilities (sm:, md:, lg:, xl:)
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 13. Add error handling and edge cases
  - [x] 13.1 Implement error handling for all API calls
    - Add error notifications using shadcn Toast for failed requests
    - Implement retry logic
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [x] 13.2 Implement empty states for all sections
    - Add empty state messages for each section using shadcn Card
    - _Requirements: 9.4_

- [x] 14. Checkpoint - Ensure all tests pass
  - Ensure all unit tests pass
  - Ensure all property tests pass
  - Verify no console errors
  - Ask the user if questions arise

- [x] 15. Final integration and polish
  - [x] 15.1 Test all workflows end-to-end
    - Test user management workflow
    - Test provider verification workflow
    - Test service moderation workflow
    - Test booking monitoring workflow
    - Test review moderation workflow
    - Test category management workflow
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1_

  - [x] 15.2 Verify styling consistency with Tailwind CSS
    - Ensure all components use shadcn styling
    - Verify dark sidebar and professional styling
    - Test responsive design across breakpoints
    - _Requirements: 1.5, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [x] 15.3 Performance optimization
    - Optimize re-renders with React.memo where appropriate
    - Implement lazy loading for large lists
    - _Requirements: 1.1, 2.1, 4.1, 5.1, 6.1_

- [x] 16. Final checkpoint - All features complete
  - Ensure all requirements are met
  - Verify all tests pass
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- All components use shadcn/ui for consistent, accessible UI
- Styling uses Tailwind CSS for responsive design
- API calls use the adminService.js utility
