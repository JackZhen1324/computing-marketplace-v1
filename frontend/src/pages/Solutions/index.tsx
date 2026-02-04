import { Row, Col, Typography, Card, Button } from 'antd';
import { Link } from 'react-router-dom';
import { ArrowRightOutlined } from '@ant-design/icons';
import { HeroSection } from '../../components/common';
import { solutionsData } from '../../data/solutions';
import styles from './Solutions.module.css';

const { Title, Paragraph } = Typography;

const Solutions = () => {
  // Filter out the "solutions-home" entry as it's just for the homepage
  const solutionsList = solutionsData.filter(s => s.id !== 'solutions-home');

  return (
    <div className={styles.solutions}>
      <HeroSection
        title="解决方案"
        subtitle="为各行各业提供专业的算力解决方案"
      />

      <section className={styles.section}>
        <div className={styles.container}>
          <Paragraph className={styles.intro}>
            依托强大的算力基础设施和丰富的行业经验，为不同行业客户提供定制化的算力解决方案，助力企业数字化转型。
          </Paragraph>

          <Row gutter={[32, 32]}>
            {solutionsList.map((solution) => (
              <Col xs={24} md={8} key={solution.id}>
                <Link to={`/solutions/${solution.id}`}>
                  <Card
                    hoverable
                    className={styles.card}
                  >
                    <Title level={3} className={styles.cardTitle}>
                      {solution.title}
                    </Title>
                    <Paragraph className={styles.cardDescription}>
                      {solution.subtitle}
                    </Paragraph>

                    <div className={styles.features}>
                      {solution.highlights.map((highlight, idx) => (
                        <div key={idx} className={styles.feature}>
                          • {highlight}
                        </div>
                      ))}
                    </div>

                    <Button type="primary" icon={<ArrowRightOutlined />} block>
                      了解更多
                    </Button>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      </section>
    </div>
  );
};

export default Solutions;
