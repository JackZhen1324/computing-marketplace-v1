import { useState, useMemo } from 'react';
import { Spin, Alert } from 'antd';
import GPUProductCard from '../../components/common/GPUProductCard';
import { useProducts } from '../../services/hooks/useProducts';
import styles from './GpuBareMetal.module.css';

interface FilterState {
  search: string;
  source: 'all' | 'domestic' | 'foreign';
  vram: string;
}

const GpuBareMetal = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    source: 'all',
    vram: 'all',
  });

  const { products, loading, error } = useProducts({ category: 'gpu-bare-metal' });

  // VRAM filter options
  const vramOptions = [
    { label: '全部', value: 'all' },
    { label: '6GB', value: '6GB' },
    { label: '16GB', value: '16GB' },
    { label: '32GB', value: '32GB' },
    { label: '64GB', value: '64GB' },
    { label: '80GB', value: '80GB' },
    { label: '128GB', value: '128GB' },
    { label: '141GB', value: '141GB' },
  ];

  // Check if GPU is domestic (Chinese brand)
  const isDomesticGPU = (productName: string): boolean => {
    const domesticBrands = ['昇腾', '壁仞', '摩尔线程', '天数', '燧原', '沐曦'];
    return domesticBrands.some(brand => productName.includes(brand));
  };

  // Filter products based on current filters
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (
          !product.name.toLowerCase().includes(searchLower) &&
          !(product.title || '').toLowerCase().includes(searchLower) &&
          !(product.description || '').toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      // Source filter
      if (filters.source !== 'all') {
        if (filters.source === 'domestic' && !isDomesticGPU(product.name)) {
          return false;
        }
        if (filters.source === 'foreign' && isDomesticGPU(product.name)) {
          return false;
        }
      }

      // VRAM filter
      if (filters.vram !== 'all') {
        const vramSpec = product.specifications.find(spec => spec.specLabel === 'GPU显存');
        if (vramSpec && !vramSpec.specValue.includes(filters.vram)) {
          return false;
        }
      }

      return true;
    });
  }, [products, filters]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.page}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.page}>
        <div style={{ padding: '50px' }}>
          <Alert
            message="加载失败"
            description={error}
            type="error"
            showIcon
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
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
                💾
            </div>
            <h1 className={styles.heroTitle}>GPU 裸金属</h1>
            <p className={styles.heroSubtitle}>
              高性能计算 · 资源独享 · 稳定可靠
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className={styles.filterSection}>
        <div className={styles.filterContainer}>
          {/* Search Box */}
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="搜索 GPU 型号、品牌..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          {/* Source Filter */}
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>来源：</span>
            <div className={styles.filterTags}>
              {[
                { label: '全部', value: 'all' },
                { label: '国产', value: 'domestic' },
                { label: '非国产', value: 'foreign' },
              ].map(option => (
                <button
                  key={option.value}
                  className={`${styles.filterTag} ${
                    filters.source === option.value ? styles.active : ''
                  }`}
                  onClick={() => handleFilterChange('source', option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* VRAM Filter */}
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>显存：</span>
            <div className={styles.filterTags}>
              {vramOptions.map(option => (
                <button
                  key={option.value}
                  className={`${styles.filterTag} ${
                    filters.vram === option.value ? styles.active : ''
                  }`}
                  onClick={() => handleFilterChange('vram', option.value)}
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
              <GPUProductCard key={product.id} product={product} />
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
    </div>
  );
};

export default GpuBareMetal;
