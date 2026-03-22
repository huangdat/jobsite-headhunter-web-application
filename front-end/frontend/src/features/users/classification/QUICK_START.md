# User Classification - Quick Start Guide

## 🎯 What Is This Feature?

The User Classification feature allows admins to group users by:
- **Role** (Admin, Headhunter, Collaborator, Candidate)
- **Status** (Active, Locked, Suspended, Pending)
- **Company** (Company name)
- **Created Month** (Registration month)

Each group shows statistics: count, %, active/inactive breakdown, with an interactive dashboard.

## 🚀 Quick Links

- **URL**: `http://localhost:5173/users/classification`
- **Navigation**: Sidebar > Users > Classification
- **Components**: `src/features/users/classification/`

---

## 📁 File Structure

```
classification/
├── pages/
│   └── UserClassificationPage.tsx      ← Entry point (use this!)
├── components/
│   ├── UserClassificationHeader.tsx     (dropdown + stats)
│   ├── UserClassificationGroup.tsx      (group card)
│   ├── UserClassificationOverview.tsx   (layout)
│   └── index.ts
├── hooks/
│   ├── useUserClassification.ts         (main logic)
│   └── index.ts
├── types/
│   └── classification.types.ts          (TypeScript types)
├── utils/
│   ├── groupingConfig.ts                (grouping rules)
│   ├── classificationUtils.ts           (calculations)
│   └── [more utils...]
├── index.ts                             (re-exports)
├── CLASSIFICATION_GUIDE.md              (detailed docs)
└── IMPLEMENTATION_SUMMARY.md            (this feature explained)
```

---

## 💡 Usage Examples

### Display Classification Page

```tsx
import { UserClassificationPage } from "@/features/users/classification";

function MyComponent() {
  return <UserClassificationPage />;
}
```

### Use the Hook Directly

```tsx
import { useUserClassification } from "@/features/users/classification";

function MyStats() {
  const {
    groups,           // Grouped users with stats
    overviewStats,    // Total stats (activeRate, totalUsers, etc.)
    loading,          // Is data loading?
    error,            // Error message if any
    groupBy,          // Current grouping field
    setGroupBy,       // Change grouping (e.g., "role" → "status")
    toggleGroup,      // Expand/collapse individual group
    expandAll,        // Expand all groups
    collapseAll,      // Collapse all groups
  } = useUserClassification();

  return (
    <div>
      <p>Total Users: {overviewStats.totalUsers}</p>
      <p>Active Rate: {overviewStats.activeRate}%</p>
      {/* Use groups array */}
    </div>
  );
}
```

### Add New Grouping Field

Example: Add grouping by `department`

**1. Update Type** (`classification.types.ts`):
```typescript
export type ClassificationGroupBy = 
  "role" | "status" | "company" | "createdMonth" | "department";  // ← ADD
```

**2. Add Config** (`groupingConfig.ts`):
```typescript
export const groupingConfigs: Record<string, GroupingConfig> = {
  // ... existing ...
  
  department: {  // ← ADD
    field: "department",
    label: "Department",
    description: "Group users by department",
    extractKey: (user: UserDetail) => user.department || "Unknown",
    getDisplayName: (key: string) => key,
    getSubtitle: (key: string) => `${key} department members`,
    getIconType: () => "company",
    getColorScheme: () => "blue",
  },
};
```

**3. Add Translation** (both `en/users.json` and `vi/users.json`):
```json
{
  "classification": {
    "groupBy_department": "Group by Department",
    "departmentDescription": "Group users by their department"
  }
}
```

That's it! The dropdown will automatically show the new option.

---

## 🎨 Component Overview

### UserClassificationPage
**Level**: Top component
- Coordinates everything
- Manages navigation
- Shows page layout

### UserClassificationOverview
**Level**: Container component
- Main layout
- Combines header + groups + dashboard
- Manages expand/collapse state

### UserClassificationHeader
**Level**: UI component
- Group By dropdown
- Stats summary (Total, Active Rate)
- Expand/Collapse All buttons

### UserClassificationGroup
**Level**: UI component (repeated)
- Individual group card
- Collapsible header with stats
- User list (when expanded)
- Shows avatar, name, email, status

---

## 📊 Data Calculations

### Per-Group Statistics
```typescript
{
  totalCount: 124,              // Total users in group
  percentage: 1.0,             // % of all users
  activeCount: 120,            // Active users in group
  inactiveCount: 4,            // Inactive users in group
  activePercentage: 96.7,      // % active within group
}
```

