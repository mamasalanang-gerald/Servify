# Design Document: Frontend Refactoring to shadcn/ui and Tailwind CSS

## Overview

This design document outlines the approach for refactoring the user and provider frontend sections to use shadcn/ui components and Tailwind CSS, achieving consistency with the admin dashboard implementation. The refactoring will maintain the exact visual design and user experience while modernizing the underlying code structure.

## Architecture

### Current State

The application currently has three distinct frontend sections:
1. **Admin Dashboard**: Uses shadcn/ui + Tailwind CSS (modern approach)
2. **User Dashboard**: Uses traditional CSS modules + custom CSS files
3. **Provider Dashboard**: Uses traditional CSS modules + custom CSS files

### Target State

After refactoring, all three sections will use:
- shadcn/ui components for common UI elements
- Tailwind CSS utility classes for styling
- Consistent component patterns and structure
- Unified dark mode implementation

### Migration Strategy

The refactoring will follow a component-by-component approach:
1. Identify all components using CSS modules
2. Replace CSS classes with Tailwind utilities
3. Integrate shadcn/ui components where applicable
4. Remove CSS module files
5. Test visual consistency
6. Verify functionality

## Components and Interfaces

### Component Categories

#### 1. Layout Components
- **Navbar**: Navigation bar with logo, links, and user menu
- **Footer**: Site footer with links and information
- **DashboardSidebar**: User dashboard navigation sidebar
- **ProviderSidebar**: Provider dashboard navigation sidebar

#### 2. Dashboard Components (User)
- **DashboardStats**: Statistics cards showing booking counts
- **BookingList**: List of user bookings with filtering
- **BookingCard**: Individual booking display card
- **SavedServices**: Grid of saved/favorited services
- **ProfileSettings**: User profile editing form
- **AccountSettings**: Account management and security settings

#### 3. Dashboard Components (Provider)
- **ProviderOverview**: Provider dashboard summary with stats
- **ProviderServices**: Table of provider's service listings
- **ProviderBookings**: Table of booking requests
- **ProviderEarnings**: Earnings charts and payout information
- **ProviderProfile**: Provider profile and portfolio editor
- **ProviderReviews**: Display of customer reviews

#### 4. Landing Page Components
- **Hero**: Main hero section with search
- **PopularCategories**: Grid of service categories
- **LoginBox**: Login form component
- **RegisterBox**: Registration form component

#### 5. Services Page Components
- **ServicesFilter**: Filter sidebar for services
- **ServicesGrid**: Grid layout for service cards
- **ServiceCard**: Individual service display card
- **ServiceDetailPage**: Detailed service view
- **ViewService**: Service detail modal/dialog

### shadcn/ui Component Mapping

| Current Element | shadcn/ui Component | Usage |
|----------------|---------------------|-------|
| Custom buttons | `Button` | All button elements |
| Form inputs | `Input` | Text inputs, email, password fields |
| Cards/panels | `Card`, `CardHeader`, `CardContent` | Dashboard stats, service cards |
| Modals | `Dialog`, `DialogContent`, `DialogHeader` | Service details, confirmations |
| Tables | `Table`, `TableHeader`, `TableBody`, `TableRow` | Provider services, bookings |
| Status badges | `Badge` | Booking status, service categories |
| Dropdowns | `Select`, `SelectTrigger`, `SelectContent` | Filters, sorting options |
| Pagination | `Pagination` | Service listings, booking lists |
| Toast notifications | `Toast`, `Toaster` | Success/error messages |

## Data Models

### Component Props Structure

#### Sidebar Components
```typescript
interface SidebarProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
}
```

#### Card Components
```typescript
interface BookingCardProps {
  booking: {
    id: string;
    title: string;
    provider: string;
    date: string;
    status: 'upcoming' | 'completed' | 'cancelled';
    total: number;
    image?: string;
  };
}

interface ServiceCardProps {
  service: {
    id: string;
    title: string;
    category: string;
    provider: string;
    providerInitial: string;
    rating: number;
    jobs: number;
    price: string;
    img: string;
  };
}
```

#### Dashboard Stats
```typescript
interface DashboardStatsProps {
  stats: {
    totalBookings: number;
    upcomingBookings: number;
    completedBookings: number;
  };
}
```

## Tailwind CSS Patterns

### Color Scheme
```javascript
// Primary colors (matching admin)
primary: '#1a3a8f'
accent: '#2b52cc'
accent-light: '#eef2ff'

// Text colors
text: '#0f172a'
text-muted: '#64748b'

// Background colors
bg: '#f1f5f9'
card: '#ffffff'
border: '#e2e8f0'

// Dark mode
dark:text: '#f1f5f9'
dark:text-muted: '#94a3b8'
dark:bg: '#0f172a'
dark:card: '#1e293b'
dark:border: '#1e293b'
```

