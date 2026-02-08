import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button, Typography, Space } from 'antd';
import { ThunderboltOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { productsData } from '../../data/products';
import InquiryDialog from '../common/InquiryDialog';
import ParticleEffect from './ParticleEffect';
import styles from './HeroSection.module.css';

const { Title, Paragraph, Text } = Typography;

const HeroSection = () => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);

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
      transition: { duration: 0.5 },
    },
  };

  const handleInquiryClick = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedProduct(product);
    setDialogVisible(true);
  };

  const handleDialogClose = () => {
    setDialogVisible(false);
    setSelectedProduct(null);
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
        <div className={styles.gradientOrb2}></div>
        <ParticleEffect />
      </div>

      <motion.div
        className={styles.container}
        style={{ y: y1, opacity }}
      >
        <motion.div className={styles.heroContent} variants={containerVariants}>
          {/* Left: Brand Info */}
          <motion.div className={styles.brandSection} variants={itemVariants}>
            <div
              className={styles.heroIcon}
              style={{
                fontSize: '80px',
                marginBottom: '24px',
                animation: 'float 3s ease-in-out infinite',
                display: 'inline-block',
                textAlign: 'center',
              }}
            >
              🚀
            </div>

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
              <Link to="/intelligent-computing">
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.08,
                    duration: 0.5,
                    ease: 'easeOut',
                  }}
                  whileHover={{
                    y: -6,
                    boxShadow: '0 16px 32px rgba(99, 102, 241, 0.2)',
                    transition: {
                      duration: 0.2,
                      ease: 'easeOut',
                    },
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
                      <Button
                        type="primary"
                        size="small"
                        onClick={(e) => handleInquiryClick(product, e)}
                      >
                        立即咨询
                      </Button>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Inquiry Dialog */}
      <InquiryDialog
        visible={dialogVisible}
        onClose={handleDialogClose}
        product={selectedProduct || { id: '', name: '', category: '' }}
      />
    </motion.section>
  );
};

export default HeroSection;
