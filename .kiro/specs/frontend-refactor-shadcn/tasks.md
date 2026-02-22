# Implementation Plan: Frontend Refactoring to shadcn/ui and Tailwind CSS

## Overview

This implementation plan breaks down the refactoring of user and provider frontend components to use shadcn/ui and Tailwind CSS. The refactoring will be done in phases, starting with shared components, then landing pages, followed by user dashboard, provider dashboard, and finally services pages. Each task focuses on refactoring specific components while maintaining visual consistency and functionality.

## Tasks

- [x] 1. Setup and Preparation
  - Verify shadcn/ui components are installed and configured
  - Verify Tailwind CSS configuration matches design specifications
  - Create a backup branch for safety
  - Document current component structure
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 2. Refactor Shared Navigation Components
  - [x] 2.1 Refactor Navbar component
    - Replace CSS imports with Tailwind classes
    - Use shadcn/ui Button for action buttons
    - Implement responsive navigation with Tailwind utilities
    - Maintain dark mode toggle functionality
    - Remove `client/src/pages/styles/Navbar.css`
    - _Requirements: 7.3, 3.1, 3.2, 4.1, 10.1_

  - [x] 2.2 Refactor Footer component
    - Replace CSS imports with Tailwind classes
    - Use Tailwind grid utilities for layout
    - Ensure responsive design with Tailwind breakpoints
    - Remove `client/src/components/Footer.css`
    - _Requirements: 7.4, 3.1, 3.2, 9.4_

- [x] 3. Refactor Landing Page Components
  - [x] 3.1 Refactor Hero component
    - Replace CSS imports with Tailwind classes
    - Use shadcn/ui Input for search field
    - Use shadcn/ui Button for search button
    - Maintain gradient backgrounds and animations
    - Ensure dark mode compatibility
    - Remove `client/src/components/Hero.css`
    - _Requirements: 7.1, 3.1, 4.1, 4.2, 10.1_

  - [x] 3.2 Refactor PopularCategories component
    - Replace CSS imports with Tailwind classes
    - Use Tailwind grid utilities for category layout
    - Maintain hover effects and transitions
    - Ensure responsive grid behavior
    - Remove `client/src/components/PopularCategories.css`
    - _Requirements: 7.2, 3.1, 3.3, 9.4_

  - [x] 3.3 Refactor LoginBox component
    - Replace CSS with Tailwind classes
    - Use shadcn/ui Input for form fields
    - Use shadcn/ui Button for submit button
    - Maintain form validation styling
    - Remove associated CSS file
    - _Requirements: 7.5, 4.1, 4.2, 12.3_

  - [x] 3.4 Refactor RegisterBox component
    - Replace CSS with Tailwind classes
    - Use shadcn/ui Input for form fields
    - Use shadcn/ui Button for submit button
    - Maintain form validation styling
    - Remove associated CSS file
    - _Requirements: 7.6, 4.1, 4.2, 12.3_

- [x] 4. Checkpoint - Test Landing Pages
  - Verify all landing page components render correctly
  - Test responsive behavior on mobile, tablet, and desktop
  - Test dark mode on all landing page components
  - Verify all links and navigation work correctly
  - Ensure all tests pass, ask the user if questions arise

- [x] 5. Refactor User Dashboard Components
  - [x] 5.1 Refactor DashboardSidebar component
    - Replace CSS imports with Tailwind classes
    - Use Tailwind flex utilities for layout
    - Maintain active state styling
    - Ensure guest mode styling works
    - Remove `client/src/pages/styles/Dashboardsidebar.css`
    - _Requirements: 5.1, 3.1, 2.1, 2.2_

  - [x] 5.2 Refactor DashboardStats component
    - Replace CSS with Tailwind classes
    - Use shadcn/ui Card components for stat cards
    - Use Tailwind grid for layout
    - Maintain hover effects
    - Remove associated CSS from `client/src/pages/styles/dashboard.css`
    - _Requirements: 5.2, 4.3, 3.3, 2.5_

  - [x] 5.3 Refactor BookingList component
    - Replace CSS with Tailwind classes
    - Use shadcn/ui Button for tab buttons
    - Use shadcn/ui Card for container
    - Maintain tab switching functionality
    - Remove associated CSS from `client/src/pages/styles/dashboard.css`
    - _Requirements: 5.3, 4.1, 4.3, 12.1_

  - [x] 5.4 Refactor BookingCard component
    - Replace CSS with Tailwind classes
    - Use shadcn/ui Card components
    - Use shadcn/ui Badge for status indicators
    - Use shadcn/ui Button for action buttons
    - Maintain hover effects and transitions
    - Remove associated CSS from `client/src/pages/styles/dashboard.css`
    - _Requirements: 5.4, 4.3, 4.6, 4.1, 2.5_

  - [x] 5.5 Refactor SavedServices component
    - Replace CSS with Tailwind classes
    - Use Tailwind grid for service layout
    - Use shadcn/ui Card for service items
    - Remove `client/src/pages/styles/SavedServices.css`
    - _Requirements: 5.5, 3.3, 4.3_

  - [x] 5.6 Refactor ProfileSettings component
    - Replace CSS with Tailwind classes
    - Use shadcn/ui Input for form fields
    - Use shadcn/ui Button for save button
    - Maintain form validation and submission
    - Remove `client/src/pages/styles/ProfileSettings.css`
    - _Requirements: 5.6, 4.2, 4.1, 12.3_

  - [x] 5.7 Refactor AccountSettings component
    - Replace CSS with Tailwind classes
    - Use shadcn/ui Input for form fields
    - Use shadcn/ui Button for action buttons
    - Use shadcn/ui Dialog for confirmation modals
    - Remove `client/src/pages/styles/AccountSettings.css`
    - _Requirements: 5.7, 4.2, 4.1, 4.4_

  - [x] 5.8 Refactor Dashboardpage component
    - Update to use refactored child components
    - Replace CSS with Tailwind classes
    - Maintain guest overlay functionality
    - Remove `client/src/pages/styles/dashboard.css`
    - _Requirements: 5.1, 3.1, 12.1_