### Common Utility Patterns

#### Card Pattern
```jsx
<div className="bg-card border-[1.5px] border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
  {/* Card content */}
</div>
```

#### Button Pattern (Primary)
```jsx
<button className="bg-accent hover:bg-primary text-white font-semibold px-6 py-3 rounded-xl transition-all">
  Button Text
</button>
```

#### Button Pattern (Secondary)
```jsx
<button className="bg-transparent border-[1.5px] border-border hover:border-accent hover:bg-accent-light text-accent font-semibold px-6 py-3 rounded-xl transition-all">
  Button Text
</button>
```

#### Sidebar Navigation Item
```jsx
<button className={cn(
  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left",
  "hover:bg-accent-light hover:text-accent",
  isActive && "bg-accent-light text-accent font-semibold"
)}>
  {/* Nav item content */}
</button>
```

### Responsive Breakpoints
- `sm:` - 640px and up (mobile landscape)
- `md:` - 768px and up (tablet)
- `lg:` - 1024px and up (desktop)
- `xl:` - 1280px and up (large desktop)

### Dark Mode Pattern
```jsx
<div className="bg-card dark:bg-[#1e293b] text-text dark:text-[#f1f5f9]">
  {/* Content */}
</div>
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Visual Consistency Preservation
*For any* refactored component, when rendered with the same props as the original, the visual output (layout, spacing, colors, typography) should be identical to the original component.
**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

### Property 2: CSS Module Removal Completeness
*For any* refactored component, after refactoring is complete, there should be no remaining import statements for CSS modules and no orphaned CSS files in the codebase.
**Validates: Requirements 11.1, 11.2, 11.3, 11.4**

### Property 3: Tailwind Class Application
*For any* refactored component, all styling should be achieved through Tailwind utility classes or shadcn/ui components, with no inline style objects except for dynamic values.
**Validates: Requirements 3.1, 3.2, 3.5**

### Property 4: shadcn/ui Component Integration
*For any* common UI element (button, input, card, dialog, table, badge, select), the refactored component should use the corresponding shadcn/ui component rather than custom implementations.
**Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7**

### Property 5: Responsive Behavior Preservation
*For any* refactored component, when viewed at different viewport widths (mobile, tablet, desktop), the responsive behavior should match the original component's behavior.
**Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5**

### Property 6: Dark Mode Consistency
*For any* refactored component, when dark mode is toggled, all text should remain readable, all interactive elements should be visible, and color contrast should meet accessibility standards.
**Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5**

### Property 7: Functional Equivalence
*For any* refactored component, all event handlers, state management, and interactive behaviors should function identically to the original component.
**Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5**

### Property 8: Import Statement Validity
*For any* file in the codebase after refactoring, all import statements should resolve to existing files with no broken references.
**Validates: Requirements 11.4**

## Error Handling

### Migration Errors

**CSS Class Not Found**
- **Scenario**: A CSS class used in the original component has no Tailwind equivalent
- **Handling**: Document the custom class and create a Tailwind equivalent using @apply or custom utilities in tailwind.config.js

**Component Prop Mismatch**
- **Scenario**: shadcn/ui component props don't match the original component's interface
- **Handling**: Create a wrapper component that adapts the props to match the shadcn/ui interface

**Visual Regression**
- **Scenario**: Refactored component doesn't match the original visual design
- **Handling**: Use browser DevTools to compare computed styles and adjust Tailwind classes accordingly

**Broken Functionality**
- **Scenario**: Interactive features stop working after refactoring
- **Handling**: Verify all event handlers are preserved and state management logic is intact

### Runtime Errors

**Missing shadcn/ui Component**
- **Scenario**: Attempting to use a shadcn/ui component that hasn't been installed
- **Handling**: Install the component using the shadcn/ui CLI: `npx shadcn-ui@latest add [component]`

**Tailwind Class Not Applied**
- **Scenario**: Tailwind classes don't appear to be working
- **Handling**: Verify the component file is included in tailwind.config.js content paths

**Dark Mode Not Working**
- **Scenario**: Dark mode classes don't apply correctly
- **Handling**: Ensure `darkMode: 'class'` is set in tailwind.config.js and the `dark` class is toggled on the html element

## Testing Strategy

### Visual Regression Testing

**Manual Visual Comparison**
1. Take screenshots of original components in different states
2. Refactor the component
3. Take screenshots of refactored components in the same states
4. Compare side-by-side for visual differences
5. Adjust Tailwind classes until visuals match exactly

**Responsive Testing**
1. Test each refactored component at breakpoints: 375px, 768px, 1024px, 1440px
2. Verify layout, spacing, and element visibility at each breakpoint
3. Ensure no horizontal scrolling or overflow issues

**Dark Mode Testing**
1. Toggle dark mode for each refactored component
2. Verify all text is readable
3. Verify all interactive elements are visible
4. Check color contrast ratios using browser DevTools

### Functional Testing

**Unit Tests**
- Test that event handlers are called with correct arguments
- Test that state updates trigger expected UI changes
- Test form validation logic
- Test navigation and routing behavior

**Integration Tests**
- Test user flows across multiple refactored components
- Test data fetching and display
- Test form submission and API interactions
- Test authentication and authorization flows

### Property-Based Tests

Each correctness property should be validated through automated tests where possible:

**Property 1: Visual Consistency** (Manual)
- Visual comparison testing as described above

**Property 2: CSS Module Removal** (Automated)
- Script to scan for `.css` imports in component files
- Script to find orphaned CSS files in the styles directory

**Property 3: Tailwind Class Application** (Automated)
- Lint rule to detect inline style objects
- Code review to verify Tailwind usage

**Property 4: shadcn/ui Integration** (Manual)
- Code review to verify shadcn/ui components are used for common elements

**Property 5: Responsive Behavior** (Manual)
- Responsive testing as described above

**Property 6: Dark Mode Consistency** (Manual)
- Dark mode testing as described above

**Property 7: Functional Equivalence** (Automated)
- Unit and integration tests as described above

**Property 8: Import Validity** (Automated)
- TypeScript/ESLint checks for broken imports
- Build process should fail if imports are invalid

### Testing Tools

- **Vitest**: Unit and integration testing
- **React Testing Library**: Component testing
- **Playwright**: End-to-end testing
- **ESLint**: Static code analysis
- **TypeScript**: Type checking and import validation

### Test Coverage Goals

- 80%+ code coverage for refactored components
- 100% of interactive features tested
- 100% of user flows tested
- All responsive breakpoints tested
- Both light and dark modes tested

## Implementation Notes

### Refactoring Order

1. **Phase 1: Shared Components** (Navbar, Footer)
   - These are used across all pages
   - Refactoring them first provides immediate consistency

2. **Phase 2: Landing Page** (Hero, PopularCategories, LoginBox, RegisterBox)
   - Public-facing pages
   - Lower risk of breaking authenticated user flows

3. **Phase 3: User Dashboard** (Sidebar, Stats, Bookings, Profile, Settings)
   - Core user functionality
   - Test thoroughly before moving to provider

4. **Phase 4: Provider Dashboard** (Sidebar, Overview, Services, Bookings, Earnings, Profile, Reviews)
   - Provider-specific functionality
   - Similar patterns to user dashboard

5. **Phase 5: Services Pages** (Filter, Grid, Card, Detail)
   - Service browsing and discovery
   - Final piece to complete the refactoring

### Component Refactoring Checklist

For each component:
- [ ] Create a backup of the original component
- [ ] Identify all CSS classes used
- [ ] Map CSS classes to Tailwind utilities
- [ ] Replace custom elements with shadcn/ui components
- [ ] Update className attributes with Tailwind classes
- [ ] Remove CSS import statement
- [ ] Test visual appearance (light mode)
- [ ] Test visual appearance (dark mode)
- [ ] Test responsive behavior
- [ ] Test interactive functionality
- [ ] Delete CSS module file
- [ ] Commit changes

### Tailwind Configuration

Ensure tailwind.config.js includes:
```javascript
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a3a8f',
        accent: '#2b52cc',
        'accent-light': '#eef2ff',
        text: '#0f172a',
        'text-muted': '#64748b',
        bg: '#f1f5f9',
        card: '#ffffff',
        border: '#e2e8f0',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'DM Sans', 'sans-serif'],
        heading: ['Sora', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### Dark Mode Implementation

The application uses class-based dark mode. The `dark` class is toggled on the `<html>` element:

```javascript
// In Navbar or App component
const [dark, setDark] = useState(() => {
  return localStorage.getItem("theme") === "dark";
});

useEffect(() => {
  if (dark) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
}, [dark]);
```

All components should use the `dark:` prefix for dark mode styles:
```jsx
<div className="bg-white dark:bg-[#1e293b] text-gray-900 dark:text-gray-100">
```

### Utility Function

Use the `cn()` utility from `lib/utils.js` for conditional classes:
```javascript
import { cn } from '@/lib/utils';

<button className={cn(
  "base-classes",
  isActive && "active-classes",
  isDisabled && "disabled-classes"
)}>
```

This utility is already available in the codebase and should be used consistently.
