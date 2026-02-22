# Admin Frontend Setup & Testing Guide

## Prerequisites
- Node.js (v16+)
- PostgreSQL running locally
- Git

## Step 1: Database Setup

### 1.1 Ensure PostgreSQL is Running
```bash
# On Windows (if using PostgreSQL service)
# PostgreSQL should be running as a service

# On macOS (if using Homebrew)
brew services start postgresql

# On Linux
sudo systemctl start postgresql
```

### 1.2 Create Database (if not already created)
```bash
# Connect to PostgreSQL
psql -U postgres

# In psql terminal:
CREATE DATABASE servify;
CREATE USER servify WITH PASSWORD 'servify_2347socia';
ALTER ROLE servify WITH CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE servify TO servify;
\q
```

## Step 2: Backend Setup

### 2.1 Install Dependencies
```bash
cd server
npm install
```

### 2.2 Run Database Migrations
```bash
npm run migrate
```

### 2.3 Seed Admin User
```bash
npm run seed:admin
```

**Output should show:**
```
✓ Admin user created successfully
Admin Details:
  Email: admin@servify.com
  Password: Admin@123456
  ID: [some-id]

⚠️  IMPORTANT: Change the admin password after first login!
```

### 2.4 Start Backend Server
```bash
npm run dev
```

**Expected output:**
```
Server is running on port 3000
```

## Step 3: Frontend Setup

### 3.1 Install Dependencies
```bash
cd client
npm install
```

### 3.2 Create .env.local (if needed)
```bash
# In client directory, create .env.local
VITE_API_URL=http://localhost:3000/api/v1
```

### 3.3 Start Frontend Development Server
```bash
npm run dev
```

**Expected output:**
```
  VITE v7.3.1  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

## Step 4: Login as Admin

### 4.1 Navigate to Login Page
- Open browser: `http://localhost:5173`
- You should see the login page

### 4.2 Enter Admin Credentials
```
Email: admin@servify.com
Password: Admin@123456
```

### 4.3 Click Login
- You'll be redirected to the admin dashboard

## Step 5: Test Admin Features

### 5.1 Dashboard Overview
- **URL**: `http://localhost:5173/admin`
- **Features to test**:
  - View key metrics (Total Users, Total Providers, Bookings Today, Open Reports)
  - See recent users table
  - All stats should load from the backend

### 5.2 User Management
- **Navigation**: Click "Users" in sidebar
- **Features to test**:
  - View paginated list of users
  - Click "View" to see user details
  - Activate/Deactivate users
  - Search and filter by role
  - Verify toast notifications appear

### 5.3 Provider Management
- **Navigation**: Click "Providers" in sidebar
- **Features to test**:
  - View list of service providers
  - Click "View" to see provider details
  - Verify provider information
  - Test verification status updates

### 5.4 Service Moderation
- **Navigation**: Click "Services" in sidebar
- **Features to test**:
  - View paginated list of services
  - Toggle service status (active/inactive)
  - View service details
  - Verify status changes persist

### 5.5 Booking Monitoring
- **Navigation**: Click "Bookings" in sidebar
- **Features to test**:
  - View paginated list of bookings
  - Filter by status (pending, confirmed, completed, cancelled)
  - Click "View" to see booking details
  - Verify filtering works correctly

### 5.6 Review Moderation
- **Navigation**: Click "Reviews" in sidebar
- **Features to test**:
  - View paginated list of reviews
  - Filter by rating (1-5 stars)
  - Click "View" to see review details
  - Delete inappropriate reviews
  - Verify deletion removes review from list

### 5.7 Category Management
- **Navigation**: Click "Categories" in sidebar
- **Features to test**:
  - View list of categories
  - Click "Add Category" to create new category
  - Fill in name and description
  - Click "Save"
  - Edit existing categories
  - Delete categories
  - Verify changes persist

## Step 6: Test Responsive Design

### 6.1 Desktop View (1920px+)
- Sidebar visible on left
- Full layout with all columns
- All features accessible