- [x] 6. Checkpoint - Test User Dashboard
  - Verify all user dashboard components render correctly
  - Test navigation between dashboard sections
  - Test guest mode overlay and authentication flow
  - Test responsive behavior on all screen sizes
  - Test dark mode on all dashboard components
  - Ensure all tests pass, ask the user if questions arise

- [x] 7. Refactor Provider Dashboard Components
  - [x] 7.1 Refactor ProviderSidebar component
    - Replace CSS with Tailwind classes
    - Use Tailwind flex utilities for layout
    - Maintain active state and badge styling
    - Remove `client/src/pages/styles/Providersidebar.css`
    - _Requirements: 6.1, 3.1, 2.1_

  - [x] 7.2 Refactor ProviderOverview component
    - Replace CSS with Tailwind classes
    - Use shadcn/ui Card for stat cards
    - Use Tailwind grid for layout
    - Remove `client/src/pages/styles/ProviderOverview.css`
    - _Requirements: 6.2, 4.3, 3.3_

  - [x] 7.3 Refactor ProviderServices component
    - Replace CSS with Tailwind classes
    - Use shadcn/ui Table for service listings
    - Use shadcn/ui Dialog for add/edit service modals
    - Use shadcn/ui Button for action buttons
    - Remove `client/src/pages/styles/ProviderServices.css`
    - _Requirements: 6.3, 4.5, 4.4, 4.1_

  - [x] 7.4 Refactor ProviderBookings component
    - Replace CSS with Tailwind classes
    - Use shadcn/ui Table for bookings list
    - Use shadcn/ui Badge for status indicators
    - Use shadcn/ui Button for action buttons
    - Remove `client/src/pages/styles/ProviderBookings.css`
    - _Requirements: 6.4, 4.5, 4.6, 4.1_

  - [x] 7.5 Refactor ProviderEarnings component
    - Replace CSS with Tailwind classes
    - Use shadcn/ui Card for earnings summary
    - Use Tailwind utilities for chart containers
    - Remove `client/src/pages/styles/ProviderEarnings.css`
    - _Requirements: 6.5, 4.3, 3.1_

  - [x] 7.6 Refactor ProviderProfile component
    - Replace CSS with Tailwind classes
    - Use shadcn/ui Input for form fields
    - Use shadcn/ui Button for save button
    - Maintain form validation and submission
    - Remove `client/src/pages/styles/ProviderProfile.css`
    - _Requirements: 6.6, 4.2, 4.1, 12.3_

  - [x] 7.7 Refactor ProviderReviews component
    - Replace CSS with Tailwind classes
    - Use shadcn/ui Card for review items
    - Use shadcn/ui Badge for rating display
    - Remove `client/src/pages/styles/ProviderReviews.css`
    - _Requirements: 6.7, 4.3, 4.6_

  - [x] 7.8 Refactor Providerdashboardpage component
    - Update to use refactored child components
    - Replace CSS with Tailwind classes
    - Maintain topbar and navigation functionality
    - Remove `client/src/pages/styles/Providerdashboard.css`
    - _Requirements: 6.1, 3.1, 12.1_

