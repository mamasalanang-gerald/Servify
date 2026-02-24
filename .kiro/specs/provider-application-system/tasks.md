# Implementation Plan: Provider Application System

## Overview

This implementation plan breaks down the Provider Application System into discrete, incremental tasks. Each task builds on previous work and includes testing to validate functionality. The plan follows a bottom-up approach: database → backend API → frontend UI → integration.

## Tasks

- [x] 1. Create database schema and migrations
  - Create provider_applications table with all required fields
  - Add indexes for performance (user_id, status, submitted_at)
  - Add constraints (unique pending per user, rejection reason required)
  - Test foreign key constraints work correctly
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 1.1 Write property test for database constraints
  - **Property 21: Foreign Key Integrity**
  - **Validates: Requirements 8.2**

- [x] 1.2 Write property test for user deletion prevention
  - **Property 22: User Deletion Prevention**
  - **Validates: Requirements 8.3**

- [x] 2. Implement application data model and validation
  - [x] 2.1 Create applicationModel.js with CRUD operations
    - Implement createApplication(userId, applicationData)
    - Implement getApplicationById(id)
    - Implement getApplicationByUserId(userId)
    - Implement updateApplicationStatus(id, status, reviewerId, reason)
    - Implement getAllApplications(filters, pagination)
    - _Requirements: 1.2, 4.1, 6.1_

- [x] 2.2 Write property test for application creation
  - **Property 1: Valid Application Creation**
  - **Validates: Requirements 1.2, 2.7**

- [x] 2.3 Create validation utilities
  - Implement validateApplicationData(data) function
  - Validate required fields presence
  - Validate bio minimum length (50 chars)
  - Validate years of experience (non-negative number)
  - Validate phone number format
  - Validate service address length
  - _Requirements: 1.3, 2.1, 2.2, 2.3, 2.5_


- [x] 2.4 Write property tests for validation
  - **Property 2: Required Field Validation**
  - **Property 3: Bio Length Validation**
  - **Property 4: Experience Validation**
  - **Property 5: Phone Number Format Validation**
  - **Validates: Requirements 1.3, 2.1, 2.2, 2.3, 2.5**

- [x] 3. Implement application service layer
  - [x] 3.1 Create applicationService.js
    - Implement submitApplication(userId, applicationData)
    - Check for existing pending application
    - Validate user is a client (not provider/admin)
    - Create application with pending status
    - Return application details
    - _Requirements: 1.2, 1.4, 8.5_

- [x] 3.2 Write property test for duplicate prevention
  - **Property 6: Duplicate Application Prevention**
  - **Validates: Requirements 1.4**

- [x] 3.3 Write property test for provider restriction
  - **Property 7: Provider Restriction**
  - **Validates: Requirements 8.5**

- [x] 3.4 Implement getMyApplicationStatus(userId)
  - Fetch user's most recent application
  - Calculate canReapply based on rejection date
  - Return status with reapply eligibility
  - _Requirements: 3.1, 3.4, 3.5_

- [x] 3.5 Write property test for reapplication restriction
  - **Property 11: Reapplication Time Restriction**
  - **Validates: Requirements 3.5**

- [x] 3.6 Implement approveApplication(applicationId, adminId)
  - Begin database transaction
  - Update application status to 'approved'
  - Update user_type to 'provider'
  - Update user profile (bio, experience, address)
  - Commit transaction or rollback on error
  - _Requirements: 4.3, 4.5, 4.6, 8.4_

- [x] 3.7 Write property tests for approval process
  - **Property 14: Approval Status Update**
  - **Property 16: User Role Promotion on Approval**
  - **Property 17: Profile Update on Approval**
  - **Property 23: Approval Transaction Atomicity**
  - **Validates: Requirements 4.3, 4.5, 4.6, 8.4**

- [x] 3.8 Implement rejectApplication(applicationId, adminId, reason)
  - Validate rejection reason is provided
  - Update application status to 'rejected'
  - Store rejection reason and reviewer info
  - _Requirements: 4.4_

- [x] 3.9 Write property test for rejection
  - **Property 15: Rejection Reason Requirement**
  - **Validates: Requirements 4.4**

- [x] 4. Checkpoint - Ensure service layer tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement application API routes
  - [x] 5.1 Create applicationRoutes.js
    - POST /api/applications - Submit application
    - GET /api/applications/my-status - Get user's application status
    - _Requirements: 1.2, 3.1_

- [x] 5.2 Create applicationController.js
  - Implement submitApplication controller
  - Validate request body
  - Call service layer
  - Handle errors and return appropriate responses
  - _Requirements: 1.2, 1.3_

- [x] 5.3 Write property test for API validation
  - **Property 2: Required Field Validation** (API level)
  - **Validates: Requirements 1.3**

- [x] 5.4 Implement getMyStatus controller
  - Fetch application status for authenticated user
  - Return formatted response with reapply info
  - _Requirements: 3.1, 3.4, 3.5_

- [x] 5.5 Write property test for status accuracy
  - **Property 9: Status Display Accuracy**
  - **Property 10: Rejection Reason Display**
  - **Validates: Requirements 3.1, 3.4**

