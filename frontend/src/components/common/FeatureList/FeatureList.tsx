import { Row, Col } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import type { Feature } from '../../../data/siteContent';
import styles from './FeatureList.module.css';

interface FeatureListProps {
  features: Feature[];
  columns?: number;
}

const FeatureList = ({ features, columns = 3 }: FeatureListProps) => {
  const getColSpan = () => {
    if (columns === 2) {
      return { xs: 24, sm: 12, md: 12 };
    }
    if (columns === 4) {
      return { xs: 12, sm: 12, md: 6, lg: 6 };
    }
    // Default: 3 columns
    return { xs: 24, sm: 12, md: 8 };
  };

  const colSpan = getColSpan();

  return (
    <div className={styles.container}>
      <Row gutter={[24, 24]}>
        {features.map((feature, index) => (
          <Col key={index} {...colSpan}>
            <div className={styles.feature}>
              <div className={styles.icon}>
                {feature.icon ? (
                  <img src={feature.icon} alt={feature.title} />
                ) : (
                  <CheckCircleOutlined />
                )}
              </div>
              <h3 className={styles.title}>{feature.title}</h3>
              <p className={styles.description}>{feature.description}</p>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default FeatureList;
