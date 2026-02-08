# Complete Redesign Design Document

**Date:** 2025-02-04
**Project:** Computing Marketplace (算力超市) - Complete Redesign
**Status:** Approved for Implementation

## Overview

Complete redesign of the computing marketplace frontend to match Axure design mockups exactly across all 14 pages, with full responsive design and interactivity.

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Build tool
- **Ant Design 6** - UI component library
- **React Router** - Client-side routing
- **CSS Modules** - Scoped styling for pixel-perfect matching

## Project Structure

```
src/
├── data/
│   ├── navigation.ts       # Navigation menu structure
│   ├── products.ts         # Product listings (GPU, 通算, etc.)
│   ├── solutions.ts        # Solutions content
│   └── siteContent.ts      # Hero sections, features, statistics
├── components/
│   ├── layout/
│   │   ├── Header/         # Top navigation with logo, menu, mobile drawer
│   │   ├── Footer/         # Site footer with company info, links
│   │   └── PageLayout/     # Common page wrapper
│   ├── common/
│   │   ├── ProductCard/    # Reusable product cards
│   │   ├── HeroSection/    # Page headers with title, subtitle, CTA
│   │   ├── FeatureList/    # Features/benefits grid display
│   │   └── SpecTable/      # Two-column specifications tables
│   └── [other shared components]
├── pages/
│   ├── Home/               # 首页
│   ├── GeneralComputing/   # 通算专区
│   ├── IntelligentComputing/ # All 4 智算 sub-pages
│   │   ├── GPUBareMetal/   # GPU裸金属
│   │   ├── GPUCloud/       # GPU云主机
│   │   ├── Appliance/      # 智算一体机
│   │   └── MaaS/           # MaaS平台
│   └── Solutions/          # All 4 解决方案 pages
│       ├── SolutionsHome/
│       ├── ServicePlatform/
│       ├── NetworkSystem/
│       └── FusionBase/
├── assets/
│   └── images/             # Copied from design/
└── App.tsx                 # Main routing configuration
```

## Data Structure

### Navigation Data

```typescript
interface NavItem {
  label: string;
  path: string;
  children?: NavItem[];
  icon?: string;
}
```

### Product Data

```typescript
interface Product {
  id: string;
  name: string;
  category: 'gpu-bare-metal' | 'gpu-cloud' | 'appliance' | 'maas' | 'general';
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  specifications: Spec[];
  pricing?: Pricing[];
  useCases: string[];
}

interface Spec {
  label: string;
  value: string;
}
```

### Solution Data

```typescript
interface Solution {
  id: string;
  title: string;
  description: string;
  highlights: string[];
  benefits: Benefit[];
  architecture?: string;
}
```

### Site Content

```typescript
interface PageContent {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    cta?: { text: string; link: string };
  };
  features?: Feature[];
  statistics?: Stat[];
}
```

## Pages Overview

### 1. 首页 (Home)
- Hero section with main CTA
- Product category cards (智算专区, 通算专区)
- Statistics/numbers section
- Featured solutions preview
- Footer

### 2-5. 智算专区 Pages
- GPU裸金属 (GPUBareMetal)
- GPU云主机 (GPUCloud)
- 智算一体机 (Appliance)
- MaaS平台 (MaaS)

Each includes:
- Hero section (product-specific)
- Product overview
- Key features (grid layout)
- Technical specifications table
- Use cases
- Pricing/CTA section

### 6. 通算专区 (GeneralComputing)
- Hero section
- Product overview
- Features list
- Specifications
- Pricing tiers

### 7-10. 解决方案 Pages
- 解决方案首页 (SolutionsHome)
- 解决方案-算力服务平台 (ServicePlatform)
- 解决方案-算力网络体系 (NetworkSystem)
- 解决方案-算力融合底座 (FusionBase)

Each includes:
- Hero with solution title
- Problem statement
- Solution architecture diagram
- Key benefits
- Implementation steps

## Component Architecture

### Layout Components

**Header**
- Logo (images/首页/u39.png or similar)
- Main navigation menu
- Dropdown menus for 智算专区 sub-items
- Mobile hamburger menu (responsive)

**Footer**
- Company info
- Navigation links
- Contact information
- Copyright

**PageLayout**
- Header/Footer wrapper
- Page container with max-width
- Common spacing/margins

### Common Components

**ProductCard**
- Product image
- Title and subtitle
- Key features
- "Learn More" CTA
- Hover effects

**HeroSection**
- Background image/color
- Title and subtitle
- Optional CTA buttons

**SpecTable**
- Two-column layout (label | value)
- Responsive to single column on mobile

**FeatureList**
- Icon + text pairs
- Grid layout (responsive)

## Responsive Design

### Breakpoints

