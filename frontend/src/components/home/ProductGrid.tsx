import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Typography, Button, Tag } from 'antd';
import { Link } from 'react-router-dom';
import { ThunderboltOutlined, StarOutlined, CheckOutlined } from '@ant-design/icons';
import { useInquiries } from '../../contexts/InquiryContext';
import InquiryDialog from '../common/InquiryDialog';
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
  const { addInquiry } = useInquiries();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

  const getIconForZone = (zone: string) => {
    switch (zone) {
      case 'intelligent':
        return '🔥';
      case 'general':
        return '⚡';
      case 'solutions':
        return '🎯';
      default:
        return '💻';
    }
  };

  const getIconColorForZone = (zone: string) => {
    switch (zone) {
      case 'intelligent':
        return '#667eea';
      case 'general':
        return '#10B981';
      case 'solutions':
        return '#F59E0B';
      default:
        return '#667eea';
    }
  };

  const getZonePath = (product: any) => {
    switch (product.category) {
      case 'gpu-bare-metal':
        return '/intelligent/gpu-bare-metal';
      case 'gpu-cloud':
        return '/intelligent/gpu-cloud';
      case 'appliance':
        return '/intelligent/appliance';
      case 'maas':
        return '/intelligent/maas';
      case 'general':
        return '/general';
      default:
        return '/intelligent';
    }
  };

  const handleInquiryClick = (product: Product) => {
    setSelectedProduct(product);
    setDialogVisible(true);
  };

  const handleInquirySubmit = (data: any) => {
    if (selectedProduct) {
      addInquiry(
        selectedProduct.id,
        selectedProduct.name,
        selectedProduct.category,
        data
      );
    }
  };

  const handleDialogClose = () => {
    setDialogVisible(false);
    setSelectedProduct(null);
  };

  return (
    <>
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
                style={{
                  borderRadius: '16px',
                  overflow: 'visible',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  height: '100%',
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
                  position: 'relative',
                }}
                styles={{
                  body: { padding: '24px' },
                }}
              >
                {/* Status Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div style={{ position: 'absolute', top: '-8px', right: '16px', zIndex: 1 }}>
                    {product.tags.map((tag) => (
                      <Tag
                        key={tag}
                        color={tag === '热销' ? 'red' : tag === '上新' ? 'blue' : 'purple'}
                        style={{
                          fontSize: '12px',
                          fontWeight: 'bold',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          margin: '0 4px',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        {tag}
                      </Tag>
                    ))}
                  </div>
                )}

                {/* Product Icon */}
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: getGradientForZone(zone),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    fontSize: '32px',
                  }}
                >
                  {getIconForZone(zone)}
                </div>

                {/* Product Name */}
                <Title level={4} className={styles.productName} style={{ marginBottom: '12px', minHeight: '48px' }}>
                  {product.name}
                </Title>

                {/* Price */}
                {product.price && (
                  <div style={{ marginBottom: '16px' }}>
                    <Text className={styles.price} style={{ fontSize: '22px', fontWeight: 'bold', color: '#ff4d4f' }}>
                      {product.price}
                    </Text>
                  </div>
                )}

                {/* Specifications */}
                <div className={styles.specs}>
                  {product.specifications.slice(0, 5).map((spec, index) => (
                    <div key={spec.label} className={styles.specItem} style={{ marginBottom: index < 4 ? '8px' : '0' }}>
                      <span style={{ color: getIconColorForZone(zone), fontSize: '14px', marginRight: '6px' }}>
                        {index === 0 ? <ThunderboltOutlined /> :
                         index === 1 ? <StarOutlined /> :
                         <CheckOutlined />}
                      </span>
                      <Text className={styles.specLabel}>{spec.label}：</Text>
                      <Text className={styles.specValue}>{spec.value}</Text>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className={styles.cardFooter} style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(0, 0, 0, 0.06)' }}>
                  <Button
                    type="primary"
                    size="small"
                    className={styles.ctaButton}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleInquiryClick(product);
                    }}
                    style={{
                      background: getGradientForZone(zone),
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 600,
                      width: '100%',
                    }}
                  >
                    立即咨询
                  </Button>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Inquiry Dialog */}
      <InquiryDialog
        visible={dialogVisible}
        onClose={handleDialogClose}
        product={selectedProduct || { id: '', name: '', category: '' }}
        onSubmit={handleInquirySubmit}
      />
    </>
  );
};

export default ProductGrid;
