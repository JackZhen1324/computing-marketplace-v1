import { Typography, Row, Col, Card } from 'antd';
import { HeroSection, FeatureList } from '../../components/common';
import { getSolutionById } from '../../data/solutions';
import styles from './SolutionPage.module.css';

const { Title, Paragraph } = Typography;

const ServicePlatform = () => {
  const solution = getSolutionById('service-platform');

  if (!solution) return <div>Loading...</div>;

  return (
    <div className={styles.page}>
      <HeroSection
        title={solution.title}
        subtitle={solution.subtitle}
        backgroundImage={solution.image}
      />

      <section className={styles.section}>
        <div className={styles.container}>
          <Title level={2} className={styles.title}>方案概述</Title>
          <Paragraph className={styles.description}>
            {solution.description}
          </Paragraph>
        </div>
      </section>

      <section className={styles.section + ' ' + styles.sectionGray}>
        <div className={styles.container}>
          <Title level={2} className={styles.title}>核心优势</Title>
          <Row gutter={[24, 24]}>
            {solution.benefits.map((benefit, index) => (
              <Col key={index} xs={24} md={12}>
                <Card className={styles.benefitCard} hoverable>
                  <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                  <p className={styles.benefitDescription}>{benefit.description}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <Title level={2} className={styles.title}>主要功能</Title>
          <FeatureList
            features={solution.features.map(f => ({
              title: f,
              description: f,
            }))}
            columns={2}
          />
        </div>
      </section>

      {solution.architecture && (
        <section className={styles.section + ' ' + styles.sectionGray}>
          <div className={styles.container}>
            <Title level={2} className={styles.title}>架构设计</Title>
            <Paragraph className={styles.architecture}>
              {solution.architecture}
            </Paragraph>
          </div>
        </section>
      )}
    </div>
  );
};

export default ServicePlatform;