### Overview Statistics
```typescript
{
  totalUsers: 12482,           // All users
  activeRate: 94.2,            // % active overall
  groupCount: 4,               // Number of groups
  totalActiveUsers: 11750,     // Active across all
  totalInactiveUsers: 732,     // Inactive across all
}
```

---

## 🔄 State Flow

```
User selects grouping
        ↓
setGroupBy() called
        ↓
useUserClassification recalculates
        ↓
classifyUsers() groups data
        ↓
calculateGroupStatistics() per group
        ↓
calculateOverviewStatistics() totals
        ↓
UI re-renders with new groups
```

---

## 🌐 Internationalization

### Supported Languages
- ✅ English (en)
- ✅ Vietnamese (vi)

### Translation Keys Pattern
All keys are under `users.classification.*`:
- `users.classification.groupBy`
- `users.classification.totalUsers`
- `users.classification.activeRate`
- etc.

### Using Translations
```tsx
import { useUsersTranslation } from "@/shared/hooks";

function MyComponent() {
  const { t } = useUsersTranslation();
  
  return <p>{t("classification.groupBy")}</p>;  // "Group Results By"
}
```

---

## 🎯 Key Concepts

### GroupBy Field
A string indicating how to classify users:
- `"role"` - By user role
- `"status"` - By account status
- `"company"` - By company
- `"createdMonth"` - By registration month

### Group Object
```typescript
{
  id: "ADMIN",                    // Unique ID
  displayName: "Admin",           // Display text
  iconType: "role",               // Icon category
  colorScheme: "blue",            // Color theme
  subtitle: "System Administrators",
  users: [...],                   // Users in group
  statistics: {...},              // Stats (see above)
  isExpanded: false,              // UI state
}
```

---

## 🐛 Common Issues & Fixes

### Statistics Showing 0%?
**Issue**: All percentages are 0%  
**Fix**: Check that users have valid `status` field (ACTIVE/LOCKED)

### Dropdown Not Working?
**Issue**: Dropdown appears but doesn't select  
**Fix**: Check browser console for errors, verify useCallback works

### Dark Mode Broken?
**Issue**: Styling looks broken in dark theme  
**Fix**: CSS uses `dark:` prefix; verify Tailwind dark mode is enabled

### Group By "Company" Shows Duplicate Names?
**Issue**: Similar company names not grouped  
**Fix**: Data normalization needed in API or `groupingConfig.ts`

---

## 📈 Performance Tips

1. **For 1,000+ users**: Consider backend grouping
2. **For virtual scrolling**: Use within UserClassificationGroup
3. **For cached data**: Implement refetch with stale-while-revalidate
4. **For real-time**: Add WebSocket updates to hook

---

## 🧪 Testing the Feature

### Test Grouping Changes
1. Go to `/users/classification`
2. Click "Group Results By" dropdown
3. Select "Role" → Verify grouped by role
4. Select "Status" → Verify grouped by status
5. Repeat for Company, Created Month

### Test Expand/Collapse
1. Click group card → should expand/collapse
2. Click "Expand All" → all groups should open
3. Click "Collapse All" → all groups should close

### Test Dark Mode
1. Enable dark mode in OS
2. Verify all colors are appropriate
3. Check text contrast is sufficient

### Test i18n
1. Switch language to Vietnamese
2. All UI text should be in Vietnamese
3. Translations should be complete

---

## 📚 Further Reading

- **Detailed Guide**: `CLASSIFICATION_GUIDE.md`
- **Full Summary**: `IMPLEMENTATION_SUMMARY.md`
- **Type Definitions**: `types/classification.types.ts`
- **Grouping Rules**: `utils/groupingConfig.ts`

---

## 🤝 Need Help?

### Check These Files First
1. `CLASSIFICATION_GUIDE.md` - Complete architecture
2. `types/classification.types.ts` - TypeScript definitions
3. `utils/classificationUtils.ts` - Calculation logic

### Debug Tips
```tsx
// Log the hook data
const classification = useUserClassification();
console.log("Groups:", classification.groups);
console.log("Stats:", classification.overviewStats);

// Check individual group
const group = classification.groups[0];
console.log("Group", group.id);
console.log("Stats:", group.statistics);
```

---

## ✅ Implementation Checklist

- [x] All 4 grouping types working
- [x] Statistics calculated correctly
- [x] Collapse/Expand working
- [x] Dashboard displaying stats
- [x] Dark mode styling
- [x] Responsive design
- [x] i18n complete (EN + VI)
- [x] Documentation complete
- [x] Navigation link added
- [x] Route configured
- [x] Types defined
- [x] Error handling

---

**Last Updated**: March 20, 2026  
**Status**: ✅ Production Ready
