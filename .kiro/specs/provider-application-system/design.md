# Design Document: Provider Application System

## Overview

The Provider Application System implements a structured workflow for users to apply to become service providers. Instead of instant promotion, users submit applications that are reviewed and approved by administrators. This ensures quality control and allows collection of necessary provider information before granting provider privileges.

The system consists of three main components:
1. **Application Submission** - Client-facing interface for submitting provider applications
2. **Application Management** - Admin interface for reviewing and processing applications
3. **Status Tracking** - User interface for tracking application progress

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
├─────────────────────────────────────────────────────────────┤
│  BecomeProviderPage  │  ApplicationStatus  │  AdminReview   │
└──────────────┬───────────────────┬──────────────────┬───────┘
               │                   │                  │
┌──────────────▼───────────────────▼──────────────────▼───────┐
│                      API Layer                               │
├─────────────────────────────────────────────────────────────┤
│  POST /applications      │  GET /applications/my-status     │
│  GET /admin/applications │  PATCH /admin/applications/:id   │
└──────────────┬───────────────────┬──────────────────┬───────┘
               │                   │                  │
┌──────────────▼───────────────────▼──────────────────▼───────┐
│                    Service Layer                             │
├─────────────────────────────────────────────────────────────┤
│  ApplicationService  │  NotificationService  │  UserService │
└──────────────┬───────────────────┬──────────────────┬───────┘
               │                   │                  │
┌──────────────▼───────────────────▼──────────────────▼───────┐
│                     Data Layer                               │
├─────────────────────────────────────────────────────────────┤
│  provider_applications  │  users  │  categories             │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

**Application Submission Flow:**
1. Client fills out application form
2. Frontend validates required fields
3. POST request to `/applications` endpoint
4. Backend validates data and user eligibility
5. Create application record with 'pending' status
6. Send confirmation notification
7. Return success response

**Application Approval Flow:**
1. Admin reviews pending applications
2. Admin approves/rejects application
3. PATCH request to `/admin/applications/:id`
4. Backend validates admin permissions
5. Begin database transaction
6. Update application status
7. If approved: Update user_type and profile
8. Commit transaction
9. Send notification to applicant
10. Return success response

## Components and Interfaces

### Frontend Components

#### 1. BecomeProviderPage Component
**Location:** `client/src/pages/BecomeProviderPage.jsx`

**Purpose:** Application form for clients to apply as providers

**Props:** None (uses auth context)

**State:**
```javascript
{
  formData: {
    businessName: string,
    bio: string,
    yearsOfExperience: number,
    serviceCategories: number[],
    phoneNumber: string,
    serviceAddress: string
  },
  errors: object,
  isSubmitting: boolean,
  submitSuccess: boolean
}
```

**Key Methods:**
- `handleInputChange(field, value)` - Updates form field
- `validateForm()` - Validates all required fields
- `handleSubmit()` - Submits application
- `loadCategories()` - Fetches available service categories

#### 2. ApplicationStatusCard Component
**Location:** `client/src/components/ApplicationStatusCard.jsx`

**Purpose:** Displays current application status in user dashboard

**Props:**
```javascript
{
  application: {
    status: 'pending' | 'approved' | 'rejected',
    submittedAt: Date,
    reviewedAt: Date | null,
    rejectionReason: string | null
  }
}
```

#### 3. AdminApplicationManagement Component
**Location:** `client/src/components/admin/ApplicationManagement.jsx`

**Purpose:** Admin interface for reviewing applications

**State:**
```javascript
{
  applications: Application[],
  filter: 'all' | 'pending' | 'approved' | 'rejected',
  searchQuery: string,
  selectedApplication: Application | null,
  isProcessing: boolean
}
```

**Key Methods:**
- `loadApplications(filter, search)` - Fetches applications
- `viewApplication(id)` - Opens application details
- `approveApplication(id)` - Approves application
- `rejectApplication(id, reason)` - Rejects with reason

