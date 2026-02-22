# Admin Frontend Requirements

## Introduction

The admin frontend provides a comprehensive dashboard for administrators to manage users, providers, services, bookings, reviews, and categories. The interface follows the existing Servify design theme with a dark sidebar, clean typography, and professional styling using shadcn components.

## Glossary

- **Admin**: A user with administrative privileges who can manage platform content and users
- **Dashboard**: The main overview page showing key metrics and recent activity
- **User Management**: Interface for viewing, activating, and deactivating user accounts
- **Provider Management**: Interface for viewing and verifying service providers
- **Service Moderation**: Interface for reviewing and toggling service visibility
- **Booking Monitoring**: Interface for viewing and managing booking requests
- **Review Moderation**: Interface for viewing and deleting inappropriate reviews
- **Category Management**: Interface for creating, updating, and deleting service categories
- **Metrics**: Key performance indicators displayed on the dashboard (total users, providers, bookings, reports)

## Requirements

### Requirement 1: Admin Dashboard Overview

**User Story:** As an admin, I want to see a dashboard with key metrics and recent activity, so that I can quickly understand the platform's health and status.

#### Acceptance Criteria

1. WHEN the admin accesses the dashboard, THE Admin_Dashboard SHALL display key metrics including total users, total providers, bookings today, and open reports
2. WHEN the dashboard loads, THE Admin_Dashboard SHALL fetch metrics from the `/admin/dashboard` endpoint
3. WHEN viewing the dashboard, THE Admin_Dashboard SHALL display a table of recent users with name, email, role, join date, and status
4. WHEN the admin views the dashboard, THE Admin_Dashboard SHALL show status indicators (active/suspended) for each user
5. WHEN the dashboard is displayed, THE Admin_Dashboard SHALL apply the existing admin theme with dark sidebar and professional styling

### Requirement 2: User Management

**User Story:** As an admin, I want to manage user accounts, so that I can maintain platform quality and handle user issues.

#### Acceptance Criteria

1. WHEN the admin navigates to Users section, THE User_Management_Page SHALL display a paginated list of all users
2. WHEN viewing users, THE User_Management_Page SHALL fetch users from the `/admin/users` endpoint with pagination support
3. WHEN viewing the users list, THE User_Management_Page SHALL display user name, email, role (user/provider), join date, and status
4. WHEN an admin clicks on a user, THE User_Management_Page SHALL display a user detail modal with full information
5. WHEN an admin activates a user, THE User_Management_Page SHALL call the `/admin/users/:id/activate` endpoint
6. WHEN an admin deactivates a user, THE User_Management_Page SHALL call the `/admin/users/:id/deactivate` endpoint
7. WHEN a user action completes, THE User_Management_Page SHALL refresh the user list and show a success notification

### Requirement 3: Provider Verification

**User Story:** As an admin, I want to verify and manage service providers, so that I can ensure platform quality and trust.

#### Acceptance Criteria

1. WHEN the admin navigates to Providers section, THE Provider_Management_Page SHALL display a list of all providers
2. WHEN viewing providers, THE Provider_Management_Page SHALL fetch providers from the `/admin/users` endpoint filtered by role
3. WHEN viewing the providers list, THE Provider_Management_Page SHALL display provider name, email, services count, rating, and verification status
4. WHEN an admin verifies a provider, THE Provider_Management_Page SHALL call the `/admin/users/:id/verify` endpoint
5. WHEN a provider is verified, THE Provider_Management_Page SHALL update the verification status and show a success notification

### Requirement 4: Service Moderation

**User Story:** As an admin, I want to moderate services, so that I can maintain content quality and remove inappropriate listings.

#### Acceptance Criteria

1. WHEN the admin navigates to Services section, THE Service_Moderation_Page SHALL display a paginated list of all services
2. WHEN viewing services, THE Service_Moderation_Page SHALL fetch services from the `/admin/services` endpoint
3. WHEN viewing the services list, THE Service_Moderation_Page SHALL display service name, provider, category, price, and status
4. WHEN an admin toggles a service status, THE Service_Moderation_Page SHALL call the `/admin/services/:id/toggle` endpoint
5. WHEN a service action completes, THE Service_Moderation_Page SHALL refresh the list and show a success notification

### Requirement 5: Booking Monitoring

**User Story:** As an admin, I want to monitor bookings, so that I can track platform activity and resolve booking issues.

