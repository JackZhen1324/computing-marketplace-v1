import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Card, Typography } from 'antd';
import {
  SafetyOutlined,
  DatabaseOutlined,
  ThunderboltOutlined,
  RocketOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import styles from './PlatformCapabilities.module.css';

const { Title, Paragraph, Text } = Typography;

const capabilities = [
  {
    icon: <SafetyOutlined />,
    title: '技术稳定可靠',
    description: '企业级基础设施保障，多设备多链路冗余，构筑网络坚实壁垒',
    gradient: 'linear-gradient(135deg, #3F58FA 0%, #667EEA 100%)',
    stat: '99.9%',
    statLabel: '可用性',
  },
  {
    icon: <DatabaseOutlined />,
    title: '多样规格供应',
    description: '全方位资源规格满足不同业务需求，灵活选择，多样搭配',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
    stat: '100+',
    statLabel: '规格类型',
  },
  {
    icon: <ThunderboltOutlined />,
    title: '随需弹性伸缩',
    description: '按需购买，随需灵活升配降配，大幅节省部署时间，提升扩容缩容效率',
    gradient: 'linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)',
    stat: '5min',
    statLabel: '快速交付',
  },
  {
    icon: <RocketOutlined />,
    title: '智算/通算适配',
    description: '异构算力统一调度，适配各类业务场景，提供高效普惠的基础计算支撑',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
    stat: '混合',
    statLabel: '算力调度',
  },
  {
    icon: <DollarOutlined />,
    title: '定价透明灵活',
    description: '多种计费方式可选，定价透明，灵活配置，满足不同预算需求',
    gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
    stat: '按需',
    statLabel: '计费模式',
  },
];

const PlatformCapabilities = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

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
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  return (
    <motion.section
      ref={ref}
      className={styles.capabilitiesSection}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      <div className={styles.container}>
        {/* Header */}
        <motion.div className={styles.header} variants={itemVariants}>
          <div className={styles.titleBadge}>平台优势</div>
          <Title level={2} className={styles.title}>
            平台能力介绍
          </Title>
          <Paragraph className={styles.description}>
            融合通算算力与智算算力，打造一体化算力交易服务生态。
            整合全域异构算力资源，以超市化模式提供按需选配、即取即用的智算服务，
            定价透明、计费灵活，赋能政企数智化转型。
          </Paragraph>
        </motion.div>

        {/* Capabilities Grid */}
        <motion.div className={styles.grid} variants={containerVariants}>
          {capabilities.map((capability, index) => (
            <motion.div
              key={index}
              className={styles.gridItem}
              variants={itemVariants}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className={styles.card} bordered={false}>
                <div
                  className={styles.iconWrapper}
                  style={{ background: capability.gradient }}
                >
                  {capability.icon}
                </div>

                <Title level={4} className={styles.cardTitle}>
                  {capability.title}
                </Title>

                <Text className={styles.cardDescription}>
                  {capability.description}
                </Text>

                <div className={styles.stat}>
                  <div className={styles.statValue}>{capability.stat}</div>
                  <div className={styles.statLabel}>{capability.statLabel}</div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default PlatformCapabilities;
