import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Row, Col, Card, Typography, Button, Pagination, Spin, Alert } from 'antd';
import { useProducts } from '../../services/hooks/useProducts';
import styles from './GeneralComputing.module.css';

const { Title, Text } = Typography;

const GeneralComputing = () => {
  const { products, loading, error } = useProducts({ category: 'general' });

  // Category filter state
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6; // Show 6 products per page (as in design)

  // Categories from design
  const categories = [
    { key: 'all', label: '全部' },
    { key: 'domestic', label: '国产CPU型' },
    { key: 'general', label: '通用应用型' },
    { key: 'enhanced', label: '通用计算增强型' },
    { key: 'memory', label: '内存计算型' },
    { key: 'storage', label: '存储型' },
  ];

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;

    // Simple category mapping based on product names
    const categoryMap: Record<string, string[]> = {
      'domestic': ['general-001', 'general-002', 'general-003', 'general-004'], // 鲲鹏系列
      'general': ['general-001', 'general-004', 'general-005'], // 通用计算型
      'enhanced': ['general-001', 'general-004', 'general-005'], // 增强型
      'memory': ['general-002', 'general-006'], // 内存优化型
      'storage': ['general-003'], // I/O型
    };

    const ids = categoryMap[activeCategory] || [];
    return products.filter(p => ids.includes(p.id));
  }, [products, activeCategory]);

  // Pagination
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredProducts.slice(startIndex, startIndex + pageSize);
  }, [filteredProducts, currentPage]);

  const totalProducts = filteredProducts.length;

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
        <div className={styles.heroBackground}>
          <div className={styles.gridOverlay}></div>
          <div className={styles.gradientOrb}></div>
          <div className={styles.gradientOrb2}></div>
        </div>

        <div className={styles.heroContent}>
          <motion.div
            className={styles.heroIcon}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ fontSize: '80px', marginBottom: '24px' }}
          >
            💻
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Title level={1} className={styles.heroTitle}>
              通用计算云主机
            </Title>
            <Text className={styles.heroSubtitle}>
              提供安全稳定、可随时自助获取、弹性伸缩的计算服务
            </Text>
            <Text className={styles.heroHighlight}>
              数百种实例规格，灵活计费，极简运维，极大降低企业成本
            </Text>
          </motion.div>
        </div>
      </section>

      {/* Category Tags - Matching Design */}
      <section className={styles.categoriesSection}>
        <div className={styles.container}>
          <div className={styles.categoryTabs}>
            {categories.map((category) => (
              <div
                key={category.key}
                className={`${styles.categoryTab} ${
                  activeCategory === category.key ? styles.active : ''
                }`}
                onClick={() => {
                  setActiveCategory(category.key);
                  setCurrentPage(1);
                }}
              >
                {category.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid - Matching Design 3x2 Layout */}
      <section className={styles.productsSection}>
        <div className={styles.container}>
          <Row gutter={[24, 24]}>
            {paginatedProducts.map((product) => (
              <Col xs={24} sm={12} lg={8} key={product.id}>
                <Card
                  hoverable
                  className={`${styles.productCard} fade-in-up`}
                  cover={
                    <div className={styles.cardCover}>
                      {product.tags && product.tags.includes('热销') && (
                        <div className={`${styles.cardTag} ${styles.tagHot}`}>热销</div>
                      )}
                      {product.tags && product.tags.includes('上新') && (
                        <div className={`${styles.cardTag} ${styles.tagNew}`}>上新</div>
                      )}
                      {product.tags && product.tags.includes('推荐') && (
                        <div className={`${styles.cardTag} ${styles.tagRecommend}`}>推荐</div>
                      )}
                    </div>
                  }
                >
                  <Title level={4} className={styles.productName}>
                    {product.name}
                  </Title>

                  <div className={styles.productPricing}>
                    <Text className={styles.priceLabel}>包周期</Text>
                    <Text className={styles.price}>
                      {product.priceDisplay}
                    </Text>
                  </div>

                  <Text className={styles.productDescription}>
                    {product.description}
                  </Text>

                  <div className={styles.productSpecs}>
                    <div className={styles.specRow}>
                      <Text className={styles.specLabel}>CPU内存比</Text>
                      <Text className={styles.specValue}>{product.cpuMemoryRatio}</Text>
                    </div>
                    <div className={styles.specRow}>
                      <Text className={styles.specLabel}>vCPU数量范围</Text>
                      <Text className={styles.specValue}>{product.vcpuRange}</Text>
                    </div>
                    <div className={styles.specRow}>
                      <Text className={styles.specLabel}>基频/睿频</Text>
                      <Text className={styles.specValue}>{product.baseFreq}</Text>
                    </div>
                  </div>

                  <Button
                    type="primary"
                    className={styles.ctaButton}
                  >
                    立即咨询
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination - Matching Design */}
          <div className={styles.paginationWrapper}>
            <Pagination
              current={currentPage}
              total={totalProducts}
              pageSize={pageSize}
              onChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              showSizeChanger={false}
              className={styles.pagination}
              showTotal={(total) => `共 ${total} 条`}
            />
          </div>
        </div>
      </section>

      {/* Contact Section - Matching Design */}
      <section className={styles.contactSection}>
        <div className={styles.container}>
          <div className={styles.contactInfo}>
            <Title level={3} className={styles.contactTitle}>联系我们：</Title>
            <Text className={styles.contactText}>
              中电信数智科技有限公司
            </Text>
            <Text className={styles.contactText}>
              地 址：北京市西城区展览路街道京鼎大厦2
            </Text>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GeneralComputing;
