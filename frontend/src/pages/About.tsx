import { motion } from 'framer-motion';
import { Card, Typography, Row, Col, Button } from 'antd';
import {
  TeamOutlined,
  RocketOutlined,
  SafetyOutlined,
  CustomerServiceOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  CheckCircleOutlined,
  BulbOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  MailOutlined,
  ArrowRightOutlined,
  TrophyOutlined,
  HeartOutlined,
  StarOutlined,
  FireOutlined,
} from '@ant-design/icons';
import styles from './About.module.css';

const { Title, Paragraph, Text } = Typography;

const About = () => {
  const values = [
    {
      icon: <BulbOutlined />,
      title: '创新驱动',
      description: '持续技术创新，引领算力服务行业发展',
      gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
    },
    {
      icon: <HeartOutlined />,
      title: '客户至上',
      description: '以客户需求为中心，提供优质服务体验',
      gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
    },
    {
      icon: <SafetyOutlined />,
      title: '安全可靠',
      description: '企业级安全保障，确保数据和业务安全',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      icon: <TeamOutlined />,
      title: '团队协作',
      description: '专业团队协作，高效响应客户需求',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
  ];

  const advantages = [
    {
      icon: <ThunderboltOutlined />,
      title: '强大的算力资源',
      description: '整合GPU裸金属、GPU云主机、智算一体机等多种算力资源，满足不同规模和场景的计算需求',
      stat: '1000+',
      statLabel: 'GPU实例',
      color: '#667eea',
    },
    {
      icon: <GlobalOutlined />,
      title: '广泛的网络覆盖',
      description: '覆盖全国主要城市，提供低延迟、高可用的算力服务，支持就近接入',
      stat: '50+',
      statLabel: '覆盖城市',
      color: '#4ECDC4',
    },
    {
      icon: <SafetyOutlined />,
      title: '企业级安全保障',
      description: '多重安全防护机制，符合等保要求，保障客户数据安全和业务连续性',
      stat: '99.9%',
      statLabel: '安全等级',
      color: '#f093fb',
    },
    {
      icon: <CustomerServiceOutlined />,
      title: '专业的技术支持',
      description: '7x24小时技术支持团队，提供从咨询、部署到运维的全流程服务',
      stat: '24/7',
      statLabel: '技术支持',
      color: '#FF6B6B',
    },
  ];

  const milestones = [
    {
      year: '2021',
      title: '平台成立',
      description: '算力超市项目启动，开始搭建算力交易平台',
      icon: <RocketOutlined />,
    },
    {
      year: '2022',
      title: '服务上线',
      description: 'GPU裸金属、GPU云主机服务正式上线',
      icon: <CheckCircleOutlined />,
    },
    {
      year: '2023',
      title: '快速发展',
      description: '引入国产GPU，推出智算一体机，服务企业超过1000家',
      icon: <TrophyOutlined />,
    },
    {
      year: '2024',
      title: '生态完善',
      description: '上线MaaS平台，整合大模型服务，构建完整算力生态',
      icon: <StarOutlined />,
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

  const stats = [
    { value: '1000+', label: '服务企业', icon: <FireOutlined /> },
    { value: '99.9%', label: '服务可用性', icon: <StarOutlined /> },
    { value: '50+', label: '覆盖城市', icon: <GlobalOutlined /> },
    { value: '24/7', label: '技术支持', icon: <ClockCircleOutlined /> },
  ];

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.gridOverlay}></div>
          <div className={styles.gradientOrb1}></div>
          <div className={styles.gradientOrb2}></div>
          <div className={styles.gradientOrb3}></div>
        </div>

        <div className={styles.heroContent}>
          <motion.div
            className={styles.heroBadge}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <TrophyOutlined style={{ fontSize: '20px', marginRight: '8px' }} />
            <span>值得信赖的算力服务平台</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Title level={1} className={styles.heroTitle}>
              关于我们
            </Title>
            <Paragraph className={styles.heroSubtitle}>
              中电信数智科技有限公司
            </Paragraph>
            <Paragraph className={styles.heroDescription}>
              您的智能算力服务伙伴，致力于为企业提供高效、安全、可靠的算力解决方案
            </Paragraph>
          </motion.div>

          <motion.div
            className={styles.statsRow}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {stats.map((stat, index) => (
              <div key={index} className={styles.statItem}>
                <div className={styles.statIcon}>{stat.icon}</div>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Company Introduction */}
      <section className={styles.introSection}>
        <div className={styles.container}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Title level={2} className={styles.sectionTitle}>
              公司简介
            </Title>
            <div className={styles.introContent}>
              <Paragraph className={styles.introText}>
                中电信数智科技有限公司是中国电信旗下专注于算力服务的高科技企业。我们致力于打造国内领先的算力交易平台，为企业提供一站式算力采购服务。
              </Paragraph>
              <Paragraph className={styles.introText}>
                平台整合了GPU裸金属、GPU云主机、智算一体机、MaaS平台等多种算力资源，支持从AI训练、推理到通用计算的各类应用场景。我们凭借强大的技术实力和完善的运营体系，已为超过1000家企业客户提供优质的算力服务。
              </Paragraph>
              <Paragraph className={styles.introText}>
                未来，我们将继续深耕算力服务领域，推动技术创新和服务升级，为数字经济发展贡献力量。
              </Paragraph>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className={styles.valuesSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Title level={2} className={styles.sectionTitle}>
              核心价值观
            </Title>
            <Paragraph className={styles.sectionDesc}>
              我们的价值观指引着企业的发展方向和员工的行为准则
            </Paragraph>
          </motion.div>

          <motion.div
            className={styles.valuesGrid}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                className={styles.valueCard}
                variants={itemVariants}
                whileHover={{ y: -12, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Card bordered={false} className={styles.card}>
                  <motion.div
                    className={styles.valueIcon}
                    style={{ background: value.gradient }}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    {value.icon}
                  </motion.div>
                  <Title level={4} className={styles.valueTitle}>
                    {value.title}
                  </Title>
                  <Paragraph className={styles.valueDescription}>
                    {value.description}
                  </Paragraph>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Core Advantages */}
      <section className={styles.advantagesSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Title level={2} className={styles.sectionTitle}>
              核心优势
            </Title>
            <Paragraph className={styles.sectionDesc}>
              为什么选择算力超市作为您的算力服务合作伙伴
            </Paragraph>
          </motion.div>

          <Row gutter={[32, 32]}>
            {advantages.map((advantage, index) => (
              <Col key={index} xs={24} md={12} lg={12}>
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <Card bordered={false} className={styles.advantageCard}>
                    <div className={styles.advantageHeader}>
                      <motion.div
                        className={styles.advantageIconWrapper}
                        style={{ background: advantage.color }}
                        whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {advantage.icon}
                      </motion.div>
                      <div className={styles.advantageTitleWrapper}>
                        <Title level={4} className={styles.advantageTitle}>
                          {advantage.title}
                        </Title>
                        <div className={styles.advantageStat}>
                          <span className={styles.statNumber}>{advantage.stat}</span>
                          <span className={styles.statText}>{advantage.statLabel}</span>
                        </div>
                      </div>
                    </div>
                    <Paragraph className={styles.advantageDescription}>
                      {advantage.description}
                    </Paragraph>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Development Milestones */}
      <section className={styles.milestonesSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Title level={2} className={styles.sectionTitle}>
              发展历程
            </Title>
            <Paragraph className={styles.sectionDesc}>
              从成立到今天，我们不断成长，持续创新
            </Paragraph>
          </motion.div>

          <div className={styles.timeline}>
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                className={styles.timelineItem}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <motion.div
                  className={styles.timelineMarker}
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {milestone.icon}
                </motion.div>
                <motion.div
                  className={styles.timelineContent}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={styles.timelineYear}>{milestone.year}</div>
                  <Title level={4} className={styles.timelineTitle}>
                    {milestone.title}
                  </Title>
                  <Paragraph className={styles.timelineDescription}>
                    {milestone.description}
                  </Paragraph>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.ctaCard}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className={styles.ctaContent}>
              <div className={styles.ctaIcon}>
                <RocketOutlined />
              </div>
              <Title level={2} className={styles.ctaTitle}>
                准备好开启您的算力之旅了吗？
              </Title>
              <Paragraph className={styles.ctaDescription}>
                立即联系我们，获取专属算力解决方案，让您的业务更高效
              </Paragraph>
              <div className={styles.ctaButtons}>
                <Button
                  type="primary"
                  size="large"
                  icon={<PhoneOutlined />}
                  className={styles.ctaButtonPrimary}
                >
                  立即咨询
                </Button>
                <Button
                  size="large"
                  icon={<MailOutlined />}
                  className={styles.ctaButtonSecondary}
                >
                  发送邮件
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className={styles.contactSection}>
        <div className={styles.container}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Title level={2} className={styles.contactTitle}>
              联系我们
            </Title>
            <Paragraph className={styles.contactDesc}>
              我们随时为您提供专业的咨询服务
            </Paragraph>
          </motion.div>

          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <motion.div
                className={styles.contactCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className={styles.contactIconWrapper}>
                  <EnvironmentOutlined className={styles.contactIcon} />
                </div>
                <div className={styles.contactLabel}>公司地址</div>
                <div className={styles.contactValue}>北京市西城区展览路街道京鼎大厦</div>
              </motion.div>
            </Col>
            <Col xs={24} md={8}>
              <motion.div
                className={styles.contactCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                whileHover={{ y: -8 }}
              >
                <div className={styles.contactIconWrapper}>
                  <PhoneOutlined className={styles.contactIcon} />
                </div>
                <div className={styles.contactLabel}>服务热线</div>
                <div className={styles.contactValue}>400-888-8888</div>
              </motion.div>
            </Col>
            <Col xs={24} md={8}>
              <motion.div
                className={styles.contactCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                whileHover={{ y: -8 }}
              >
                <div className={styles.contactIconWrapper}>
                  <MailOutlined className={styles.contactIcon} />
                </div>
                <div className={styles.contactLabel}>电子邮箱</div>
                <div className={styles.contactValue}>contact@computing-marketplace.com</div>
              </motion.div>
            </Col>
          </Row>
        </div>
      </section>
    </div>
  );
};

export default About;
