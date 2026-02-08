import { Card, Row, Col, Statistic, Typography, Space } from 'antd';
import {
  MessageOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  UserOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons';
import { useInquiries } from '../../services/hooks/useInquiries';
import { useProducts } from '../../services/hooks/useProducts';
import styles from './Dashboard.module.css';

const { Title } = Typography;

const Dashboard = () => {
  const { inquiries } = useInquiries();
  const { products } = useProducts();

  // Calculate statistics
  const totalInquiries = inquiries?.length || 0;
  const pendingInquiries = inquiries?.filter((i: any) => i.status === 'PENDING').length || 0;
  const totalProducts = products?.length || 0;
  const activeProducts = products?.filter((p: any) => p.isVisible).length || 0;

  // Calculate trends (mock data for demo)
  const inquiryTrend = '+12.5';
  const productTrend = '+3.2';

  return (
    <div className={styles.dashboard}>
      <Title level={3} style={{ marginBottom: 24 }}>
        数据概览
      </Title>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="总询价数"
              value={totalInquiries}
              prefix={<MessageOutlined style={{ color: '#1890ff' }} />}
              suffix={
                <span style={{ fontSize: 14, color: '#3f8600' }}>
                  <ArrowUpOutlined /> {inquiryTrend}%
                </span>
              }
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="待处理询价"
              value={pendingInquiries}
              prefix={<FileTextOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: pendingInquiries > 0 ? '#ff4d4f' : '#999' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="产品总数"
              value={totalProducts}
              prefix={<ShoppingCartOutlined style={{ color: '#52c41a' }} />}
              suffix={
                <span style={{ fontSize: 14, color: '#3f8600' }}>
                  <ArrowUpOutlined /> {productTrend}%
                </span>
              }
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="在线产品"
              value={activeProducts}
              prefix={<CheckCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Links */}
      <Card title="快捷操作" style={{ marginBottom: 24 }}>
        <Space wrap>
          <a href="/admin/inquiries" className={styles.quickLink}>
            <MessageOutlined /> 查看询价
          </a>
          <a href="/admin/products" className={styles.quickLink}>
            <ShoppingCartOutlined /> 管理产品
          </a>
          <a href="/admin/categories" className={styles.quickLink}>
            <UserOutlined /> 产品分类
          </a>
        </Space>
      </Card>

      {/* Recent Activity */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="最新询价" extra={<a href="/admin/inquiries">查看全部</a>}>
            {inquiries && inquiries.length > 0 ? (
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {inquiries.slice(0, 5).map((inquiry: any) => (
                  <div key={inquiry.id} className={styles.activityItem}>
                    <div className={styles.activityHeader}>
                      <span className={styles.activityName}>{inquiry.name}</span>
                      <span className={`${styles.activityStatus} ${styles[inquiry.status?.toLowerCase()]}`}>
                        {inquiry.status === 'PENDING' ? '待处理' :
                         inquiry.status === 'CONTACTED' ? '已联系' :
                         inquiry.status === 'CONVERTED' ? '已转化' : '已关闭'}
                      </span>
                    </div>
                    <div className={styles.activityDetail}>
                      {inquiry.productName} - {inquiry.company}
                    </div>
                    <div className={styles.activityTime}>
                      {new Date(inquiry.createdAt).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                ))}
              </Space>
            ) : (
              <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                暂无询价数据
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="系统信息">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>系统版本</span>
                <span className={styles.infoValue}>v1.0.0</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>上次更新</span>
                <span className={styles.infoValue}>{new Date().toLocaleDateString('zh-CN')}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>数据库状态</span>
                <span className={styles.infoValue} style={{ color: '#52c41a' }}>
                  ● 正常
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>服务状态</span>
                <span className={styles.infoValue} style={{ color: '#52c41a' }}>
                  ● 运行中
                </span>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
