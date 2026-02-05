import { motion } from 'framer-motion';
import { Row, Col, Typography, Card, Button } from 'antd';
import { Link } from 'react-router-dom';
import {
  ArrowRightOutlined,
  CloudServerOutlined,
  NodeIndexOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import { solutionsData } from '../../data/solutions';
import styles from './Solutions.module.css';

const { Title, Paragraph } = Typography;

const Solutions = () => {
  // Filter out the "solutions-home" entry as it's just for the homepage
  const solutionsList = solutionsData.filter(s => s.id !== 'solutions-home');

  // Icon mapping for solutions
  const getIconForSolution = (id: string) => {
    switch (id) {
      case 'service-platform':
        return <CloudServerOutlined />;
      case 'network-system':
        return <NodeIndexOutlined />;
      case 'fusion-base':
        return <ApiOutlined />;
      default:
        return <CloudServerOutlined />;
    }
  };

  // Color gradient for solutions
  const getGradientForSolution = (id: string) => {
    switch (id) {
      case 'service-platform':
        return 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)';
      case 'network-system':
        return 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)';
      case 'fusion-base':
        return 'linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)';
      default:
        return 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className={styles.solutions}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.gridOverlay}></div>
          <div className={styles.gradientOrb}></div>
          <div className={styles.gradientOrb2}></div>
        </div>

        <div className={styles.heroContent}>
    

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Title level={1} className={styles.heroTitle}>
              解决方案
            </Title>
            <Paragraph className={styles.heroSubtitle}>
              为各行各业提供专业的算力解决方案，助力企业数字化转型
            </Paragraph>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <motion.div
            className={styles.intro}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Paragraph className={styles.introText}>
              依托强大的算力基础设施和丰富的行业经验，为不同行业客户提供定制化的算力解决方案。
            </Paragraph>
          </motion.div>

          <motion.div
            className={styles.solutionsGrid}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Row gutter={[32, 32]}>
              {solutionsList.map((solution, index) => (
                <Col xs={24} md={8} key={solution.id}>
                  <motion.div variants={itemVariants} whileHover={{ y: -8 }}>
                    <Link to={`/solutions/${solution.id}`} className={styles.solutionLink}>
                      <Card
                        hoverable
                        className={styles.card}
                        bordered={false}
                        style={{
                          height: '100%',
                          background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
                          borderRadius: '20px',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {/* Icon */}
                        <div
                          className={styles.solutionIcon}
                          style={{ background: getGradientForSolution(solution.id) }}
                        >
                          {getIconForSolution(solution.id)}
                        </div>

                        {/* Content */}
                        <Title level={3} className={styles.cardTitle}>
                          {solution.title}
                        </Title>
                        <Paragraph className={styles.cardDescription}>
                          {solution.subtitle}
                        </Paragraph>

                        {/* Features */}
                        <div className={styles.features}>
                          {solution.highlights.slice(0, 3).map((highlight, idx) => (
                            <div key={idx} className={styles.feature}>
                              ✓ {highlight}
                            </div>
                          ))}
                        </div>

                        {/* CTA */}
                        <Button
                          type="primary"
                          className={styles.ctaButton}
                          style={{ background: getGradientForSolution(solution.id), border: 'none' }}
                          icon={<ArrowRightOutlined />}
                        >
                          了解更多
                        </Button>
                      </Card>
                    </Link>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Solutions;
