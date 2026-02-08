# Homepage Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the homepage with modern visual style, enhanced animations, and improved user experience while preserving core elements (product cards, zone categories, Hero section, platform capabilities).

**Architecture:**
- Component-based React architecture using Ant Design primitives
- CSS Modules for scoped styling with modern design tokens (gradients, shadows, animations)
- Tabbed interface for zone switching (Intelligent/General/Solutions)
- Scroll-triggered animations using Intersection Observer API
- Responsive design with mobile-first approach

**Tech Stack:**
- React 19.2.4 + TypeScript
- Ant Design 6.2.3 (components and theming)
- CSS Modules (already configured)
- Vite 5.4.21 (build tool)
- Framer Motion (new dependency for animations)

---

## Prerequisites

### Task 0: Install Framer Motion

**Files:**
- Modify: `package.json`

**Step 1: Install framer-motion dependency**

Run:
```bash
cd /Users/zqian15/Desktop/AI\ Store/算力超市demo/.worktrees/computing-marketplace/frontend
npm install framer-motion
```

Expected: Package added to dependencies and node_modules

**Step 2: Verify installation**

Check that `framer-motion` appears in `package.json` dependencies

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install framer-motion for animations"
```

---

## Phase 1: Design Tokens & Global Styles

### Task 1: Create design tokens configuration

**Files:**
- Create: `src/styles/tokens.css`

**Step 1: Create design tokens file**

Create `src/styles/tokens.css`:

```css
:root {
  /* Colors */
  --color-primary: #3F58FA;
  --color-primary-light: #667EEA;
  --color-primary-dark: #3B42B5;
  --color-accent: #FF6B6B;
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-info: #3B82F6;

  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #3F58FA 0%, #667EEA 100%);
  --gradient-accent: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
  --gradient-intelligent: linear-gradient(135deg, #3F58FA 0%, #667EEA 100%);
  --gradient-general: linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%);
  --gradient-solutions: linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%);
  --gradient-hero: linear-gradient(135deg, #1e3a8a 0%, #3F58FA 50%, #667EEA 100%);

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-card: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-card-hover: 0 12px 24px rgba(63, 88, 250, 0.15);

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;

  /* Transitions */
  --transition-fast: 150ms ease-out;
  --transition-base: 200ms ease-out;
  --transition-slow: 300ms ease-out;

  /* Z-index */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
}

