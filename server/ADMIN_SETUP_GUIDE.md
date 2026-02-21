# Admin Backend Setup Guide

## Quick Start

### Step 1: Seed Admin User

Run the admin seeding script to create the default admin account:

```bash
cd server
node scripts/seedAdmin.js
```

**Output:**
```
✓ Admin user created successfully
Admin Details:
  Email: admin@servify.com
  Password: Admin@123456
  ID: <admin_uuid>

⚠️  IMPORTANT: Change the admin password after first login!
```

### Step 2: Start the Server

```bash
npm start
# or with nodemon for development
npm run dev
```

### Step 3: Login as Admin

Get your JWT token:

```bash
curl -X POST "http://localhost:3000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@servify.com",
    "password": "Admin@123456"
  }'
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Step 4: Use Admin Endpoints

Example - Get all users:

```bash
curl -X GET "http://localhost:3000/api/v1/admin/users" \
  -H "Authorization: Bearer <your_access_token>"
```

---

## Admin Endpoints Overview

### User Management
- `GET /api/v1/admin/users` - List all users
- `GET /api/v1/admin/users/:id` - Get user details
- `PATCH /api/v1/admin/users/:id/activate` - Activate user
- `PATCH /api/v1/admin/users/:id/deactivate` - Deactivate user
- `PATCH /api/v1/admin/users/:id/verify` - Verify provider

### Category Management
- `GET /api/v1/admin/categories` - List categories
- `POST /api/v1/admin/categories` - Create category
- `PUT /api/v1/admin/categories/:id` - Update category
- `DELETE /api/v1/admin/categories/:id` - Delete category

### Service Moderation
- `GET /api/v1/admin/services` - List services
- `GET /api/v1/admin/services/:id` - Get service details
- `PATCH /api/v1/admin/services/:id/toggle` - Toggle service status

### Booking Monitoring
- `GET /api/v1/admin/bookings` - List bookings
- `GET /api/v1/admin/bookings/:id` - Get booking details

### Review Moderation
- `GET /api/v1/admin/reviews` - List reviews
- `GET /api/v1/admin/reviews/:id` - Get review details
- `DELETE /api/v1/admin/reviews/:id` - Delete review

### Dashboard
- `GET /api/v1/admin/dashboard` - Get platform metrics

---

## File Structure

```
server/
├── controllers/
│   └── adminController.js          # Admin request handlers
├── services/
│   └── adminService.js             # Database queries
├── routes/
│   └── adminRoutes.js              # Admin endpoints
├── middlewares/
│   ├── authMiddleware.js           # JWT verification
│   ├── roleMiddleware.js           # Role authorization
│   └── adminValidation.js          # Input validation
├── scripts/
│   └── seedAdmin.js                # Admin seeding script
├── ADMIN_API_DOCUMENTATION.md      # Full API docs
└── ADMIN_SETUP_GUIDE.md            # This file
```

---

## Key Features

### ✅ Security
- JWT-based authentication
- Role-based access control (RBAC)
- Parameterized SQL queries (SQL injection prevention)
- Admin cannot deactivate own account
- Password hashing with bcrypt

### ✅ Functionality
- User management (activate, deactivate, verify)
- Category CRUD operations
- Service moderation (toggle status)
- Booking monitoring (read-only)
- Review moderation (delete inappropriate reviews)
- Dashboard metrics (platform statistics)

### ✅ Data Validation
- UUID format validation
- Pagination validation (1-100 records)
- Role filter validation
- Status filter validation
- Category name validation

### ✅ Error Handling
- Consistent error response format
- Appropriate HTTP status codes
- Descriptive error messages
- Validation error details

---

## Common Tasks

### Create a New Category

```bash
curl -X POST "http://localhost:3000/api/v1/admin/categories" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "UI/UX Design",
    "description": "User interface and experience design services"
  }'
```

### Verify a Provider

```bash
curl -X PATCH "http://localhost:3000/api/v1/admin/users/<provider_id>/verify" \
  -H "Authorization: Bearer <token>"
