import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import styles from './TopBar.module.css';

interface TopBarProps {
  title?: string;
  breadcrumb?: Array<{ title: string; path?: string }>;
  extra?: React.ReactNode;
}

export const TopBar = ({ title, breadcrumb, extra }: TopBarProps) => {
  const breadcrumbItems = breadcrumb
    ? [
        { title: <HomeOutlined />, path: '/admin' },
        ...breadcrumb.map((item) => ({
          title: item.title,
          path: item.path,
        })),
      ]
    : [];

  return (
    <div className={styles.topbar}>
      <div className={styles.topbarLeft}>
        {breadcrumb && breadcrumb.length > 0 && (
          <Breadcrumb
            items={breadcrumbItems}
            className={styles.breadcrumb}
          />
        )}
        {title && <h1 className={styles.title}>{title}</h1>}
      </div>
      {extra && <div className={styles.topbarRight}>{extra}</div>}
    </div>
  );
};