#### Acceptance Criteria

1. WHEN the admin navigates to Bookings section, THE Booking_Monitoring_Page SHALL display a paginated list of all bookings
2. WHEN viewing bookings, THE Booking_Monitoring_Page SHALL fetch bookings from the `/admin/bookings` endpoint
3. WHEN viewing the bookings list, THE Booking_Monitoring_Page SHALL display booking ID, client name, provider name, service, date, and status
4. WHEN an admin clicks on a booking, THE Booking_Monitoring_Page SHALL display booking details in a modal
5. WHEN viewing bookings, THE Booking_Monitoring_Page SHALL support filtering by status (pending, confirmed, completed, cancelled)

### Requirement 6: Review Moderation

**User Story:** As an admin, I want to moderate reviews, so that I can maintain community standards and remove inappropriate content.

#### Acceptance Criteria

1. WHEN the admin navigates to Reviews section, THE Review_Moderation_Page SHALL display a paginated list of all reviews
2. WHEN viewing reviews, THE Review_Moderation_Page SHALL fetch reviews from the `/admin/reviews` endpoint
3. WHEN viewing the reviews list, THE Review_Moderation_Page SHALL display reviewer name, provider name, rating, comment, and date
4. WHEN an admin deletes a review, THE Review_Moderation_Page SHALL call the `/admin/reviews/:id/delete` endpoint
5. WHEN a review is deleted, THE Review_Moderation_Page SHALL refresh the list and show a success notification

### Requirement 7: Category Management

**User Story:** As an admin, I want to manage service categories, so that I can organize services and improve discoverability.

#### Acceptance Criteria

1. WHEN the admin navigates to Categories section, THE Category_Management_Page SHALL display a list of all categories
2. WHEN viewing categories, THE Category_Management_Page SHALL fetch categories from the `/admin/categories` endpoint
3. WHEN viewing the categories list, THE Category_Management_Page SHALL display category name, description, and action buttons
4. WHEN an admin creates a category, THE Category_Management_Page SHALL open a modal form and call the `/admin/categories` endpoint
5. WHEN an admin updates a category, THE Category_Management_Page SHALL open a modal form and call the `/admin/categories/:id` endpoint
6. WHEN an admin deletes a category, THE Category_Management_Page SHALL call the `/admin/categories/:id/delete` endpoint
7. WHEN a category action completes, THE Category_Management_Page SHALL refresh the list and show a success notification

### Requirement 8: Navigation and Layout

**User Story:** As an admin, I want consistent navigation and layout, so that I can easily move between different admin sections.

#### Acceptance Criteria

1. THE Admin_Layout SHALL display a fixed dark sidebar with admin branding and navigation items
2. THE Admin_Layout SHALL display a top navigation bar with the current section title and date
3. THE Admin_Layout SHALL include navigation items for Overview, Users, Providers, Services, Bookings, Reviews, and Categories
4. WHEN an admin clicks a navigation item, THE Admin_Layout SHALL update the active section and display the corresponding page
5. THE Admin_Layout SHALL include a logout button in the sidebar footer
6. THE Admin_Layout SHALL apply consistent styling matching the existing provider dashboard theme

### Requirement 9: Error Handling and Notifications

**User Story:** As an admin, I want clear feedback on actions, so that I can understand if operations succeeded or failed.

#### Acceptance Criteria

1. WHEN an API request fails, THE Admin_System SHALL display an error notification with a descriptive message
2. WHEN an action succeeds, THE Admin_System SHALL display a success notification
3. WHEN data is loading, THE Admin_System SHALL display loading indicators
4. WHEN no data is available, THE Admin_System SHALL display an empty state message
5. WHEN an error occurs, THE Admin_System SHALL allow the admin to retry the action

### Requirement 10: Responsive Design

**User Story:** As an admin, I want the interface to work on different screen sizes, so that I can access the admin panel from various devices.

#### Acceptance Criteria

1. WHEN viewing on tablet screens, THE Admin_Interface SHALL stack the sidebar and adjust layout appropriately
2. WHEN viewing on mobile screens, THE Admin_Interface SHALL hide the sidebar and provide a mobile menu
3. WHEN viewing on desktop, THE Admin_Interface SHALL display the full sidebar and multi-column layouts
4. WHEN resizing the window, THE Admin_Interface SHALL maintain usability and readability
