import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, Typography, Button } from 'antd';
import { Link } from 'react-router-dom';
import ProductGrid from './ProductGrid';
import { productsData, Product } from '../../data/products';
import styles from './ZoneTabs.module.css';

const { Title, Paragraph } = Typography;

const ZoneTabs = () => {
  const [activeTab, setActiveTab] = useState('intelligent');
  const [activeSubCategory, setActiveSubCategory] = useState('all');

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

  // Reset subcategory when tab changes
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setActiveSubCategory('all');
  };

  const getProductsForZone = (zone: string, subCategory?: string): Product[] => {
    let products: Product[] = [];

    switch (zone) {
      case 'intelligent':
        products = productsData.filter(p =>
          ['gpu-bare-metal', 'gpu-cloud', 'appliance', 'maas'].includes(p.category)
        );
        break;
      case 'general':
        products = productsData.filter(p => p.category === 'general');
        break;
      case 'solutions':
        products = [];
        break;
      default:
        products = [];
    }

    // Filter by subcategory if not 'all'
    if (subCategory && subCategory !== 'all') {
      products = products.filter(p => p.category === subCategory);
    }

    return products.slice(0, 6);
  };

  const products = getProductsForZone(activeTab, activeSubCategory);

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

  const getZoneName = (zone: string) => {
    switch (zone) {
      case 'intelligent':
        return '智算专区';
      case 'general':
        return '通算专区';
      case 'solutions':
        return '解决方案';
      default:
        return '';
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
            onChange={handleTabChange}
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
            {currentTab?.subCategories.map((cat, index) => (
              <motion.button
                key={cat.key}
                className={`${styles.subCatButton} ${activeSubCategory === cat.key ? styles.active : ''}`}
                onClick={() => setActiveSubCategory(cat.key)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{cat.label}</span>
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`products-${activeTab}-${activeSubCategory}`}
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <Link to={`/${activeTab === 'intelligent' ? 'intelligent-computing' : activeTab === 'general' ? 'general-computing' : 'solutions'}`}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="large" className={styles.viewMoreButton}>
                查看{getZoneName(activeTab)}全部产品
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ZoneTabs;
