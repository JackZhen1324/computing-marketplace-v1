import React from 'react';
import { Card, Tag, Typography, Space } from 'antd';
import styles from './TaskCard.module.css';

const { Text } = Typography;

interface TaskCardProps {
  id: string;
  companyName: string;
  customerName: string;
  productName: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  contactPhone?: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  id: _id,
  companyName,
  customerName,
  productName,
  priority,
  createdAt,
  contactPhone: _contactPhone,
}) => {
  const priorityColors = {
    HIGH: 'red',
    MEDIUM: 'blue',
    LOW: 'default',
  };

  const priorityText = {
    HIGH: '高',
    MEDIUM: '中',
    LOW: '低',
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        return `${diffMins}分钟前`;
      }
      return `${diffHours}小时前`;
    } else if (diffDays === 1) {
      return '昨天';
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  };

  return (
    <div className={styles.card}>
      <Card size="small" className={styles.cardContent}>
        <div className={styles.header}>
          <Tag color={priorityColors[priority]}>
            {priorityText[priority]}优先级
          </Tag>
        </div>
        <div className={styles.content}>
          <Text strong>{companyName}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            意向：{productName}
          </Text>
        </div>
        <div className={styles.footer}>
          <Space>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              👤 {customerName}
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              📅 {formatDate(createdAt)}
            </Text>
          </Space>
        </div>
      </Card>
    </div>
  );
};
