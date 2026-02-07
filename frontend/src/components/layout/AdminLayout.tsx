import { Outlet, Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  FileTextOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  NewsOutlined,
  SolutionOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import styles from './AdminLayout.module.css';

const { Sider, Content } = Layout;

const AdminLayout = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: '/admin/inquiries',
      icon: <FileTextOutlined />,
      label: <Link to="/admin/inquiries">询价管理</Link>,
    },
    {
      key: '/admin/categories',
      icon: <AppstoreOutlined />,
      label: <Link to="/admin/categories">分类管理</Link>,
    },
    {
      key: '/admin/products',
      icon: <ShoppingOutlined />,
      label: <Link to="/admin/products">产品管理</Link>,
    },
    {
      key: '/admin/news',
      icon: <NewsOutlined />,
      label: <Link to="/admin/news">新闻管理</Link>,
    },
    {
      key: '/admin/solutions',
      icon: <SolutionOutlined />,
      label: <Link to="/admin/solutions">解决方案</Link>,
    },
  ];

  const getSelectedKey = () => {
    const path = location.pathname;
    // Match exact path or parent path
    return menuItems.find(item => path.startsWith(item.key))?.key || '/admin/inquiries';
  };

  return (
    <Layout style={{ minHeight: 'calc(100vh - 72px)' }}>
      <Sider
        width={240}
        theme="light"
        style={{
          overflow: 'auto',
          height: 'calc(100vh - 72px)',
          position: 'sticky',
          top: '72px',
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 16px',
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#3F58FA',
          borderBottom: '1px solid #f0f0f0',
        }}>
          <TeamOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
          <span>管理后台</span>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          style={{ borderRight: 0, padding: '16px 8px' }}
          items={menuItems}
        />
      </Sider>
      <Layout style={{ background: '#f5f5f5' }}>
        <Content style={{ minHeight: 'calc(100vh - 72px)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