```

### Deactivate a Service

```bash
curl -X PATCH "http://localhost:3000/api/v1/admin/services/<service_id>/toggle" \
  -H "Authorization: Bearer <token>"
```

### Get Dashboard Metrics

```bash
curl -X GET "http://localhost:3000/api/v1/admin/dashboard" \
  -H "Authorization: Bearer <token>"
```

### List Pending Bookings

```bash
curl -X GET "http://localhost:3000/api/v1/admin/bookings?status=pending" \
  -H "Authorization: Bearer <token>"
```

---

## Pagination Examples

### Get First 10 Users
```bash
curl -X GET "http://localhost:3000/api/v1/admin/users?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

### Get Next 10 Users
```bash
curl -X GET "http://localhost:3000/api/v1/admin/users?page=2&limit=10" \
  -H "Authorization: Bearer <token>"
```

### Get 50 Users Per Page
```bash
curl -X GET "http://localhost:3000/api/v1/admin/users?page=1&limit=50" \
  -H "Authorization: Bearer <token>"
```

---

## Filtering Examples

### Filter Users by Role
```bash
curl -X GET "http://localhost:3000/api/v1/admin/users?role=provider" \
  -H "Authorization: Bearer <token>"
```

### Filter Services by Category
```bash
curl -X GET "http://localhost:3000/api/v1/admin/services?category_id=1" \
  -H "Authorization: Bearer <token>"
```

### Search Services by Title
```bash
curl -X GET "http://localhost:3000/api/v1/admin/services?search=web" \
  -H "Authorization: Bearer <token>"
```

### Filter Bookings by Status
```bash
curl -X GET "http://localhost:3000/api/v1/admin/bookings?status=completed" \
  -H "Authorization: Bearer <token>"
```

### Filter Reviews by Rating
```bash
curl -X GET "http://localhost:3000/api/v1/admin/reviews?rating=5" \
  -H "Authorization: Bearer <token>"
```

---

## Troubleshooting

### Issue: "Admin user already exists"
**Solution:** The admin user has already been seeded. Use the existing credentials to login.

### Issue: "Forbidden" error on admin endpoints
**Solution:** Ensure you're using a valid JWT token from an admin account. Non-admin users cannot access admin endpoints.

### Issue: "Invalid user ID format"
**Solution:** Ensure the user ID is a valid UUID format (e.g., `550e8400-e29b-41d4-a716-446655440000`).

### Issue: "Category name already exists"
**Solution:** Category names must be unique. Choose a different name or update the existing category.

### Issue: "Cannot delete category. It is used by X service(s)"
**Solution:** Deactivate or reassign services to a different category before deleting.

---

## Security Best Practices

1. **Change Default Admin Password**
   - After first login, change the admin password immediately
   - Use a strong password (min 12 characters, mix of upper/lower/numbers/symbols)

2. **Protect JWT Tokens**
   - Never share tokens in URLs or logs
   - Store tokens securely on the client side
   - Use HTTPS in production

3. **Audit Admin Actions**
   - Log all admin actions for compliance
   - Review logs regularly for suspicious activity

4. **Limit Admin Accounts**
   - Create separate admin accounts for each administrator
   - Disable unused admin accounts
   - Use role-based access control

5. **Regular Backups**
   - Backup database regularly
   - Test backup restoration procedures

---

## Performance Tips

1. **Use Pagination**
   - Always use pagination for large datasets
   - Default limit is 10, max is 100

2. **Filter Efficiently**
   - Use specific filters to reduce result sets
   - Combine filters for more precise results

3. **Monitor Dashboard**
   - Check dashboard metrics regularly
   - Monitor pending bookings and new users

---

## Next Steps

1. ✅ Seed admin user
2. ✅ Start the server
3. ✅ Login and get JWT token
4. ✅ Test admin endpoints
5. ✅ Create categories
6. ✅ Verify providers
7. ✅ Monitor bookings and reviews
8. ✅ View dashboard metrics

---

## Support

For detailed API documentation, see `ADMIN_API_DOCUMENTATION.md`

For issues or questions, contact the development team.
