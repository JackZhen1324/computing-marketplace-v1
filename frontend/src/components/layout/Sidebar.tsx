import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  MessageOutlined,
  ShoppingOutlined,
  SolutionOutlined,
  ReadOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  SettingOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import styles from './Sidebar.module.css';

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  path: string;
}

const menuItems: MenuItem[] = [
  {
    key: 'dashboard',
    icon: <BarChartOutlined />,
    label: '数据统计',
    path: '/admin/dashboard',
  },
  {
    key: 'inquiries',
    icon: <MessageOutlined />,
    label: '询价管理',
    path: '/admin/inquiries',
  },
  {
    key: 'products',
    icon: <ShoppingOutlined />,
    label: '产品管理',
    path: '/admin/products',
  },
  {
    key: 'solutions',
    icon: <SolutionOutlined />,
    label: '解决方案',
    path: '/admin/solutions',
  },
  {
    key: 'news',
    icon: <ReadOutlined />,
    label: '新闻管理',
    path: '/admin/news',
  },
  {
    key: 'categories',
    icon: <AppstoreOutlined />,
    label: '产品分类',
    path: '/admin/categories',
  },
];

interface SidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export const Sidebar = ({ collapsed = false, onCollapsedChange }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  useEffect(() => {
    setIsCollapsed(collapsed);
  }, [collapsed]);

  const handleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapsedChange?.(newCollapsed);
  };

  const handleMenuClick = (item: MenuItem) => {
    navigate(item.path);
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}
      style={{ width: isCollapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width)' }}
    >
      {/* Logo Area */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <AppstoreOutlined />
        </div>
        {!isCollapsed && <span className={styles.logoText}>算力超市</span>}
      </div>

      {/* Toggle Button */}
      <button
        className={styles.toggleBtn}
        onClick={handleCollapse}
        type="button"
      >
        {isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </button>

      {/* Navigation Menu */}
      <nav className={styles.navigation}>
        <ul className={styles.menuList}>
          {menuItems.map((item) => (
            <li key={item.key}>
              <button
                className={`${styles.menuItem} ${isActive(item.path) ? styles.active : ''}`}
                onClick={() => handleMenuClick(item)}
                type="button"
              >
                <span className={styles.menuIcon}>{item.icon}</span>
                {!isCollapsed && <span className={styles.menuLabel}>{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom User Section */}
      <div className={styles.userSection}>
        <button className={styles.userButton} type="button">
          <div className={styles.userAvatar}>
            <UserOutlined />
          </div>
          {!isCollapsed && <span className={styles.userName}>管理员</span>}
        </button>
        <button className={styles.settingsBtn} type="button">
          <SettingOutlined />
        </button>
      </div>
    </div>
  );
};
