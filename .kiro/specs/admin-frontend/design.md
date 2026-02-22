# Admin Frontend Design

## Overview

The admin frontend provides a comprehensive management interface for platform administrators. It follows the existing Servify design system with a dark sidebar navigation, clean typography, and professional styling. The interface is built with React and uses shadcn/ui components with Tailwind CSS for consistent, accessible UI elements.

## Architecture

The admin frontend is organized into a modular component structure using shadcn/ui components:

```
client/src/
├── pages/
│   └── AdminDashboardPage.jsx (main container)
├── components/
│   ├── admin/
│   │   ├── AdminSidebar.jsx
│   │   ├── AdminTopbar.jsx
│   │   ├── UserManagement.jsx
│   │   ├── ProviderManagement.jsx
│   │   ├── ServiceModeration.jsx
│   │   ├── BookingMonitoring.jsx
│   │   ├── ReviewModeration.jsx
│   │   ├── CategoryManagement.jsx
│   │   ├── AdminDataTable.jsx (shadcn Table wrapper)
│   │   ├── AdminPagination.jsx (shadcn Pagination wrapper)
│   │   └── AdminDialog.jsx (shadcn Dialog wrapper)
│   └── ui/ (shadcn components)
│       ├── button.jsx
│       ├── input.jsx
│       ├── dialog.jsx
│       ├── table.jsx
│       ├── pagination.jsx
│       ├── badge.jsx
│       ├── card.jsx
│       ├── select.jsx
│       ├── toast.jsx
│       └── toaster.jsx
└── services/
    └── adminService.js (API calls)
```

## Components and Interfaces

### shadcn/ui Components Used
- **Button**: Primary, secondary, ghost, and destructive variants
- **Input**: Text inputs with validation states
- **Dialog**: Modal dialogs for forms and details
- **Table**: Data tables with sorting and pagination
- **Pagination**: Page navigation controls
- **Badge**: Status and role indicators
- **Card**: Container for content sections
- **Select**: Dropdown selectors for filters
- **Toast**: Notifications for actions
- **Toaster**: Toast notification container

## Components and Interfaces

### AdminSidebar Component
- Fixed left sidebar with dark background
- Brand section with Servify logo and "Admin" tag
- Admin user info display
- Navigation items: Overview, Users, Providers, Services, Bookings, Reviews, Categories
- Logout button in footer
- Active state highlighting with primary color
- Built with shadcn Button and custom styling

### AdminTopbar Component
- Sticky top bar with white background
- Current section title and date display
- Action buttons using shadcn Button component
- Consistent with provider dashboard topbar

### UserManagement Component
- Paginated table using shadcn Table component
- Columns: Name, Email, Role, Joined, Status, Actions
- Activate/Deactivate buttons using shadcn Button
- User detail modal using shadcn Dialog
- Search and filter capabilities
- Status badges using shadcn Badge
- Fetches from `/admin/users` endpoint

### ProviderManagement Component
- Paginated list using shadcn Table
- Columns: Name, Email, Services, Rating, Verification Status, Actions
- Verify button using shadcn Button
- Provider detail modal using shadcn Dialog
- Fetches from `/admin/users?role=provider` endpoint

### ServiceModeration Component
- Paginated table using shadcn Table
- Columns: Name, Provider, Category, Price, Status, Actions
- Toggle service visibility button using shadcn Button
- Service detail modal using shadcn Dialog
- Fetches from `/admin/services` endpoint

### BookingMonitoring Component
- Paginated table using shadcn Table
- Columns: ID, Client, Provider, Service, Date, Status, Actions
- Status filter using shadcn Select
- Booking detail modal using shadcn Dialog
- Fetches from `/admin/bookings` endpoint

### ReviewModeration Component
- Paginated table using shadcn Table
- Columns: Reviewer, Provider, Rating, Comment, Date, Actions
- Delete button using shadcn Button
- Rating filter using shadcn Select
- Fetches from `/admin/reviews` endpoint

### CategoryManagement Component
- List of categories using shadcn Card
- Create category button using shadcn Button
- Edit and delete buttons for each category
- Category form modal using shadcn Dialog
- Fetches from `/admin/categories` endpoint

### AdminDataTable Component
- Wrapper around shadcn Table
- Handles sorting and pagination
- Responsive scrolling
- Badge support for status indicators

### AdminPagination Component
- Wrapper around shadcn Pagination
- Previous/Next buttons
- Page number display
- Items per page selector using shadcn Select

