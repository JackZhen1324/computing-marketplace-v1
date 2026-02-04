import { Typography } from 'antd';
import { HeroSection, SpecTable, FeatureList } from '../../components/common';
import { getProductsByCategory } from '../../data/products';
import styles from './ProductPage.module.css';

const { Title, Paragraph } = Typography;

const MaaS = () => {
  const products = getProductsByCategory('maas');
  const product = products[0];

  return (
    <div className={styles.page}>
      <HeroSection
        title={product.title}
        subtitle={product.subtitle}
        backgroundImage={product.image}
      />

      <section className={styles.section}>
        <div className={styles.container}>
          <Title level={2} className={styles.title}>产品概述</Title>
          <Paragraph className={styles.description}>
            {product.description}
          </Paragraph>
        </div>
      </section>

      <section className={styles.section + ' ' + styles.sectionGray}>
        <div className={styles.container}>
          <Title level={2} className={styles.title}>产品特点</Title>
          <FeatureList
            features={product.features.map(f => ({
              title: f,
              description: f,
            }))}
            columns={3}
          />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <Title level={2} className={styles.title}>技术规格</Title>
          <div className={styles.specContainer}>
            <SpecTable specifications={product.specifications} />
          </div>
        </div>
      </section>

      <section className={styles.section + ' ' + styles.sectionGray}>
        <div className={styles.container}>
          <Title level={2} className={styles.title}>应用场景</Title>
          <div className={styles.useCases}>
            {product.useCases.map((useCase, index) => (
              <div key={index} className={styles.useCase}>
                <h3>{useCase}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MaaS;
