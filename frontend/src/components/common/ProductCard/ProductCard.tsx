import { Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../../data/products';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate based on category
    const pathMap: Record<Product['category'], string> = {
      'gpu-bare-metal': '/intelligent/gpu-bare-metal',
      'gpu-cloud': '/intelligent/gpu-cloud',
      'appliance': '/intelligent/appliance',
      'maas': '/intelligent/maas',
      'general': '/general',
    };

    navigate(pathMap[product.category]);
  };

  return (
    <Card
      hoverable
      className={styles.card}
      onClick={handleClick}
      cover={
        product.image && (
          <div className={styles.imageContainer}>
            <img alt={product.title} src={product.image} className={styles.image} />
          </div>
        )
      }
    >
      <div className={styles.content}>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.subtitle}>{product.subtitle}</p>

        {product.features && product.features.length > 0 && (
          <ul className={styles.features}>
            {product.features.slice(0, 4).map((feature, index) => (
              <li key={index} className={styles.featureItem}>
                <span className={styles.bullet}>•</span>
                {feature}
              </li>
            ))}
          </ul>
        )}

        <div className={styles.footer}>
          <span className={styles.link}>了解更多 →</span>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
