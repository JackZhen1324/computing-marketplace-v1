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