### Backend API Endpoints

#### POST /api/applications
**Purpose:** Submit provider application

**Authentication:** Required (client role only)

**Request Body:**
```javascript
{
  businessName: string,      // required, 2-100 chars
  bio: string,               // required, min 50 chars
  yearsOfExperience: number, // required, >= 0
  serviceCategories: number[], // required, array of category IDs
  phoneNumber: string,       // required, valid format
  serviceAddress: string     // required, 5-255 chars
}
```

**Response (201):**
```javascript
{
  success: true,
  message: "Application submitted successfully",
  application: {
    id: uuid,
    status: "pending",
    submittedAt: timestamp
  }
}
```

**Error Responses:**
- 400: Validation errors or duplicate application
- 401: Not authenticated
- 403: User is already a provider

#### GET /api/applications/my-status
**Purpose:** Get current user's application status

**Authentication:** Required (client role)

**Response (200):**
```javascript
{
  success: true,
  application: {
    id: uuid,
    status: "pending" | "approved" | "rejected",
    submittedAt: timestamp,
    reviewedAt: timestamp | null,
    rejectionReason: string | null,
    canReapply: boolean,
    reapplyDate: timestamp | null
  } | null
}
```

#### GET /api/admin/applications
**Purpose:** List all applications with filtering

**Authentication:** Required (admin role only)

**Query Parameters:**
- `status`: 'pending' | 'approved' | 'rejected' | 'all'
- `search`: string (searches name/email)
- `page`: number
- `limit`: number

**Response (200):**
```javascript
{
  success: true,
  applications: [{
    id: uuid,
    userId: uuid,
    applicantName: string,
    applicantEmail: string,
    businessName: string,
    bio: string,
    yearsOfExperience: number,
    serviceCategories: string[], // category names
    phoneNumber: string,
    serviceAddress: string,
    status: string,
    submittedAt: timestamp,
    reviewedAt: timestamp | null,
    reviewedBy: uuid | null,
    reviewerName: string | null,
    rejectionReason: string | null
  }],
  pagination: {
    total: number,
    page: number,
    limit: number,
    totalPages: number
  },
  counts: {
    pending: number,
    approved: number,
    rejected: number
  }
}
```

#### PATCH /api/admin/applications/:id/approve
**Purpose:** Approve a provider application

**Authentication:** Required (admin role only)

**Response (200):**
```javascript
{
  success: true,
  message: "Application approved successfully",
  application: {
    id: uuid,
    status: "approved",
    reviewedAt: timestamp,
    reviewedBy: uuid
  }
}
```

**Error Responses:**
- 404: Application not found
- 400: Application already processed
- 500: Transaction failure

#### PATCH /api/admin/applications/:id/reject
**Purpose:** Reject a provider application

**Authentication:** Required (admin role only)

**Request Body:**
```javascript
{
  rejectionReason: string // required, min 10 chars
}
```

**Response (200):**
```javascript
{
  success: true,
  message: "Application rejected",
  application: {
    id: uuid,
    status: "rejected",
    reviewedAt: timestamp,
    reviewedBy: uuid,
    rejectionReason: string
  }
}
```

## Data Models

### provider_applications Table

```sql
CREATE TABLE provider_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    business_name VARCHAR(100) NOT NULL,
    bio TEXT NOT NULL CHECK (LENGTH(bio) >= 50),
    years_of_experience INTEGER NOT NULL CHECK (years_of_experience >= 0),
    service_categories INTEGER[] NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    service_address VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'approved', 'rejected')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE NULL,
    reviewed_by UUID NULL REFERENCES users(id),
    rejection_reason TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT unique_pending_application_per_user 
        UNIQUE (user_id) WHERE (status = 'pending'),
    CONSTRAINT rejection_reason_required_when_rejected 
        CHECK (status != 'rejected' OR rejection_reason IS NOT NULL)
);

-- Indexes
CREATE INDEX idx_applications_user_id ON provider_applications(user_id);
CREATE INDEX idx_applications_status ON provider_applications(status);
CREATE INDEX idx_applications_submitted_at ON provider_applications(submitted_at DESC);
CREATE INDEX idx_applications_reviewed_by ON provider_applications(reviewed_by);
```

