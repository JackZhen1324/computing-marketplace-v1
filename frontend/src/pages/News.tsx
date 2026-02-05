import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Tag, Typography, Button, Space } from 'antd';
import {
  ClockCircleOutlined,
  FileTextOutlined,
  RocketOutlined,
  AlertOutlined,
} from '@ant-design/icons';
import styles from './News.module.css';

const { Title, Paragraph, Text } = Typography;

const News = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'policy' | 'news'>('all');

  const newsItems = [
    {
      id: 1,
      type: 'policy',
      title: '算力产业发展三年行动计划（2024-2026年）',
      summary: '国家发展改革委等部门联合印发算力产业发展行动计划，明确提出到2026年，算力规模超过300 EFLOPS，智能算力占比达到35%。',
      date: '2024-01-15',
      source: '国家发展改革委',
      tag: '政策文件',
      icon: <FileTextOutlined />,
    },
    {
      id: 2,
      type: 'news',
      title: '算力超市正式上线，打造一站式算力交易平台',
      summary: '中电信数智科技有限公司推出算力超市平台，整合GPU裸金属、GPU云主机、智算一体机等多种算力资源，为企业提供便捷的算力采购服务。',
      date: '2024-01-10',
      source: '算力超市',
      tag: '产品动态',
      icon: <RocketOutlined />,
    },
    {
      id: 3,
      type: 'policy',
      title: '关于加快推进算力基础设施高质量发展的实施意见',
      summary: '工信部发布实施意见，提出加强算力基础设施建设，优化算力资源布局，提升算力服务能力，支撑数字经济发展。',
      date: '2024-01-05',
      source: '工业和信息化部',
      tag: '产业政策',
      icon: <AlertOutlined />,
    },
    {
      id: 4,
      type: 'news',
      title: '国产GPU芯片实现重大突破，性能达到国际先进水平',
      summary: '多款国产GPU芯片在AI训练和推理性能上取得突破，算力超市率先引入昇腾、壁仞等国产GPU服务器，助力自主可控。',
      date: '2023-12-28',
      source: '科技日报',
      tag: '技术前沿',
      icon: <ClockCircleOutlined />,
    },
    {
      id: 5,
      type: 'news',
      title: 'DeepSeek大模型正式入驻算力超市MaaS平台',
      summary: '算力超市MaaS平台引入DeepSeek系列大模型API服务，包括DeepSeek-R1等主流模型，为企业AI应用开发提供强大支撑。',
      date: '2023-12-20',
      source: '算力超市',
      tag: '产品动态',
      icon: <RocketOutlined />,
    },
    {
      id: 6,
      type: 'policy',
      title: '数字经济发展规划（2023-2027年）',
      summary: '国务院印发数字经济发展规划，强调加快新型数字基础设施建设，提升算力服务供给能力，推动数字经济与实体经济深度融合。',
      date: '2023-12-15',
      source: '国务院',
      tag: '国家规划',
      icon: <FileTextOutlined />,
    },
    {
      id: 7,
      type: 'news',
      title: '算力服务价格大幅下降，企业AI应用成本降低40%',
      summary: '随着国产算力资源快速发展和算力网络优化，算力服务成本持续下降，算力超市推出多项优惠措施，惠及广大中小企业。',
      date: '2023-12-10',
      source: '算力超市',
      tag: '市场动态',
      icon: <ClockCircleOutlined />,
    },
    {
      id: 8,
      type: 'policy',
      title: '关于促进人工智能产业发展的若干措施',
      summary: '多部门联合发布促进AI产业发展措施，从算力支撑、数据资源、技术创新等方面提出具体政策，推动AI产业高质量发展。',
      date: '2023-12-05',
      source: '科技部',
      tag: '产业扶持',
      icon: <AlertOutlined />,
    },
  ];

  const filteredItems = newsItems.filter(item => {
    if (activeTab === 'all') return true;
    return item.type === activeTab;
  });

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
        </div>

        <div className={styles.heroContent}>
          <motion.div
            className={styles.heroIcon}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ fontSize: '80px', marginBottom: '24px' }}
          >
            📰
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Title level={1} className={styles.heroTitle}>
              政策&新闻
            </Title>
            <Paragraph className={styles.heroSubtitle}>
              了解最新的算力产业政策和平台动态，把握行业发展脉搏
            </Paragraph>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className={styles.filterSection}>
        <div className={styles.container}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
              onClick={() => setActiveTab('all')}
            >
              全部
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'policy' ? styles.active : ''}`}
              onClick={() => setActiveTab('policy')}
            >
              <FileTextOutlined style={{ marginRight: '6px' }} />
              政策文件
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'news' ? styles.active : ''}`}
              onClick={() => setActiveTab('news')}
            >
              <RocketOutlined style={{ marginRight: '6px' }} />
              新闻动态
            </button>
          </div>
        </div>
      </section>

      {/* News List */}
      <section className={styles.newsSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.newsGrid}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                className={styles.newsCard}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  bordered={false}
                  className={styles.card}
                  style={{
                    background: item.type === 'policy'
                      ? 'linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)'
                      : 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)',
                  }}
                >
                  {/* Header */}
                  <div className={styles.cardHeader}>
                    <div
                      className={styles.typeIcon}
                      style={{
                        background: item.type === 'policy'
                          ? 'linear-gradient(135deg, #f56565 0%, #ed8936 100%)'
                          : 'linear-gradient(135deg, #4299e1 0%, #667eea 100%)',
                      }}
                    >
                      {item.icon}
                    </div>
                    <Tag
                      color={item.type === 'policy' ? 'red' : 'blue'}
                      className={styles.typeTag}
                    >
                      {item.type === 'policy' ? '政策' : '新闻'}
                    </Tag>
                  </div>

                  {/* Content */}
                  <Title level={4} className={styles.newsTitle}>
                    {item.title}
                  </Title>

                  <Paragraph className={styles.newsSummary}>
                    {item.summary}
                  </Paragraph>

                  {/* Footer */}
                  <div className={styles.cardFooter}>
                    <Space size="large">
                      <Text className={styles.footerInfo}>
                        <ClockCircleOutlined style={{ marginRight: '4px' }} />
                        {item.date}
                      </Text>
                      <Text className={styles.footerInfo}>
                        <FileTextOutlined style={{ marginRight: '4px' }} />
                        {item.source}
                      </Text>
                    </Space>
                    <Tag color={item.type === 'policy' ? 'orange' : 'cyan'}>
                      {item.tag}
                    </Tag>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default News;