- [x] 6. Implement admin application management API
  - [x] 6.1 Create admin application routes
    - GET /api/admin/applications - List all applications
    - PATCH /api/admin/applications/:id/approve - Approve application
    - PATCH /api/admin/applications/:id/reject - Reject application
    - Add admin role middleware to all routes
    - _Requirements: 4.1, 4.3, 4.4_

- [x] 6.2 Implement admin controllers
  - Implement listApplications with filtering and search
  - Implement approveApplication controller
  - Implement rejectApplication controller
  - Include application counts in list response
  - _Requirements: 4.1, 6.3, 6.4, 6.5_

- [x] 6.3 Write property tests for admin operations
  - **Property 12: Admin Application Listing**
  - **Property 13: Application Detail Completeness**
  - **Property 18: Application Filtering**
  - **Property 19: Application Search**
  - **Property 20: Application Count Accuracy**
  - **Validates: Requirements 4.1, 4.2, 6.3, 6.4, 6.5**

- [x] 7. Checkpoint - Ensure backend API tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Update existing BecomeProviderPage with application process
  - [x] 8.1 Update BecomeProviderBox.jsx with full application form
    - Add all required fields (business name, bio, years of experience, service categories, phone, address)
    - Add field validation (client-side)
    - Implement form submission to new API endpoint
    - Display success/error messages
    - Show application status if already submitted
    - _Requirements: 1.1, 1.2, 1.3, 1.6_

- [x] 8.2 Create form validation utilities
  - Validate bio length (50+ chars)
  - Validate phone number format
  - Validate years of experience (non-negative)
  - Validate required fields
  - _Requirements: 1.3, 2.2, 2.3, 2.5_

- [x] 8.3 Integrate with category service
  - Fetch available categories for dropdown
  - Allow multi-select of categories
  - _Requirements: 2.4_

- [x] 9. Create application status tracking UI
  - [x] 9.1 Create ApplicationStatusCard.jsx
    - Display current application status
    - Show submission date
    - Show approval/rejection date if processed
    - Display rejection reason if rejected
    - Show reapply eligibility if rejected
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 9.2 Integrate status card into user dashboard
  - Add ApplicationStatusCard to Dashboardpage.jsx
  - Fetch application status on dashboard load
  - Display "Become a Provider" button if no application
  - Display status card if application exists
  - _Requirements: 7.1, 7.4_

- [x] 10. Create admin application management UI
  - [x] 10.1 Create ApplicationManagement.jsx component
    - Display list of applications in table format
    - Add status filter dropdown (all, pending, approved, rejected)
    - Add search input for name/email
    - Display application counts
    - Implement pagination
    - _Requirements: 4.1, 6.2, 6.3, 6.4, 6.5_

- [x] 10.2 Create ApplicationDetailModal.jsx
  - Display all application fields
  - Show applicant information
  - Add approve/reject buttons for pending applications
  - Show review information for processed applications
  - _Requirements: 4.2_

- [x] 10.3 Implement approval/rejection actions
  - Add approve button with confirmation dialog
  - Add reject button with reason input modal
  - Call admin API endpoints
  - Refresh application list after action
  - Display success/error notifications
  - _Requirements: 4.3, 4.4_

- [x] 10.4 Integrate into admin dashboard
  - Add "Applications" tab to AdminDashboardPage
  - Add navigation link in AdminSidebar
  - _Requirements: 4.1_

- [x] 11. Implement application services (frontend)
  - [x] 11.1 Create applicationService.js
    - Implement submitApplication(applicationData)
    - Implement getMyApplicationStatus()
    - _Requirements: 1.2, 3.1_

- [x] 11.2 Create adminApplicationService.js
  - Implement getApplications(filters, search, page)
  - Implement approveApplication(id)
  - Implement rejectApplication(id, reason)
    - _Requirements: 4.1, 4.3, 4.4_

- [x] 12. Add navigation and routing
  - [x] 12.1 Verify route for BecomeProviderPage exists
    - Ensure /become-provider route exists in App.jsx
    - Protect route with authentication
    - Redirect providers to dashboard
    - _Requirements: 1.1, 1.5, 7.2_

- [x] 12.2 Update navigation components
  - Add "Become a Provider" link to Navbar for clients
  - Hide link for providers and admins
  - Add link to DashboardSidebar for clients
    - _Requirements: 7.1, 7.3_

- [x] 13. Implement notification system
  - [x] 13.1 Create notification service
    - Implement sendApplicationSubmittedNotification(userId)
    - Implement sendApplicationApprovedNotification(userId)
    - Implement sendApplicationRejectedNotification(userId, reason)
    - _Requirements: 5.1, 5.2, 5.3_

- [x] 13.2 Write unit tests for notifications
  - Test notification sending on application submission
  - Test notification sending on approval
  - Test notification sending on rejection
  - _Requirements: 4.7, 5.1, 5.2, 5.3, 5.4_

- [ ] 14. Final integration and testing
  - [x] 14.1 Test complete user flow
    - Test application submission as client
    - Test status tracking
    - Test admin approval process
    - Test admin rejection process
    - Test reapplication after rejection

- [x] 14.2 Write integration tests
  - Test end-to-end application submission flow
  - Test end-to-end approval flow
  - Test end-to-end rejection flow
  - Test concurrent application submissions

- [x] 15. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The implementation follows a bottom-up approach: database → backend → frontend
- Transaction handling is critical for the approval process to maintain data consistency