### Application Model Interface

```javascript
interface ProviderApplication {
  id: string;
  userId: string;
  businessName: string;
  bio: string;
  yearsOfExperience: number;
  serviceCategories: number[];
  phoneNumber: string;
  serviceAddress: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt: Date | null;
  reviewedBy: string | null;
  rejectionReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Valid Application Creation
*For any* client user with valid application data (all required fields present and valid), submitting an application should create a new application record with status 'pending' and the authenticated user's ID.
**Validates: Requirements 1.2, 2.7**

### Property 2: Required Field Validation
*For any* application submission missing one or more required fields (businessName, bio, yearsOfExperience, serviceCategories, phoneNumber, serviceAddress), the system should reject the submission with validation errors.
**Validates: Requirements 1.3, 2.1**

### Property 3: Bio Length Validation
*For any* application with a bio containing fewer than 50 characters, the system should reject the submission with a validation error.
**Validates: Requirements 2.2**

### Property 4: Experience Validation
*For any* application with negative years of experience or non-numeric experience value, the system should reject the submission with a validation error.
**Validates: Requirements 2.3**

### Property 5: Phone Number Format Validation
*For any* application with an invalid phone number format, the system should reject the submission with a validation error.
**Validates: Requirements 2.5**

### Property 6: Duplicate Application Prevention
*For any* user with a pending application, attempting to submit another application should fail and return the existing application status.
**Validates: Requirements 1.4**

### Property 7: Provider Restriction
*For any* user with user_type 'provider' or 'admin', attempting to submit a provider application should be rejected with an authorization error.
**Validates: Requirements 8.5**

### Property 8: Application Timestamp Recording
*For any* successfully created application, the submitted_at field should be set to a non-null timestamp.
**Validates: Requirements 2.6**

### Property 9: Status Display Accuracy
*For any* application, when an applicant views their status, the returned status should match the application's current status in the database.
**Validates: Requirements 3.1**

### Property 10: Rejection Reason Display
*For any* rejected application, when the applicant views their status, the response should include the rejection reason provided by the admin.
**Validates: Requirements 3.4**

### Property 11: Reapplication Time Restriction
*For any* user with a rejected application less than 30 days old, attempting to submit a new application should be rejected; for rejections 30+ days old, new applications should be allowed.
**Validates: Requirements 3.5**

### Property 12: Admin Application Listing
*For any* set of pending applications in the database, when an admin requests pending applications, all pending applications should be returned with applicant details.
**Validates: Requirements 4.1**

### Property 13: Application Detail Completeness
*For any* application, when an admin views the application details, the response should include all submitted fields: businessName, bio, yearsOfExperience, serviceCategories, phoneNumber, serviceAddress, and submittedAt.
**Validates: Requirements 4.2**

### Property 14: Approval Status Update
*For any* pending application, when an admin approves it, the application status should be updated to 'approved', reviewedAt should be set to the current timestamp, and reviewedBy should be set to the admin's ID.
**Validates: Requirements 4.3**

### Property 15: Rejection Reason Requirement
*For any* application, attempting to reject it without providing a rejection reason should fail; rejecting with a reason should succeed and update the status to 'rejected'.
**Validates: Requirements 4.4**

### Property 16: User Role Promotion on Approval
*For any* approved application, the associated user's user_type should be updated from 'client' to 'provider'.
**Validates: Requirements 4.5**

### Property 17: Profile Update on Approval
*For any* approved application, the associated user's profile should be updated with the application data: bio, experience (years_of_experience), and address (service_address).
**Validates: Requirements 4.6**

### Property 18: Application Filtering
*For any* status filter ('pending', 'approved', 'rejected'), when an admin requests applications with that filter, all returned applications should have the specified status.
**Validates: Requirements 6.3**

### Property 19: Application Search
*For any* search query, when an admin searches applications, all returned applications should have applicant names or emails that match the search query (case-insensitive).
**Validates: Requirements 6.4**

### Property 20: Application Count Accuracy
*For any* set of applications in the database, the counts returned for pending, approved, and rejected applications should match the actual number of applications with each status.
**Validates: Requirements 6.5**

### Property 21: Foreign Key Integrity
*For any* attempt to create an application with a non-existent user_id, the system should reject the operation with a foreign key constraint error.
**Validates: Requirements 8.2**

### Property 22: User Deletion Prevention
*For any* user with associated applications, attempting to delete the user account should fail with a referential integrity error.
**Validates: Requirements 8.3**

### Property 23: Approval Transaction Atomicity
*For any* application approval, if the user profile update fails, the user_type should not be changed and the application status should remain 'pending' (all-or-nothing).
**Validates: Requirements 8.4**

## Error Handling

### Validation Errors
- Return 400 status with detailed field-level errors
- Include field name and specific validation failure reason
- Use consistent error response format:
```javascript
{
  success: false,
  errors: {
    fieldName: "Error message"
  }
}
```

### Authorization Errors
- Return 403 for users attempting actions outside their role
- Return 401 for unauthenticated requests
- Clear error messages without exposing system details

### Database Errors
- Wrap database operations in try-catch blocks
- Use transactions for multi-step operations (approval process)
- Rollback transactions on any failure
- Log detailed errors server-side
- Return generic error messages to clients

### Duplicate Application Handling
- Check for existing pending application before creation
- Return 400 with existing application details
- Include status and submission date in error response

### Notification Failures
- Log notification failures but don't fail the main operation
- Implement retry mechanism for failed notifications
- Store notification status for audit trail

## Testing Strategy

### Unit Tests
- Test individual validation functions (bio length, phone format, experience range)
- Test database model methods (create, update, query)
- Test service layer methods in isolation
- Test API route handlers with mocked dependencies
- Test specific edge cases:
  - Empty string vs null values
  - Boundary values (exactly 50 characters for bio)
  - Invalid category IDs
  - Concurrent application submissions

### Property-Based Tests
- Use a property-based testing library (fast-check for JavaScript/TypeScript)
- Configure each test to run minimum 100 iterations
- Tag each test with: **Feature: provider-application-system, Property {number}: {property_text}**
- Generate random valid and invalid application data
- Test validation rules across wide input ranges
- Test status transitions and state consistency
- Test filtering and search with random datasets

### Integration Tests
- Test complete application submission flow
- Test approval flow with database transactions
- Test rejection flow with notification
- Test concurrent application submissions
- Test admin review workflow
- Test status tracking across user sessions

### End-to-End Tests
- Test user journey from application to approval
- Test admin review process
- Test notification delivery
- Test UI interactions and form validation
- Test error handling and recovery

## Implementation Notes

### Security Considerations
- Validate user role on every endpoint
- Prevent SQL injection with parameterized queries
- Sanitize user input before storage
- Rate limit application submissions (max 1 per 30 days if rejected)
- Log all admin actions for audit trail

### Performance Considerations
- Index frequently queried fields (status, user_id, submitted_at)
- Paginate admin application lists
- Cache category list for form dropdown
- Use database transactions efficiently
- Implement query optimization for search and filtering

### Scalability Considerations
- Design for horizontal scaling of API servers
- Use connection pooling for database
- Implement async notification sending
- Consider message queue for notifications at scale
- Design database schema to avoid hotspots

### Future Enhancements
- Email notifications for status changes
- Document upload for verification (ID, certifications)
- Multi-step application process
- Application scoring/ranking system
- Automated approval for qualified applicants
- Provider onboarding workflow after approval
- Application analytics dashboard
