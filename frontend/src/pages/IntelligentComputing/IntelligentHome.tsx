import { motion } from 'framer-motion';
import { Card, Button, Typography } from 'antd';
import { Link } from 'react-router-dom';
import {
  ThunderboltOutlined,
  CloudOutlined,
  RocketOutlined,
  CodeOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import styles from './IntelligentHome.module.css';

const { Title, Paragraph, Text } = Typography;

const IntelligentHome = () => {
  const categories = [
    {
      id: 'gpu-bare-metal',
      title: 'GPU裸金属',
      subtitle: '高性能计算资源',
      description: '独享GPU资源，极致性能，适合大规模模型训练和高性能计算任务',
      icon: <ThunderboltOutlined />,
      color: 'linear-gradient(135deg, #5B67E5 0%, #4C51BF 100%)',
      features: ['资源独享', '极致性能', '稳定可靠'],
      link: '/intelligent/gpu-bare-metal',
    },
    {
      id: 'gpu-cloud',
      title: 'GPU云主机',
      subtitle: '弹性GPU算力',
      description: '按需弹性使用GPU算力，灵活配置，成本可控，适合中小规模计算需求',
      icon: <CloudOutlined />,
      color: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
      features: ['弹性伸缩', '按需计费', '快速部署'],
      link: '/intelligent/gpu-cloud',
    },
    {
      id: 'appliance',
      title: '智算一体机',
      subtitle: '开箱即用的AI算力',
      description: '软硬件一体化交付，预装主流AI框架和环境，快速上线AI业务',
      icon: <RocketOutlined />,
      color: 'linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)',
      features: ['开箱即用', '软硬一体', '快速上线'],
      link: '/intelligent/appliance',
    },
    {
      id: 'maas',
      title: 'MaaS平台',
      subtitle: '模型即服务平台',
      description: '提供各类主流大模型API服务，快速集成AI能力，降低AI应用门槛',
      icon: <CodeOutlined />,
      color: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      features: ['标准API', '即取即用', '持续优化'],
      link: '/intelligent/maas',
    },
  ];

  const advantages = [
    {
      icon: '⚡',
      title: '极速部署',
      desc: '分钟级交付，快速上线业务',
    },
    {
      icon: '🔒',
      title: '安全可靠',
      desc: '企业级安全保障，数据无忧',
    },
    {
      icon: '💰',
      title: '灵活计费',
      desc: '按需付费，成本可控',
    },
    {
      icon: '🛠️',
      title: '技术支持',
      desc: '专业技术团队7x24小时支持',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.gridOverlay}></div>
          <div className={styles.gradientOrb}></div>
          <div className={styles.gradientOrb2}></div>
          <div className={styles.floatingParticles}>
            <span className={styles.particle} style={{ left: '10%', animationDelay: '0s' }}>⚡</span>
            <span className={styles.particle} style={{ left: '20%', animationDelay: '1s' }}>💎</span>
            <span className={styles.particle} style={{ left: '30%', animationDelay: '2s' }}>🚀</span>
            <span className={styles.particle} style={{ left: '70%', animationDelay: '1.5s' }}>⚡</span>
            <span className={styles.particle} style={{ left: '80%', animationDelay: '0.5s' }}>💎</span>
            <span className={styles.particle} style={{ left: '90%', animationDelay: '2.5s' }}>🚀</span>
          </div>
        </div>

        <div className={styles.heroContent}>
          <motion.div
            className={styles.heroBadge}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
          
            <span className={styles.badgeText}>企业级AI算力解决方案</span>
          </motion.div>


          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Title level={1} className={styles.heroTitle}>
              智算专区
            </Title>
            <Paragraph className={styles.heroSubtitle}>
              强大的GPU算力资源，满足人工智能、深度学习等高性能计算需求
            </Paragraph>
          </motion.div>

          <motion.div
            className={styles.heroStats}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className={styles.statItem}>
              <div className={styles.statValue}>99.9%</div>
              <div className={styles.statLabel}>服务可用性</div>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>&lt;5min</div>
              <div className={styles.statLabel}>快速交付</div>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>24/7</div>
              <div className={styles.statLabel}>技术支持</div>
            </div>
          </motion.div>

          <motion.div
            className={styles.heroCTA}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link to="/intelligent/gpu-bare-metal" className={styles.primaryButton}>
              <ThunderboltOutlined style={{ marginRight: '8px' }} />
              探索GPU裸金属
              <ArrowRightOutlined style={{ marginLeft: '8px' }} />
            </Link>
            <Link to="/intelligent/gpu-cloud" className={styles.secondaryButton}>
              <CloudOutlined style={{ marginRight: '8px' }} />
              GPU云主机
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className={styles.advantagesSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.advantagesGrid}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {advantages.map((advantage, index) => (
              <motion.div
                key={index}
                className={styles.advantageCard}
                variants={itemVariants}
              >
                <div className={styles.advantageIcon}>{advantage.icon}</div>
                <Title level={4} className={styles.advantageTitle}>
                  {advantage.title}
                </Title>
                <Paragraph className={styles.advantageDesc}>
                  {advantage.desc}
                </Paragraph>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className={styles.categoriesSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Title level={2} className={styles.sectionTitle}>
              选择服务类型
            </Title>
            <Paragraph className={styles.sectionDesc}>
              四种智算服务模式，满足不同规模和场景的算力需求
            </Paragraph>
          </motion.div>

          <motion.div
            className={styles.categoriesGrid}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                className={styles.categoryCard}
                variants={itemVariants}
                whileHover={{ y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <Link to={category.link} className={styles.categoryLink}>
                  <Card
                    className={styles.card}
                    bordered={false}
                    style={{
                      borderRadius: '20px',
                      overflow: 'hidden',
                      height: '100%',
                      background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
                      border: 'none',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {/* Icon */}
                    <div
                      className={styles.categoryIcon}
                      style={{ background: category.color }}
                    >
                      {category.icon}
                    </div>

                    {/* Content */}
                    <Title level={3} className={styles.categoryTitle}>
                      {category.title}
                    </Title>
                    <Text className={styles.categorySubtitle}>
                      {category.subtitle}
                    </Text>
                    <Paragraph className={styles.categoryDescription}>
                      {category.description}
                    </Paragraph>

                    {/* Features */}
                    <div className={styles.features}>
                      {category.features.map((feature, idx) => (
                        <span key={idx} className={styles.featureTag}>
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <Button
                      type="primary"
                      size="large"
                      className={styles.ctaButton}
                      style={{ background: category.color, border: 'none' }}
                      icon={<ArrowRightOutlined />}
                    >
                      了解详情
                    </Button>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default IntelligentHome;
