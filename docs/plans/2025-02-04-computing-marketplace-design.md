# Computing Power Marketplace - Design Document

**Date:** 2025-02-04
**Project:** 算力超市 (Computing Power Marketplace) Frontend Implementation

## Overview

Build a modern React-based frontend for the Computing Power Marketplace platform based on the Axure RP prototype. The platform showcases various computing power services including GPU bare metal, cloud hosting, intelligent computing appliances, and enterprise solutions.

## Technology Stack

- **Framework:** React 18 with Vite
- **UI Library:** Ant Design 5
- **Routing:** React Router v6
- **Styling:** Tailwind CSS + Ant Design theme customization
- **Language:** TypeScript
- **State Management:** React Context, local useState
- **Build Tool:** Vite

## Project Structure

```
computing-marketplace/
├── src/
│   ├── components/          # Reusable components
│   │   ├── layout/         # Layout components
│   │   ├── common/         # Common UI components
│   │   └── sections/       # Page-specific sections
│   ├── pages/              # Page components
│   ├── data/               # Mock data
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── contexts/           # React Context providers
│   ├── App.tsx
│   └── main.tsx
├── public/                 # Static assets
└── package.json
```

## Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Homepage with hero section and product showcase |
| `/intelligent` | Intelligent Computing Zone | Overview of intelligent computing products |
| `/intelligent/gpu-bare-metal` | GPU Bare Metal | Product listing with filters |
| `/intelligent/gpu-cloud` | GPU Cloud Host | Cloud-based GPU instances |
| `/intelligent/appliance` | Computing Appliance | Pre-configured hardware solutions |
| `/intelligent/maas` | MaaS Platform | Model-as-a-Service offerings |
| `/general` | General Computing | Standard computing instances |
| `/solutions` | Solutions Overview | Solutions landing page |
| `/solutions/platform` | Service Platform | Computing service platform solution |
| `/solutions/network` | Network System | Computing network system solution |
| `/solutions/foundation` | Fusion Foundation | Computing fusion foundation solution |
| `/news` | Policy & News | News and policy updates |
| `/about` | About Us | Company information |

## Key Components

### Layout Components
- **AppHeader** - Navigation bar with logo and menu
- **AppFooter** - Footer with company info and contact details

### Common Components
- **HeroSection** - Hero banner with title, description, and CTAs
- **ProductCard** - Product/service display card
- **ProductFilter** - Filter sidebar (source, region, price, specs)
- **SolutionCard** - Solution overview card
- **DataTable** - Sortable, paginated product listing

## Data Models

```typescript
interface Product {
  id: string;
  name: string;
  category: 'gpu-bare-metal' | 'gpu-cloud' | 'appliance' | 'maas' | 'general-computing';
  description: string;
  specifications: Record<string, string>;
  pricing: {
    type: 'hourly' | 'monthly' | 'contact';
    price?: number;
    unit?: string;
  };
  source: string;
  region: string;
  image: string;
  tags: string[];
  featured: boolean;
}

interface Solution {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  features: string[];
  applications: string[];
  link: string;
}

interface News {
  id: string;
  title: string;
  summary: string;
  category: 'policy' | 'news';
  date: string;
  image: string;
}
```

## Styling & Theming

**Color Scheme:**
- Primary Blue: `#3F58FA`
- Background: White `#FFFFFF`
- Text: Various shades for hierarchy

**Design Tokens:**
```typescript
theme: {
  token: {
    colorPrimary: '#3F58FA',
    colorBgBase: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'PingFang SC, Arial, sans-serif',
  }
}
```

**Responsive Breakpoints:**
- Desktop: 1920px (base)
- Tablet: 768px
- Mobile: 480px

## Mock Data

All data will be in `src/data/mockData.ts` with realistic Chinese content:
- 8-10 GPU Bare Metal products
- 6-8 GPU Cloud products
- 4-6 Appliance products
- 4-6 MaaS offerings
- 6-8 General Computing products
- 4 Solution cards
- 6-8 News/Policy items

## Implementation Phases

### Phase 1: Project Setup & Core Layout
- Initialize Vite + React + TypeScript project
- Install dependencies (Ant Design, React Router, Tailwind)
- Set up project structure
- Create AppHeader and AppFooter
- Copy images from prototype

### Phase 2: Homepage
- Hero section with background
- Feature sections
- Product preview cards
- News/Policy section

### Phase 3: Intelligent Computing Pages
- GPU Bare Metal page
- GPU Cloud Host page
- Computing Appliance page
- MaaS Platform page

### Phase 4: Remaining Pages
- General Computing Zone
- Solutions overview + 3 detail pages
- About Us
- Policy & News

### Phase 5: Polish & Optimization
- Responsive design
- Loading states
- Error handling
- Performance optimization
- Final testing

## State Management

- **AppContext** - Global app settings, navigation
- **FilterContext** - Product filter state
- **CartContext** - Inquiry cart (optional)
- Local useState for component state

## Error Handling

- Error Boundaries for React errors
- Ant Design message/notification for user feedback
- Skeleton screens for loading states
- Form validation with Ant Design Form

## Performance Considerations

- Lazy loading for images
- Code splitting with React Router lazy
- Memoization for expensive computations
- Debounced search input