/* Dark mode support (optional, for future) */
@media (prefers-color-scheme: dark) {
  :root {
    /* Can be implemented later */
  }
}
```

**Step 2: Import in main styles**

Modify `src/index.css`, add at the top after existing imports:

```css
@import './styles/tokens.css';
```

**Step 3: Commit**

```bash
git add src/styles/tokens.css src/index.css
git commit -m "feat: add design tokens for consistent styling"
```

---

## Phase 2: Hero Section Redesign

### Task 2: Redesign Hero section with modern layout

**Files:**
- Create: `src/components/home/HeroSection.tsx`
- Create: `src/components/home/HeroSection.module.css`
- Modify: `src/pages/Home/index.tsx`

**Step 1: Create HeroSection component**

Create `src/components/home/HeroSection.tsx`:

```tsx
import { motion } from 'framer-motion';
import { Button, Typography, Space } from 'antd';
import { ThunderboltOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { productsData } from '../../data/products';
import styles from './HeroSection.module.css';

const { Title, Paragraph, Text } = Typography;

const HeroSection = () => {
  // Featured products for hero section
  const featuredProducts = [
    productsData.find(p => p.id === 'gpu-bare-metal-001'),
    productsData.find(p => p.id === 'gpu-bare-metal-002'),
    productsData.find(p => p.id === 'gpu-bare-metal-004'),
  ].filter(Boolean);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <motion.section
      className={styles.heroSection}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className={styles.heroBackground}>
        <div className={styles.gridOverlay}></div>
        <div className={styles.gradientOrb}></div>
      </div>

      <div className={styles.container}>
        <motion.div className={styles.heroContent} variants={containerVariants}>
          {/* Left: Brand Info */}
          <motion.div className={styles.brandSection} variants={itemVariants}>
            <div className={styles.heroBadge}>
              <ThunderboltOutlined /> 算力新未来
            </div>

            <Title level={1} className={styles.heroTitle}>
              云聚通智一体算力超市
            </Title>

            <Paragraph className={styles.heroSubtitle}>
              汇聚各类算力服务，支持算力在线磋商与交易，促进算力资源有效流通，
              助力智能产业发展
            </Paragraph>

            <Space size="middle" className={styles.heroActions}>
              <Link to="/intelligent">
                <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
                  探索智算专区
                </Button>
              </Link>
              <Link to="/solutions">
                <Button size="large">
                  查看解决方案
                </Button>
              </Link>
            </Space>
          </motion.div>

          {/* Right: Product Cards */}
          <motion.div className={styles.productsSection} variants={itemVariants}>
            <div className={styles.productsGrid}>
              {featuredProducts.map((product: any, index) => (
                <motion.div
                  key={product.id}
                  className={styles.productCard}
                  initial={{ opacity: 0, y: 30, rotate: -2 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{
                    delay: 0.3 + index * 0.1,
                    duration: 0.6,
                    ease: 'easeOut',
                  }}
                  whileHover={{
                    y: -8,
                    rotate: 0,
                    transition: { duration: 0.2 },
                  }}
                >
                  <Link to={`/intelligent-computing/gpu-bare-metal#${product.id}`}>
                    <div className={styles.cardHeader}>
                      <Text className={styles.productName}>{product.name}</Text>
                      {product.tags?.includes('热销') && (
                        <span className={`${styles.tag} ${styles.tagHot}`}>
                          🔥 热销
                        </span>
                      )}
                    </div>

                    <div className={styles.specsGrid}>
                      {product.specifications.slice(0, 4).map((spec: any) => (
                        <div key={spec.label} className={styles.specItem}>
                          <Text className={styles.specLabel}>{spec.label}</Text>
                          <Text className={styles.specValue}>{spec.value}</Text>
                        </div>
                      ))}
                    </div>

                    <div className={styles.cardFooter}>
                      <Text className={styles.price}>{product.price}</Text>
                      <Button type="primary" size="small">
                        立即咨询
                      </Button>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className={styles.scrollIndicator}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span>向下滑动查看更多</span>
          <ArrowRightOutlined className={styles.scrollArrow} />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
```

**Step 2: Create HeroSection styles**

Create `src/components/home/HeroSection.module.css`:

```css
.heroSection {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 80px 24px 60px;
}

.heroBackground {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--gradient-hero);
  z-index: 0;
}

.gridOverlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.5;
}

.gradientOrb {
  position: absolute;
  width: 800px;
  height: 800px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  top: -200px;
  right: -200px;
  filter: blur(60px);
  animation: pulse 8s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
}

.container {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.heroContent {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 60px;
  align-items: center;
}

.brandSection {
  color: white;
}

.heroBadge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-full);
  color: white;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.heroTitle {
  color: white !important;
  font-size: 56px !important;
  font-weight: 700 !important;
  line-height: 1.2 !important;
  margin-bottom: 24px !important;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
}

.heroSubtitle {
  color: rgba(255, 255, 255, 0.9) !important;
  font-size: 18px !important;
  line-height: 1.8 !important;
  margin-bottom: 40px !important;
}

.heroActions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.productsSection {
  perspective: 1000px;
}

.productsGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.productCard {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-card);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all var(--transition-base);
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.productCard a {
  color: inherit;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.cardHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 8px;
}

.productName {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  flex: 1;
}

.tag {
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.tagHot {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
  color: white;
}

.tagNew {
  background: linear-gradient(135deg, #10B981 0%, #34D399 100%);
  color: white;
}

.specsGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  flex: 1;
}

.specItem {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.specLabel {
  font-size: 12px;
  color: #666;
}

.specValue {
  font-size: 13px;
  font-weight: 500;
  color: #1a1a1a;
}

.cardFooter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.price {
  font-size: 20px;
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.scrollIndicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.scrollArrow {
  transform: rotate(90deg);
  font-size: 16px;
}

/* Responsive Design */
@media (max-width: 1199px) {
  .heroContent {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .productsGrid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .heroSection {
    padding: 60px 16px 40px;
    min-height: auto;
  }

  .heroTitle {
    font-size: 36px !important;
  }

  .heroSubtitle {
    font-size: 16px !important;
  }

  .productsGrid {
    grid-template-columns: 1fr;
  }

  .heroActions {
    flex-direction: column;
    width: 100%;
  }

  .heroActions button {
    width: 100%;
  }

  .gradientOrb {
    width: 400px;
    height: 400px;
  }
}
```

**Step 3: Update Home page to use HeroSection**

Modify `src/pages/Home/index.tsx`:

Replace lines 48-116 (the entire Hero Section) with:

```tsx
import HeroSection from '../../components/home/HeroSection';
// ... keep other imports

const Home = () => {
  // ... keep existing code

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <HeroSection />

      {/* Rest of the page remains the same for now... */}
```

**Step 4: Test the Hero section**

Run:
```bash
npm run dev
```

Navigate to `http://localhost:5173`

Expected: Hero section displays with animated entry, gradient background, product cards on right side

**Step 5: Commit**

```bash
git add src/components/home/HeroSection.tsx src/components/home/HeroSection.module.css src/pages/Home/index.tsx
git commit -m "feat: redesign Hero section with modern layout and animations"
```

---

## Phase 3: Platform Capabilities Section

### Task 3: Redesign platform capabilities with modern grid

**Files:**
- Create: `src/components/home/PlatformCapabilities.tsx`
- Create: `src/components/home/PlatformCapabilities.module.css`
- Modify: `src/pages/Home/index.tsx`

**Step 1: Create PlatformCapabilities component**

Create `src/components/home/PlatformCapabilities.tsx`:

```tsx
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Card, Typography, Row, Col } from 'antd';
import {
  SafetyOutlined,
  DatabaseOutlined,
  ThunderboltOutlined,
  RocketOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import styles from './PlatformCapabilities.module.css';

const { Title, Paragraph, Text } = Typography;

const capabilities = [
  {
    icon: <SafetyOutlined />,
    title: '技术稳定可靠',
    description: '企业级基础设施保障，多设备多链路冗余，构筑网络坚实壁垒',
    gradient: 'linear-gradient(135deg, #3F58FA 0%, #667EEA 100%)',
    stat: '99.9%',
    statLabel: '可用性',
  },
  {
    icon: <DatabaseOutlined />,
    title: '多样规格供应',
    description: '全方位资源规格满足不同业务需求，灵活选择，多样搭配',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
    stat: '100+',
    statLabel: '规格类型',
  },
  {
    icon: <ThunderboltOutlined />,
    title: '随需弹性伸缩',
    description: '按需购买，随需灵活升配降配，大幅节省部署时间，提升扩容缩容效率',
    gradient: 'linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)',
    stat: '5min',
    statLabel: '快速交付',
  },
  {
    icon: <RocketOutlined />,
    title: '智算/通算适配',
    description: '异构算力统一调度，适配各类业务场景，提供高效普惠的基础计算支撑',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
    stat: '混合',
    statLabel: '算力调度',
  },
  {
    icon: <DollarOutlined />,
    title: '定价透明灵活',
    description: '多种计费方式可选，定价透明，灵活配置，满足不同预算需求',
    gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
    stat: '按需',
    statLabel: '计费模式',
  },
];

const PlatformCapabilities = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.section
      ref={ref}
      className={styles.capabilitiesSection}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      <div className={styles.container}>
        {/* Header */}
        <motion.div className={styles.header} variants={itemVariants}>
          <div className={styles.titleBadge}>平台优势</div>
          <Title level={2} className={styles.title}>
            平台能力介绍
          </Title>
          <Paragraph className={styles.description}>
            融合通算算力与智算算力，打造一体化算力交易服务生态。
            整合全域异构算力资源，以超市化模式提供按需选配、即取即用的智算服务，
            定价透明、计费灵活，赋能政企数智化转型。
          </Paragraph>
        </motion.div>

        {/* Capabilities Grid */}
        <motion.div className={styles.grid} variants={containerVariants}>
          {capabilities.map((capability, index) => (
            <motion.div
              key={index}
              className={styles.gridItem}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Card className={styles.card} bordered={false}>
                <div
                  className={styles.iconWrapper}
                  style={{ background: capability.gradient }}
                >
                  {capability.icon}
                </div>

                <Title level={4} className={styles.cardTitle}>
                  {capability.title}
                </Title>

                <Text className={styles.cardDescription}>
                  {capability.description}
                </Text>

                <div className={styles.stat}>
                  <div className={styles.statValue}>{capability.stat}</div>
                  <div className={styles.statLabel}>{capability.statLabel}</div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default PlatformCapabilities;
```

**Step 2: Create PlatformCapabilities styles**

Create `src/components/home/PlatformCapabilities.module.css`:

```css
.capabilitiesSection {
  padding: 100px 24px;
  background: linear-gradient(180deg, #f8f9fc 0%, #ffffff 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 60px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.titleBadge {
  display: inline-block;
  padding: 8px 24px;
  background: var(--gradient-primary);
  color: white;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 24px;
}

.title {
  font-size: 42px !important;
  font-weight: 700 !important;
  color: #1a1a1a !important;
  margin-bottom: 20px !important;
}

.description {
  font-size: 16px !important;
  line-height: 1.8 !important;
  color: #666 !important;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.gridItem {
  height: 100%;
}

.card {
  height: 100%;
  border-radius: var(--radius-lg) !important;
  padding: 32px !important;
  box-shadow: var(--shadow-card) !important;
  transition: all var(--transition-base);
  border: 1px solid rgba(0, 0, 0, 0.04) !important;
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient-primary);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.card:hover::before {
  opacity: 1;
}

.card:hover {
  box-shadow: var(--shadow-card-hover) !important;
}

.iconWrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: white;
  margin-bottom: 24px;
  position: relative;
}

.iconWrapper::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: inherit;
  opacity: 0.2;
  filter: blur(12px);
  z-index: -1;
}

.cardTitle {
  font-size: 20px !important;
  font-weight: 600 !important;
  color: #1a1a1a !important;
  margin-bottom: 12px !important;
}

.cardDescription {
  font-size: 14px !important;
  line-height: 1.6 !important;
  color: #666 !important;
  display: block;
  margin-bottom: 20px;
}

.stat {
  padding-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.statValue {
  font-size: 28px;
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.statLabel {
  font-size: 13px;
  color: #999;
  margin-top: 4px;
}

/* Responsive */
@media (max-width: 991px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .capabilitiesSection {
    padding: 60px 16px;
  }

  .title {
    font-size: 32px !important;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .card {
    padding: 24px !important;
  }
}
```

**Step 3: Update Home page**

Modify `src/pages/Home/index.tsx`, replace the Platform Capabilities section (lines 118-179) with:

```tsx
import PlatformCapabilities from '../../components/home/PlatformCapabilities';
// ... keep other imports

const Home = () => {
  // ... keep existing code

  return (
    <div className={styles.home}>
      <HeroSection />

      {/* Platform Capabilities */}
      <PlatformCapabilities />

      {/* Keep existing sections for now... */}
```

**Step 4: Test**

Run dev server and verify platform capabilities section displays correctly with animations.

**Step 5: Commit**

```bash
git add src/components/home/PlatformCapabilities.tsx src/components/home/PlatformCapabilities.module.css src/pages/Home/index.tsx
git commit -m "feat: redesign platform capabilities section with modern grid layout"
```

---

## Phase 4: Zone Tabs Component

### Task 4: Create tabbed zone interface

**Files:**
- Create: `src/components/home/ZoneTabs.tsx`
- Create: `src/components/home/ZoneTabs.module.css`
- Create: `src/components/home/ProductGrid.tsx`
- Create: `src/components/home/ProductGrid.module.css`
- Modify: `src/pages/Home/index.tsx`

**Step 1: Create ZoneTabs component**

Create `src/components/home/ZoneTabs.tsx`:

```tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, Typography, Button } from 'antd';
import { Link } from 'react-router-dom';
import ProductGrid from './ProductGrid';
import { productsData } from '../../data/products';
import styles from './ZoneTabs.module.css';

const { Title, Paragraph } = Typography;

const ZoneTabs = () => {
  const [activeTab, setActiveTab] = useState('intelligent');

  const tabItems = [
    {
      key: 'intelligent',
      label: (
        <span className={styles.tabLabel}>
          <span className={styles.tabIcon}>🔥</span>
          智算专区
          {activeTab === 'intelligent' && <span className={styles.indicator} />}
        </span>
      ),
      subCategories: [
        { key: 'all', label: '全部' },
        { key: 'gpu-bare-metal', label: 'GPU裸金属' },
        { key: 'gpu-cloud', label: 'GPU云主机' },
        { key: 'appliance', label: '智算一体机' },
      ],
    },
    {
      key: 'general',
      label: (
        <span className={styles.tabLabel}>
          <span className={styles.tabIcon}>⚡</span>
          通算专区
          {activeTab === 'general' && <span className={styles.indicator} />}
        </span>
      ),
      subCategories: [
        { key: 'all', label: '全部' },
        { key: 'general', label: '通用计算' },
        { key: 'memory', label: '内存优化' },
        { key: 'io', label: '高I/O型' },
      ],
    },
    {
      key: 'solutions',
      label: (
        <span className={styles.tabLabel}>
          <span className={styles.tabIcon}>🎯</span>
          解决方案
          {activeTab === 'solutions' && <span className={styles.indicator} />}
        </span>
      ),
      subCategories: [
        { key: 'all', label: '全部' },
        { key: 'service-platform', label: '服务平台' },
        { key: 'network-system', label: '网络系统' },
        { key: 'fusion-base', label: '融合基础' },
      ],
    },
  ];

  const currentTab = tabItems.find(t => t.key === activeTab);

  const getProductsForZone = (zone: string) => {
    switch (zone) {
      case 'intelligent':
        return productsData.filter(p =>
          ['gpu-bare-metal', 'gpu-cloud', 'appliance', 'maas'].includes(p.category)
        ).slice(0, 6);
      case 'general':
        return productsData.filter(p => p.category === 'general').slice(0, 6);
      case 'solutions':
        return []; // Solutions will be handled separately
      default:
        return [];
    }
  };

  const products = getProductsForZone(activeTab);

  const getZoneGradient = (zone: string) => {
    switch (zone) {
      case 'intelligent':
        return 'var(--gradient-intelligent)';
      case 'general':
        return 'var(--gradient-general)';
      case 'solutions':
        return 'var(--gradient-solutions)';
      default:
        return 'var(--gradient-primary)';
    }
  };

  return (
    <section className={styles.zoneTabsSection} style={{ '--zone-gradient': getZoneGradient(activeTab) } as any}>
      <div className={styles.container}>
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Title level={2} className={styles.title}>
            产品服务
          </Title>
          <Paragraph className={styles.description}>
            汇聚多样化算力资源，满足不同场景需求
          </Paragraph>
        </motion.div>

        {/* Tabs */}
        <div className={styles.tabsWrapper}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            className={styles.tabs}
          />
        </div>

        {/* Sub Categories */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`subcategories-${activeTab}`}
            className={styles.subCategories}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {currentTab?.subCategories.map(cat => (
              <button
                key={cat.key}
                className={`${styles.subCatButton} ${cat.key === 'all' ? styles.active : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`products-${activeTab}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ProductGrid products={products} zone={activeTab} />
          </motion.div>
        </AnimatePresence>

        {/* View More Link */}
        <motion.div
          className={styles.viewMore}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link to={`/${activeTab}`}>
            <Button size="large" className={styles.viewMoreButton}>
              查看{currentTab?.label.slice(3)}全部产品
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ZoneTabs;
```

**Step 2: Create ZoneTabs styles**

Create `src/components/home/ZoneTabs.module.css`:

```css
.zoneTabsSection {
  padding: 80px 24px;
  background: #ffffff;
  border-top: 4px solid var(--zone-gradient);
  transition: border-color 0.3s ease;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.title {
  font-size: 42px !important;
  font-weight: 700 !important;
  color: #1a1a1a !important;
  margin-bottom: 16px !important;
}

.description {
  font-size: 16px !important;
  color: #666 !important;
}

.tabsWrapper {
  margin-bottom: 32px;
  display: flex;
  justify-content: center;
}

.tabs {
  width: 100%;
  max-width: 600px;
}

.tabs :global(.ant-tabs-nav) {
  margin-bottom: 0;
}

.tabs :global(.ant-tabs-tab) {
  padding: 16px 24px !important;
  font-size: 18px;
  font-weight: 600;
  color: #666;
  transition: all var(--transition-base);
}

.tabs :global(.ant-tabs-tab:hover) {
  color: var(--color-primary);
}

.tabs :global(.ant-tabs-tab-active) {
  background: var(--zone-gradient) !important;
  border-radius: var(--radius-lg);
  color: white !important;
  transition: all var(--transition-base);
}

.tabs :global(.ant-tabs-ink-bar) {
  display: none;
}

.tabLabel {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tabIcon {
  font-size: 20px;
}

.indicator {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
}

.subCategories {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.subCatButton {
  padding: 8px 20px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: var(--radius-full);
  font-size: 14px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all var(--transition-base);
}

.subCatButton:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.subCatButton.active {
  background: var(--zone-gradient);
  border-color: transparent;
  color: white;
}

.viewMore {
  text-align: center;
  margin-top: 48px;
}

.viewMoreButton {
  background: var(--zone-gradient);
  border: none;
  color: white;
  font-weight: 600;
  padding: 12px 40px;
  height: auto;
  border-radius: var(--radius-lg);
  font-size: 16px;
  transition: all var(--transition-base);
}

.viewMoreButton:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.viewMoreButton a {
  color: inherit;
  text-decoration: none;
}

/* Responsive */
@media (max-width: 768px) {
  .zoneTabsSection {
    padding: 60px 16px;
  }

  .title {
    font-size: 32px !important;
  }

  .tabs :global(.ant-tabs-tab) {
    padding: 12px 16px !important;
    font-size: 16px;
  }

  .subCategories {
    gap: 8px;
  }

  .subCatButton {
    padding: 6px 16px;
    font-size: 13px;
  }
}
```

**Step 3: Create ProductGrid component**

Create `src/components/home/ProductGrid.tsx`:

```tsx
import { motion } from 'framer-motion';
import { Card, Typography, Button, Tag } from 'antd';
import { Link } from 'react-router-dom';
import styles from './ProductGrid.module.css';

const { Title, Text } = Typography;

interface Product {
  id: string;
  name: string;
  category: string;
  tags?: string[];
  price?: string;
  specifications: Array<{ label: string; value: string }>;
}

interface ProductGridProps {
  products: Product[];
  zone: string;
}

const ProductGrid = ({ products, zone }: ProductGridProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const getGradientForZone = (zone: string) => {
    switch (zone) {
      case 'intelligent':
        return 'var(--gradient-intelligent)';
      case 'general':
        return 'var(--gradient-general)';
      case 'solutions':
        return 'var(--gradient-solutions)';
      default:
        return 'var(--gradient-primary)';
    }
  };

  const getZonePath = (product: any) => {
    switch (product.category) {
      case 'gpu-bare-metal':
        return '/intelligent-computing/gpu-bare-metal';
      case 'gpu-cloud':
        return '/intelligent-computing/gpu-cloud';
      case 'appliance':
        return '/intelligent-computing/appliance';
      case 'maas':
        return '/intelligent-computing/maas';
      case 'general':
        return '/general';
      default:
        return '/intelligent';
    }
  };

  return (
    <motion.div
      className={styles.grid}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {products.map((product) => (
        <motion.div
          key={product.id}
          className={styles.gridItem}
          variants={itemVariants}
          whileHover={{ y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <Link to={`${getZonePath(product)}#${product.id}`}>
            <Card
              className={styles.card}
              bordered={false}
              hoverable
            >
              {/* Header */}
              <div className={styles.cardHeader}>
                <Title level={4} className={styles.productName}>
                  {product.name}
                </Title>
                <div className={styles.tags}>
                  {product.tags?.map((tag) => (
                    <Tag
                      key={tag}
                      className={`${styles.tag} ${tag === '热销' ? styles.tagHot : tag === '上新' ? styles.tagNew : ''}`}
                    >
                      {tag === '热销' && '🔥 热销'}
                      {tag === '上新' && '✨ 上新'}
                    </Tag>
                  ))}
                </div>
              </div>

              {/* Specifications */}
              <div className={styles.specs}>
                {product.specifications.slice(0, 5).map((spec) => (
                  <div key={spec.label} className={styles.specItem}>
                    <Text className={styles.specLabel}>{spec.label}</Text>
                    <Text className={styles.specValue}>{spec.value}</Text>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className={styles.cardFooter}>
                {product.price && (
                  <Text className={styles.price}>{product.price}</Text>
                )}
                <Button
                  type="primary"
                  size="small"
                  className={styles.ctaButton}
                  style={{ background: getGradientForZone(zone), border: 'none' }}
                >
                  立即咨询
                </Button>
              </div>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProductGrid;
```

**Step 4: Create ProductGrid styles**

Create `src/components/home/ProductGrid.module.css`:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.gridItem {
  height: 100%;
}

.gridItem a {
  display: block;
  height: 100%;
  text-decoration: none;
  color: inherit;
}

.card {
  height: 100%;
  border-radius: var(--radius-lg) !important;
  box-shadow: var(--shadow-card) !important;
  transition: all var(--transition-base);
  border: 1px solid rgba(0, 0, 0, 0.04) !important;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.card:hover {
  box-shadow: var(--shadow-card-hover) !important;
}

.card :global(.ant-card-body) {
  padding: 24px !important;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.cardHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 12px;
}

.productName {
  font-size: 18px !important;
  font-weight: 600 !important;
  color: #1a1a1a !important;
  margin: 0 !important;
  flex: 1;
  line-height: 1.4 !important;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 600;
  border: none;
  margin: 0;
}

.tagHot {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
  color: white;
}

.tagNew {
  background: linear-gradient(135deg, #10B981 0%, #34D399 100%);
  color: white;
}

.specs {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  margin-bottom: 20px;
}

.specItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: #f8f9fc;
  border-radius: var(--radius-md);
  transition: background var(--transition-fast);
}

.card:hover .specItem {
  background: #f0f2f8;
}

.specLabel {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.specValue {
  font-size: 13px;
  color: #1a1a1a;
  font-weight: 600;
  text-align: right;
}

.cardFooter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.price {
  font-size: 22px;
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ctaButton {
  font-weight: 600;
  border-radius: var(--radius-md);
  padding: 4px 16px;
  height: auto;
  transition: all var(--transition-base);
}

.ctaButton:hover {
  opacity: 0.9;
  transform: scale(1.05);
}

/* Responsive */
@media (max-width: 1199px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .card :global(.ant-card-body) {
    padding: 20px !important;
  }

  .productName {
    font-size: 16px !important;
  }

  .price {
    font-size: 18px;
  }
}
```

**Step 5: Update Home page**

Modify `src/pages/Home/index.tsx`, replace GPU Bare Metal and DeepSeek sections with:

```tsx
import ZoneTabs from '../../components/home/ZoneTabs';
// ... keep other imports

const Home = () => {
  return (
    <div className={styles.home}>
      <HeroSection />
      <PlatformCapabilities />

      {/* Zone Tabs - Replaces individual product sections */}
      <ZoneTabs />

      {/* Keep existing Footer */}
      <footer className={styles.footer}>
        {/* ... existing footer content */}
      </footer>
    </div>
  );
};
```

Remove the old product sections (GPU Bare Metal and DeepSeek sections).

**Step 6: Test**

Run dev server and verify:
- Zone tabs switch smoothly with animations
- Products display correctly for each zone
- Sub-category buttons are visible
- "View More" links work

**Step 7: Commit**

```bash
git add src/components/home/ZoneTabs.tsx src/components/home/ZoneTabs.module.css src/components/home/ProductGrid.tsx src/components/home/ProductGrid.module.css src/pages/Home/index.tsx
git commit -m "feat: add tabbed zone interface with animated product grids"
```

---

## Phase 5: Footer Redesign

### Task 5: Modernize footer component

**Files:**
- Create: `src/components/home/Footer.tsx`
- Create: `src/components/home/Footer.module.css`
- Modify: `src/pages/Home/index.tsx`

**Step 1: Create Footer component**

Create `src/components/home/Footer.tsx`:

```tsx
import { Typography, Row, Col, Space } from 'antd';
import {
  CustomerServiceOutlined,
  WechatOutlined,
  WeiboOutlined,
  QqOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import styles from './Footer.module.css';

const { Title, Text, Paragraph } = Typography;

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Main Content */}
        <Row gutter={[48, 32]} className={styles.mainContent}>
          {/* Brand Section */}
          <Col xs={24} md={8}>
            <div className={styles.brandSection}>
              <div className={styles.logo}>
                <span className={styles.logoIcon}>🏢</span>
                <span className={styles.logoText}>云聚通智一体算力超市</span>
              </div>
              <Paragraph className={styles.description}>
                中电信数智科技有限公司，致力于为企业客户提供专业的算力服务和解决方案
              </Paragraph>
              <div className={styles.companyInfo}>
                <div className={styles.infoItem}>
                  <EnvironmentOutlined />
                  <Text>北京市西城区展览路街道京鼎大厦</Text>
                </div>
                <div className={styles.infoItem}>
                  <PhoneOutlined />
                  <Text>400-XXX-XXXX</Text>
                </div>
              </div>
            </div>
          </Col>

          {/* Quick Links */}
          <Col xs={24} md={8}>
            <div className={styles.linksSection}>
              <Title level={4} className={styles.sectionTitle}>
                快速链接
              </Title>
              <div className={styles.linkGroups}>
                <div className={styles.linkGroup}>
                  <Text className={styles.linkGroupTitle}>智算服务</Text>
                  <Space direction="vertical" size={8}>
                    <a href="/intelligent-computing/gpu-bare-metal">GPU裸金属</a>
                    <a href="/intelligent-computing/gpu-cloud">GPU云主机</a>
                    <a href="/intelligent-computing/appliance">智算一体机</a>
                    <a href="/intelligent-computing/maas">MaaS平台</a>
                  </Space>
                </div>
              </div>
            </div>
          </Col>

          {/* Contact & Social */}
          <Col xs={24} md={8}>
            <div className={styles.contactSection}>
              <Title level={4} className={styles.sectionTitle}>
                联系我们
              </Title>
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <CustomerServiceOutlined />
                  <div>
                    <Text className={styles.contactLabel}>客户服务热线</Text>
                    <Text className={styles.contactValue}>400-XXX-XXXX</Text>
                  </div>
                </div>
                <div className={styles.socialLinks}>
                  <Text className={styles.socialLabel}>关注我们</Text>
                  <Space size={16}>
                    <a href="#" className={styles.socialIcon}>
                      <WechatOutlined />
                      <Text>微信</Text>
                    </a>
                    <a href="#" className={styles.socialIcon}>
                      <WeiboOutlined />
                      <Text>微博</Text>
                    </a>
                    <a href="#" className={styles.socialIcon}>
                      <QqOutlined />
                      <Text>QQ</Text>
                    </a>
                  </Space>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            <Text>© 2024 中电信数智科技有限公司 版权所有</Text>
            <Text>|</Text>
            <a href="#">隐私政策</a>
            <Text>|</Text>
            <a href="#">服务条款</a>
            <Text>|</Text>
            <a href="#">京ICP备XXXXXXXX号</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

**Step 2: Create Footer styles**

Create `src/components/home/Footer.module.css`:

```css
.footer {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: white;
  padding: 80px 24px 24px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.mainContent {
  margin-bottom: 48px;
}

.brandSection {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.logoIcon {
  font-size: 40px;
}

.logoText {
  font-size: 20px;
  font-weight: 700;
  color: white;
}

.description {
  color: rgba(255, 255, 255, 0.8) !important;
  font-size: 14px !important;
  line-height: 1.8 !important;
  margin: 0 !important;
}

.companyInfo {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.infoItem {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.infoItem span {
  color: rgba(255, 255, 255, 0.7);
}

.linksSection {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sectionTitle {
  color: white !important;
  font-size: 18px !important;
  font-weight: 600 !important;
  margin-bottom: 16px !important;
}

.linkGroupTitle {
  display: block;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
}

.linkGroups :global(.ant-space-item) a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 14px;
  transition: color var(--transition-fast);
}

.linkGroups :global(.ant-space-item) a:hover {
  color: white;
}

.contactSection {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.contactInfo {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.contactItem {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.contactItem span:first-child {
  font-size: 24px;
  color: var(--color-primary-light);
  margin-top: 2px;
}

.contactLabel {
  display: block;
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  margin-bottom: 4px;
}

.contactValue {
  display: block;
  color: white;
  font-size: 18px;
  font-weight: 600;
}

.socialLinks {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.socialLabel {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 600;
}

.socialIcon {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 14px;
  transition: all var(--transition-base);
  padding: 8px 16px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.05);
}

.socialIcon:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.bottomBar {
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.copyright {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
}

.copyright a {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.copyright a:hover {
  color: white;
}

/* Responsive */
@media (max-width: 768px) {
  .footer {
    padding: 60px 16px 24px;
  }

  .logo {
    flex-direction: column;
    align-items: flex-start;
  }

  .logoText {
    font-size: 18px;
  }

  .sectionTitle {
    font-size: 16px !important;
  }
}
```

**Step 3: Update Home page**

Modify `src/pages/Home/index.tsx`, replace the existing footer with:

```tsx
import Footer from '../../components/home/Footer';
// ... keep other imports

const Home = () => {
  return (
    <div className={styles.home}>
      <HeroSection />
      <PlatformCapabilities />
      <ZoneTabs />
      <Footer />
    </div>
  );
};
```

Remove the old footer code (lines 313-376 in the original file).

**Step 4: Test**

Run dev server and verify footer displays correctly on desktop and mobile.

**Step 5: Commit**

```bash
git add src/components/home/Footer.tsx src/components/home/Footer.module.css src/pages/Home/index.tsx
git commit -m "feat: redesign footer with modern layout and styling"
```

---

## Phase 6: Responsive Design & Polish

### Task 6: Add global styles and polish

**Files:**
- Modify: `src/pages/Home/Home.module.css`
- Modify: `src/index.css`

**Step 1: Update Home page global styles**

Modify `src/pages/Home/Home.module.css`, replace entire content with:

```css
.home {
  min-height: 100vh;
  background: #ffffff;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: var(--color-primary);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary-dark);
}

/* Selection */
::selection {
  background: var(--color-primary);
  color: white;
}

/* Focus styles for accessibility */
*:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Link transitions */
a {
  transition: color var(--transition-fast);
}

/* Button transitions */
button {
  transition: all var(--transition-base);
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Step 2: Add utility classes to global styles**

Modify `src/index.css`, add at the end:

```css
/* Utility classes */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.section {
  padding: 80px 0;
}

.text-gradient {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Animation utilities */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.6s ease-out;
}

/* Loading skeleton */
.skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

**Step 3: Test responsive design**

Run dev server and test at different viewport sizes:
- Desktop (1920x1080)
- Laptop (1366x768)
- Tablet (768x1024)
- Mobile (375x667)

Check:
- All sections display correctly
- No horizontal scrollbars
- Navigation works on mobile
- Animations are smooth

**Step 4: Performance check**

Open browser DevTools:
- Check Lighthouse score
- Verify no console errors
- Check animation performance (should maintain 60fps)

**Step 5: Commit**

```bash
git add src/pages/Home/Home.module.css src/index.css
git commit -m "style: add global styles and polish responsive design"
```

---

## Phase 7: Final Testing & Documentation

### Task 7: Final testing and cleanup

**Files:**
- Create: `docs/HOMEPAGE_REDESIGN.md`
- Test: Manual testing checklist

**Step 1: Create redesign documentation**

Create `docs/HOMEPAGE_REDESIGN.md`:

```markdown
# Homepage Redesign Summary

## Overview
Redesigned the homepage with modern visual style, enhanced animations, and improved user experience.

## Key Changes

### 1. Hero Section
- New gradient background with animated grid overlay
- Split layout: brand info left, product cards right
- Framer Motion animations for smooth entry
- Floating product cards with 3D hover effects
- Scroll indicator animation

### 2. Platform Capabilities
- Redesigned 2x3 grid layout
- Icon-based cards with gradient backgrounds
- Animated entry using Intersection Observer
- Statistics display for each capability

### 3. Zone Tabs Interface
- Tabbed navigation for Intelligent/General/Solutions zones
- Animated tab switching with color transitions
- Sub-category badges for each zone
- Unified product grid component

### 4. Product Cards
- Modern card design with rounded corners
- Icon-based specification display
- Gradient price text
- Enhanced hover animations

### 5. Footer
- Modern dark theme design
- Reorganized into three columns
- Social media links
- Quick navigation links

## Technical Implementation

### New Dependencies
- `framer-motion`: ^11.0.0 (animations)

### New Components
- `src/components/home/HeroSection.tsx`
- `src/components/home/PlatformCapabilities.tsx`
- `src/components/home/ZoneTabs.tsx`
- `src/components/home/ProductGrid.tsx`
- `src/components/home/Footer.tsx`

### Design Tokens
- Defined in `src/styles/tokens.css`
- Includes colors, gradients, shadows, spacing, transitions

## Performance
- Smooth 60fps animations
- Optimized with GPU acceleration (transform/opacity)
- Lazy loading ready for product images
- Skeleton loading states implemented

## Responsive Breakpoints
- Desktop: ≥1200px (3 columns)
- Tablet: 768px-1199px (2 columns)
- Mobile: <768px (1 column, stacked layout)

## Browser Support
- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile browsers: iOS Safari 12+, Chrome Android

## Future Enhancements
- Dark mode toggle
- Product filtering by specifications
- Advanced search functionality
- Product comparison feature
- Wishlist functionality
- Live chat integration
