import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, Tag, Typography, Space, Spin, Alert } from 'antd';
import {
  ClockCircleOutlined,
  FileTextOutlined,
  RocketOutlined,
  AlertOutlined,
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
    if (!tag) return <FileTextOutlined />;
    switch (tag) {
      case '政策文件':
      case '产业政策':
      case '国家规划':
        return <FileTextOutlined />;
      case '产品动态':
        return <RocketOutlined />;
      case '技术前沿':
        return <ClockCircleOutlined />;
      default:
        return <AlertOutlined />;
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
              className={`${styles.tab} ${activeTab === 'POLICY' ? styles.active : ''}`}
              onClick={() => setActiveTab('POLICY')}
            >
              <FileTextOutlined style={{ marginRight: '6px' }} />
              政策文件
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'NEWS' ? styles.active : ''}`}
              onClick={() => setActiveTab('NEWS')}
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
                    background: item.type === 'POLICY'
                      ? 'linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)'
                      : 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)',
                  }}
                >
                  {/* Header */}
                  <div className={styles.cardHeader}>
                    <div
                      className={styles.typeIcon}
                      style={{
                        background: item.type === 'POLICY'
                          ? 'linear-gradient(135deg, #f56565 0%, #ed8936 100%)'
                          : 'linear-gradient(135deg, #4299e1 0%, #667eea 100%)',
                      }}
                    >
                      {getIconForTag(item.tag)}
                    </div>
                    <Tag
                      color={item.type === 'POLICY' ? 'red' : 'blue'}
                      className={styles.typeTag}
                    >
                      {item.type === 'POLICY' ? '政策' : '新闻'}
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
                        {item.publishDate}
                      </Text>
                      <Text className={styles.footerInfo}>
                        <FileTextOutlined style={{ marginRight: '4px' }} />
                        {item.source}
                      </Text>
                    </Space>
                    <Tag color={item.type === 'POLICY' ? 'orange' : 'cyan'}>
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
