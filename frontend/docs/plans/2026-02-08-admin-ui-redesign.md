# Admin UI Redesign - Modern Minimalist Style

## Overview

Redesign the admin backend with a modern minimalist aesthetic, featuring a sidebar + top bar layout, black-white-blue color scheme, and clean typography.

**Design Style:** Modern Minimalist (Vercel/Linear inspired)
**Layout:** Sidebar navigation + Top bar
**Color Scheme:** Classic black-white-blue

---

## Color System

### Primary Colors
- Primary: `#0066FF` (Blue)
- Success: `#10B981` (Green)
- Warning: `#F59E0B` (Orange)
- Error: `#EF4444` (Red)
- Info: `#3B82F6` (Blue)

### Neutral Colors
- Background: `#FFFFFF` (Pure white)
- Secondary Background: `#F8FAFC` (Very light gray)
- Border: `#E2E8F0` (Light gray)
- Text Primary: `#1E293B` (Dark gray)
- Text Secondary: `#64748B` (Medium gray)
- Text Tertiary: `#94A3B8` (Light gray)

### Sidebar Colors (Dark)
- Background: `#0F172A` (Dark blue-black)
- Hover: `#1E293B` (Slightly lighter)
- Active: `#0066FF` (Primary blue)
- Text: `#F1F5F9` (Off-white)

---

## Layout Structure

### Three-Column Layout

**Left Sidebar (240px / 64px collapsed):**
- Logo + product name
- Main navigation menu (vertical)
- Bottom user avatar and settings

**Center Content (auto width):**
- Top bar (64px): Breadcrumb + Page title + Action buttons
- Content area: White cards with subtle shadows

**Right Panel (280px, optional):**
- Detail panel (shown when needed)
- Collapsible

### Sidebar Navigation

**Behavior:**
- Default collapsed: Icon only (64px)
- Hover to expand: Show text (240px)
- Smooth transition (300ms ease)
- Active state: Blue left border + blue icon
- Hover state: Light gray background

**Menu Groups:**
- Main: Inquiry, Products, Solutions, News
- Categories: Product Categories
- Analytics: Dashboard
- System Settings (bottom, collapsible)

**Icon Style:**
- Linear Icons or Heroicons style
- 24px size, 2px stroke
- Fill with blue when active

### Top Bar (64px height)

**Structure:**
- Left: Breadcrumb navigation (gray-blue text)
- Center: Page title (black, bold)
- Right: Search + Notification bell + User avatar

**Style:**
- White background, bottom border 1px
- Buttons: No background, icon only
- User avatar: Circle (40px), dropdown on click

---

## Component Design

### Cards

**Style:**
- Pure white background
- Border radius: 8px
- Shadow: `0 1px 3px rgba(0,0,0,0.05)`
- Padding: 24px
- Gap: 16px between cards

**Statistics Cards:**
- Gradient background (blue to light blue)
- White numbers, large font (32px)
- Small tag (gray) in top-right corner

### Tables

**Header:**
- Light gray background (#F8FAFC)
- Small font (12px), gray text
- No borders, 2px blue bottom line for sortable columns

**Rows:**
- Zebra striping: Even rows light gray
- Hover: More obvious light gray
- Selected: Blue border
- Actions column: Fixed right, vertical divider

**Buttons:**
- Primary: Blue background, white text, no border radius
- Secondary: White background, blue border
- Danger: Red background (delete)
- Link: No background, blue text

### Modals

**Overlay:**
- Semi-transparent black (rgba(0,0,0,0.4))
- Blurred background

**Container:**
- White background, 12px border radius
- Max width 600px, centered
- Top header: Bold 18px text, close button right
- Bottom buttons: Cancel (gray) left, Confirm (blue) right

**Animations:**
- Fade in/out: 200ms
- Slight scale: 0.95 to 1.0

### Forms

**Inputs:**
- Height: 40px
- Border: 1px light gray (#E2E8F0)
- Focus: Blue border, pale blue glow
- Border radius: 6px
- Padding: 12px
- Label: Small gray text above

**Switches & Selects:**
- Same height as inputs
- Blue active state
- Clean dropdown arrows

**Submit Buttons:**
- Primary: Blue gradient, white text, no radius
- Hover: Darker blue
- Loading: Spinning icon

---

## Responsive Design

### Breakpoints
- Desktop: > 1440px (Three-column layout)
- Laptop: 1024px - 1440px (Sidebar auto-collapses)
- Tablet: 768px - 1024px (Drawer sidebar)
- Mobile: < 768px (Full-screen layout, bottom nav)

### Mobile Adaptations
- Table: Horizontal scroll
- Cards: Stacked layout
- Hamburger menu
- Bottom action buttons fixed

---

## Animations & Transitions

### Page Transitions
- Fade in/out: 150ms
- Slight upward movement

### Hover Effects
- Buttons: Background darkens 10%
- Cards: Shadow deepens
- Links: Blue text

### Loading States
- Skeleton screens: Light gray striped animation
- Spinner: Blue rotating icon
- Progress bar: Blue gradient

---

## Implementation Plan

### Phase 1: Base Style System
1. Create global CSS variables (colors, spacing, border-radius)
2. Create base component style overrides
3. Update AdminLayout component

### Phase 2: Sidebar Refactor
1. Create new Sidebar component (collapsible)
2. Update navigation menu styles
3. Add icons

### Phase 3: Page Content Area
1. Update Table styles
2. Optimize Card component
3. Refactor statistics cards

### Phase 4: Interaction Polish
1. Add transition animations
2. Optimize modal styles
3. Form component beautification

---

## File Structure

```
frontend/src/
├── styles/
│   ├── globals.css                    # Global styles + CSS variables
│   ├── themes/
│   │   └── modern.css                 # Modern minimalist theme
│   └── components/
│       ├── table.css                  # Table style overrides
│       ├── card.css                   # Card styles
│       └── button.css                 # Button styles
├── components/
│   ├── layout/
│   │   ├── AdminLayout.tsx            # Update layout
│   │   ├── Sidebar.tsx                # New sidebar
│   │   └── TopBar.tsx                 # New top bar
│   └── ui/
│       ├── StatCard.tsx               # Statistics card
│       └── DataTable.tsx              # Enhanced table
└── pages/
    └── Admin/
        └── [pages].tsx                # Gradual updates
```

---

## CSS Variables Reference

```css
:root {
  /* Primary Colors */
  --color-primary: #0066FF;
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;

  /* Neutral Colors */
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: #F8FAFC;
  --color-border: #E2E8F0;
  --color-text-primary: #1E293B;
  --color-text-secondary: #64748B;
  --color-text-tertiary: #94A3B8;

  /* Sidebar */
  --color-sidebar-bg: #0F172A;
  --color-sidebar-hover: #1E293B;
  --color-sidebar-active: #0066FF;

  /* Dimensions */
  --sidebar-width: 240px;
  --sidebar-width-collapsed: 64px;
  --topbar-height: 64px;
  --border-radius-sm: 6px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);

  /* Transitions */
  --transition-fast: 150ms;
  --transition-base: 200ms;
  --transition-slow: 300ms;
}
```
