# Forum Feature Structure

## Overview

This feature implements a complete News/Forum system with admin management and public views.

## Structure

```text
features/forum/
├── admin/
│   ├── categories/          ← Prompt 1 (FOR-01 to 05)
│   │   ├── components/
│   │   │   ├── CategoryList.tsx
│   │   │   ├── CategoryCreateForm.tsx (inline)
│   │   │   ├── CategoryEditForm.tsx (inline)
│   │   │   ├── CategoryToggleButton.tsx
│   │   │   └── CategoryDeleteModal.tsx
│   │   ├── hooks/
│   │   │   └── useCategoryManagement.ts
│   │   ├── pages/
│   │   │   └── CategoryManagementPage.tsx
│   │   └── services/
│   │       └── categoryApi.ts
│   │
│   └── posts/               ← Prompt 2 (FOR-06 to 09)
│       ├── components/
│       │   ├── PostList.tsx
│       │   ├── PostFormModal.tsx (create + edit)
│       │   ├── PostStatusDropdown.tsx
│       │   └── PostDeleteModal.tsx
│       ├── hooks/
│       │   └── usePostManagement.ts
│       ├── pages/
│       │   └── PostManagementPage.tsx
│       └── services/
│           └── postApi.ts
│
└── public/
    ├── list/                ← Prompt 3 (FOR-10)
    │   ├── components/
    │   │   ├── FeaturedSection.tsx
    │   │   ├── NewsGrid.tsx
    │   │   ├── NewsFilters.tsx
    │   │   └── NewsPagination.tsx
    │   ├── hooks/
    │   │   └── useNewsList.ts
    │   ├── pages/
    │   │   └── NewsListPage.tsx
    │   └── services/
    │       └── newsApi.ts
    │
    └── detail/              ← Prompt 4 (FOR-11 + FOR-12)
        ├── components/
        │   ├── PostContent.tsx
        │   ├── PostMetadata.tsx
        │   ├── ReactionsBar.tsx (FOR-12)
        │   └── RelatedPosts.tsx
        ├── hooks/
        │   ├── usePostDetail.ts
        │   └── useReactions.ts
        ├── pages/
        │   └── PostDetailPage.tsx
        └── services/
            ├── postApi.ts
            └── reactionsApi.ts
```

## Implementation Roadmap

### Prompt 1: Admin Category Management (FOR-01 to 05)

**Files:** `admin/categories/*`

**Tasks:**

- FOR-01: List categories with inline create/edit forms
- FOR-02: Create new category (inline form)
- FOR-03: Edit category (inline form)
- FOR-04: Toggle category active/inactive
- FOR-05: Delete category with confirmation

**Key Features:**

- Inline forms (no modals)
- Real-time status toggling
- Validation for duplicate names
- Confirmation before delete

---

### Prompt 2: Admin Post Management (FOR-06 to 09)

**Files:** `admin/posts/*`

**Tasks:**

- FOR-06: List all posts with filters
- FOR-07: Create/Edit post in modal
- FOR-08: Change post status (Draft/Published/Archived)
- FOR-09: Delete post with confirmation

**Key Features:**

- Rich text editor for content
- Image upload support
- Category association
- Status workflow

---

### Prompt 3: Public News List (FOR-10)

**Files:** `public/list/*`

**Tasks:**

- FOR-10: Display published posts with filtering and pagination

**Key Features:**

- Featured posts section
- Grid layout for posts
- Filter by category
- Pagination
- Search functionality

---

### Prompt 4: Public Post Detail + Reactions (FOR-11 + FOR-12)

**Files:** `public/detail/*`

**Tasks:**

- FOR-11: Display full post content
- FOR-12: Like/Love/Celebrate reactions

**Key Features:**

- Full post content with rich formatting
- Post metadata (author, date, views, category)
- Reaction system (Like, Love, Celebrate)
- Related posts suggestions
- View counter

---

## Status

✅ **Structure Created** - All 32 files with placeholder code
⏳ **Implementation Pending** - Ready for 4 prompts

## Next Steps

1. Implement Prompt 1 (Category Management)
2. Implement Prompt 2 (Post Management)
3. Implement Prompt 3 (News List)
4. Implement Prompt 4 (Post Detail + Reactions)

---

Created: April 1, 2026
