import { useState, useMemo } from 'react';
import ApplianceCard from '../../components/common/ApplianceCard';
import { getProductsByCategory } from '../../data/products';
import styles from './Appliance.module.css';

interface FilterState {
  search: string;
  category: 'all' | 'deepseek' | 'general';
}

const Appliance = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'all',
  });

  const products = getProductsByCategory('appliance');

  // Filter products based on current filters
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (
          !product.name.toLowerCase().includes(searchLower) &&
          !product.title.toLowerCase().includes(searchLower) &&
          !product.description.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      // Category filter
      if (filters.category !== 'all') {
        if (filters.category === 'deepseek' && !product.name.includes('DeepSeek')) {
          return false;
        }
        if (filters.category === 'general' && product.name.includes('DeepSeek')) {
          return false;
        }
      }

      return true;
    });
  }, [products, filters]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const features = [
    {
      icon: '📦',
      title: '开箱即用',
      desc: '软硬件一体化，预装AI框架和开发环境，快速部署AI业务',
    },
    {
      icon: '🔄',
      title: '灵活配置',
      desc: '支持多种GPU配置，可根据业务需求选择合适的算力规格',
    },
    {
      icon: '🛠️',
      title: '统一管理',
      desc: '提供统一的管理平台，简化运维管理，降低使用门槛',
    },
    {
      icon: '🔧',
      title: '定制服务',
      desc: '支持定制化服务，满足特定行业和场景的专业需求',
    },
    {
      icon: '📊',
      title: '性能优化',
      desc: '针对主流AI模型进行性能优化，提供最佳算力输出',
    },
    {
      icon: '🌐',
      title: '云端协同',
      desc: '支持云端协同工作，实现混合云部署方案',
    },
  ];

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={`${styles.hero} ${styles.deepseekHero}`}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div
              className={styles.heroIcon}
              style={{
                fontSize: '80px',
                marginBottom: '24px',
                animation: 'float 3s ease-in-out infinite',
                display: 'inline-block'
              }}
            >
              💻
            </div>
            <h1 className={styles.heroTitle}>智算一体机</h1>
            <p className={styles.heroSubtitle}>
              开箱即用 · 软硬一体 · 性能优化
            </p>
          </div>
        </div>
      </section>

      {/* DeepSeek Special Section */}
      <section className={styles.deepseekSection}>
        <div className={styles.deepseekContainer}>
          <div className={styles.deepseekBadge}>🤖 DeepSeek专区</div>
          <h2 className={styles.deepseekTitle}>
            DeepSeek 大模型训推一体机
          </h2>
          <p className={styles.deepseekDesc}>
            针对 DeepSeek 全系列模型优化的训推一体机，支持从单机到大规模集群的多种配置方案，
            预装 DeepSeek-R1 系列模型，开箱即用，快速部署企业级 AI 服务
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className={styles.filterSection}>
        <div className={styles.filterContainer}>
          {/* Search Box */}
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="搜索产品名称、型号..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>分类：</span>
            <div className={styles.filterTags}>
              {[
                { label: '全部', value: 'all' },
                { label: 'DeepSeek专区', value: 'deepseek' },
                { label: '通用一体机', value: 'general' },
              ].map(option => (
                <button
                  key={option.value}
                  className={`${styles.filterTag} ${
                    filters.category === option.value ? styles.active : ''
                  }`}
                  onClick={() => handleFilterChange('category', option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className={styles.productsSection}>
        <h2 className={styles.sectionTitle}>
          产品列表 ({filteredProducts.length})
        </h2>

        {filteredProducts.length > 0 ? (
          <div className={styles.productsGrid}>
            {filteredProducts.map(product => (
              <ApplianceCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#999',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <p style={{ fontSize: '16px', margin: 0 }}>
              未找到符合条件的产品，请尝试调整筛选条件
            </p>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresContainer}>
          <h2 className={styles.featuresTitle}>核心优势</h2>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDesc}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Appliance;