### 6.2 Tablet View (768px - 1024px)
- Sidebar hidden by default
- Content takes full width
- Responsive grid layouts

### 6.3 Mobile View (< 768px)
- Sidebar hidden
- Single column layout
- Touch-friendly buttons
- Responsive tables

**To test responsive design:**
1. Open DevTools (F12)
2. Click device toggle (Ctrl+Shift+M)
3. Select different device sizes
4. Test navigation and interactions

## Step 7: Test Error Handling

### 7.1 Network Error
- Stop backend server
- Try to perform any action
- Should see error toast: "Connection error. Please try again."

### 7.2 Unauthorized Error
- Clear localStorage (DevTools > Application > Local Storage > Clear All)
- Refresh page
- Should redirect to login

### 7.3 Validation Error
- Try to create category without name
- Should see validation error message

## Step 8: Troubleshooting

### Issue: "Connection refused" error
**Solution:**
- Ensure backend is running on port 3000
- Check `.env` file has correct database credentials
- Verify PostgreSQL is running

### Issue: "Database does not exist"
**Solution:**
```bash
# Create database
psql -U postgres -c "CREATE DATABASE servify;"
# Run migrations
npm run migrate
```

### Issue: Admin user not found
**Solution:**
```bash
# Reseed admin user
npm run seed:admin
```

### Issue: CORS errors
**Solution:**
- Ensure frontend is running on `http://localhost:5173`
- Check `server/index.js` has correct CORS origins
- Restart backend server

### Issue: Tailwind styles not loading
**Solution:**
```bash
cd client
npm install
npm run dev
```

## Step 9: API Endpoints Reference

### Dashboard
- `GET /api/v1/admin/dashboard` - Get dashboard metrics

### Users
- `GET /api/v1/admin/users` - List users (paginated)
- `GET /api/v1/admin/users/:id` - Get user details
- `PATCH /api/v1/admin/users/:id/activate` - Activate user
- `PATCH /api/v1/admin/users/:id/deactivate` - Deactivate user
- `PATCH /api/v1/admin/users/:id/verify` - Verify provider

### Services
- `GET /api/v1/admin/services` - List services (paginated)
- `GET /api/v1/admin/services/:id` - Get service details
- `PATCH /api/v1/admin/services/:id/toggle` - Toggle service status

### Bookings
- `GET /api/v1/admin/bookings` - List bookings (paginated)
- `GET /api/v1/admin/bookings/:id` - Get booking details

### Reviews
- `GET /api/v1/admin/reviews` - List reviews (paginated)
- `GET /api/v1/admin/reviews/:id` - Get review details
- `DELETE /api/v1/admin/reviews/:id` - Delete review

### Categories
- `GET /api/v1/admin/categories` - List categories
- `POST /api/v1/admin/categories` - Create category
- `PUT /api/v1/admin/categories/:id` - Update category
- `DELETE /api/v1/admin/categories/:id` - Delete category

## Step 10: Quick Start Commands

```bash
# Terminal 1: Start Backend
cd server
npm install
npm run seed:admin
npm run dev

# Terminal 2: Start Frontend
cd client
npm install
npm run dev

# Then open browser to http://localhost:5173
# Login with: admin@servify.com / Admin@123456
```

## Features Implemented

✅ Dashboard with metrics and recent users
✅ User management (list, view, activate, deactivate)
✅ Provider management (list, view, verify)
✅ Service moderation (list, view, toggle status)
✅ Booking monitoring (list, view, filter by status)
✅ Review moderation (list, view, delete, filter by rating)
✅ Category management (CRUD operations)
✅ Responsive design (mobile, tablet, desktop)
✅ Error handling with toast notifications
✅ Pagination and filtering
✅ shadcn/ui components with Tailwind CSS
✅ Professional dark sidebar navigation

## Next Steps

1. Change admin password after first login
2. Create test data (users, providers, services, bookings, reviews)
3. Test all workflows end-to-end
4. Deploy to production when ready

---

**Need help?** Check the error messages in browser console (F12) or server logs for debugging.
