# User Classification Feature Documentation

## Overview

The User Classification feature allows administrators to group and analyze users by multiple criteria, providing detailed statistics and visual insights into user distribution.

## Features

### Grouping Options

Users can be grouped by:

1. **Role**: Groups users by their organizational role (Admin, Headhunter, Collaborator, Candidate)
2. **Status**: Groups users by account status (Active, Locked, Suspended, Pending)
3. **Company**: Groups users by their company affiliation
4. **Created Month**: Groups users by their registration month

### Group Statistics

For each group, the system displays:

- **Total Count**: Number of users in the group
- **Distribution %**: Percentage of total users
- **Active/Inactive Ratio**: Number and percentage of active vs inactive users
- **Visual Progress Bar**: Quick visual representation of active/inactive split

### Features

- ✅ Real-time grouping with instant recalculation on group-by change
- ✅ Collapsible/Expandable groups to view individual users
- ✅ Expand/Collapse All groups at once
- ✅ System health indicator (overall active rate)
- ✅ User distribution trend chart
- ✅ Summary statistics dashboard
- ✅ Responsive design with dark mode support
- ✅ Fully internationalized (English & Vietnamese)

## Acceptance Criteria Implementation

### AC1: Phân loại thành công (Classification Success)

**Requirement**: Admin can select a grouping criterion and see users grouped accordingly.

**Implementation**:
- Dropdown menu on UserClassificationHeader allows selection of grouping field
- Groups are displayed as collapsible cards
- Each group shows a clear header with icon and title

**Files**:
- `UserClassificationHeader.tsx` - Dropdown implementation
- `useUserClassification.ts` - Grouping logic

### AC2: Thống kê nhóm (Group Statistics)

**Requirement**: Group headers display count, percentage, and active/inactive statistics.

**Implementation**:
- Group statistics calculated in frontend (TypeScript)
- Header displays: Count, %, Active/Inactive breakdown
- Visual progress bar shows active/inactive ratio
- Summary section shows aggregated statistics

**Files**:
- `classificationUtils.ts` - Statistics calculation
- `UserClassificationGroup.tsx` - Statistics display

## Architecture

### Type Hierarchy

```
ClassificationGroupBy
  ├── "role"
  ├── "status"
  ├── "company"
  └── "createdMonth"

ClassificationGroupData
  ├── id: string
  ├── displayName: string
  ├── subtitle: string
  ├── users: UserDetail[]
  └── statistics: ClassificationStatistics

ClassificationStatistics
  ├── totalCount: number
  ├── percentage: number
  ├── activeCount: number
  ├── inactiveCount: number
  └── activePercentage: number

ClassificationOverviewStats
  ├── totalUsers: number
  ├── activeRate: number
  ├── groupCount: number
  ├── totalActiveUsers: number
  └── totalInactiveUsers: number
```

### Component Hierarchy

```
UserClassificationPage
  └── UserClassificationOverview
      ├── UserClassificationHeader
      ├── UserClassificationGroup (×N)
      │   └── User item (×M)
      └── Statistics Footer (3 cards)
          ├── Distribution Trend Chart
          ├── System Health Indicator
          └── Summary Stats
```

### Data Flow

```
useUserClassification Hook
  ├── fetchAllUsers() → API call to searchUsers
  ├── allUsers state
  ├── classifyUsers() → Groups users by groupBy field
  ├── groups state
  ├── calculateOverviewStatistics() → Aggregated stats
  ├── overviewStats state
  └── Actions:
      ├── setGroupBy() → Recalculate groups
      ├── toggleGroup() → Collapse/Expand
      ├── expandAll() / collapseAll()
      └── refetch() → Reload data
```

## Usage

### Basic Integration

```tsx
import { UserClassificationPage } from "@/features/users/classification";

// In router
<Route path="/users/classification" element={<UserClassificationPage />} />
```

### Using the Hook Standalone

```tsx
import { useUserClassification } from "@/features/users/classification";

function MyComponent() {
  const {
    groups,
    overviewStats,
    groupBy,
    setGroupBy,
    toggleGroup,
    loading,
    error,
  } = useUserClassification();

  // Use the data...
}
```

### Extending Grouping Options

To add a new grouping criterion:

1. Add to `ClassificationGroupBy` type in `classification.types.ts`
2. Add extraction logic in `groupingConfigs` object in `groupingConfig.ts`
3. Add translation strings in both locale files

Example:

```typescript
// In groupingConfig.ts
export const groupingConfigs: Record<string, GroupingConfig> = {
  // ... existing configs ...
  
  department: {
    field: "department",
    label: "Department",
    description: "Group users by department",
    extractKey: (user: UserDetail) => user.department || "Unknown",
    getDisplayName: (key: string) => key,
    getSubtitle: (key: string) => `${key} team members`,
    getIconType: () => "company",
    getColorScheme: () => "blue",
  },
};
```

## Styling & Design

- Uses Tailwind CSS for styling
- Material Icons for UI elements
- Supports dark mode with `dark:` prefix
- Responsive grid layout for statistics footer
- Hover states for interactive elements
- Smooth transitions and animations

## Performance Considerations

- **Data Loading**: All users are loaded at once for classification
  - Current: PAGE_SIZE = 1000 (adjust if needed)
  - Consider pagination if user count grows significantly
  
- **Grouping**: O(n) complexity where n = number of users
  - Happens on component mount and when groupBy changes
  
- **Memoization**: useCallback used for action handlers to prevent unnecessary re-renders

## Future Improvements

- [ ] API-based grouping (backend does classification)
- [ ] Export classification data (CSV, PDF)
- [ ] Custom grouping rules
- [ ] Filters within groups
- [ ] User action history within classification view
- [ ] Performance optimization for large datasets (10k+ users)

## Translation Keys

All user-facing strings are in:
- `src/i18n/locales/en/users.json` - English
- `src/i18n/locales/vi/users.json` - Vietnamese

Classification-specific keys are under `classification.*`:
- `classification.groupBy` - "Group Results By"
- `classification.totalUsers` - "Total Users"
- `classification.activeRate` - "Active Rate"
- etc.

## Testing

Key scenarios to test:

1. **Group By Change**: Select different grouping options
2. **Collapse/Expand**: Toggle individual groups and use expand/collapse all
3. **Statistics Accuracy**: Verify counts and percentages
4. **Dark Mode**: Check styling in dark theme
5. **Responsive**: Test on mobile/tablet/desktop
6. **Internationalization**: Switch languages and verify translations
7. **Error Handling**: Test with failed data loading
8. **Performance**: Load with large user dataset

## Troubleshooting

### Groups not displaying

- Check browser console for errors
- Verify API is returning data
- Ensure users have createdAt field for createdMonth grouping

### Statistics showing 0%

- Verify user count is > 0
- Check that users have proper status field (ACTIVE/LOCKED)

### I18n keys showing raw text

- Verify locale files have `classification.*` section
- Check locale config is properly loaded
- Review `useUsersTranslation` hook usage
