# Admin Panel - Quick Start (5 Minutes)

## 🚀 Quick Setup

### Terminal 1: Backend
```bash
cd server
npm install
npm run seed:admin
npm run dev
```

### Terminal 2: Frontend
```bash
cd client
npm install
npm run dev
```

### Browser
```
http://localhost:5173
```

## 🔐 Login Credentials

```
Email:    admin@servify.com
Password: Admin@123456
```

## 📋 Admin Features

| Feature | Path | What You Can Do |
|---------|------|-----------------|
| **Dashboard** | Overview | View metrics, recent users |
| **Users** | Users | List, view, activate, deactivate users |
| **Providers** | Providers | List, view, verify providers |
| **Services** | Services | List, view, toggle service status |
| **Bookings** | Bookings | List, view, filter by status |
| **Reviews** | Reviews | List, view, delete, filter by rating |
| **Categories** | Categories | Create, edit, delete categories |

## ✨ Key Features

✅ **Responsive Design** - Works on mobile, tablet, desktop
✅ **Real-time Updates** - Changes reflect immediately
✅ **Error Handling** - Clear error messages
✅ **Pagination** - Navigate through large datasets
✅ **Filtering** - Filter by status, role, rating
✅ **Modals** - View details and edit in modals
✅ **Toast Notifications** - Success/error feedback
✅ **Professional UI** - shadcn/ui + Tailwind CSS

## 🧪 Quick Test Workflow

1. **Login** → Use credentials above
2. **Dashboard** → See metrics and recent users
3. **Users** → Click "View" on any user
4. **Categories** → Click "Add Category" to create one
5. **Reviews** → Filter by rating, delete a review
6. **Responsive** → Press F12, toggle device toolbar

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Connection refused | Ensure backend running on port 3000 |
| Database error | Run `npm run seed:admin` in server |
| Styles not loading | Run `npm install` in client |
| Can't login | Check credentials: admin@servify.com / Admin@123456 |

## 📱 Test on Different Screens

```bash
# In browser DevTools (F12)
Ctrl+Shift+M  # Toggle device toolbar
# Select: iPhone, iPad, Desktop
```

## 🔗 Important URLs

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **Admin Dashboard**: http://localhost:5173/admin
- **API Base**: http://localhost:3000/api/v1

## 📊 Test Data

The system comes with:
- ✅ Admin user (created by seed script)
- ✅ Sample users, providers, services, bookings, reviews
- ✅ Categories for services

## 🎯 What to Test

1. **Navigation** - Click all sidebar items
2. **Pagination** - Go through pages
3. **Filtering** - Use filters on each page
4. **CRUD** - Create, read, update, delete categories
5. **Modals** - Open and close detail modals
6. **Responsive** - Test on different screen sizes
7. **Errors** - Stop backend and see error handling
8. **Notifications** - Perform actions and see toasts

## 💡 Pro Tips

- **Refresh data**: Click navigation item again
- **Clear filters**: Select "All" in filter dropdowns
- **View details**: Click "View" button on any row
- **Edit categories**: Click "Edit" on category card
- **Delete safely**: Confirmation dialog appears
- **Mobile menu**: Sidebar hides on mobile (< 768px)

## 🚨 Important Notes

⚠️ **Change admin password** after first login
⚠️ **Don't commit credentials** to version control
⚠️ **Use HTTPS** in production
⚠️ **Validate all inputs** on backend

---

**Ready to test?** Follow the Quick Setup above and you'll be in the admin panel in 5 minutes!
