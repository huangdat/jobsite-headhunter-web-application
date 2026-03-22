# Admin User URLs & Features - Quick Reference

## Available Admin URLs (After Login)

| Feature             | URL                     | Icon | Purpose                                                         |
| ------------------- | ----------------------- | ---- | --------------------------------------------------------------- |
| **Classification**  | `/users/classification` | 📁   | View & analyze user distribution by role, status, company, date |
| **User Management** | `/users`                | 👥   | View, search, manage all users                                  |
| **User Details**    | `/users/{userId}`       | 👤   | View/edit individual user profile                               |
| Dashboard           | `/home`                 | 📊   | Home page (available to all)                                    |

## Available API Endpoints for Admin

**Base URL**: `http://localhost:8081/headhunt`

| Endpoint                        | Method | Purpose                                      | Role Required |
| ------------------------------- | ------ | -------------------------------------------- | ------------- |
| `/api/account/search`           | GET    | **CLASSIFICATION** - Search & classify users | ADMIN         |
| `/api/account`                  | GET    | Get all users                                | ADMIN         |
| `/api/account/{id}`             | GET    | Get specific user                            | ADMIN         |
| `/api/account/{id}`             | PUT    | Update user                                  | ADMIN         |
| `/api/account/{id}/lock`        | POST   | Lock user account                            | ADMIN         |
| `/api/account/{id}/unlock`      | POST   | Unlock user account                          | ADMIN         |
| `/api/account/{id}/soft-delete` | DELETE | Soft delete (30 day hold)                    | ADMIN         |
| `/api/account/{id}`             | DELETE | Hard delete permanently                      | ADMIN         |

## Classification Feature Details

**Route**: `/users/classification`
**API Endpoint**: `/api/account/search`

### Group By Options:

- **Role**: Admin, Headhunter, Collaborator, Candidate
- **Status**: Active, Locked, Suspended, Pending
- **Company**: Group by company affiliation
- **Created Month**: Show users registered by month

### Example API Call:

```bash
curl -X GET "http://localhost:8081/headhunt/api/account/search?page=1&size=1000" \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json"
```

### Response Expected:

```json
{
  "result": {
    "items": [
      {
        "id": "user-id",
        "username": "admin",
        "fullName": "Admin User",
        "email": "admin@company.com",
        "role": "Admin",
        "status": "ACTIVE",
        "company": "HeadHunt",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "total": 150
  },
  "code": 200,
  "message": "success"
}
```

## How to Access Classification Feature

### **Web UI**:

1. Log in with admin account
2. Look for "User Classification" in left sidebar (category icon)
3. Click to navigate to `/users/classification`
4. Select grouping method (Role, Status, Company, Created Month)
5. View user distribution and analytics

### **Programmatically**:

```typescript
// Using the frontend API
const users = await usersApi.searchUsers({
  page: 1,
  size: 1000,
});

// Group using frontend utilities
const groups = groupUsersByRole(users.items);
```

## Error Handling

### **Permission Denied (403)**

```
Error Message: "Permission Denied"
Description: "You do not have permission to access the classification feature.
             Only administrators can view user classifications."
Solution: Contact system admin to grant ADMIN role
Button: "Try Again" (after permissions updated)
```

### **Unauthorized (401)**

```
Error Message: "Unauthorized"
Description: "Your session has expired. Please login again to continue."
Solution: Refresh page or log in again
```

### **Load Failed**

```
Error Message: "Failed to Load Classifications"
Description: "An unexpected error occurred while loading user data."
Solution: Check network connection, try again
```

## Admin Features Management

All admin features are configured in:

```
src/features/users/config/adminFeaturesConfig.ts
```

To **add a new admin feature**:

1. Add to `ADMIN_FEATURES_CONFIG` object
2. Create route in `router.tsx` with `AdminOnlyRoute` wrapper
3. Create page component
4. Feature auto-appears in sidebar

## Role-Based Access Control

**Admin Routes** (Protected by AdminOnlyRoute):

- `/users`
- `/users/classification` ← **NEW**
- `/users/{userId}`

**Anyone Can Access** (ProtectedRoute):

- `/home`
- `/change-password`

**Guest Only** (No authentication):

- `/login`
- `/register`
- `/forgot-password`

## Sidebar Navigation (Admin View)

```
┌─────────────────────────────┐
│ JobSite (Admin Panel)        │
├─────────────────────────────┤
│ 📊 Dashboard                │
│ 👥 Users                    │
│ 📁 User Classification ✨   │ ← NEW
│ 📋 Activity Logs            │
│ ⚙️  Settings                 │
├─────────────────────────────┤
│ [AD] Admin User             │
│      v1.0.0                 │
└─────────────────────────────┘
```

## Backend Prerequisites

To use these URLs, ensure:

1. **Backend running**: `http://localhost:8081/headhunt`
2. **Endpoints implemented**: Especially `/api/account/search`
3. **Security**: Backend validates `@PreAuthorize("hasAuthority('SCOPE_ADMIN')")`
4. **Token**: JWT token includes admin role/authorities
5. **CORS**: Configured to accept frontend origin

## Testing Admin Features

### **Test 1: Admin Access**

```bash
# Login as admin
POST /api/auth/login
{
  "username": "admin",
  "password": "password123"
}

# Response: Returns accessToken with role=admin

# Access classification
GET /api/account/search?page=1&size=1000
Headers: Authorization: Bearer {accessToken}

# Expected: 200 OK with user list
```

### **Test 2: Non-Admin Access**

```bash
# Login as non-admin
POST /api/auth/login
{
  "username": "candidate",
  "password": "password123"
}

# Try to access classification
GET /api/account/search?page=1&size=1000
Headers: Authorization: Bearer {candidateToken}

# Expected: 403 Forbidden
```

### **Test 3: Web UI Access**

1. Visit `http://localhost:3000`
2. Log in with admin credentials
3. Verify sidebar shows classification link
4. Click to load `/users/classification`
5. Verify user groups display correctly

## Troubleshooting

| Issue                              | Solution                                      |
| ---------------------------------- | --------------------------------------------- |
| Classification link doesn't appear | Check user role is "admin" in dev tools       |
| 403 Permission Denied error        | Backend endpoint requires ADMIN authority     |
| Page redirects to home             | User role not recognized as admin             |
| Sidebar links missing              | Feature config not loaded (check config file) |
| API 404 on `/api/account/search`   | Backend endpoint not implemented yet          |

---

**For complete technical details**, see `ADMIN_INTEGRATION_REPORT.md`
