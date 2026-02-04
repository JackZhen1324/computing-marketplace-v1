import { Typography, Row, Col, Space } from 'antd';
import {
  CustomerServiceOutlined,
  WechatOutlined,
  WeiboOutlined,
  QqOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import styles from './Footer.module.css';

const { Title, Text, Paragraph } = Typography;

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Main Content */}
        <Row gutter={[48, 32]} className={styles.mainContent}>
          {/* Brand Section */}
          <Col xs={24} md={8}>
            <div className={styles.brandSection}>
              <div className={styles.logo}>
                <span className={styles.logoIcon}>🏢</span>
                <span className={styles.logoText}>云聚通智一体算力超市</span>
              </div>
              <Paragraph className={styles.description}>
                中电信数智科技有限公司，致力于为企业客户提供专业的算力服务和解决方案
              </Paragraph>
              <div className={styles.companyInfo}>
                <div className={styles.infoItem}>
                  <EnvironmentOutlined />
                  <Text>北京市西城区展览路街道京鼎大厦</Text>
                </div>
                <div className={styles.infoItem}>
                  <PhoneOutlined />
                  <Text>400-XXX-XXXX</Text>
                </div>
              </div>
            </div>
          </Col>

          {/* Quick Links */}
          <Col xs={24} md={8}>
            <div className={styles.linksSection}>
              <Title level={4} className={styles.sectionTitle}>
                快速链接
              </Title>
              <div className={styles.linkGroups}>
                <div className={styles.linkGroup}>
                  <Text className={styles.linkGroupTitle}>智算服务</Text>
                  <Space direction="vertical" size={8}>
                    <a href="/intelligent/gpu-bare-metal">GPU裸金属</a>
                    <a href="/intelligent/gpu-cloud">GPU云主机</a>
                    <a href="/intelligent/appliance">智算一体机</a>
                    <a href="/intelligent/maas">MaaS平台</a>
                  </Space>
                </div>
              </div>
            </div>
          </Col>

          {/* Contact & Social */}
          <Col xs={24} md={8}>
            <div className={styles.contactSection}>
              <Title level={4} className={styles.sectionTitle}>
                联系我们
              </Title>
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <CustomerServiceOutlined />
                  <div>
                    <Text className={styles.contactLabel}>客户服务热线</Text>
                    <Text className={styles.contactValue}>400-XXX-XXXX</Text>
                  </div>
                </div>
                <div className={styles.socialLinks}>
                  <Text className={styles.socialLabel}>关注我们</Text>
                  <Space size={16}>
                    <a href="#" className={styles.socialIcon}>
                      <WechatOutlined />
                      <Text>微信</Text>
                    </a>
                    <a href="#" className={styles.socialIcon}>
                      <WeiboOutlined />
                      <Text>微博</Text>
                    </a>
                    <a href="#" className={styles.socialIcon}>
                      <QqOutlined />
                      <Text>QQ</Text>
                    </a>
                  </Space>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            <Text>© 2024 中电信数智科技有限公司 版权所有</Text>
            <Text>|</Text>
            <a href="#">隐私政策</a>
            <Text>|</Text>
            <a href="#">服务条款</a>
            <Text>|</Text>
            <a href="#">京ICP备XXXXXXXX号</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