- [x] 8. Checkpoint - Test Provider Dashboard
  - Verify all provider dashboard components render correctly
  - Test navigation between provider sections
  - Test service management functionality
  - Test booking management functionality
  - Test responsive behavior on all screen sizes
  - Test dark mode on all provider components
  - Ensure all tests pass, ask the user if questions arise

- [x] 9. Refactor Services Page Components
  - [x] 9.1 Refactor ServicesFilter component
    - Replace CSS with Tailwind classes
    - Use shadcn/ui Select for dropdown filters
    - Use shadcn/ui Input for search field
    - Maintain filter state and functionality
    - Remove associated CSS file
    - _Requirements: 8.1, 4.7, 4.2, 12.1_

  - [x] 9.2 Refactor ServicesGrid component
    - Replace CSS with Tailwind classes
    - Use Tailwind grid utilities for layout
    - Ensure responsive grid behavior
    - Remove associated CSS file
    - _Requirements: 8.2, 3.3, 9.4_

  - [x] 9.3 Refactor ServiceCard component
    - Replace CSS with Tailwind classes
    - Use shadcn/ui Card components
    - Use shadcn/ui Badge for category tags
    - Use shadcn/ui Button for view details
    - Maintain hover effects
    - Remove associated CSS file
    - _Requirements: 8.3, 4.3, 4.6, 4.1, 2.5_

  - [x] 9.4 Refactor ServiceDetailPage component
    - Replace CSS with Tailwind classes
    - Use shadcn/ui Card for sections
    - Use shadcn/ui Button for booking button
    - Use shadcn/ui Badge for tags
    - Remove `client/src/components/ServiceDetailPage.css`
    - _Requirements: 8.4, 4.3, 4.1, 4.6_

  - [x] 9.5 Refactor ViewService component
    - Replace CSS with Tailwind classes
    - Use shadcn/ui Dialog for modal display
    - Use shadcn/ui Button for actions
    - Remove `client/src/pages/styles/ViewService.css`
    - _Requirements: 8.5, 4.4, 4.1_

  - [x] 9.6 Refactor ServicesPage component
    - Update to use refactored child components
    - Replace CSS with Tailwind classes
    - Maintain filter and search functionality
    - Remove `client/src/pages/styles/services.css`
    - _Requirements: 8.1, 3.1, 12.1_

- [x] 10. Checkpoint - Test Services Pages
  - Verify all services page components render correctly
  - Test service filtering and search functionality
  - Test service card interactions
  - Test service detail view
  - Test responsive behavior on all screen sizes
  - Test dark mode on all services components
  - Ensure all tests pass, ask the user if questions arise

- [x] 11. Clean Up and Final Verification
  - [x] 11.1 Remove unused CSS files
    - Delete all CSS files from `client/src/pages/styles/` that are no longer referenced
    - Verify no broken imports remain
    - _Requirements: 11.2, 11.3, 11.4_

  - [x] 11.2 Update global styles
    - Review `client/src/index.css` for any unused styles
    - Ensure only Tailwind directives and necessary global styles remain
    - _Requirements: 3.1, 11.3_

  - [x] 11.3 Verify Tailwind configuration
    - Ensure all custom colors are defined in tailwind.config.js
    - Verify content paths include all component files
    - Confirm dark mode is set to 'class'
    - _Requirements: 3.1, 10.1_

  - [x] 11.4 Run build and check for errors
    - Run `npm run build` in client directory
    - Fix any build errors or warnings
    - Verify bundle size is reasonable
    - _Requirements: 11.4, 12.1_

- [x] 12. Final Testing and Documentation
  - [x] 12.1 Comprehensive visual testing
    - Test all pages in light mode
    - Test all pages in dark mode
    - Test all pages at mobile, tablet, and desktop sizes
    - Document any visual differences from original
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 9.1, 9.2, 9.3, 10.1_

  - [x] 12.2 Comprehensive functional testing
    - Test all user flows (registration, login, booking, etc.)
    - Test all provider flows (service management, bookings, etc.)
    - Test all admin flows (should remain unchanged)
    - Verify all forms submit correctly
    - Verify all navigation works correctly
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [x] 12.3 Update documentation
    - Document the new component structure
    - Update any developer documentation
    - Create a migration guide for future components
    - _Requirements: 1.5, 11.5_

## Notes

- Each refactoring task should maintain the exact visual appearance of the original component
- Test each component thoroughly before moving to the next
- Keep the original CSS files until the refactored component is verified to work correctly
- Use the `cn()` utility from `lib/utils.js` for conditional classes
- Follow the Tailwind patterns documented in the design document
- Ensure all shadcn/ui components are properly imported and used
- Maintain all existing functionality and event handlers
- Test both light and dark modes for every component
- Test responsive behavior at all breakpoints
- Commit changes after each major component or group of related components
