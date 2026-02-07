import { Outlet, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Breadcrumb } from 'antd';
import {
  FileTextOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  ReadOutlined,
  SolutionOutlined,
  HomeOutlined,
} from '@ant-design/icons';

const { Sider, Content, Header } = Layout;

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
      icon: <ReadOutlined />,
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

  const getPageTitle = () => {
    const selectedItem = menuItems.find(item => location.pathname.startsWith(item.key));
    return selectedItem?.label?.props?.children || '管理后台';
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Admin Header */}
      <Header
        style={{
          background: '#fff',
          padding: '0 24px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
          lineHeight: '64px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '16px',
              fontWeight: 600,
              color: '#3F58FA',
              textDecoration: 'none',
              marginRight: '32px',
            }}
          >
            <HomeOutlined />
            返回首页
          </Link>
          <Breadcrumb
            items={[
              { title: <Link to="/admin/inquiries">管理后台</Link> },
              { title: getPageTitle() },
            ]}
            style={{ fontSize: '14px' }}
          />
        </div>
      </Header>

      <Layout>
        {/* Sidebar */}
        <Sider
          width={256}
          style={{
            background: '#fff',
            borderRight: '1px solid #f0f0f0',
            overflow: 'auto',
            height: 'calc(100vh - 64px)',
          }}
        >
          <div
            style={{
              padding: '24px 16px',
              borderBottom: '1px solid #f0f0f0',
              background: 'linear-gradient(135deg, #3F58FA 0%, #5B6FFF 100%)',
            }}
          >
            <div
              style={{
                color: '#fff',
                fontSize: '20px',
                fontWeight: 'bold',
                textAlign: 'center',
                letterSpacing: '0.5px',
              }}
            >
              算力超市
            </div>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: '12px',
                textAlign: 'center',
                marginTop: '4px',
              }}
            >
              管理控制台
            </div>
          </div>
          <Menu
            mode="inline"
            selectedKeys={[getSelectedKey()]}
            style={{
              borderRight: 0,
              padding: '16px 8px',
              background: '#fff',
            }}
            items={menuItems}
          />
        </Sider>

        {/* Main Content */}
        <Content
          style={{
            background: '#f5f7fa',
            padding: '24px',
            minHeight: 'calc(100vh - 64px)',
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
