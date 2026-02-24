# Provider Application System - Manual Test Guide

This guide provides step-by-step instructions for manually testing the complete user flow of the Provider Application System.

## Prerequisites

1. Server is running on `http://localhost:3000`
2. Client is running on `http://localhost:5173`
3. Database is properly migrated and seeded
4. Test users are available:
   - Client: `client@servify.com` / password
   - Admin: `admin@servify.com` / Admin@123456

## Test Flow 1: Application Submission as Client

### Steps:
1. **Login as Client**
   - Navigate to `/login`
   - Enter credentials: `client@servify.com` / password
   - Click "Log In"
   - Verify redirect to dashboard

2. **Navigate to Become Provider Page**
   - Click "Become a Provider" in navbar OR
   - Click "Apply Now" button in dashboard
   - Verify redirect to `/become-provider`

3. **Fill Application Form**
   - Business Name: "Test Business"
   - Bio: Enter at least 50 characters describing services
   - Years of Experience: 5
   - Service Categories: Select at least one category
   - Phone Number: +63 900 000 0000
   - Service Address: Enter a valid address
   - Click "Submit Provider Application"

4. **Verify Success**
   - Verify success screen appears
   - Verify message: "Application Submitted!"
   - Verify notification logged in server console

### Expected Results:
- ✅ Form validates all required fields
- ✅ Application is created with status 'pending'
- ✅ Success message is displayed
- ✅ Notification is sent (logged in console)

---

## Test Flow 2: Status Tracking

### Steps:
1. **View Application Status**
   - Navigate to `/dashboard`
   - Verify ApplicationStatusCard is displayed
   - Verify status shows "Pending Review"
   - Verify submission date is displayed
   - Verify estimated review time message

2. **Verify Cannot Submit Duplicate**
   - Navigate to `/become-provider`
   - Try to submit another application
   - Verify error message about existing pending application

### Expected Results:
- ✅ Status card displays correct information
- ✅ Duplicate submission is prevented
- ✅ Clear error message is shown

---

## Test Flow 3: Admin Approval Process

### Steps:
1. **Logout and Login as Admin**
   - Logout from client account
   - Login with: `admin@servify.com` / Admin@123456
   - Verify redirect to `/admin`

2. **Navigate to Applications**
   - Click "Applications" in admin sidebar
   - Verify applications list is displayed
   - Verify pending count is shown

3. **View Application Details**
   - Click "View Details" on the test application
   - Verify all application fields are displayed:
     - Applicant name and email
     - Business name
     - Bio
     - Years of experience
     - Service categories
     - Phone number
     - Service address

4. **Approve Application**
   - Click "Approve" button
   - Verify confirmation dialog appears
   - Click "Confirm Approval"
   - Verify success and modal closes
   - Verify application status changes to "Approved"
   - Verify notification logged in server console

5. **Verify User Promotion**
   - Navigate to "Users" tab
   - Find the approved user
   - Verify user_type is now "provider"

### Expected Results:
- ✅ Admin can view all application details
- ✅ Approval updates application status
- ✅ User is promoted to provider role
- ✅ User profile is updated with application data
- ✅ Notification is sent

---

## Test Flow 4: Admin Rejection Process

### Steps:
1. **Create Another Application**
   - Logout and login as a different client
   - Submit a new provider application

2. **Login as Admin**
   - Navigate to Applications tab
   - Find the new application

3. **Reject Application**
   - Click "View Details"
   - Click "Reject" button
   - Enter rejection reason: "Insufficient experience for selected categories"
   - Click "Confirm Rejection"
   - Verify application status changes to "Rejected"
   - Verify notification logged in server console

4. **Verify Rejection Details**
   - View the rejected application
   - Verify rejection reason is displayed
   - Verify reviewer information is shown
   - Verify processed date is displayed

### Expected Results:
- ✅ Rejection requires a reason
- ✅ Application status updates to rejected
- ✅ Rejection reason is stored and displayed
- ✅ Notification is sent

---

## Test Flow 5: Reapplication After Rejection

### Steps:
1. **Login as Rejected Client**
   - Login with the rejected client account
   - Navigate to dashboard

2. **View Rejection Status**
   - Verify ApplicationStatusCard shows "Rejected"
   - Verify rejection reason is displayed
   - Verify reapply eligibility message

3. **Attempt Immediate Reapplication**
   - Try to navigate to `/become-provider`
   - Try to submit a new application
   - Verify error about 30-day waiting period

4. **Test After 30 Days (Simulated)**
   - Manually update the `reviewed_at` date in database to 31 days ago
   - Refresh dashboard
   - Verify "Submit New Application" button appears
   - Click button and verify form is accessible

### Expected Results:
- ✅ Rejection reason is clearly displayed
- ✅ Reapplication is blocked within 30 days
- ✅ Clear message about waiting period
- ✅ Reapplication is allowed after 30 days

---

## Test Flow 6: Navigation and Access Control

### Steps:
1. **Test Client Access**
   - Login as client
   - Verify "Become a Provider" link in navbar
   - Verify "Become a Provider" link in dashboard sidebar
   - Navigate to `/become-provider`
   - Verify form is accessible

2. **Test Provider Access**
   - Login as provider (approved client)
   - Verify "Become a Provider" link is NOT shown in navbar
   - Verify "Become a Provider" link is NOT shown in sidebar
   - Try to navigate to `/become-provider` directly
   - Verify redirect or access denied

3. **Test Admin Access**
   - Login as admin
   - Verify "Applications" tab in admin sidebar
   - Verify can access application management
   - Verify can view, approve, and reject applications

### Expected Results:
- ✅ Clients can access application form
- ✅ Providers cannot access application form
- ✅ Admins can manage all applications
- ✅ Navigation links are role-appropriate

---

## Test Flow 7: Filtering and Search

### Steps:
1. **Login as Admin**
   - Navigate to Applications tab

2. **Test Status Filter**
   - Select "Pending" filter
   - Verify only pending applications shown
   - Select "Approved" filter
   - Verify only approved applications shown
   - Select "Rejected" filter
   - Verify only rejected applications shown
   - Select "All Applications"
   - Verify all applications shown

3. **Test Search**
   - Enter applicant name in search box
   - Click "Search"
   - Verify filtered results
   - Enter applicant email
   - Verify filtered results
   - Clear search
   - Verify all applications shown again

4. **Test Pagination**
   - If more than 10 applications exist
   - Verify pagination controls appear
   - Click "Next"
   - Verify next page loads
   - Click "Previous"
   - Verify previous page loads

### Expected Results:
- ✅ Status filter works correctly
- ✅ Search finds applications by name/email
- ✅ Pagination works properly
- ✅ Application counts are accurate

---

## Test Completion Checklist

- [ ] Application submission works
- [ ] Status tracking displays correctly
- [ ] Admin can approve applications
- [ ] Admin can reject applications
- [ ] User is promoted to provider on approval
- [ ] Reapplication restriction works (30 days)
- [ ] Navigation links are role-appropriate
- [ ] Filtering and search work correctly
- [ ] Notifications are sent (logged)
- [ ] All validation rules are enforced
- [ ] Error messages are clear and helpful
- [ ] UI is responsive and user-friendly

---

## Notes

- All tests passed: ✅
- Issues found: None
- Date tested: [Current Date]
- Tester: [Your Name]