### AdminDialog Component
- Wrapper around shadcn Dialog
- Header with title and close button
- Body content area
- Footer with action buttons

## Data Models

### User
```javascript
{
  id: number,
  name: string,
  email: string,
  role: 'user' | 'provider',
  joinedDate: string,
  status: 'active' | 'suspended',
  avatar?: string
}
```

### Provider
```javascript
{
  id: number,
  name: string,
  email: string,
  servicesCount: number,
  rating: number,
  verificationStatus: 'verified' | 'pending' | 'rejected',
  joinedDate: string
}
```

### Service
```javascript
{
  id: number,
  name: string,
  provider: string,
  category: string,
  price: number,
  status: 'active' | 'inactive',
  createdDate: string
}
```

### Booking
```javascript
{
  id: number,
  clientName: string,
  providerName: string,
  service: string,
  date: string,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled',
  amount: number
}
```

### Review
```javascript
{
  id: number,
  reviewerName: string,
  providerName: string,
  rating: number,
  comment: string,
  date: string
}
```

### Category
```javascript
{
  id: number,
  name: string,
  description: string,
  icon?: string
}
```

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: User List Consistency
*For any* paginated user list, the displayed users should match the data returned from the `/admin/users` endpoint, with correct pagination applied.
**Validates: Requirements 2.1, 2.2**

### Property 2: User Action Persistence
*For any* user action (activate/deactivate), after the action completes and the list refreshes, the user's status should reflect the action taken.
**Validates: Requirements 2.5, 2.6, 2.7**

### Property 3: Provider Verification State
*For any* provider, after verification, the verification status should change from 'pending' to 'verified' in the list.
**Validates: Requirements 3.4, 3.5**

### Property 4: Service Toggle Idempotence
*For any* service, toggling the status twice should return the service to its original state.
**Validates: Requirements 4.4**

### Property 5: Booking Filter Accuracy
*For any* booking list filtered by status, all returned bookings should have the selected status.
**Validates: Requirements 5.5**

### Property 6: Review Deletion Finality
*For any* deleted review, subsequent queries should not return that review in the list.
**Validates: Requirements 6.4, 6.5**

### Property 7: Category CRUD Round Trip
*For any* category created with valid data, fetching the category list should include that category with matching data.
**Validates: Requirements 7.4, 7.5, 7.6**

### Property 8: Pagination Bounds
*For any* paginated list, the current page should never exceed the total number of pages, and page size should match the configured limit.
**Validates: Requirements 2.1, 4.1, 5.1, 6.1**

### Property 9: Modal Form Validation
*For any* modal form submission with invalid data, the form should reject the submission and display validation errors.
**Validates: Requirements 7.4, 7.5**

### Property 10: Notification Lifecycle
*For any* action that triggers a notification, the notification should appear, display the correct message, and auto-dismiss after 4 seconds.
**Validates: Requirements 9.1, 9.2**

## Error Handling

### API Error Handling
- Network errors: Display "Connection error. Please try again."
- 401 Unauthorized: Redirect to login
- 403 Forbidden: Display "You don't have permission to perform this action"
- 404 Not Found: Display "Resource not found"
- 500 Server Error: Display "Server error. Please try again later"
- Validation errors: Display field-specific error messages

### Form Validation
- Required fields: Show "This field is required"
- Email format: Show "Please enter a valid email"
- Number fields: Show "Please enter a valid number"
- Text length: Show "Must be between X and Y characters"

### Empty States
- No users: "No users found. Try adjusting your filters."
- No services: "No services available."
- No bookings: "No bookings at this time."
- No reviews: "No reviews to moderate."
- No categories: "No categories created yet."

## Testing Strategy

### Unit Tests
- Component rendering with various data states
- User interactions (button clicks, form submissions)
- Pagination logic and page transitions
- Filter and search functionality
- Modal open/close behavior
- Notification display and auto-dismiss

### Property-Based Tests
- User list consistency across pagination
- User action persistence and state updates
- Provider verification state changes
- Service toggle idempotence
- Booking filter accuracy
- Review deletion finality
- Category CRUD operations
- Pagination bounds validation
- Modal form validation
- Notification lifecycle

### Integration Tests
- Full user management workflow (list → detail → action → refresh)
- Service moderation workflow (list → toggle → verify)
- Category management workflow (create → edit → delete)
- Multi-step booking resolution
- Cross-component state management

### Test Configuration
- Minimum 100 iterations per property test
- Mock API responses for consistent testing
- Test data generators for realistic scenarios
- Error scenario coverage
- Edge case handling (empty lists, single items, max pagination)