```css
base:      320px - 767px   (mobile)
sm:        768px - 991px   (tablet)
md:        992px - 1199px  (desktop-sm)
lg:        1200px+         (desktop - exact design match)
```

### Responsive Patterns

**Navigation**
- Desktop: Horizontal menu with dropdowns
- Tablet: Same as desktop
- Mobile: Hamburger menu with slide-out drawer

**Grid Layouts**
- Product cards: 1 col (mobile) → 2 cols (tablet) → 3/4 cols (desktop)
- Feature lists: 1 col → 2 cols → 3 cols

**Typography**
- Desktop: Match exact Axure font sizes
- Mobile: Reduce proportionally (maintain hierarchy)

**Images**
- Use Ant Design's Image component for responsive loading
- Lazy load for performance
- WebP format with fallbacks

## Interactivity & Functionality

### Navigation & Routing
- All links work correctly using React Router
- Active link highlighting
- Dropdown menus
- Smooth scrolling to sections
- Mobile menu toggle with animations

### Interactive Components
- **Tabs** - For product variants/specifications
- **Accordions** - For FAQ sections or expandable details
- **Carousels** - For image galleries or featured products
- **Modals** - For product detail views or contact forms
- **Tooltips** - For additional information on hover

### Forms & Input
- Contact forms with validation
- Search/filter functionality for products
- Newsletter subscription
- Success/error states

### Dynamic Features
- Product filtering (by category, specs, price range)
- Sort functionality (price, popularity, newest)
- Comparison between products
- "Add to inquiry/cart" actions with feedback

### User Feedback
- Loading states for async operations
- Success notifications (Ant Design message.success)
- Error handling with helpful messages
- Hover effects on all interactive elements
- Click animations

### State Management
- Use React Context for global state (cart, filters, theme)
- Local state for component-specific interactions
- URL params for filter persistence

## Asset Management

### Image Organization

```
public/
└── images/
    ├── common/           # Shared images (logo, icons)
    ├── home/             # 首页 specific images
    ├── general-computing/# 通算专区 images
    ├── intelligent-computing/      # 智算专区 images
    │   ├── gpu-bare-metal/
    │   ├── gpu-cloud/
    │   ├── appliance/
    │   └── maas/
    └── solutions/        # 解决方案 images
```

### Image Optimization
- Keep original PNGs for exact design match
- Use Ant Design Image component for lazy loading
- Responsive images with srcset where appropriate

## Development Workflow

### Phase 1: Foundation
1. Copy all images to public/images/
2. Create data structure files with interfaces
3. Set up routing for all 14 pages
4. Build core layout components (Header, Footer, PageLayout)

### Phase 2: Common Components
1. Build reusable components (ProductCard, HeroSection, etc.)
2. Create responsive grid layouts
3. Add interactions and animations

### Phase 3: Page Implementation
1. Implement all 14 pages in parallel
2. Each page uses data from data files
3. Match designs pixel-perfectly
4. Add page-specific interactivity

### Phase 4: Polish & Testing
1. Cross-browser testing
2. Responsive testing (mobile, tablet, desktop)
3. Accessibility audit
4. Performance optimization

## Testing Strategy

### Visual Regression Testing
- Compare implemented pages with Axure designs
- Pixel-level matching for desktop (1200px+)
- Responsive layout verification for tablet/mobile

### Functionality Testing
- All navigation links work
- Forms validate correctly
- Interactive elements (tabs, accordions, modals) function
- Mobile menu works smoothly
- No console errors

### Cross-Browser Testing
- Chrome (primary)
- Safari (important for Mac users)
- Firefox
- Edge (Chromium)

### Responsive Testing
- iPhone SE (375px) - smallest mobile
- iPad (768px) - tablet
- Desktop (1920px) - large screens
- Common laptop sizes (1366px, 1440px)

### Performance
- Image lazy loading working
- Fast initial load
- Smooth animations
- Code splitting for routes

### Accessibility
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Screen reader friendly

### Code Quality
- TypeScript strict mode
- ESLint for code standards
- Consistent naming conventions
- Component documentation

## Key Design Principles

1. **Pixel-perfect matching** of layout, spacing, colors from Axure designs
2. **Data-driven** - All content externalized to TypeScript data files
3. **Responsive-first** - Fully functional across all device sizes
4. **Interactive** - All buttons, links, forms work with mock data
5. **Maintainable** - Clear separation of concerns, reusable components
6. **Performance** - Optimized images, lazy loading, code splitting

## Success Criteria

- [ ] All 14 pages implemented and matching designs
- [ ] Fully responsive (mobile, tablet, desktop)
- [ ] All navigation and routing works
- [ ] All interactive elements functional
- [ ] All data externalized to data files
- [ ] No console errors
- [ ] Cross-browser compatible
- [ ] Accessible to screen readers
- [ ] Fast load times
