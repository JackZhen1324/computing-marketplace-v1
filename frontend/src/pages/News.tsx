import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, Tag, Typography, Space, Spin, Alert } from 'antd';
import {
  ClockCircleOutlined,
  FileTextOutlined,
  RocketOutlined,
  AlertOutlined,
  BookOutlined,
  NotificationOutlined,
} from '@ant-design/icons';
import { newsService, NewsArticle } from '../services/api/news';
import styles from './News.module.css';

const { Title, Paragraph, Text } = Typography;

const News = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'POLICY' | 'NEWS'>('all');
  const [newsItems, setNewsItems] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        let data;
        if (activeTab === 'POLICY') {
          data = await newsService.getNews({ type: 'POLICY' });
        } else if (activeTab === 'NEWS') {
          data = await newsService.getNews({ type: 'NEWS' });
        } else {
          data = await newsService.getNews();
        }
        setNewsItems(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [activeTab]);

  // Loading state
  if (loading) {
    return (
      <div className={styles.page}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.page}>
        <div style={{ padding: '50px' }}>
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

  const getIconForTag = (tag: string | null) => {
    if (!tag) return <BookOutlined />;
    switch (tag) {
      case '政策文件':
      case '产业政策':
      case '国家规划':
        return <BookOutlined />;
      case '产品动态':
        return <RocketOutlined />;
      case '技术前沿':
        return <NotificationOutlined />;
      default:
        return <FileTextOutlined />;
    }
  };

  // Remove the hardcoded newsItems array
  // The newsItems are now fetched from the API

  const filteredItems = newsItems; // Already filtered by API call

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
      <motion.section
        className={styles.hero}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.heroBackground}>
          <div className={styles.gridOverlay}></div>
          <div className={styles.gradientOrb}></div>
          <div className={styles.gradientOrb2}></div>
        </div>

        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className={styles.heroBadge}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <NotificationOutlined />
            行业资讯
          </motion.div>

          <Title level={1} className={styles.heroTitle}>
            政策&新闻
          </Title>
          <Paragraph className={styles.heroSubtitle}>
            了解最新的算力产业政策和平台动态，把握行业发展脉搏
          </Paragraph>
        </motion.div>
      </motion.section>

      {/* Filter Tabs */}
      <section className={styles.filterSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.tabs}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.button
              className={`${styles.pillTab} ${activeTab === 'all' ? styles.active : ''}`}
              onClick={() => setActiveTab('all')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FileTextOutlined />
              全部
            </motion.button>
            <motion.button
              className={`${styles.pillTab} ${activeTab === 'POLICY' ? styles.activePolicy : ''}`}
              onClick={() => setActiveTab('POLICY')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BookOutlined />
              政策文件
            </motion.button>
            <motion.button
              className={`${styles.pillTab} ${activeTab === 'NEWS' ? styles.activeNews : ''}`}
              onClick={() => setActiveTab('NEWS')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RocketOutlined />
              新闻动态
            </motion.button>
          </motion.div>
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
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                className={styles.newsCard}
                variants={itemVariants}
                whileHover={{ y: -12, scale: 1.02 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <Card
                  bordered={false}
                  className={styles.card}
                  style={{
                    background: item.type === 'POLICY'
                      ? 'linear-gradient(135deg, #fff5f5 0%, #ffffff 50%, #fff0f0 100%)'
                      : 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #f0f7ff 100%)',
                  }}
                >
                  {/* Decorative Top Border */}
                  <div
                    className={styles.topBorder}
                    style={{
                      background: item.type === 'POLICY'
                        ? 'linear-gradient(90deg, #f56565 0%, #ed8936 100%)'
                        : 'linear-gradient(90deg, #4299e1 0%, #667eea 100%)',
                    }}
                  ></div>

                  {/* Header */}
                  <div className={styles.cardHeader}>
                    <motion.div
                      className={styles.typeIcon}
                      style={{
                        background: item.type === 'POLICY'
                          ? 'linear-gradient(135deg, #f56565 0%, #ed8936 100%)'
                          : 'linear-gradient(135deg, #4299e1 0%, #667eea 100%)',
                      }}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {getIconForTag(item.tag)}
                    </motion.div>
                    <Tag
                      className={styles.typeTag}
                      style={{
                        background: item.type === 'POLICY'
                          ? 'linear-gradient(135deg, rgba(245, 101, 101, 0.1) 0%, rgba(237, 137, 54, 0.1) 100%)'
                          : 'linear-gradient(135deg, rgba(66, 153, 225, 0.1) 0%, rgba(102, 126, 234, 0.1) 100%)',
                        color: item.type === 'POLICY' ? '#f56565' : '#4299e1',
                        border: `1px solid ${item.type === 'POLICY' ? 'rgba(245, 101, 101, 0.2)' : 'rgba(66, 153, 225, 0.2)'}`,
                      }}
                    >
                      {item.type === 'POLICY' ? '政策文件' : '新闻动态'}
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
                    <Space size="large" className={styles.footerLeft}>
                      <Text className={styles.footerInfo}>
                        <ClockCircleOutlined className={styles.footerIcon} />
                        {item.publishDate}
                      </Text>
                      <Text className={styles.footerInfo}>
                        <FileTextOutlined className={styles.footerIcon} />
                        {item.source}
                      </Text>
                    </Space>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Tag
                        className={styles.categoryTag}
                        style={{
                          background: item.type === 'POLICY'
                            ? 'linear-gradient(135deg, rgba(237, 137, 54, 0.15) 0%, rgba(245, 101, 101, 0.15) 100%)'
                            : 'linear-gradient(135deg, rgba(34, 211, 238, 0.15) 0%, rgba(66, 153, 225, 0.15) 100%)',
                          color: item.type === 'POLICY' ? '#ed8936' : '#22d3ee',
                        }}
                      >
                        {item.tag}
                      </Tag>
                    </motion.div>
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
