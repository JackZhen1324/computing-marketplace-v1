import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const getPageInfo = () => {
    const path = location.pathname;

    if (path.startsWith('/admin/inquiries')) {
      return {
        title: '询价管理',
        breadcrumb: [{ title: '询价管理' }],
      };
    }
    if (path.startsWith('/admin/products')) {
      return {
        title: '产品管理',
        breadcrumb: [{ title: '产品管理' }],
      };
    }
    if (path.startsWith('/admin/categories')) {
      return {
        title: '分类管理',
        breadcrumb: [{ title: '分类管理' }],
      };
    }
    if (path.startsWith('/admin/news')) {
      return {
        title: '新闻管理',
        breadcrumb: [{ title: '新闻管理' }],
      };
    }
    if (path.startsWith('/admin/solutions')) {
      return {
        title: '解决方案',
        breadcrumb: [{ title: '解决方案' }],
      };
    }
    if (path.startsWith('/admin/dashboard')) {
      return {
        title: '数据统计',
        breadcrumb: [{ title: '数据统计' }],
      };
    }

    return {
      title: '管理后台',
      breadcrumb: [{ title: '首页' }],
    };
  };

  const { title, breadcrumb } = getPageInfo();

  return (
    <div className={styles.layout}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      <div
        className={styles.mainContent}
        style={{ marginLeft: sidebarCollapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width)' }}
      >
        {/* Top Bar */}
        <TopBar
          title={title}
          breadcrumb={breadcrumb}
          extra={
            <Link to="/" className={styles.homeLink}>
              <HomeOutlined /> 返回首页
            </Link>
          }
        />

        {/* Page Content */}
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
