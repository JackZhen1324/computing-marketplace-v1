import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Row, Col, Typography, Button, Spin, Alert } from 'antd';
import { Link } from 'react-router-dom';
import {
  ArrowRightOutlined,
  CloudServerOutlined,
  NodeIndexOutlined,
  ApiOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { solutionsService } from '../../services/api/solutions';
import type { SolutionWithBenefits } from '../../services/types/api';
import styles from './Solutions.module.css';

const { Title, Paragraph } = Typography;

const Solutions = () => {
  const [solutionsList, setSolutionsList] = useState<SolutionWithBenefits[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const data = await solutionsService.getSolutions();
        setSolutionsList(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load solutions');
      } finally {
        setLoading(false);
      }
    };

    fetchSolutions();
  }, []);

  if (loading) {
    return (
      <div className={styles.page}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div style={{ padding: '50px', maxWidth: '800px', margin: '0 auto' }}>
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

  const getGradientForSolution = (id: string) => {
    switch (id) {
      case 'service-platform':
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'network-system':
        return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
      case 'fusion-base':
        return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
      default:
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  };

  const getLightGradientForSolution = (id: string) => {
    switch (id) {
      case 'service-platform':
        return 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)';
      case 'network-system':
        return 'linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.05) 100%)';
      case 'fusion-base':
        return 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.05) 100%)';
      default:
        return 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)';
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
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

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
            className={styles.heroIcon}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            💡
          </motion.div>

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

          <motion.div
            className={styles.features}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className={styles.featureItem}>
              <CheckCircleOutlined className={styles.featureIcon} />
              <span>定制化方案</span>
            </div>
            <div className={styles.featureItem}>
              <CheckCircleOutlined className={styles.featureIcon} />
              <span>快速部署</span>
            </div>
            <div className={styles.featureItem}>
              <CheckCircleOutlined className={styles.featureIcon} />
              <span>专业支持</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className={styles.solutionsSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Title level={2} className={styles.sectionTitle}>
              专业解决方案
            </Title>
            <Paragraph className={styles.sectionDesc}>
              依托强大的算力基础设施和丰富的行业经验，为您提供全方位的算力服务
            </Paragraph>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <Row gutter={[32, 32]}>
              {solutionsList.map((solution, index) => (
                <Col xs={24} md={8} key={solution.id}>
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ y: -12 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link to={`/solutions/${solution.id}`} className={styles.solutionLink}>
                      <div
                        className={styles.solutionCard}
                        style={{
                          background: getLightGradientForSolution(solution.id),
                        }}
                      >
                        {/* Animated border */}
                        <div
                          className={styles.solutionBorder}
                          style={{ background: getGradientForSolution(solution.id) }}
                        />

                        {/* Icon */}
                        <div
                          className={styles.solutionIcon}
                          style={{ background: getGradientForSolution(solution.id) }}
                        >
                          {getIconForSolution(solution.id)}
                        </div>

                        {/* Content */}
                        <Title level={3} className={styles.solutionTitle}>
                          {solution.title}
                        </Title>
                        <Paragraph className={styles.solutionDescription}>
                          {solution.subtitle}
                        </Paragraph>

                        {/* Features List */}
                        <div className={styles.solutionFeatures}>
                          {solution.highlights.slice(0, 4).map((highlight, idx) => (
                            <div key={idx} className={styles.solutionFeature}>
                              <CheckCircleOutlined className={styles.checkIcon} />
                              <span>{highlight}</span>
                            </div>
                          ))}
                        </div>

                        {/* CTA Button */}
                        <Button
                          type="primary"
                          className={styles.ctaButton}
                          style={{ background: getGradientForSolution(solution.id), border: 'none' }}
                          icon={<ArrowRightOutlined />}
                        >
                          了解更多
                        </Button>
                      </div>
                    </Link>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.ctaText}
          >
            <Title level={2} className={styles.ctaTitle}>
              找不到合适的解决方案？
            </Title>
            <Paragraph className={styles.ctaDesc}>
              我们的专业团队可以根据您的具体需求，为您量身定制专属的算力解决方案
            </Paragraph>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Link to="/contact">
              <Button
                type="primary"
                size="large"
                className={styles.consultButton}
              >
                立即咨询
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Solutions;
