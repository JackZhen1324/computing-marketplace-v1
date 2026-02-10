import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Row, Col, Card, Typography, Button, Pagination, Spin, Alert, Tag } from 'antd';
import {
  CloudServerOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  DollarOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useProducts } from '../../services/hooks/useProducts';
import InquiryDialog from '../../components/common/InquiryDialog';
import styles from './GeneralComputing.module.css';

const { Title, Text, Paragraph } = Typography;

const GeneralComputing = () => {
  const { products, loading, error } = useProducts({ category: 'general' });
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Category filter state
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6; // Show 6 products per page (as in design)

  // Categories from design
  const categories = [
    { key: 'all', label: '全部', icon: <CloudServerOutlined /> },
    { key: 'domestic', label: '国产CPU型', icon: <ThunderboltOutlined /> },
    { key: 'general', label: '通用应用型', icon: <CloudServerOutlined /> },
    { key: 'enhanced', label: '通用计算增强型', icon: <SafetyOutlined /> },
    { key: 'memory', label: '内存计算型', icon: <DollarOutlined /> },
    { key: 'storage', label: '存储型', icon: <ClockCircleOutlined /> },
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

  const handleInquiryClick = (product: any) => {
    setSelectedProduct(product);
    setDialogVisible(true);
  };

  const handleDialogClose = () => {
    setDialogVisible(false);
    setSelectedProduct(null);
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
        <div className={styles.heroBackground}>
          <div className={styles.gridOverlay}></div>
          <div className={styles.gradientOrb}></div>
          <div className={styles.gradientOrb2}></div>
        </div>

        <div className={styles.heroContent}>
          <motion.div
            className={styles.heroBadge}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CloudServerOutlined style={{ fontSize: '20px', marginRight: '8px' }} />
            企业级云计算服务
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Title level={1} className={styles.heroTitle}>
              通用计算云主机
            </Title>
            <Paragraph className={styles.heroSubtitle}>
              提供安全稳定、可随时自助获取、弹性伸缩的计算服务
            </Paragraph>
          </motion.div>

          <motion.div
            className={styles.features}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className={styles.featureItem}>
              <CheckCircleOutlined className={styles.featureIcon} />
              <span>弹性伸缩</span>
            </div>
            <div className={styles.featureItem}>
              <CheckCircleOutlined className={styles.featureIcon} />
              <span>安全可靠</span>
            </div>
            <div className={styles.featureItem}>
              <CheckCircleOutlined className={styles.featureIcon} />
              <span>极速部署</span>
            </div>
            <div className={styles.featureItem}>
              <CheckCircleOutlined className={styles.featureIcon} />
              <span>灵活计费</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Tags - Matching Design */}
      <section className={styles.categoriesSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.categoryTabs}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {categories.map((category, index) => (
              <motion.button
                key={category.key}
                className={`${styles.categoryTab} ${
                  activeCategory === category.key ? styles.active : ''
                }`}
                onClick={() => {
                  setActiveCategory(category.key);
                  setCurrentPage(1);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {category.icon}
                {category.label}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Products Grid - Matching Design 3x2 Layout */}
      <section className={styles.productsSection}>
        <div className={styles.container}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Row gutter={[24, 24]}>
              {paginatedProducts.map((product, index) => (
                <Col xs={24} sm={12} lg={8} key={product.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                  >
                    <Card
                      hoverable
                      className={styles.productCard}
                      style={{
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                      }}
                    >
                      {/* Animated Top Border */}
                      <div className={styles.cardTopBorder}></div>

                      {/* Tags */}
                      <div className={styles.cardTags}>
                        {product.tags && product.tags.includes('热销') && (
                          <Tag className={styles.cardTagHot} color="red">热销</Tag>
                        )}
                        {product.tags && product.tags.includes('上新') && (
                          <Tag className={styles.cardTagNew} color="green">上新</Tag>
                        )}
                        {product.tags && product.tags.includes('推荐') && (
                          <Tag className={styles.cardTagRecommend} color="blue">推荐</Tag>
                        )}
                      </div>

                      <Title level={4} className={styles.productName}>
                        {product.name}
                      </Title>

                      <div className={styles.productPricing}>
                        <Text className={styles.priceLabel}>包周期</Text>
                        <Text className={styles.price}>
                          {product.priceDisplay}
                        </Text>
                      </div>

                      <Paragraph className={styles.productDescription}>
                        {product.description}
                      </Paragraph>

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

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button
                          type="primary"
                          className={styles.ctaButton}
                          onClick={() => handleInquiryClick(product)}
                          block
                        >
                          立即咨询
                        </Button>
                      </motion.div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>

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

      {/* Contact Section - Enhanced Design */}
      <section className={styles.contactSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.contactCard}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.contactIcon}>
              <CloudServerOutlined />
            </div>
            <Title level={2} className={styles.contactTitle}>需要帮助？</Title>
            <Paragraph className={styles.contactDesc}>
              我们的专业团队随时为您提供咨询服务，帮您找到最适合的通用计算解决方案
            </Paragraph>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <Text className={styles.contactLabel}>公司</Text>
                <Text className={styles.contactValue}>中电信数智科技有限公司</Text>
              </div>
              <div className={styles.contactItem}>
                <Text className={styles.contactLabel}>地址</Text>
                <Text className={styles.contactValue}>北京市西城区展览路街道京鼎大厦</Text>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Inquiry Dialog */}
      <InquiryDialog
        visible={dialogVisible}
        onClose={handleDialogClose}
        product={selectedProduct || { id: '', name: '', category: '' }}
      />
    </div>
  );
};

export default GeneralComputing;
